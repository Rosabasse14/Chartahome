import { cn } from "@/lib/utils";

interface StatusBadgeProps {
  status: "paid" | "partial" | "overdue" | "pending" | "active" | "inactive" | "available" | "occupied";
}

export function StatusBadge({ status }: StatusBadgeProps) {
  const styles = {
    paid: "bg-primary/10 text-primary border-primary/20",
    partial: "bg-warning/10 text-warning border-warning/20",
    overdue: "bg-destructive/10 text-destructive border-destructive/20",
    pending: "bg-muted text-muted-foreground border-muted",
    active: "bg-primary/10 text-primary border-primary/20",
    inactive: "bg-muted text-muted-foreground border-muted",
    available: "text-muted-foreground",
    occupied: "text-primary",
  };

  return (
    <span
      className={cn(
        "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border",
        styles[status]
      )}
    >
      {status}
    </span>
  );
}
