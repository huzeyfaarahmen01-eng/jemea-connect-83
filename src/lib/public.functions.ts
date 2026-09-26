import { createServerFn } from "@tanstack/react-start";
import { getRequestHeader } from "@tanstack/react-start/server";
import { z } from "zod";

const submissionSchema = z.object({
  name: z.string().trim().min(2).max(120),
  email: z.string().trim().email().max(200),
  department: z.string().trim().min(1).max(120),
  year: z.string().trim().min(1).max(60),
  subject: z.string().trim().max(160).optional().default(""),
  message: z.string().trim().min(10).max(4000),
});

function clientIp() {
  const forwarded = getRequestHeader("x-forwarded-for");
  return forwarded?.split(",")[0]?.trim() ?? null;
}

/** Public contact/idea submission. Validated server-side, stored as NEW. */
export const createPublicSubmission = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => submissionSchema.parse(input))
  .handler(async ({ data }) => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");

    const { data: existingUser } = await supabaseAdmin
      .from("profiles")
      .select("id")
      .ilike("email", data.email)
      .maybeSingle();

    const { data: inserted, error } = await supabaseAdmin
      .from("submissions")
      .insert({
        name: data.name,
        email: data.email.toLowerCase(),
        department: data.department,
        year: data.year,
        subject: data.subject || null,
        message: data.message,
        status: "NEW",
        student_id: existingUser?.id ?? null,
      })
      .select("id")
      .single();

    if (error || !inserted) {
      console.error("createPublicSubmission failed", error);
      throw new Error("We could not save your submission. Please try again.");
    }

    await supabaseAdmin.from("audit_logs").insert({
      user_type: existingUser ? "student" : "visitor",
      user_id: existingUser?.id ?? null,
      action: "SUBMISSION_CREATED",
      details: `Submission ${inserted.id} created by ${data.email}`,
      ip_address: clientIp(),
    });

    if (existingUser?.id) {
      await supabaseAdmin.from("notifications").insert({
        student_id: existingUser.id,
        submission_id: inserted.id,
        title: "Submission received",
        message: "Your submission was received and is awaiting review.",
      });
    }

    return { id: inserted.id };
  });

/** Public status lookup. Returns only the submitter's own latest record fields. */
export const lookupSubmissionStatus = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => z.object({ email: z.string().trim().email() }).parse(input))
  .handler(async ({ data }) => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");

    const { data: rows, error } = await supabaseAdmin
      .from("submissions")
      .select("id, subject, status, department, year, created_at, updated_at, reply")
      .ilike("email", data.email)
      .order("created_at", { ascending: false })
      .limit(5);

    if (error) {
      console.error("lookupSubmissionStatus failed", error);
      throw new Error("We could not look that up right now. Please try again.");
    }

    return { submissions: rows ?? [] };
  });
