import { cn, getReadinessBg } from "@/lib/utils";
import type { ReadinessLevel } from "@/types/data-product";

interface Props {
  level: ReadinessLevel;
  size?: "sm" | "md";
}

export function ReadinessBadge({ level, size = "md" }: Props) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full font-medium border",
        getReadinessBg(level),
        size === "sm" ? "px-2 py-0.5 text-xs" : "px-2.5 py-1 text-xs"
      )}
    >
      {level}
    </span>
  );
}
