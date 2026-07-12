-- AetherAqua — Veritabanı Şeması (v1)
-- Bu dosyayı Supabase Dashboard → SQL Editor → New query içine yapıştırıp
-- "Run" ile çalıştırın.

-- ============================================
-- 1. STOK TABLOSU
-- ============================================
create table if not exists public.stock (
  product_id text not null check (product_id in ('apollo', 'helios')),
  size int not null check (size in (30,40,50,60,70,80,90,100,110,120)),
  quantity int not null default 0 check (quantity >= 0),
  updated_at timestamptz not null default now(),
  primary key (product_id, size)
);

alter table public.stock enable row level security;

-- Herkes stok durumunu görebilir (ürün sayfasında göstermek için)
create policy "Stok herkese açık okunabilir"
  on public.stock for select
  to anon, authenticated
  using (true);

-- Başlangıç stok verisi (her boy için 15 adet varsayılan)
insert into public.stock (product_id, size, quantity)
select p.product_id, s.size, 15
from (values ('apollo'), ('helios')) as p(product_id)
cross join (values (30),(40),(50),(60),(70),(80),(90),(100),(110),(120)) as s(size)
on conflict (product_id, size) do nothing;

-- ============================================
-- 2. SİPARİŞLER TABLOSU
-- ============================================
create table if not exists public.orders (
  id uuid primary key default gen_random_uuid(),
  order_no text not null unique,
  user_id uuid references auth.users(id) on delete set null,

  status text not null default 'beklemede'
    check (status in ('beklemede','onaylandı','hazırlanıyor','kargoya_verildi','teslim_edildi','iptal')),
  payment_status text not null default 'beklemede'
    check (payment_status in ('beklemede','ödendi','başarısız','iade')),

  customer_name text not null,
  customer_phone text not null,
  customer_email text not null,
  customer_address text not null,

  invoice_type text not null check (invoice_type in ('bireysel','kurumsal')),
  tckn text,
  company_name text,
  tax_office text,
  tax_number text,

  subtotal numeric(10,2) not null,
  coupon_code text,
  coupon_discount numeric(10,2) not null default 0,
  total numeric(10,2) not null,

  legal_text_version text,
  consent_accepted_at timestamptz,

  created_at timestamptz not null default now()
);

alter table public.orders enable row level security;

-- Giriş yapmış kullanıcı sadece kendi siparişlerini görebilir
create policy "Kullanıcı kendi siparişlerini görebilir"
  on public.orders for select
  to authenticated
  using (auth.uid() = user_id);

-- Hem misafir hem üye sipariş oluşturabilir
create policy "Herkes sipariş oluşturabilir"
  on public.orders for insert
  to anon, authenticated
  with check (true);

-- ============================================
-- 3. SİPARİŞ KALEMLERİ TABLOSU
-- ============================================
create table if not exists public.order_items (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references public.orders(id) on delete cascade,

  product_id text not null check (product_id in ('apollo','helios')),
  product_name text not null,
  size int not null,
  color_id text not null,
  color_label text not null,
  unit_price numeric(10,2) not null,
  quantity int not null check (quantity > 0)
);

alter table public.order_items enable row level security;

create policy "Kullanıcı kendi sipariş kalemlerini görebilir"
  on public.order_items for select
  to authenticated
  using (
    exists (
      select 1 from public.orders
      where orders.id = order_items.order_id
      and orders.user_id = auth.uid()
    )
  );

create policy "Herkes sipariş kalemi oluşturabilir"
  on public.order_items for insert
  to anon, authenticated
  with check (true);

-- ============================================
-- 4. PROFİL TABLOSU (isim/telefon varsayılanları için)
-- ============================================
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text,
  phone text,
  address text,
  created_at timestamptz not null default now()
);

alter table public.profiles enable row level security;

create policy "Kullanıcı kendi profilini görebilir"
  on public.profiles for select
  to authenticated
  using (auth.uid() = id);

create policy "Kullanıcı kendi profilini güncelleyebilir"
  on public.profiles for update
  to authenticated
  using (auth.uid() = id);

create policy "Kullanıcı kendi profilini oluşturabilir"
  on public.profiles for insert
  to authenticated
  with check (auth.uid() = id);

-- Yeni kullanıcı kayıt olduğunda otomatik boş profil oluştur
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, full_name)
  values (new.id, new.raw_user_meta_data->>'full_name');
  return new;
end;
$$ language plpgsql security definer;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();
