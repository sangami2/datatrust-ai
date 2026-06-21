import { cn, getSeverityColor } from "@/lib/utils";
import type { IncidentSeverity } from "@/types/incident";

interface Props {
  severity: IncidentSeverity;
  size?: "sm" | "md";
}

export function SeverityBadge({ severity, size = "md" }: Props) {
  const labels: Record<IncidentSeverity, string> = {
    critical: "Critical",
    high: "High",
    medium: "Medium",
    low: "Low",
  };

  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full font-medium border capitalize",
        getSeverityColor(severity),
        size === "sm" ? "px-2 py-0.5 text-xs" : "px-2.5 py-1 text-xs"
      )}
    >
      {labels[severity]}
    </span>
  );
}
