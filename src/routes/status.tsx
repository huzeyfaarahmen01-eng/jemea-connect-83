import { createFileRoute } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useState } from "react";
import { FileSearch, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { PublicLayout } from "@/components/site/PublicLayout";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { STATUS_LABELS } from "@/lib/constants";
import { lookupSubmissionStatus } from "@/lib/public.functions";

type StatusRow = {
  id: string;
  subject: string | null;
  status: string;
  department: string | null;
  year: string | null;
  created_at: string;
  updated_at: string;
  reply: string | null;
};

export const Route = createFileRoute("/status")({
  head: () => ({
    meta: [
      { title: "Check a submission status — Jemea" },
      {
        name: "description",
        content:
          "Enter your email address to see the status of your latest Jemea submissions and any reply from administration.",
      },
      { property: "og:title", content: "Check a submission status — Jemea" },
      {
        property: "og:description",
        content: "See the status of your latest submissions and any reply from administration.",
      },
    ],
  }),
  component: StatusPage,
});

function statusVariant(status: string) {
  if (status === "REPLIED") return "default" as const;
  if (status === "READ") return "secondary" as const;
  return "outline" as const;
}

function StatusPage() {
  const lookup = useServerFn(lookupSubmissionStatus);
  const [email, setEmail] = useState("");
  const [rows, setRows] = useState<StatusRow[] | null>(null);
  const [pending, setPending] = useState(false);

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      toast.error("Please enter a valid email address.");
      return;
    }
    setPending(true);
    try {
      const result = await lookup({ data: { email: email.trim() } });
      setRows(result.submissions as StatusRow[]);
    } catch {
      toast.error("We could not look that up right now. Please try again.");
    } finally {
      setPending(false);
    }
  }

  return (
    <PublicLayout>
      <section className="hero-canvas border-b border-border">
        <div className="mx-auto w-full max-w-3xl px-4 py-12 text-center sm:px-6 lg:py-16">
          <h1 className="text-3xl font-bold sm:text-4xl">Check your submission status</h1>
          <p className="mt-3 text-muted-foreground">
            Enter the email address you used. You will only see records submitted with that address.
          </p>
        </div>
      </section>

      <section className="mx-auto w-full max-w-3xl px-4 py-12 sm:px-6">
        <Card>
          <CardHeader>
            <CardTitle>Status lookup</CardTitle>
            <CardDescription>We show your five most recent submissions.</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="flex flex-col gap-3 sm:flex-row sm:items-end">
              <div className="grid flex-1 gap-2">
                <Label htmlFor="lookup-email">Email address</Label>
                <Input
                  id="lookup-email"
                  type="email"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  placeholder="you@university.edu"
                />
              </div>
              <Button type="submit" disabled={pending}>
                {pending && <Loader2 className="size-4 animate-spin" />}
                {pending ? "Checking…" : "Check status"}
              </Button>
            </form>
          </CardContent>
        </Card>

        {rows !== null && (
          <div className="mt-8 space-y-4">
            {rows.length === 0 ? (
              <div className="surface-panel flex flex-col items-center gap-3 p-10 text-center">
                <FileSearch className="size-8 text-muted-foreground" />
                <h2 className="text-lg font-semibold">No submissions found</h2>
                <p className="max-w-sm text-sm text-muted-foreground">
                  We could not find anything submitted with that email address.
                </p>
              </div>
            ) : (
              rows.map((row) => (
                <Card key={row.id}>
                  <CardContent className="pt-6">
                    <div className="flex flex-wrap items-center justify-between gap-3">
                      <h3 className="text-base font-semibold">
                        {row.subject || "Submission"}
                      </h3>
                      <Badge variant={statusVariant(row.status)}>
                        {STATUS_LABELS[row.status] ?? row.status}
                      </Badge>
                    </div>
                    <dl className="mt-4 grid gap-3 text-sm sm:grid-cols-3">
                      <div>
                        <dt className="text-muted-foreground">Submitted</dt>
                        <dd className="font-medium">
                          {new Date(row.created_at).toLocaleDateString()}
                        </dd>
                      </div>
                      <div>
                        <dt className="text-muted-foreground">Department</dt>
                        <dd className="font-medium">{row.department ?? "—"}</dd>
                      </div>
                      <div>
                        <dt className="text-muted-foreground">Year</dt>
                        <dd className="font-medium">{row.year ?? "—"}</dd>
                      </div>
                    </dl>
                    {row.reply && (
                      <div className="mt-4 rounded-lg border border-border bg-secondary/60 p-4 text-sm">
                        <p className="font-semibold">Latest response</p>
                        <p className="mt-1 text-muted-foreground">{row.reply}</p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        )}
      </section>
    </PublicLayout>
  );
}
