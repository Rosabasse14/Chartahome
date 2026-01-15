-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- PROFILES (Links to auth.users)
create table if not exists public.profiles (
  id uuid references auth.users not null primary key,
  email text not null,
  full_name text,
  role text check (role in ('SUPER_ADMIN', 'MANAGER', 'TENANT')) not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- PROPERTIES
create table if not exists public.properties (
  id uuid default uuid_generate_v4() primary key,
  manager_id uuid references public.profiles(id) not null,
  name text not null,
  address text not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- UNITS
create table if not exists public.units (
  id uuid default uuid_generate_v4() primary key,
  property_id uuid references public.properties(id) on delete cascade not null,
  name text not null, -- e.g. "Apt 4B"
  monthly_rent numeric not null,
  status text check (status in ('occupied', 'vacant', 'maintenance')) default 'vacant',
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- TENANTS
-- Extends profile information with lease details
create table if not exists public.tenants (
  id uuid default uuid_generate_v4() primary key,
  profile_id uuid references public.profiles(id), -- Nullable initially if invited but not yet signed up, or use email to link
  unit_id uuid references public.units(id), -- Enforces 1 unit per tenant logic if we add unique constraint
  email text not null,
  name text not null,
  lease_start date,
  lease_end date,
  is_active boolean default true,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  constraint unique_unit_assignment unique (unit_id) -- Ensures one unit assigned to one tenant only (active)
);

-- PAYMENTS
create table if not exists public.payments (
  id uuid default uuid_generate_v4() primary key,
  tenant_id uuid references public.tenants(id) not null,
  unit_id uuid references public.units(id) not null,
  amount numeric not null,
  period text not null, -- e.g. "January 2026"
  status text check (status in ('pending', 'verified', 'rejected')) default 'pending',
  proof_url text, -- Supabase Storage URL
  payment_method text,
  notes text,
  submitted_at timestamp with time zone default timezone('utc'::text, now()) not null,
  verified_at timestamp with time zone
);

-- MANAGERS TABLE (For directory / legacy compatibility if needed, or strictly use profiles)
create table if not exists public.managers (
  id uuid default uuid_generate_v4() primary key,
  profile_id uuid references public.profiles(id),
  email text not null,
  name text not null,
  phone text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- RLS POLICIES & SECURITY

-- Enable RLS
alter table public.profiles enable row level security;
alter table public.properties enable row level security;
alter table public.units enable row level security;
alter table public.tenants enable row level security;
alter table public.payments enable row level security;
alter table public.managers enable row level security;

-- Drop existing policies to ensure clean updates (Idempotent)
drop policy if exists "Users can view own profile" on public.profiles;
create policy "Users can view own profile" on public.profiles
  for select using (auth.uid() = id);

drop policy if exists "Managers view assigned properties" on public.properties;
create policy "Managers view assigned properties" on public.properties
  for select using (manager_id = auth.uid() or exists (select 1 from public.profiles where id = auth.uid() and role = 'SUPER_ADMIN'));

drop policy if exists "Managers view units" on public.units;
create policy "Managers view units" on public.units
  for select using (
    exists (select 1 from public.properties where id = public.units.property_id and manager_id = auth.uid())
    or exists (select 1 from public.profiles where id = auth.uid() and role = 'SUPER_ADMIN')
  );

drop policy if exists "Tenants view own unit" on public.units;
create policy "Tenants view own unit" on public.units
  for select using (
    exists (select 1 from public.tenants where unit_id = public.units.id and profile_id = auth.uid())
  );

drop policy if exists "Managers view tenants" on public.tenants;
create policy "Managers view tenants" on public.tenants
  for all using (
    exists (select 1 from public.profiles where id = auth.uid() and role in ('MANAGER', 'SUPER_ADMIN'))
  );

drop policy if exists "Tenants view own record" on public.tenants;
create policy "Tenants view own record" on public.tenants
  for select using (profile_id = auth.uid());

drop policy if exists "Managers view payments" on public.payments;
create policy "Managers view payments" on public.payments
  for all using (
    exists (select 1 from public.profiles where id = auth.uid() and role in ('MANAGER', 'SUPER_ADMIN'))
  );

drop policy if exists "Tenants view own payments" on public.payments;
create policy "Tenants view own payments" on public.payments
  for select using (
    exists (select 1 from public.tenants where id = public.payments.tenant_id and profile_id = auth.uid())
  );

drop policy if exists "Tenants insert payments" on public.payments;
create policy "Tenants insert payments" on public.payments
  for insert with check (
    exists (select 1 from public.tenants where id = tenant_id and profile_id = auth.uid())
  );

-- STORAGE BUCKET SCRIPT (Run this in SQL Editor)
insert into storage.buckets (id, name, public) values ('payment_proofs', 'payment_proofs', true)
on conflict (id) do nothing;

-- Ensure RLS on objects is set
drop policy if exists "Authenticated users can upload proofs" on storage.objects;
create policy "Authenticated users can upload proofs" on storage.objects for insert with check (bucket_id = 'payment_proofs' and auth.role() = 'authenticated');

drop policy if exists "Public access to proofs" on storage.objects;
create policy "Public access to proofs" on storage.objects for select using (bucket_id = 'payment_proofs');

-- REALTIME
alter publication supabase_realtime add table public.payments;
alter publication supabase_realtime add table public.units;
