import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, BellRing, LineChart, MessagesSquare, ShieldCheck, Send } from "lucide-react";
import { PublicLayout } from "@/components/site/PublicLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import heroImage from "@/assets/hero-students.jpg";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Jemea — Student ideas, questions and answers" },
      {
        name: "description",
        content:
          "Submit ideas, questions and concerns to your administration, track every status change and keep the whole conversation in one place.",
      },
      { property: "og:title", content: "Jemea — Student ideas, questions and answers" },
      {
        property: "og:description",
        content: "Submit an idea, track its status and talk directly with administration.",
      },
    ],
  }),
  component: Home,
});

const features = [
  {
    icon: Send,
    title: "Submit in a minute",
    body: "Ideas, questions, concerns and feedback go in through one clear form — no queues, no paperwork.",
  },
  {
    icon: LineChart,
    title: "Track every status",
    body: "Each submission moves from new to under review to replied, and you can see exactly where it stands.",
  },
  {
    icon: MessagesSquare,
    title: "Keep the conversation",
    body: "Replies live in a threaded conversation, so nothing is lost between emails and corridors.",
  },
  {
    icon: BellRing,
    title: "Get notified",
    body: "Notifications tell you the moment administration reads or answers your submission.",
  },
];

const steps = [
  { step: "01", title: "Send it", body: "Describe your idea or concern and submit it in a minute." },
  {
    step: "02",
    title: "It gets reviewed",
    body: "Administration sees it in their dashboard and marks it under review.",
  },
  {
    step: "03",
    title: "You get an answer",
    body: "You are notified, and the reply opens a conversation you can continue.",
  },
];

function Home() {
  return (
    <PublicLayout>
      <section className="hero-canvas border-b border-border">
        <div className="mx-auto grid w-full max-w-6xl items-center gap-12 px-4 py-16 sm:px-6 lg:grid-cols-2 lg:py-24">
          <div>
            <span className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-3 py-1 text-xs font-semibold tracking-wide text-muted-foreground uppercase">
              <ShieldCheck className="size-3.5 text-primary" />
              Student voice platform
            </span>
            <h1 className="mt-5 text-4xl leading-tight font-bold text-balance sm:text-5xl lg:text-6xl">
              Your idea deserves an answer, not a suggestion box.
            </h1>
            <p className="mt-5 max-w-xl text-lg text-muted-foreground">
              Jemea gives students a structured way to raise ideas, questions and concerns — and
              gives administration the tools to review, respond and keep track of every one.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Button asChild size="lg">
                <Link to="/contact">
                  Submit an idea
                  <ArrowRight className="size-4" />
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline">
                <Link to="/status">Check a submission</Link>
              </Button>
            </div>
            <p className="mt-6 text-sm text-muted-foreground">
              Already registered?{" "}
              <Link to="/auth" className="font-semibold text-primary underline-offset-4 hover:underline">
                Sign in to the student portal
              </Link>
              .
            </p>
          </div>

          <div className="surface-panel overflow-hidden p-0">
            <img
              src={heroImage}
              alt="Students discussing ideas together in a campus study lounge"
              width={1600}
              height={1104}
              className="h-full w-full object-cover"
            />
          </div>
        </div>
      </section>

      <section className="mx-auto w-full max-w-6xl px-4 py-16 sm:px-6 lg:py-20">
        <div className="max-w-2xl">
          <h2 className="text-3xl font-semibold sm:text-4xl">Built around one promise: follow-up</h2>
          <p className="mt-3 text-muted-foreground">
            Everything in Jemea exists to make sure a submission does not disappear after it is
            sent.
          </p>
        </div>
        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {features.map((feature) => (
            <Card key={feature.title} className="h-full shadow-none transition-shadow hover:shadow-md">
              <CardContent className="pt-6">
                <span className="flex size-10 items-center justify-center rounded-lg bg-secondary text-primary">
                  <feature.icon className="size-5" />
                </span>
                <h3 className="mt-4 text-base font-semibold">{feature.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{feature.body}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      <section className="border-y border-border bg-secondary/50">
        <div className="mx-auto w-full max-w-6xl px-4 py-16 sm:px-6 lg:py-20">
          <h2 className="text-3xl font-semibold sm:text-4xl">How it works</h2>
          <div className="mt-10 grid gap-6 md:grid-cols-3">
            {steps.map((item) => (
              <div key={item.step} className="surface-panel p-6">
                <span className="font-display text-sm font-semibold text-primary">{item.step}</span>
                <h3 className="mt-3 text-lg font-semibold">{item.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{item.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto w-full max-w-6xl px-4 py-16 sm:px-6 lg:py-20">
        <div className="surface-panel hero-canvas flex flex-col items-start gap-6 p-8 sm:p-12 lg:flex-row lg:items-center lg:justify-between">
          <div className="max-w-xl">
            <h2 className="text-2xl font-semibold sm:text-3xl">Ready to be heard?</h2>
            <p className="mt-2 text-muted-foreground">
              Create a student account to keep all your submissions, replies and notifications in
              one place.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Button asChild size="lg">
              <Link to="/auth" search={{ mode: "register" }}>
                Create student account
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline">
              <Link to="/about">Learn more</Link>
            </Button>
          </div>
        </div>
      </section>
    </PublicLayout>
  );
}
