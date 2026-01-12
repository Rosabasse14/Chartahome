import { PageLayout } from "@/components/layout/PageLayout";
import { Bell, AlertCircle, CheckCircle2, Clock } from "lucide-react";

const notifications = [
  {
    id: "1",
    type: "overdue",
    title: "Payment Overdue",
    message: "Emily Rodriguez has an overdue payment of $2,200 for Apt A",
    time: "2 hours ago",
  },
  {
    id: "2",
    type: "payment",
    title: "Payment Received",
    message: "Robert Wilson paid $2,500 for Suite 1A",
    time: "1 day ago",
  },
  {
    id: "3",
    type: "partial",
    title: "Partial Payment",
    message: "Sarah Chen made a partial payment of $800 for Unit 102",
    time: "2 days ago",
  },
  {
    id: "4",
    type: "payment",
    title: "Payment Received",
    message: "John Smith paid $1,500 for Unit 101",
    time: "3 days ago",
  },
];

export default function Notifications() {
  const getIcon = (type: string) => {
    switch (type) {
      case "overdue":
        return <AlertCircle className="w-5 h-5 text-destructive" />;
      case "payment":
        return <CheckCircle2 className="w-5 h-5 text-primary" />;
      case "partial":
        return <Clock className="w-5 h-5 text-warning" />;
      default:
        return <Bell className="w-5 h-5 text-muted-foreground" />;
    }
  };

  return (
    <PageLayout>
      <div className="page-header">
        <h1 className="page-title">Notifications</h1>
        <p className="page-description">Stay updated on payments and tenant activity</p>
      </div>

      <div className="space-y-3">
        {notifications.map((notification) => (
          <div key={notification.id} className="bg-card rounded-lg border p-4 flex items-start gap-4">
            <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center shrink-0">
              {getIcon(notification.type)}
            </div>
            <div className="flex-1">
              <h3 className="font-medium">{notification.title}</h3>
              <p className="text-sm text-muted-foreground mt-1">{notification.message}</p>
              <p className="text-xs text-muted-foreground mt-2">{notification.time}</p>
            </div>
          </div>
        ))}
      </div>
    </PageLayout>
  );
}
