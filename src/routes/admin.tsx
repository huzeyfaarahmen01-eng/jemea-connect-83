import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Loader2, RefreshCw, Save, Search, ShieldAlert, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PublicLayout } from "@/components/site/PublicLayout";
import { useAuth } from "@/hooks/useAuth";
import { STATUS_LABELS } from "@/lib/constants";
import {
  deleteSubmission,
  getAllSubmissions,
  updateSubmission,
  type Submission,
  type SubmissionDraft,
  type SubmissionStatus,
} from "@/lib/firebase.functions";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

const submissionStatuses: SubmissionStatus[] = ["NEW", "READ", "REPLIED"];

export const Route = createFileRoute("/admin")({
  head: () => ({
    meta: [
      { title: "Admin dashboard — Jemea" },
      { name: "description", content: "Review and manage student submissions." },
    ],
  }),
  component: AdminDashboard,
});

function AdminDashboard() {
  const { user, isAdmin, loading: authLoading } = useAuth();
  const [rows, setRows] = useState<Submission[]>([]);
  const [drafts, setDrafts] = useState<Record<string, SubmissionDraft>>({});
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [loadingRows, setLoadingRows] = useState(true);
  const [loadError, setLoadError] = useState("");
  const [savingId, setSavingId] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [reloadKey, setReloadKey] = useState(0);

  useEffect(() => {
    if (authLoading || !isAdmin) {
      setLoadingRows(false);
      return;
    }

    let active = true;
    setLoadingRows(true);
    setLoadError("");
    void getAllSubmissions()
      .then((submissions) => {
        if (!active) return;
        setRows(submissions);
        setDrafts(
          Object.fromEntries(
            submissions.map((submission) => [
              submission.id,
              {
                status: submission.status as SubmissionStatus,
                reply: submission.reply ?? "",
              },
            ]),
          ),
        );
      })
      .catch((error) => {
        console.error("getAllSubmissions failed", error);
        if (active)
          setLoadError("Could not load submissions. Check the Firestore rules and try again.");
      })
      .finally(() => {
        if (active) setLoadingRows(false);
      });

    return () => {
      active = false;
    };
  }, [authLoading, isAdmin, reloadKey]);

  const normalizedSearch = search.trim().toLocaleLowerCase();
  const visibleRows = rows.filter((submission) => {
    const matchesStatus = statusFilter === "ALL" || submission.status === statusFilter;
    const searchable = [
      submission.name,
      submission.email,
      submission.subject,
      submission.message,
      submission.department,
    ]
      .filter(Boolean)
      .join(" ")
      .toLocaleLowerCase();
    return matchesStatus && (!normalizedSearch || searchable.includes(normalizedSearch));
  });

  function updateDraft(id: string, changes: Partial<SubmissionDraft>) {
    setDrafts((current) => ({
      ...current,
      [id]: { ...current[id], ...changes },
    }));
  }

  async function saveSubmission(submission: Submission) {
    const draft = drafts[submission.id];
    if (!draft) return;
    setSavingId(submission.id);
    try {
      await updateSubmission(submission.id, draft);
      setRows((current) =>
        current.map((row) =>
          row.id === submission.id
            ? { ...row, status: draft.status, reply: draft.reply.trim() || null }
            : row,
        ),
      );
      toast.success("Submission updated.");
    } catch (error) {
      console.error("updateSubmission failed", error);
      toast.error("Could not update this submission. Check the Firestore rules and try again.");
    } finally {
      setSavingId(null);
    }
  }

  async function removeSubmission(submission: Submission) {
    if (!window.confirm(`Permanently delete “${submission.subject || "Submission"}”?`)) return;
    setDeletingId(submission.id);
    try {
      await deleteSubmission(submission.id);
      setRows((current) => current.filter((row) => row.id !== submission.id));
      toast.success("Submission deleted.");
    } catch (error) {
      console.error("deleteSubmission failed", error);
      toast.error("Could not delete this submission. Check the Firestore rules and try again.");
    } finally {
      setDeletingId(null);
    }
  }

  return (
    <PublicLayout>
      <section className="border-b border-border bg-secondary/35">
        <div className="mx-auto flex w-full max-w-6xl flex-col gap-4 px-4 py-10 sm:px-6 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-sm font-semibold text-primary">Administration</p>
            <h1 className="mt-1 text-3xl font-bold">Submission dashboard</h1>
            <p className="mt-2 text-sm text-muted-foreground">
              Review ideas, update their status, and reply to students.
            </p>
          </div>
          {isAdmin && (
            <Button
              variant="outline"
              onClick={() => setReloadKey((current) => current + 1)}
              disabled={loadingRows}
            >
              <RefreshCw className={loadingRows ? "size-4 animate-spin" : "size-4"} />
              Refresh
            </Button>
          )}
        </div>
      </section>

      <section className="mx-auto w-full max-w-6xl px-4 py-8 sm:px-6">
        {authLoading ? (
          <div className="flex items-center gap-2 py-8 text-sm text-muted-foreground">
            <Loader2 className="size-4 animate-spin" /> Checking admin access…
          </div>
        ) : !user ? (
          <Card>
            <CardContent className="flex flex-col items-start gap-4 py-8">
              <ShieldAlert className="size-8 text-muted-foreground" />
              <div>
                <h2 className="font-semibold">Administrator sign-in required</h2>
                <p className="mt-1 text-sm text-muted-foreground">
                  Sign in with the Google or email account authorized for this dashboard.
                </p>
              </div>
              <Button asChild>
                <Link to="/auth">Sign in</Link>
              </Button>
            </CardContent>
          </Card>
        ) : !isAdmin ? (
          <Card>
            <CardContent className="flex flex-col items-start gap-4 py-8">
              <ShieldAlert className="size-8 text-muted-foreground" />
              <div>
                <h2 className="font-semibold">Administrator access required</h2>
                <p className="mt-1 text-sm text-muted-foreground">
                  This account is not authorized to manage submissions.
                </p>
              </div>
              <Button asChild variant="outline">
                <Link to="/">Return home</Link>
              </Button>
            </CardContent>
          </Card>
        ) : (
          <>
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              {submissionStatuses.map((status) => (
                <div key={status} className="border-l-2 border-primary px-4 py-2">
                  <p className="text-sm text-muted-foreground">{STATUS_LABELS[status]}</p>
                  <p className="mt-1 text-2xl font-semibold">
                    {rows.filter((row) => row.status === status).length}
                  </p>
                </div>
              ))}
              <div className="border-l-2 border-border px-4 py-2">
                <p className="text-sm text-muted-foreground">All submissions</p>
                <p className="mt-1 text-2xl font-semibold">{rows.length}</p>
              </div>
            </div>

            <div className="mt-8 flex flex-col gap-3 border-y border-border py-4 sm:flex-row">
              <div className="relative flex-1">
                <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  aria-label="Search submissions"
                  className="pl-9"
                  placeholder="Search name, email, subject, or message"
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                />
              </div>
              <div className="grid gap-1.5 sm:w-52">
                <Label htmlFor="status-filter" className="sr-only">
                  Filter by status
                </Label>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger id="status-filter" aria-label="Filter by status">
                    <SelectValue placeholder="All statuses" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ALL">All statuses</SelectItem>
                    {submissionStatuses.map((status) => (
                      <SelectItem key={status} value={status}>
                        {STATUS_LABELS[status]}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {loadError ? (
              <p role="alert" className="py-8 text-sm text-destructive">
                {loadError}
              </p>
            ) : loadingRows ? (
              <div className="flex items-center gap-2 py-10 text-sm text-muted-foreground">
                <Loader2 className="size-4 animate-spin" /> Loading submissions…
              </div>
            ) : visibleRows.length === 0 ? (
              <div className="py-12 text-center">
                <h2 className="font-semibold">No submissions found</h2>
                <p className="mt-1 text-sm text-muted-foreground">
                  {rows.length
                    ? "Try a different search or status filter."
                    : "New student submissions will appear here."}
                </p>
              </div>
            ) : (
              <div className="mt-2 divide-y divide-border">
                {visibleRows.map((submission) => {
                  const draft = drafts[submission.id] ?? {
                    status: submission.status as SubmissionStatus,
                    reply: submission.reply ?? "",
                  };
                  return (
                    <article
                      key={submission.id}
                      className="grid gap-5 py-6 lg:grid-cols-[minmax(0,1fr)_minmax(280px,0.8fr)]"
                    >
                      <div className="min-w-0">
                        <div className="flex flex-wrap items-center gap-2">
                          <h2 className="font-semibold">{submission.subject || "Submission"}</h2>
                          <Badge
                            variant={
                              draft.status === "REPLIED"
                                ? "default"
                                : draft.status === "READ"
                                  ? "secondary"
                                  : "outline"
                            }
                          >
                            {STATUS_LABELS[draft.status] ?? draft.status}
                          </Badge>
                        </div>
                        <p className="mt-1 break-words text-sm text-muted-foreground">
                          {submission.name} · {submission.email}
                        </p>
                        <p className="mt-1 text-xs text-muted-foreground">
                          {[
                            submission.department,
                            submission.year,
                            submission.createdAt?.toDate().toLocaleString(),
                          ]
                            .filter(Boolean)
                            .join(" · ")}
                        </p>
                        <p className="mt-4 whitespace-pre-wrap break-words text-sm leading-6">
                          {submission.message}
                        </p>
                      </div>

                      <div className="grid content-start gap-3">
                        <div className="grid gap-1.5">
                          <Label htmlFor={`status-${submission.id}`}>Status</Label>
                          <Select
                            value={draft.status}
                            onValueChange={(status) =>
                              updateDraft(submission.id, { status: status as SubmissionStatus })
                            }
                          >
                            <SelectTrigger id={`status-${submission.id}`}>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              {submissionStatuses.map((status) => (
                                <SelectItem key={status} value={status}>
                                  {STATUS_LABELS[status]}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="grid gap-1.5">
                          <Label htmlFor={`reply-${submission.id}`}>Reply to student</Label>
                          <Textarea
                            id={`reply-${submission.id}`}
                            rows={3}
                            maxLength={4000}
                            placeholder="Write a response…"
                            value={draft.reply}
                            onChange={(event) =>
                              updateDraft(submission.id, { reply: event.target.value })
                            }
                          />
                        </div>
                        <div className="flex flex-wrap justify-end gap-2">
                          <Button
                            variant="destructive"
                            size="icon"
                            aria-label="Delete submission"
                            title="Delete submission"
                            disabled={savingId === submission.id || deletingId === submission.id}
                            onClick={() => void removeSubmission(submission)}
                          >
                            {deletingId === submission.id ? (
                              <Loader2 className="size-4 animate-spin" />
                            ) : (
                              <Trash2 className="size-4" />
                            )}
                          </Button>
                          <Button
                            disabled={savingId === submission.id || deletingId === submission.id}
                            onClick={() => void saveSubmission(submission)}
                          >
                            {savingId === submission.id ? (
                              <Loader2 className="size-4 animate-spin" />
                            ) : (
                              <Save className="size-4" />
                            )}
                            Save changes
                          </Button>
                        </div>
                      </div>
                    </article>
                  );
                })}
              </div>
            )}
          </>
        )}
      </section>
    </PublicLayout>
  );
}
