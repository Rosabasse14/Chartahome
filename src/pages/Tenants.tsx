import { useState } from "react";
import { PageLayout } from "@/components/layout/PageLayout";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { tenants as initialTenants, units } from "@/data/mockData";
import { Tenant } from "@/types";
import { Plus, Users, Mail, Phone, Home, MoreVertical } from "lucide-react";
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

export default function Tenants() {
  const [tenants, setTenants] = useState<Tenant[]>(initialTenants);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newTenant, setNewTenant] = useState({
    name: "",
    email: "",
    phone: "",
    unitId: "",
  });

  const handleAddTenant = () => {
    if (newTenant.name && newTenant.email && newTenant.unitId) {
      const unit = units.find((u) => u.id === newTenant.unitId);
      const tenant: Tenant = {
        id: Date.now().toString(),
        name: newTenant.name,
        email: newTenant.email,
        phone: newTenant.phone,
        unitId: newTenant.unitId,
        unitName: unit?.name || "",
        propertyName: unit?.propertyName || "",
        status: "active",
      };
      setTenants([...tenants, tenant]);
      setNewTenant({ name: "", email: "", phone: "", unitId: "" });
      setIsDialogOpen(false);
    }
  };

  const handleDeleteTenant = (id: string) => {
    setTenants(tenants.filter((t) => t.id !== id));
  };

  return (
    <PageLayout>
      <div className="flex items-center justify-between mb-6">
        <div className="page-header mb-0">
          <h1 className="page-title">Tenants</h1>
          <p className="page-description">{tenants.length} tenants registered</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              Add Tenant
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Tenant</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 pt-4">
              <div>
                <Label htmlFor="name">Full Name</Label>
                <Input
                  id="name"
                  value={newTenant.name}
                  onChange={(e) => setNewTenant({ ...newTenant, name: e.target.value })}
                  placeholder="e.g., John Smith"
                />
              </div>
              <div>
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={newTenant.email}
                  onChange={(e) => setNewTenant({ ...newTenant, email: e.target.value })}
                  placeholder="e.g., john@example.com"
                />
              </div>
              <div>
                <Label htmlFor="phone">Phone (Optional)</Label>
                <Input
                  id="phone"
                  value={newTenant.phone}
                  onChange={(e) => setNewTenant({ ...newTenant, phone: e.target.value })}
                  placeholder="e.g., +1 234 567 8900"
                />
              </div>
              <div>
                <Label htmlFor="unit">Unit</Label>
                <Select
                  value={newTenant.unitId}
                  onValueChange={(value) => setNewTenant({ ...newTenant, unitId: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select a unit" />
                  </SelectTrigger>
                  <SelectContent>
                    {units.map((unit) => (
                      <SelectItem key={unit.id} value={unit.id}>
                        {unit.name} - {unit.propertyName}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <Button onClick={handleAddTenant} className="w-full">
                Add Tenant
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="space-y-3">
        {tenants.map((tenant) => (
          <div key={tenant.id} className="tenant-card flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center">
                <Users className="w-6 h-6 text-muted-foreground" />
              </div>
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="font-semibold">{tenant.name}</h3>
                  <StatusBadge status={tenant.status} />
                </div>
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <Mail className="w-3.5 h-3.5" />
                    <span>{tenant.email}</span>
                  </div>
                  {tenant.phone && (
                    <div className="flex items-center gap-1">
                      <Phone className="w-3.5 h-3.5" />
                      <span>{tenant.phone}</span>
                    </div>
                  )}
                </div>
                <div className="flex items-center gap-1 text-sm text-primary mt-1">
                  <Home className="w-3.5 h-3.5" />
                  <span>{tenant.unitName} • {tenant.propertyName}</span>
                </div>
              </div>
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="p-2 hover:bg-muted rounded-lg transition-colors">
                  <MoreVertical className="w-4 h-4 text-muted-foreground" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem>Edit</DropdownMenuItem>
                <DropdownMenuItem 
                  className="text-destructive"
                  onClick={() => handleDeleteTenant(tenant.id)}
                >
                  Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        ))}
      </div>
    </PageLayout>
  );
}
