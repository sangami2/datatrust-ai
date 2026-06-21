import { cn, getStatusColor } from "@/lib/utils";

interface Props {
  status: string;
  size?: "sm" | "md";
}

const labels: Record<string, string> = {
  open: "Open",
  investigating: "Investigating",
  "in-progress": "In Progress",
  resolved: "Resolved",
  complete: "Complete",
  partial: "Partial",
  minimal: "Minimal",
  signed: "Signed",
  draft: "Draft",
  "not started": "Not Started",
  compliant: "Compliant",
  conditional: "Conditional",
  "non-compliant": "Non-Compliant",
};

export function StatusBadge({ status, size = "md" }: Props) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full font-medium border",
        getStatusColor(status),
        size === "sm" ? "px-2 py-0.5 text-xs" : "px-2.5 py-1 text-xs"
      )}
    >
      {labels[status.toLowerCase()] ?? status}
    </span>
  );
}
