import { useState } from "react";
import { PageLayout } from "@/components/layout/PageLayout";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { rentLedger as initialLedger, tenants, units } from "@/data/mockData";
import { RentLedgerEntry } from "@/types";
import { Plus, Filter, ChevronDown } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export default function RentLedger() {
  const [ledger, setLedger] = useState<RentLedgerEntry[]>(initialLedger);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [newEntry, setNewEntry] = useState({
    tenantId: "",
    period: "",
    expected: "",
    paid: "",
    dueDate: "",
  });

  const handleAddEntry = () => {
    if (newEntry.tenantId && newEntry.period && newEntry.expected) {
      const tenant = tenants.find((t) => t.id === newEntry.tenantId);
      const expected = parseFloat(newEntry.expected);
      const paid = parseFloat(newEntry.paid) || 0;
      const balance = expected - paid;
      
      let status: RentLedgerEntry["status"] = "pending";
      if (paid >= expected) status = "paid";
      else if (paid > 0) status = "partial";

      const entry: RentLedgerEntry = {
        id: Date.now().toString(),
        tenantName: tenant?.name || "",
        unitName: tenant?.unitName || "",
        period: newEntry.period,
        expected,
        paid,
        balance,
        dueDate: newEntry.dueDate,
        status,
      };
      setLedger([entry, ...ledger]);
      setNewEntry({ tenantId: "", period: "", expected: "", paid: "", dueDate: "" });
      setIsDialogOpen(false);
    }
  };

  const filteredLedger = statusFilter === "all" 
    ? ledger 
    : ledger.filter((entry) => entry.status === statusFilter);

  return (
    <PageLayout>
      <div className="flex items-center justify-between mb-6">
        <div className="page-header mb-0">
          <h1 className="page-title">Rent Ledger</h1>
          <p className="page-description">Track all rent payments and outstanding balances</p>
        </div>
        <div className="flex items-center gap-3">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline">
                <Filter className="w-4 h-4 mr-2" />
                {statusFilter === "all" ? "All Status" : statusFilter}
                <ChevronDown className="w-4 h-4 ml-2" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => setStatusFilter("all")}>
                All Status
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setStatusFilter("paid")}>
                Paid
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setStatusFilter("partial")}>
                Partial
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setStatusFilter("overdue")}>
                Overdue
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setStatusFilter("pending")}>
                Pending
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="w-4 h-4 mr-2" />
                Add Entry
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add Ledger Entry</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 pt-4">
                <div>
                  <Label htmlFor="tenant">Tenant</Label>
                  <Select
                    value={newEntry.tenantId}
                    onValueChange={(value) => setNewEntry({ ...newEntry, tenantId: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select a tenant" />
                    </SelectTrigger>
                    <SelectContent>
                      {tenants.map((tenant) => (
                        <SelectItem key={tenant.id} value={tenant.id}>
                          {tenant.name} - {tenant.unitName}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="period">Period</Label>
                  <Input
                    id="period"
                    value={newEntry.period}
                    onChange={(e) => setNewEntry({ ...newEntry, period: e.target.value })}
                    placeholder="e.g., January 2026"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="expected">Expected ($)</Label>
                    <Input
                      id="expected"
                      type="number"
                      value={newEntry.expected}
                      onChange={(e) => setNewEntry({ ...newEntry, expected: e.target.value })}
                      placeholder="1500"
                    />
                  </div>
                  <div>
                    <Label htmlFor="paid">Paid ($)</Label>
                    <Input
                      id="paid"
                      type="number"
                      value={newEntry.paid}
                      onChange={(e) => setNewEntry({ ...newEntry, paid: e.target.value })}
                      placeholder="0"
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="dueDate">Due Date</Label>
                  <Input
                    id="dueDate"
                    value={newEntry.dueDate}
                    onChange={(e) => setNewEntry({ ...newEntry, dueDate: e.target.value })}
                    placeholder="e.g., Jan 1, 2026"
                  />
                </div>
                <Button onClick={handleAddEntry} className="w-full">
                  Add Entry
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <div className="bg-card rounded-lg border">
        <table className="data-table">
          <thead>
            <tr className="border-b">
              <th className="px-4">Tenant</th>
              <th className="px-4">Period</th>
              <th className="px-4">Expected</th>
              <th className="px-4">Paid</th>
              <th className="px-4">Balance</th>
              <th className="px-4">Due Date</th>
              <th className="px-4">Status</th>
            </tr>
          </thead>
          <tbody>
            {filteredLedger.map((entry) => (
              <tr key={entry.id}>
                <td className="px-4">
                  <div>
                    <p className="font-medium">{entry.tenantName}</p>
                    <p className="text-sm text-muted-foreground">{entry.unitName}</p>
                  </div>
                </td>
                <td className="px-4 text-muted-foreground">{entry.period}</td>
                <td className="px-4 font-medium">${entry.expected.toLocaleString()}</td>
                <td className="px-4 font-medium text-primary">${entry.paid.toLocaleString()}</td>
                <td className={`px-4 font-medium ${entry.balance > 0 ? "text-destructive" : ""}`}>
                  ${entry.balance.toLocaleString()}
                </td>
                <td className="px-4 text-muted-foreground">{entry.dueDate}</td>
                <td className="px-4">
                  <StatusBadge status={entry.status} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </PageLayout>
  );
}
