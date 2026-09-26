import { Link } from "@tanstack/react-router";
import { Menu, Moon, Sun, X } from "lucide-react";
import { useEffect, useState, type ReactNode } from "react";
import { Button } from "@/components/ui/button";
import { Logo } from "@/components/site/Logo";
import { useAuth } from "@/hooks/useAuth";
import { auth } from "@/integrations/firebase/client";
import { signOut } from "firebase/auth";

const publicLinks = [
  { to: "/", label: "Home" },
  { to: "/about", label: "About" },
];

const studentLinks = [
  { to: "/contact", label: "Submit an idea" },
  { to: "/status", label: "Check status" },
];

export function PublicLayout({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false);
  const [theme, setTheme] = useState<"light" | "dark">("light");
  const { user, isAdmin, loading } = useAuth();
  const signedIn = !loading && Boolean(user);
  const links = signedIn ? [...publicLinks, ...studentLinks] : publicLinks;

  useEffect(() => {
    let savedTheme: string | null = null;
    try {
      savedTheme = localStorage.getItem("jemea-theme");
    } catch {
      savedTheme = null;
    }
    const initialTheme =
      savedTheme === "light" || savedTheme === "dark"
        ? savedTheme
        : window.matchMedia("(prefers-color-scheme: dark)").matches
          ? "dark"
          : "light";
    setTheme(initialTheme);
    document.documentElement.classList.toggle("dark", initialTheme === "dark");
    document.documentElement.style.colorScheme = initialTheme;
  }, []);

  function toggleTheme() {
    const nextTheme = theme === "dark" ? "light" : "dark";
    setTheme(nextTheme);
    document.documentElement.classList.toggle("dark", nextTheme === "dark");
    document.documentElement.style.colorScheme = nextTheme;
    try {
      localStorage.setItem("jemea-theme", nextTheme);
    } catch {
      // Keep the current choice for this session when storage is unavailable.
    }
  }

  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-40 border-b border-border/80 bg-background/85 backdrop-blur">
        <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-4 py-3 sm:px-6">
          <Link to="/" aria-label="Jemea home">
            <Logo />
          </Link>

          <nav className="hidden items-center gap-1 md:flex">
            {links.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                activeOptions={{ exact: link.to === "/" }}
                className="rounded-md px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground data-[status=active]:bg-secondary data-[status=active]:text-foreground"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          <div className="hidden items-center gap-2 md:flex">
            <Button
              variant="ghost"
              size="icon"
              aria-label={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
              title={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
              aria-pressed={theme === "dark"}
              onClick={toggleTheme}
            >
              {theme === "dark" ? <Sun className="size-5" /> : <Moon className="size-5" />}
            </Button>
            {!loading && user ? (
              <>
                {isAdmin && (
                  <Button asChild variant="ghost">
                    <Link to="/admin">Admin dashboard</Link>
                  </Button>
                )}
                <Button asChild variant="ghost">
                  <Link to="/auth">Account</Link>
                </Button>
                <Button variant="outline" onClick={() => void signOut(auth)}>
                  Sign out
                </Button>
              </>
            ) : (
              <>
                <Button asChild variant="ghost">
                  <Link to="/auth">Sign in</Link>
                </Button>
                <Button asChild>
                  <Link to="/auth" search={{ mode: "register" }}>
                    Create account
                  </Link>
                </Button>
              </>
            )}
          </div>

          <div className="flex items-center gap-1 md:hidden">
            <Button
              variant="ghost"
              size="icon"
              aria-label={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
              title={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
              aria-pressed={theme === "dark"}
              onClick={toggleTheme}
            >
              {theme === "dark" ? <Sun className="size-5" /> : <Moon className="size-5" />}
            </Button>
            <Button
              variant="outline"
              size="icon"
              aria-label={open ? "Close menu" : "Open menu"}
              onClick={() => setOpen((value) => !value)}
            >
              {open ? <X className="size-5" /> : <Menu className="size-5" />}
            </Button>
          </div>
        </div>

        {open && (
          <div className="border-t border-border bg-background px-4 pb-4 md:hidden">
            <nav className="flex flex-col gap-1 py-2">
              {links.map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  onClick={() => setOpen(false)}
                  className="rounded-md px-3 py-2 text-sm font-medium text-muted-foreground hover:bg-secondary hover:text-foreground"
                >
                  {link.label}
                </Link>
              ))}
            </nav>
            <div className="flex flex-col gap-2">
              {!loading && user ? (
                <>
                  {isAdmin && (
                    <Button asChild variant="outline" onClick={() => setOpen(false)}>
                      <Link to="/admin">Admin dashboard</Link>
                    </Button>
                  )}
                  <Button asChild variant="outline" onClick={() => setOpen(false)}>
                    <Link to="/auth">Account</Link>
                  </Button>
                  <Button
                    onClick={() => {
                      setOpen(false);
                      void signOut(auth);
                    }}
                  >
                    Sign out
                  </Button>
                </>
              ) : (
                <>
                  <Button asChild variant="outline" onClick={() => setOpen(false)}>
                    <Link to="/auth">Sign in</Link>
                  </Button>
                  <Button asChild onClick={() => setOpen(false)}>
                    <Link to="/auth" search={{ mode: "register" }}>
                      Create account
                    </Link>
                  </Button>
                </>
              )}
            </div>
          </div>
        )}
      </header>

      <main className="flex-1">{children}</main>

      <footer className="border-t border-border bg-ink text-ink-foreground">
        <div className="mx-auto grid w-full max-w-6xl gap-8 px-4 py-12 sm:px-6 md:grid-cols-3">
          <div>
            <Logo tone="inverted" />
            <p className="mt-3 max-w-xs text-sm text-ink-foreground/70">
              A structured bridge between students and administration: ideas, questions, concerns
              and feedback that actually get answered.
            </p>
          </div>
          <div>
            <h4 className="text-sm font-semibold">Platform</h4>
            <ul className="mt-3 space-y-2 text-sm text-ink-foreground/70">
              {links.map((link) => (
                <li key={link.to}>
                  <Link to={link.to} className="transition-colors hover:text-ink-foreground">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="text-sm font-semibold">Access</h4>
            <ul className="mt-3 space-y-2 text-sm text-ink-foreground/70">
              <li>
                <Link to="/auth" className="transition-colors hover:text-ink-foreground">
                  Student sign in
                </Link>
              </li>
              <li>
                <Link
                  to="/auth"
                  search={{ mode: "register" }}
                  className="transition-colors hover:text-ink-foreground"
                >
                  Student registration
                </Link>
              </li>
              {isAdmin && (
                <li>
                  <Link to="/admin" className="transition-colors hover:text-ink-foreground">
                    Admin dashboard
                  </Link>
                </li>
              )}
            </ul>
          </div>
        </div>
        <div className="border-t border-sidebar-border px-4 py-5 text-center text-xs text-ink-foreground/60 sm:px-6">
          Jemea — student voice, tracked end to end.
        </div>
      </footer>
    </div>
  );
}
