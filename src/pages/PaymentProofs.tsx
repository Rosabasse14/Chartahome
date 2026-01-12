import { PageLayout } from "@/components/layout/PageLayout";
import { StatCard } from "@/components/dashboard/StatCard";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { paymentProofs } from "@/data/mockData";
import { FileText, User, DollarSign, Calendar, ExternalLink } from "lucide-react";

export default function PaymentProofs() {
  const totalAmount = paymentProofs.reduce((sum, p) => sum + p.amount, 0);
  const thisMonth = paymentProofs.length;
  const thisWeek = 2;

  return (
    <PageLayout>
      <div className="page-header">
        <h1 className="page-title">Payment Proofs</h1>
        <p className="page-description">View all submitted payment proof documents</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div className="stat-card">
          <div>
            <p className="text-sm text-muted-foreground">Total Submissions</p>
            <p className="text-3xl font-bold text-foreground mt-1">{paymentProofs.length}</p>
          </div>
        </div>
        <div className="stat-card">
          <div>
            <p className="text-sm text-muted-foreground">This Month</p>
            <p className="text-3xl font-bold text-primary mt-1">{thisMonth}</p>
          </div>
        </div>
        <div className="stat-card">
          <div>
            <p className="text-sm text-muted-foreground">Total Amount</p>
            <p className="text-3xl font-bold text-foreground mt-1">${totalAmount.toLocaleString()}</p>
          </div>
        </div>
        <div className="stat-card">
          <div>
            <p className="text-sm text-muted-foreground">This Week</p>
            <p className="text-3xl font-bold text-primary mt-1">{thisWeek}</p>
          </div>
        </div>
      </div>

      {/* Payment Proofs List */}
      <div className="space-y-4">
        {paymentProofs.map((proof) => (
          <div key={proof.id} className="proof-card">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-start gap-4">
                <div className="w-16 h-20 rounded-lg bg-muted flex items-center justify-center">
                  <FileText className="w-8 h-8 text-muted-foreground" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg">Payment Proof {proof.proofNumber}</h3>
                  <p className="text-sm text-muted-foreground">Submitted {proof.submittedAt}</p>
                </div>
              </div>
              <StatusBadge status={proof.status} />
            </div>
            
            <div className="flex items-center gap-8 mb-4">
              <div className="flex items-center gap-3">
                <User className="w-5 h-5 text-muted-foreground" />
                <div>
                  <p className="text-xs text-muted-foreground">Tenant</p>
                  <p className="font-medium">{proof.tenantName}</p>
                  <p className="text-sm text-muted-foreground">{proof.unitName}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <DollarSign className="w-5 h-5 text-primary" />
                <div>
                  <p className="text-xs text-muted-foreground">Amount Paid</p>
                  <p className="font-semibold text-primary text-lg">${proof.amount.toLocaleString()}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Calendar className="w-5 h-5 text-muted-foreground" />
                <div>
                  <p className="text-xs text-muted-foreground">Period</p>
                  <p className="font-medium">{proof.period}</p>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between pt-4 border-t">
              <button className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors">
                <ExternalLink className="w-4 h-4" />
                View File
              </button>
              {proof.notes && (
                <div>
                  <p className="text-xs text-muted-foreground">Notes:</p>
                  <p className="text-sm">{proof.notes}</p>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </PageLayout>
  );
}
