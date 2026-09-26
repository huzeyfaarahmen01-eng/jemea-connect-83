import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import {
  createUserWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithEmailAndPassword,
  signInWithPopup,
  updateProfile,
} from "firebase/auth";
import { doc, getDoc, serverTimestamp, setDoc } from "firebase/firestore";
import { useState } from "react";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { PublicLayout } from "@/components/site/PublicLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { auth, db } from "@/integrations/firebase/client";
import { DEPARTMENTS, YEARS } from "@/lib/constants";

export const Route = createFileRoute("/auth")({
  validateSearch: (search: Record<string, unknown>) => ({
    mode: search.mode === "register" ? "register" : "signin",
  }),
  head: () => ({
    meta: [
      { title: "Student account — Jemea" },
      { name: "description", content: "Create an account or sign in to Jemea." },
    ],
  }),
  component: AuthPage,
});

function authErrorMessage(error: unknown) {
  const code = error && typeof error === "object" && "code" in error ? String(error.code) : "";
  if (code === "auth/email-already-in-use") return "An account with this email already exists.";
  if (code === "auth/invalid-credential") return "Email or password is incorrect.";
  if (code === "auth/weak-password") return "Choose a password with at least 6 characters.";
  if (code === "auth/operation-not-allowed")
    return "Enable the requested sign-in provider in Firebase Authentication.";
  if (code === "auth/too-many-requests") return "Too many attempts. Please try again later.";
  if (code === "auth/network-request-failed")
    return "Network error. Check your connection and retry.";
  if (code === "auth/unauthorized-domain")
    return "Add this website's domain to Firebase Authentication's authorized domains.";
  if (code === "auth/popup-blocked") return "Allow popups for this site and try again.";
  if (code === "auth/popup-closed-by-user") return "The Google sign-in window was closed.";
  return "We could not complete that request. Please try again.";
}

function AuthPage() {
  const { mode } = Route.useSearch();
  const navigate = useNavigate();
  const registering = mode === "register";
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [department, setDepartment] = useState("");
  const [year, setYear] = useState("");
  const [pending, setPending] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setPending(true);
    try {
      if (registering) {
        const credential = await createUserWithEmailAndPassword(auth, email.trim(), password);
        await updateProfile(credential.user, { displayName: fullName.trim() });
        await setDoc(doc(db, "users", credential.user.uid), {
          full_name: fullName.trim(),
          email: credential.user.email,
          department,
          year,
          createdAt: serverTimestamp(),
        });
        toast.success("Your account is ready.");
      } else {
        await signInWithEmailAndPassword(auth, email.trim(), password);
        toast.success("Signed in successfully.");
      }
      await navigate({ to: "/contact" });
    } catch (submitError) {
      const message = authErrorMessage(submitError);
      setError(message);
      toast.error(message);
    } finally {
      setPending(false);
    }
  }

  async function handleGoogleSignIn() {
    setError("");
    setPending(true);
    try {
      const credential = await signInWithPopup(auth, new GoogleAuthProvider());
      const profileRef = doc(db, "users", credential.user.uid);
      const profileSnapshot = await getDoc(profileRef);
      if (!profileSnapshot.exists()) {
        await setDoc(profileRef, {
          full_name: credential.user.displayName ?? "",
          email: credential.user.email ?? "",
          department: null,
          year: null,
          createdAt: serverTimestamp(),
        });
      }
      toast.success("Signed in with Google.");
      await navigate({ to: "/contact" });
    } catch (signInError) {
      const message = authErrorMessage(signInError);
      setError(message);
      toast.error(message);
    } finally {
      setPending(false);
    }
  }

  return (
    <PublicLayout>
      <section className="hero-canvas border-b border-border">
        <div className="mx-auto w-full max-w-3xl px-4 py-12 text-center sm:px-6 lg:py-16">
          <h1 className="text-3xl font-bold sm:text-4xl">
            {registering ? "Create your student account" : "Welcome back"}
          </h1>
          <p className="mt-3 text-muted-foreground">
            {registering
              ? "Your account keeps your submissions and their responses together."
              : "Sign in to submit an idea and check its progress."}
          </p>
        </div>
      </section>

      <section className="mx-auto w-full max-w-xl px-4 py-12 sm:px-6">
        <Card>
          <CardHeader>
            <CardTitle>{registering ? "Student registration" : "Student sign in"}</CardTitle>
            <CardDescription>
              {registering ? "Use your university email address." : "Enter your account details."}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="grid gap-5" noValidate>
              {registering && (
                <>
                  <div className="grid gap-2">
                    <Label htmlFor="full-name">Full name</Label>
                    <Input
                      id="full-name"
                      autoComplete="name"
                      value={fullName}
                      onChange={(event) => setFullName(event.target.value)}
                      minLength={2}
                      maxLength={120}
                      required
                    />
                  </div>
                  <div className="grid gap-5 sm:grid-cols-2">
                    <div className="grid gap-2">
                      <Label htmlFor="department">Department</Label>
                      <Select value={department} onValueChange={setDepartment}>
                        <SelectTrigger id="department">
                          <SelectValue placeholder="Select department" />
                        </SelectTrigger>
                        <SelectContent>
                          {DEPARTMENTS.map((item) => (
                            <SelectItem key={item} value={item}>
                              {item}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="year">Year</Label>
                      <Select value={year} onValueChange={setYear}>
                        <SelectTrigger id="year">
                          <SelectValue placeholder="Select year" />
                        </SelectTrigger>
                        <SelectContent>
                          {YEARS.map((item) => (
                            <SelectItem key={item} value={item}>
                              {item}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </>
              )}

              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  autoComplete="email"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  required
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  autoComplete={registering ? "new-password" : "current-password"}
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  minLength={6}
                  required
                />
              </div>

              {error && (
                <p role="alert" className="text-sm text-destructive">
                  {error}
                </p>
              )}

              <Button type="submit" size="lg" disabled={pending}>
                {pending && <Loader2 className="size-4 animate-spin" />}
                {pending ? "Please wait…" : registering ? "Create account" : "Sign in"}
              </Button>
            </form>

            <div className="my-5 flex items-center gap-3 text-xs text-muted-foreground">
              <span className="h-px flex-1 bg-border" />
              <span>OR</span>
              <span className="h-px flex-1 bg-border" />
            </div>
            <Button
              type="button"
              variant="outline"
              className="w-full"
              disabled={pending}
              onClick={() => void handleGoogleSignIn()}
            >
              <span aria-hidden="true" className="font-bold text-blue-600">
                G
              </span>
              Continue with Google
            </Button>

            <p className="mt-5 text-center text-sm text-muted-foreground">
              {registering ? "Already registered? " : "New to Jemea? "}
              <Link
                to="/auth"
                search={{ mode: registering ? "signin" : "register" }}
                className="font-medium text-foreground underline underline-offset-4"
              >
                {registering ? "Sign in" : "Create an account"}
              </Link>
            </p>
          </CardContent>
        </Card>
      </section>
    </PublicLayout>
  );
}
