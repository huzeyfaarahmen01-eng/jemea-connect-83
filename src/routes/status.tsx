import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { FileSearch, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { PublicLayout } from "@/components/site/PublicLayout";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { STATUS_LABELS } from "@/lib/constants";
import { Link } from "@tanstack/react-router";
import { useAuth } from "@/hooks/useAuth";
import { getMySubmissions, type Submission } from "@/lib/firebase.functions";

export const Route = createFileRoute("/status")({
  head: () => ({
    meta: [
      { title: "Check a submission status — Jemea" },
      {
        name: "description",
        content:
          "Sign in to see the status of your latest Jemea submissions and any reply from administration.",
      },
      { property: "og:title", content: "Check a submission status — Jemea" },
      {
        property: "og:description",
        content:
          "Sign in to see the status of your latest submissions and any reply from administration.",
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
  const { user, loading: authLoading } = useAuth();
  const [rows, setRows] = useState<Submission[] | null>(null);
  const [pending, setPending] = useState(false);

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    if (!user) return;
    setPending(true);
    try {
      setRows(await getMySubmissions(user.uid));
    } catch (error) {
      console.error("getMySubmissions failed", error);
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
            Sign in to see your latest submissions and any replies from administration.
          </p>
        </div>
      </section>

      <section className="mx-auto w-full max-w-3xl px-4 py-12 sm:px-6">
        <Card>
          <CardHeader>
            <CardTitle>Status lookup</CardTitle>
            <CardDescription>
              We show the five most recent submissions on your account.
            </CardDescription>
          </CardHeader>
          <CardContent>
            {authLoading ? (
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Loader2 className="size-4 animate-spin" />
                Loading your account…
              </div>
            ) : user ? (
              <form onSubmit={handleSubmit}>
                <Button type="submit" disabled={pending}>
                  {pending && <Loader2 className="size-4 animate-spin" />}
                  {pending ? "Checking…" : "Check status"}
                </Button>
              </form>
            ) : (
              <div className="grid gap-4">
                <p className="text-sm text-muted-foreground">
                  Sign in to securely see the status and replies for your submissions.
                </p>
                <div className="flex flex-wrap gap-3">
                  <Button asChild>
                    <Link to="/auth">Sign in</Link>
                  </Button>
                  <Button asChild variant="outline">
                    <Link to="/auth" search={{ mode: "register" }}>
                      Create account
                    </Link>
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {rows !== null && (
          <div className="mt-8 space-y-4">
            {rows.length === 0 ? (
              <div className="surface-panel flex flex-col items-center gap-3 p-10 text-center">
                <FileSearch className="size-8 text-muted-foreground" />
                <h2 className="text-lg font-semibold">No submissions found</h2>
                <p className="max-w-sm text-sm text-muted-foreground">
                  There are no submissions on this account yet.
                </p>
              </div>
            ) : (
              rows.map((row) => (
                <Card key={row.id}>
                  <CardContent className="pt-6">
                    <div className="flex flex-wrap items-center justify-between gap-3">
                      <h3 className="text-base font-semibold">{row.subject || "Submission"}</h3>
                      <Badge variant={statusVariant(row.status)}>
                        {STATUS_LABELS[row.status] ?? row.status}
                      </Badge>
                    </div>
                    <dl className="mt-4 grid gap-3 text-sm sm:grid-cols-3">
                      <div>
                        <dt className="text-muted-foreground">Submitted</dt>
                        <dd className="font-medium">
                          {row.createdAt?.toDate().toLocaleDateString() ?? "Pending"}
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
