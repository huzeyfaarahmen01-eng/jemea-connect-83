import { createFileRoute } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useState } from "react";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { PublicLayout } from "@/components/site/PublicLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { DEPARTMENTS, YEARS } from "@/lib/constants";
import { createPublicSubmission } from "@/lib/public.functions";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Submit an idea or concern — Jemea" },
      {
        name: "description",
        content:
          "Send your idea, question, concern or feedback to administration through Jemea and track the response.",
      },
      { property: "og:title", content: "Submit an idea or concern — Jemea" },
      {
        property: "og:description",
        content: "Send your idea, question or concern to administration and track the response.",
      },
    ],
  }),
  component: Contact,
});

const emptyForm = {
  name: "",
  email: "",
  department: "",
  year: "",
  subject: "",
  message: "",
};

function Contact() {
  const submit = useServerFn(createPublicSubmission);
  const [form, setForm] = useState(emptyForm);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [pending, setPending] = useState(false);

  function validate() {
    const next: Record<string, string> = {};
    if (form.name.trim().length < 2) next.name = "Please enter your full name.";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim()))
      next.email = "Please enter a valid email address.";
    if (!form.department) next.department = "Please select your department.";
    if (!form.year) next.year = "Please select your year.";
    if (form.message.trim().length < 10)
      next.message = "Please describe your idea in at least 10 characters.";
    setErrors(next);
    return Object.keys(next).length === 0;
  }

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    if (!validate()) return;
    setPending(true);
    try {
      await submit({ data: { ...form, subject: form.subject.trim() } });
      toast.success("Submission sent successfully.", {
        description: "You can follow its progress on the status page.",
      });
      setForm(emptyForm);
      setErrors({});
    } catch {
      toast.error("We could not send your submission. Please try again.");
    } finally {
      setPending(false);
    }
  }

  return (
    <PublicLayout>
      <section className="hero-canvas border-b border-border">
        <div className="mx-auto w-full max-w-3xl px-4 py-12 text-center sm:px-6 lg:py-16">
          <h1 className="text-3xl font-bold sm:text-4xl">Tell us what should change</h1>
          <p className="mt-3 text-muted-foreground">
            Share an idea, question, concern or piece of feedback. Administration reviews every
            submission and replies in the platform.
          </p>
        </div>
      </section>

      <section className="mx-auto w-full max-w-3xl px-4 py-12 sm:px-6">
        <Card>
          <CardHeader>
            <CardTitle>New submission</CardTitle>
            <CardDescription>Fields marked with * are required.</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="grid gap-5" noValidate>
              <div className="grid gap-5 sm:grid-cols-2">
                <div className="grid gap-2">
                  <Label htmlFor="name">Full name *</Label>
                  <Input
                    id="name"
                    value={form.name}
                    onChange={(event) => setForm({ ...form, name: event.target.value })}
                    aria-invalid={Boolean(errors.name)}
                  />
                  {errors.name && <p className="text-sm text-destructive">{errors.name}</p>}
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="email">Email *</Label>
                  <Input
                    id="email"
                    type="email"
                    value={form.email}
                    onChange={(event) => setForm({ ...form, email: event.target.value })}
                    aria-invalid={Boolean(errors.email)}
                  />
                  {errors.email && <p className="text-sm text-destructive">{errors.email}</p>}
                </div>
              </div>

              <div className="grid gap-5 sm:grid-cols-2">
                <div className="grid gap-2">
                  <Label htmlFor="department">Department *</Label>
                  <Select
                    value={form.department}
                    onValueChange={(value) => setForm({ ...form, department: value })}
                  >
                    <SelectTrigger id="department">
                      <SelectValue placeholder="Select department" />
                    </SelectTrigger>
                    <SelectContent>
                      {DEPARTMENTS.map((department) => (
                        <SelectItem key={department} value={department}>
                          {department}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.department && (
                    <p className="text-sm text-destructive">{errors.department}</p>
                  )}
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="year">Year *</Label>
                  <Select
                    value={form.year}
                    onValueChange={(value) => setForm({ ...form, year: value })}
                  >
                    <SelectTrigger id="year">
                      <SelectValue placeholder="Select year" />
                    </SelectTrigger>
                    <SelectContent>
                      {YEARS.map((year) => (
                        <SelectItem key={year} value={year}>
                          {year}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.year && <p className="text-sm text-destructive">{errors.year}</p>}
                </div>
              </div>

              <div className="grid gap-2">
                <Label htmlFor="subject">Subject</Label>
                <Input
                  id="subject"
                  value={form.subject}
                  onChange={(event) => setForm({ ...form, subject: event.target.value })}
                  placeholder="Optional short title"
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="message">Message *</Label>
                <Textarea
                  id="message"
                  rows={6}
                  value={form.message}
                  onChange={(event) => setForm({ ...form, message: event.target.value })}
                  aria-invalid={Boolean(errors.message)}
                />
                {errors.message && <p className="text-sm text-destructive">{errors.message}</p>}
              </div>

              <div>
                <Button type="submit" size="lg" disabled={pending}>
                  {pending && <Loader2 className="size-4 animate-spin" />}
                  {pending ? "Sending…" : "Send submission"}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </section>
    </PublicLayout>
  );
}
