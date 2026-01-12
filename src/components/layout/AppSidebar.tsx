import { NavLink, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  Building2,
  Home,
  Users,
  FileText,
  Upload,
  Bell,
  LogOut,
} from "lucide-react";
import { cn } from "@/lib/utils";

const navigation = [
  { name: "Dashboard", href: "/", icon: LayoutDashboard },
  { name: "Properties", href: "/properties", icon: Building2 },
  { name: "Units", href: "/units", icon: Home },
  { name: "Tenants", href: "/tenants", icon: Users },
  { name: "Rent Ledger", href: "/rent-ledger", icon: FileText },
  { name: "Payment Proofs", href: "/payment-proofs", icon: Upload },
  { name: "Notifications", href: "/notifications", icon: Bell },
];

export function AppSidebar() {
  const location = useLocation();

  return (
    <aside className="w-64 bg-sidebar border-r border-sidebar-border flex flex-col min-h-screen">
      {/* Logo */}
      <div className="p-5 border-b border-sidebar-border">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-primary flex items-center justify-center">
            <Building2 className="w-5 h-5 text-primary-foreground" />
          </div>
          <div>
            <h1 className="font-bold text-foreground">CHARTAHOME</h1>
            <p className="text-xs text-primary">Rent Tracker</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-3">
        <ul className="space-y-1">
          {navigation.map((item) => {
            const isActive = location.pathname === item.href;
            return (
              <li key={item.name}>
                <NavLink
                  to={item.href}
                  className={cn(
                    "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors",
                    isActive
                      ? "bg-sidebar-accent text-sidebar-accent-foreground"
                      : "text-sidebar-foreground hover:bg-sidebar-accent/50"
                  )}
                >
                  <item.icon className={cn("w-5 h-5", isActive && "text-primary")} />
                  {item.name}
                </NavLink>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* User Profile */}
      <div className="p-3 border-t border-sidebar-border">
        <div className="flex items-center gap-3 px-3 py-2">
          <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center text-sm font-medium text-muted-foreground">
            D
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-foreground truncate">Daniella</p>
            <p className="text-xs text-muted-foreground truncate">rdtb1418@gmail.com</p>
          </div>
        </div>
        <button className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-sidebar-foreground hover:bg-sidebar-accent/50 transition-colors mt-1">
          <LogOut className="w-5 h-5" />
          Sign Out
        </button>
      </div>
    </aside>
  );
}
