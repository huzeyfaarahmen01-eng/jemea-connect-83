import { cn } from "@/lib/utils";

export function Logo({
  className,
  tone = "default",
}: {
  className?: string;
  tone?: "default" | "inverted";
}) {
  return (
    <span className={cn("inline-flex items-center gap-2", className)}>
      <img
        src="/favicon.ico"
        alt=""
        className={cn(
          "size-9 rounded-xl bg-white object-contain p-0.5 ring-1 ring-border",
          tone === "inverted" && "ring-white/30",
        )}
      />
      <span
        className={cn(
          "font-display text-xl font-semibold tracking-tight",
          tone === "inverted" ? "text-sidebar-foreground" : "text-foreground",
        )}
      >
        Jemea
      </span>
    </span>
  );
}
