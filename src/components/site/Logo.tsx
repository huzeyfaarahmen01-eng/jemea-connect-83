import { MessagesSquare } from "lucide-react";
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
      <span
        className={cn(
          "flex size-9 items-center justify-center rounded-xl",
          tone === "inverted" ? "bg-primary/20 text-primary" : "bg-primary text-primary-foreground",
        )}
      >
        <MessagesSquare className="size-5" />
      </span>
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
