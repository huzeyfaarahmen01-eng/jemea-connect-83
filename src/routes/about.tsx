import { createFileRoute, Link } from "@tanstack/react-router";
import { ClipboardList, Eye, Handshake, Lightbulb, MessageSquareReply, ShieldCheck } from "lucide-react";
import { PublicLayout } from "@/components/site/PublicLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About Jemea — how student submissions get answered" },
      {
        name: "description",
        content:
          "Why Jemea exists, how students submit ideas and concerns, and how administration reviews and responds to every submission.",
      },
      { property: "og:title", content: "About Jemea — how student submissions get answered" },
      {
        property: "og:description",
        content: "How students submit, how administration responds, and how the conversation stays in one place.",
      },
    ],
  }),
  component: About,
});

const cards = [
  {
    icon: Lightbulb,
    title: "What Jemea is",
    body: "A single platform for student ideas, questions, concerns and feedback, with a clear record of what was said and what happened next.",
  },
  {
    icon: ShieldCheck,
    title: "Why it exists",
    body: "Good suggestions are usually lost in inboxes and corridors. Jemea gives each one an owner, a status and a reply.",
  },
  {
    icon: ClipboardList,
    title: "How students use it",
    body: "Submit from the public form or from your student portal, then track status, read replies and continue the conversation.",
  },
  {
    icon: Eye,
    title: "How administration reviews",
    body: "Every submission lands in an admin dashboard with search, filters and statuses, so nothing sits unseen.",
  },
  {
    icon: MessageSquareReply,
    title: "How responses work",
    body: "An administrator replies in the platform. You are notified, and the reply is kept with the original submission.",
  },
  {
    icon: Handshake,
    title: "How communication stays fair",
    body: "Students only ever see their own records. Administration actions are recorded in an activity log.",
  },
];

function About() {
  return (
    <PublicLayout>
      <section className="hero-canvas border-b border-border">
        <div className="mx-auto w-full max-w-4xl px-4 py-16 text-center sm:px-6 lg:py-20">
          <h1 className="text-4xl font-bold text-balance sm:text-5xl">
            A structured bridge between students and administration
          </h1>
          <p className="mx-auto mt-5 max-w-2xl text-lg text-muted-foreground">
            Jemea replaces scattered emails and suggestion boxes with one accountable process:
            submit, review, respond, resolve.
          </p>
        </div>
      </section>

      <section className="mx-auto w-full max-w-6xl px-4 py-16 sm:px-6 lg:py-20">
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {cards.map((card) => (
            <Card key={card.title} className="h-full">
              <CardContent className="pt-6">
                <span className="flex size-10 items-center justify-center rounded-lg bg-secondary text-primary">
                  <card.icon className="size-5" />
                </span>
                <h2 className="mt-4 text-base font-semibold">{card.title}</h2>
                <p className="mt-2 text-sm text-muted-foreground">{card.body}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="surface-panel mt-12 flex flex-col gap-4 p-8 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-xl font-semibold">Have something to raise?</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Submissions are reviewed by administration and answered in the platform.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Button asChild>
              <Link to="/contact">Submit an idea</Link>
            </Button>
            <Button asChild variant="outline">
              <Link to="/status">Check status</Link>
            </Button>
          </div>
        </div>
      </section>
    </PublicLayout>
  );
}
