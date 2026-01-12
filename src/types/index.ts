export interface Property {
  id: string;
  name: string;
  address: string;
  units: number;
}

export interface Unit {
  id: string;
  name: string;
  propertyId: string;
  propertyName: string;
  monthlyRent: number;
  status: 'available' | 'occupied';
  tenantName?: string;
}

export interface Tenant {
  id: string;
  name: string;
  email: string;
  phone?: string;
  unitId: string;
  unitName: string;
  propertyName: string;
  status: 'active' | 'inactive';
}

export interface RentLedgerEntry {
  id: string;
  tenantName: string;
  unitName: string;
  period: string;
  expected: number;
  paid: number;
  balance: number;
  dueDate: string;
  status: 'paid' | 'partial' | 'overdue' | 'pending';
}

export interface PaymentSubmission {
  id: string;
  tenantName: string;
  amount: number;
  submittedAt: string;
  status: 'paid' | 'partial' | 'pending';
}

export interface PaymentProof {
  id: string;
  proofNumber: string;
  submittedAt: string;
  tenantName: string;
  unitName: string;
  amount: number;
  period: string;
  notes?: string;
  status: 'paid' | 'partial' | 'pending';
}

export interface OverduePayment {
  id: string;
  tenantName: string;
  unitName: string;
  amount: number;
  daysOverdue: number;
}
