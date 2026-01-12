import { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface StatCardProps {
  label: string;
  value: string | number;
  sublabel?: string;
  icon: ReactNode;
  iconBgColor?: string;
}

export function StatCard({ label, value, sublabel, icon, iconBgColor }: StatCardProps) {
  return (
    <div className="stat-card">
      <div>
        <p className="text-sm text-muted-foreground">{label}</p>
        <p className="text-2xl font-bold text-foreground mt-1">{value}</p>
        {sublabel && <p className="text-xs text-muted-foreground mt-1">{sublabel}</p>}
      </div>
      <div className={cn("w-10 h-10 rounded-full flex items-center justify-center", iconBgColor || "bg-primary/10")}>
        {icon}
      </div>
    </div>
  );
}
