import { PageLayout } from "@/components/layout/PageLayout";
import { StatCard } from "@/components/dashboard/StatCard";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { dashboardStats, recentPayments, overduePayments } from "@/data/mockData";
import { DollarSign, CheckCircle2, AlertCircle, TrendingUp, ExternalLink } from "lucide-react";

export default function Dashboard() {
  return (
    <PageLayout>
      <div className="page-header">
        <h1 className="page-title">Dashboard</h1>
        <p className="page-description">Overview of rent collection and tenant payments</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard
          label="Total Expected"
          value={`$${dashboardStats.totalExpected.toLocaleString()}`}
          sublabel="This month"
          icon={<DollarSign className="w-5 h-5 text-primary" />}
          iconBgColor="bg-primary/10"
        />
        <StatCard
          label="Total Collected"
          value={`$${dashboardStats.totalCollected.toLocaleString()}`}
          sublabel={`${dashboardStats.collectionRate}% collection rate`}
          icon={<CheckCircle2 className="w-5 h-5 text-primary" />}
          iconBgColor="bg-primary/10"
        />
        <StatCard
          label="Overdue Payments"
          value={dashboardStats.overdueCount}
          sublabel="Requiring attention"
          icon={<AlertCircle className="w-5 h-5 text-destructive" />}
          iconBgColor="bg-destructive/10"
        />
        <StatCard
          label="Partial Payments"
          value={dashboardStats.partialCount}
          sublabel="Awaiting full payment"
          icon={<TrendingUp className="w-5 h-5 text-warning" />}
          iconBgColor="bg-warning/10"
        />
      </div>

      {/* Two Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Payment Submissions */}
        <div className="lg:col-span-2">
          <h2 className="text-xl font-semibold mb-4">Recent Payment Submissions</h2>
          <div className="bg-card rounded-lg border">
            <table className="data-table">
              <thead>
                <tr className="border-b">
                  <th className="px-4">Tenant</th>
                  <th className="px-4">Amount</th>
                  <th className="px-4">Submitted</th>
                  <th className="px-4">Status</th>
                  <th className="px-4">Proof</th>
                </tr>
              </thead>
              <tbody>
                {recentPayments.map((payment) => (
                  <tr key={payment.id}>
                    <td className="px-4 font-medium">{payment.tenantName}</td>
                    <td className="px-4">${payment.amount.toLocaleString()}</td>
                    <td className="px-4 text-muted-foreground">{payment.submittedAt}</td>
                    <td className="px-4">
                      <StatusBadge status={payment.status} />
                    </td>
                    <td className="px-4">
                      <button className="inline-flex items-center gap-1 text-primary text-sm hover:underline">
                        <ExternalLink className="w-3.5 h-3.5" />
                        View
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Overdue Payments */}
        <div>
          <h2 className="text-xl font-semibold mb-4">Overdue Payments</h2>
          <div className="bg-card rounded-lg border p-4">
            <div className="flex items-center gap-2 text-destructive mb-4">
              <AlertCircle className="w-4 h-4" />
              <span className="font-medium">{overduePayments.length} Overdue Payments</span>
            </div>
            <div className="space-y-4">
              {overduePayments.map((payment) => (
                <div key={payment.id} className="flex items-center justify-between py-2 border-b last:border-0">
                  <div>
                    <p className="font-medium">{payment.tenantName}</p>
                    <p className="text-sm text-muted-foreground">{payment.unitName}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-destructive">${payment.amount.toLocaleString()}</p>
                    <p className="text-xs text-destructive">{payment.daysOverdue} days overdue</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </PageLayout>
  );
}
