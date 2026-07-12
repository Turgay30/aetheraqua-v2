-- AetherAqua — Veritabanı Şeması (v1)
-- Bu dosyayı Supabase Dashboard → SQL Editor → New query içine yapıştırıp
-- "Run" ile çalıştırın. Güvenle birden fazla kez çalıştırılabilir.

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

drop policy if exists "Stok herkese açık okunabilir" on public.stock;
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

drop policy if exists "Kullanıcı kendi siparişlerini görebilir" on public.orders;
create policy "Kullanıcı kendi siparişlerini görebilir"
  on public.orders for select
  to authenticated
  using (auth.uid() = user_id);

drop policy if exists "Herkes sipariş oluşturabilir" on public.orders;
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

drop policy if exists "Kullanıcı kendi sipariş kalemlerini görebilir" on public.order_items;
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

drop policy if exists "Herkes sipariş kalemi oluşturabilir" on public.order_items;
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

drop policy if exists "Kullanıcı kendi profilini görebilir" on public.profiles;
create policy "Kullanıcı kendi profilini görebilir"
  on public.profiles for select
  to authenticated
  using (auth.uid() = id);

drop policy if exists "Kullanıcı kendi profilini güncelleyebilir" on public.profiles;
create policy "Kullanıcı kendi profilini güncelleyebilir"
  on public.profiles for update
  to authenticated
  using (auth.uid() = id);

drop policy if exists "Kullanıcı kendi profilini oluşturabilir" on public.profiles;
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

-- ============================================
-- 5. SİPARİŞ VERİLİNCE STOĞU OTOMATİK DÜŞÜR
-- ============================================
create or replace function public.decrement_stock()
returns trigger as $$
begin
  update public.stock
  set quantity = greatest(quantity - new.quantity, 0),
      updated_at = now()
  where product_id = new.product_id and size = new.size;
  return new;
end;
$$ language plpgsql security definer;

drop trigger if exists on_order_item_created on public.order_items;
create trigger on_order_item_created
  after insert on public.order_items
  for each row execute function public.decrement_stock();

-- ============================================
-- 6. ADRES DEFTERİ
-- ============================================
create table if not exists public.addresses (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  label text not null default 'Ev',
  recipient_name text not null,
  phone text not null,
  address_text text not null,
  is_default boolean not null default false,
  created_at timestamptz not null default now()
);

alter table public.addresses enable row level security;

drop policy if exists "Kullanıcı kendi adreslerini yönetebilir" on public.addresses;
create policy "Kullanıcı kendi adreslerini yönetebilir"
  on public.addresses for all
  to authenticated
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- ============================================
-- 7. FAVORİLER
-- ============================================
create table if not exists public.favorites (
  user_id uuid not null references auth.users(id) on delete cascade,
  product_id text not null check (product_id in ('apollo','helios')),
  created_at timestamptz not null default now(),
  primary key (user_id, product_id)
);

alter table public.favorites enable row level security;

drop policy if exists "Kullanıcı kendi favorilerini yönetebilir" on public.favorites;
create policy "Kullanıcı kendi favorilerini yönetebilir"
  on public.favorites for all
  to authenticated
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- ============================================
-- 8. ADMİN ERİŞİMİ (sipariş yönetimi için)
-- ============================================
-- NOT: Aşağıdaki e-posta adresini kendi admin hesabınızla değiştirin.
drop policy if exists "Admin tüm siparişleri görebilir" on public.orders;
create policy "Admin tüm siparişleri görebilir"
  on public.orders for select
  to authenticated
  using (auth.jwt() ->> 'email' = 'turgayturan705@gmail.com');

drop policy if exists "Admin sipariş durumunu güncelleyebilir" on public.orders;
create policy "Admin sipariş durumunu güncelleyebilir"
  on public.orders for update
  to authenticated
  using (auth.jwt() ->> 'email' = 'turgayturan705@gmail.com');

drop policy if exists "Admin tüm sipariş kalemlerini görebilir" on public.order_items;
create policy "Admin tüm sipariş kalemlerini görebilir"
  on public.order_items for select
  to authenticated
  using (auth.jwt() ->> 'email' = 'turgayturan705@gmail.com');

-- ============================================
-- 9. DEĞERLENDİRME / YORUM SİSTEMİ
-- ============================================
create table if not exists public.reviews (
  id uuid primary key default gen_random_uuid(),
  product_id text not null check (product_id in ('apollo','helios')),
  user_id uuid not null references auth.users(id) on delete cascade,
  reviewer_name text not null,
  rating int not null check (rating between 1 and 5),
  comment text,
  created_at timestamptz not null default now(),
  unique (product_id, user_id)
);

alter table public.reviews enable row level security;

drop policy if exists "Değerlendirmeler herkese açık okunabilir" on public.reviews;
create policy "Değerlendirmeler herkese açık okunabilir"
  on public.reviews for select
  to anon, authenticated
  using (true);

drop policy if exists "Kullanıcı kendi değerlendirmesini oluşturabilir" on public.reviews;
create policy "Kullanıcı kendi değerlendirmesini oluşturabilir"
  on public.reviews for insert
  to authenticated
  with check (auth.uid() = user_id);

drop policy if exists "Kullanıcı kendi değerlendirmesini güncelleyebilir" on public.reviews;
create policy "Kullanıcı kendi değerlendirmesini güncelleyebilir"
  on public.reviews for update
  to authenticated
  using (auth.uid() = user_id);

drop policy if exists "Kullanıcı kendi değerlendirmesini silebilir" on public.reviews;
create policy "Kullanıcı kendi değerlendirmesini silebilir"
  on public.reviews for delete
  to authenticated
  using (auth.uid() = user_id);

-- ============================================
-- 10. KVKK / PAZARLAMA İZNİ
-- ============================================
alter table public.profiles
  add column if not exists marketing_consent boolean not null default false;

-- ============================================
-- 11. İŞLEM GÜNLÜĞÜ (Admin Loglama)
-- ============================================
create table if not exists public.audit_logs (
  id uuid primary key default gen_random_uuid(),
  actor_email text,
  action text not null,
  target_table text not null,
  target_id text,
  details jsonb,
  created_at timestamptz not null default now()
);

alter table public.audit_logs enable row level security;

drop policy if exists "Sadece admin günlüğü görebilir" on public.audit_logs;
create policy "Sadece admin günlüğü görebilir"
  on public.audit_logs for select
  to authenticated
  using (auth.jwt() ->> 'email' = 'turgayturan705@gmail.com');

-- Sipariş durumu değiştiğinde otomatik günlük kaydı oluştur
create or replace function public.log_order_status_change()
returns trigger as $$
begin
  if new.status is distinct from old.status then
    insert into public.audit_logs (actor_email, action, target_table, target_id, details)
    values (
      auth.jwt() ->> 'email',
      'sipariş_durumu_değişti',
      'orders',
      new.id::text,
      jsonb_build_object('eski_durum', old.status, 'yeni_durum', new.status, 'siparis_no', new.order_no)
    );
  end if;
  return new;
end;
$$ language plpgsql security definer;

drop trigger if exists on_order_status_change on public.orders;
create trigger on_order_status_change
  after update on public.orders
  for each row execute function public.log_order_status_change();

-- ============================================
-- 12. ÜRÜN FİYATLARI (Admin'den düzenlenebilir)
-- ============================================
create table if not exists public.products (
  product_id text primary key check (product_id in ('apollo','helios')),
  base_price numeric(10,2) not null,
  updated_at timestamptz not null default now()
);

alter table public.products enable row level security;

drop policy if exists "Ürün fiyatları herkese açık okunabilir" on public.products;
create policy "Ürün fiyatları herkese açık okunabilir"
  on public.products for select
  to anon, authenticated
  using (true);

drop policy if exists "Admin ürün fiyatlarını güncelleyebilir" on public.products;
create policy "Admin ürün fiyatlarını güncelleyebilir"
  on public.products for update
  to authenticated
  using (auth.jwt() ->> 'email' = 'turgayturan705@gmail.com');

insert into public.products (product_id, base_price) values
  ('apollo', 7500),
  ('helios', 4200)
on conflict (product_id) do nothing;

-- Admin ayrıca stok miktarını da güncelleyebilsin
drop policy if exists "Admin stok güncelleyebilir" on public.stock;
create policy "Admin stok güncelleyebilir"
  on public.stock for update
  to authenticated
  using (auth.jwt() ->> 'email' = 'turgayturan705@gmail.com');

-- ============================================
-- 13. GÖRSEL DEPOLAMA (Supabase Storage)
-- ============================================
insert into storage.buckets (id, name, public)
values ('site-images', 'site-images', true)
on conflict (id) do nothing;

drop policy if exists "Görseller herkese açık okunabilir" on storage.objects;
create policy "Görseller herkese açık okunabilir"
  on storage.objects for select
  using (bucket_id = 'site-images');

drop policy if exists "Admin görsel yükleyebilir" on storage.objects;
create policy "Admin görsel yükleyebilir"
  on storage.objects for insert
  to authenticated
  with check (bucket_id = 'site-images' and auth.jwt() ->> 'email' = 'turgayturan705@gmail.com');

drop policy if exists "Admin görsel silebilir" on storage.objects;
create policy "Admin görsel silebilir"
  on storage.objects for delete
  to authenticated
  using (bucket_id = 'site-images' and auth.jwt() ->> 'email' = 'turgayturan705@gmail.com');

drop policy if exists "Admin görsel güncelleyebilir" on storage.objects;
create policy "Admin görsel güncelleyebilir"
  on storage.objects for update
  to authenticated
  using (bucket_id = 'site-images' and auth.jwt() ->> 'email' = 'turgayturan705@gmail.com');

-- ============================================
-- 14. BALIK TÜRLERİ (Akvaryum Asistanı — admin yönetimli)
-- ============================================
create table if not exists public.fish_species (
  id text primary key,
  name text not null,
  latin_name text not null default '',
  image_url text not null,
  note text not null default '',
  min_shoal_size int not null default 1,
  min_tank_liters int not null default 40,
  adult_size_cm numeric(4,1) not null default 5,
  created_at timestamptz not null default now()
);

alter table public.fish_species enable row level security;

drop policy if exists "Balıklar herkese açık okunabilir" on public.fish_species;
create policy "Balıklar herkese açık okunabilir"
  on public.fish_species for select
  to anon, authenticated
  using (true);

drop policy if exists "Admin balık ekleyip silebilir" on public.fish_species;
create policy "Admin balık ekleyip silebilir"
  on public.fish_species for all
  to authenticated
  using (auth.jwt() ->> 'email' = 'turgayturan705@gmail.com')
  with check (auth.jwt() ->> 'email' = 'turgayturan705@gmail.com');

-- ============================================
-- 15. BALIK UYUMLULUK İLİŞKİLERİ
-- ============================================
create table if not exists public.fish_compatibility (
  fish_a text not null references public.fish_species(id) on delete cascade,
  fish_b text not null references public.fish_species(id) on delete cascade,
  compatible boolean not null default false,
  primary key (fish_a, fish_b)
);

alter table public.fish_compatibility enable row level security;

drop policy if exists "Uyumluluk herkese açık okunabilir" on public.fish_compatibility;
create policy "Uyumluluk herkese açık okunabilir"
  on public.fish_compatibility for select
  to anon, authenticated
  using (true);

drop policy if exists "Admin uyumluluk yönetebilir" on public.fish_compatibility;
create policy "Admin uyumluluk yönetebilir"
  on public.fish_compatibility for all
  to authenticated
  using (auth.jwt() ->> 'email' = 'turgayturan705@gmail.com')
  with check (auth.jwt() ->> 'email' = 'turgayturan705@gmail.com');

-- İlk 17 türün verisi
insert into public.fish_species (id, name, latin_name, image_url, note, min_shoal_size, min_tank_liters, adult_size_cm) values
  ('neon_tetra', 'Neon Tetra', 'Paracheirodon innesi', '/fish/neon_tetra.jpg', 'Sakin, sürü halinde yaşayan küçük bir tetra.', 6, 40, 4),
  ('ember_tetra', 'Ember Tetra', 'Hyphessobrycon amandae', '/fish/ember_tetra.jpg', 'Turuncu-kırmızı tonlarıyla dikkat çeken minik, sakin bir tetra.', 6, 30, 2),
  ('harlequin_rasbora', 'Harlequin Rasbora', 'Trigonostigma heteromorpha', '/fish/harlequin_rasbora.jpg', 'Dayanıklı, sürü halinde hareket eden sakin bir tür.', 6, 45, 4.5),
  ('zebra_danio', 'Zebra Danio', 'Danio rerio', '/fish/zebra_danio.jpg', 'Hareketli ve hızlı yüzen, dayanıklı bir sürü balığı.', 6, 45, 5),
  ('guppy', 'Guppy (Lepistes)', 'Poecilia reticulata', '/fish/guppy.jpg', 'Canlı renkli, kolay bakımlı, doğurgan bir tür.', 3, 40, 5),
  ('molly', 'Molly', 'Poecilia sphenops', '/fish/molly.jpg', 'Sağlam yapılı, uyumlu bir yaşayan doğurgan balık.', 3, 75, 10),
  ('platy', 'Platy', 'Xiphophorus maculatus', '/fish/platy.jpg', 'Sakin, dayanıklı ve yeni başlayanlar için ideal.', 3, 40, 6),
  ('swordtail', 'Kılıç Kuyruk', 'Xiphophorus hellerii', '/fish/swordtail.jpg', 'Kılıç şeklindeki kuyruğuyla tanınan aktif bir tür.', 3, 75, 12),
  ('cherry_barb', 'Kiraz Barb', 'Puntius titteya', '/fish/cherry_barb.jpg', 'Barb türleri arasında en sakin olanlardan; iyi bir topluluk balığı.', 6, 60, 5),
  ('tiger_barb', 'Kaplan Barb', 'Puntigrus tetrazona', '/fish/tiger_barb.jpg', 'Enerjik ve yarı agresif; yüzgeç ısırma eğilimi olabilir.', 6, 90, 7),
  ('corydoras', 'Corydoras', 'Corydoras spp.', '/fish/corydoras.jpg', 'Dip temizleyici, çok sakin ve sosyal bir zırhlı kedi balığı.', 6, 60, 6),
  ('kuhli_loach', 'Kuhli Loach', 'Pangio kuhlii', '/fish/kuhli_loach.jpg', 'Yılan gibi hareket eden, gece aktif, çok sakin bir dip balığı.', 3, 60, 10),
  ('otocinclus', 'Otocinclus', 'Otocinclus spp.', '/fish/otocinclus.jpg', 'Küçük, zararsız bir alg temizleyicisi.', 3, 40, 5),
  ('bristlenose_pleco', 'Bristlenose Pleco', 'Ancistrus cirrhosus', '/fish/bristlenose_pleco.jpg', 'Sakin, gece aktif bir alg temizleyicisi.', 1, 75, 12),
  ('dwarf_gourami', 'Cüce Gurami', 'Trichogaster lalius', '/fish/dwarf_gourami.jpg', 'Renkli bir labirent balığı; dikkatli eşleştirilmeli.', 1, 75, 8),
  ('angelfish', 'Melek Balığı', 'Pterophyllum scalare', '/fish/angelfish.jpg', 'Zarif ama yarı agresif; geniş ve derin tank ister.', 1, 150, 15),
  ('betta', 'Betta (Beta Balığı)', 'Betta splendens', '/fish/betta.jpg', 'Yalnız yaşamayı tercih eden, toleranssız bir tür.', 1, 20, 6)
on conflict (id) do nothing;

-- Bilinen uyumsuzluk çiftleri (her iki yönde de kaydedilir)
insert into public.fish_compatibility (fish_a, fish_b, compatible)
select a, b, false from (values
  ('betta','tiger_barb'), ('tiger_barb','betta'),
  ('betta','dwarf_gourami'), ('dwarf_gourami','betta'),
  ('betta','angelfish'), ('angelfish','betta'),
  ('betta','zebra_danio'), ('zebra_danio','betta'),
  ('tiger_barb','angelfish'), ('angelfish','tiger_barb'),
  ('tiger_barb','dwarf_gourami'), ('dwarf_gourami','tiger_barb'),
  ('tiger_barb','neon_tetra'), ('neon_tetra','tiger_barb'),
  ('tiger_barb','ember_tetra'), ('ember_tetra','tiger_barb'),
  ('tiger_barb','harlequin_rasbora'), ('harlequin_rasbora','tiger_barb'),
  ('tiger_barb','guppy'), ('guppy','tiger_barb'),
  ('tiger_barb','swordtail'), ('swordtail','tiger_barb'),
  ('angelfish','neon_tetra'), ('neon_tetra','angelfish'),
  ('angelfish','ember_tetra'), ('ember_tetra','angelfish'),
  ('angelfish','zebra_danio'), ('zebra_danio','angelfish'),
  ('angelfish','dwarf_gourami'), ('dwarf_gourami','angelfish'),
  ('dwarf_gourami','zebra_danio'), ('zebra_danio','dwarf_gourami')
) as t(a, b)
on conflict (fish_a, fish_b) do nothing;

-- ============================================
-- 16. YENİ ÜRÜNLER İÇİN ŞABLON SİSTEMİ
-- ============================================
alter table public.products add column if not exists is_builtin boolean not null default false;
alter table public.products add column if not exists name text;
alter table public.products add column if not exists tagline text;
alter table public.products add column if not exists description text;
alter table public.products add column if not exists accent_color text not null default '#C9A227';
alter table public.products add column if not exists images jsonb not null default '[]'::jsonb;
alter table public.products add column if not exists features jsonb not null default '[]'::jsonb;
alter table public.products add column if not exists tech_specs jsonb not null default '[]'::jsonb;
alter table public.products add column if not exists mythology_title text;
alter table public.products add column if not exists mythology_paragraphs jsonb not null default '[]'::jsonb;

update public.products set is_builtin = true where product_id in ('apollo', 'helios');
update public.products set name = 'Apollo', tagline = 'Işığın Efendisi' where product_id = 'apollo' and name is null;
update public.products set name = 'Helios', tagline = 'Gündüzün Taşıyıcısı' where product_id = 'helios' and name is null;

drop policy if exists "Admin ürün ekleyip silebilir" on public.products;
create policy "Admin ürün ekleyip silebilir"
  on public.products for all
  to authenticated
  using (auth.jwt() ->> 'email' = 'turgayturan705@gmail.com')
  with check (auth.jwt() ->> 'email' = 'turgayturan705@gmail.com');

-- Yeni ürün eklendiğinde tüm boylar için başlangıç stoğu otomatik oluştur
create or replace function public.seed_stock_for_new_product()
returns trigger as $$
begin
  insert into public.stock (product_id, size, quantity)
  select new.product_id, s.size, 15
  from (values (30),(40),(50),(60),(70),(80),(90),(100),(110),(120)) as s(size)
  on conflict (product_id, size) do nothing;
  return new;
end;
$$ language plpgsql security definer;

drop trigger if exists on_product_created on public.products;
create trigger on_product_created
  after insert on public.products
  for each row execute function public.seed_stock_for_new_product();

-- ============================================
-- 17. KUPON YÖNETİMİ (Admin'den düzenlenebilir)
-- ============================================
create table if not exists public.coupons (
  code text primary key,
  type text not null check (type in ('percent', 'fixed')),
  value numeric(10,2) not null,
  is_active boolean not null default true,
  expires_at timestamptz,
  usage_limit int,
  times_used int not null default 0,
  created_at timestamptz not null default now()
);

alter table public.coupons enable row level security;

drop policy if exists "Kuponlar herkese açık okunabilir" on public.coupons;
create policy "Kuponlar herkese açık okunabilir"
  on public.coupons for select
  to anon, authenticated
  using (true);

drop policy if exists "Admin kupon yönetebilir" on public.coupons;
create policy "Admin kupon yönetebilir"
  on public.coupons for all
  to authenticated
  using (auth.jwt() ->> 'email' = 'turgayturan705@gmail.com')
  with check (auth.jwt() ->> 'email' = 'turgayturan705@gmail.com');

-- Mevcut iki kuponu aktar
insert into public.coupons (code, type, value) values
  ('HOSGELDIN10', 'percent', 10),
  ('AETHER500', 'fixed', 500)
on conflict (code) do nothing;

-- Ödeme sırasında kuponun kullanım sayısını güvenle artırmak için
-- (anon kullanıcılar coupons tablosunu doğrudan güncelleyemez, sadece bu fonksiyon üzerinden)
create or replace function public.increment_coupon_usage(coupon_code text)
returns void as $$
begin
  update public.coupons set times_used = times_used + 1 where code = coupon_code;
end;
$$ language plpgsql security definer;

grant execute on function public.increment_coupon_usage(text) to anon, authenticated;

-- Bazı tablolarda temel erişim izni (GRANT) otomatik atanmamış olabilir —
-- RLS politikaları buna rağmen çalışmadığında bu satırlar gerekli.
grant select, insert, update, delete on public.coupons to authenticated;
grant select on public.coupons to anon;
grant select, insert, update, delete on public.products to authenticated;
grant select on public.products to anon;
grant select, insert, update, delete on public.fish_species to authenticated;
grant select on public.fish_species to anon;
grant select, insert, update, delete on public.fish_compatibility to authenticated;
grant select on public.fish_compatibility to anon;
grant select, insert, update, delete on public.stock to authenticated;
grant select on public.stock to anon;
grant select, insert, update, delete on public.orders to authenticated;
grant insert on public.orders to anon;
grant select, insert, update, delete on public.order_items to authenticated;
grant insert on public.order_items to anon;
grant select, insert, update, delete on public.reviews to authenticated;
grant select on public.reviews to anon;
grant select, insert, update, delete on public.addresses to authenticated;
grant select, insert, update, delete on public.favorites to authenticated;
grant select, insert, update, delete on public.profiles to authenticated;
grant select on public.audit_logs to authenticated;

-- ============================================
-- 18. BLOG / İÇERİK ALANI
-- ============================================
create table if not exists public.blog_posts (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  title text not null,
  excerpt text not null default '',
  content text not null default '',
  cover_image text,
  published boolean not null default true,
  created_at timestamptz not null default now()
);

alter table public.blog_posts enable row level security;

drop policy if exists "Yayınlanan yazılar herkese açık" on public.blog_posts;
create policy "Yayınlanan yazılar herkese açık"
  on public.blog_posts for select
  to anon, authenticated
  using (published = true);

drop policy if exists "Admin yazı yönetebilir" on public.blog_posts;
create policy "Admin yazı yönetebilir"
  on public.blog_posts for all
  to authenticated
  using (auth.jwt() ->> 'email' = 'turgayturan705@gmail.com')
  with check (auth.jwt() ->> 'email' = 'turgayturan705@gmail.com');

grant select, insert, update, delete on public.blog_posts to authenticated;
grant select on public.blog_posts to anon;

-- ============================================
-- 19. BİTKİLER (Akvaryum Asistanı — admin yönetimli)
-- ============================================
create table if not exists public.plants (
  id text primary key,
  name text not null,
  image_url text not null,
  note text not null default '',
  light_level text not null default 'orta' check (light_level in ('düşük','orta','yüksek')),
  co2_required boolean not null default false,
  created_at timestamptz not null default now()
);

alter table public.plants enable row level security;

drop policy if exists "Bitkiler herkese açık okunabilir" on public.plants;
create policy "Bitkiler herkese açık okunabilir"
  on public.plants for select
  to anon, authenticated
  using (true);

drop policy if exists "Admin bitki yönetebilir" on public.plants;
create policy "Admin bitki yönetebilir"
  on public.plants for all
  to authenticated
  using (auth.jwt() ->> 'email' = 'turgayturan705@gmail.com')
  with check (auth.jwt() ->> 'email' = 'turgayturan705@gmail.com');

grant select, insert, update, delete on public.plants to authenticated;
grant select on public.plants to anon;

-- ============================================
-- 20. KARGO TAKİP BİLGİSİ
-- ============================================
alter table public.orders add column if not exists tracking_number text;
alter table public.orders add column if not exists shipping_company text;

-- ============================================
-- 21. KABUKLULAR (Karides vb. — admin yönetimli)
-- ============================================
create table if not exists public.shrimp_species (
  id text primary key,
  name text not null,
  latin_name text not null default '',
  image_url text not null,
  note text not null default '',
  min_shoal_size int not null default 5,
  min_tank_liters int not null default 20,
  adult_size_cm numeric(4,1) not null default 3,
  created_at timestamptz not null default now()
);

alter table public.shrimp_species enable row level security;

drop policy if exists "Kabuklular herkese açık okunabilir" on public.shrimp_species;
create policy "Kabuklular herkese açık okunabilir"
  on public.shrimp_species for select
  to anon, authenticated
  using (true);

drop policy if exists "Admin kabuklu yönetebilir" on public.shrimp_species;
create policy "Admin kabuklu yönetebilir"
  on public.shrimp_species for all
  to authenticated
  using (auth.jwt() ->> 'email' = 'turgayturan705@gmail.com')
  with check (auth.jwt() ->> 'email' = 'turgayturan705@gmail.com');

grant select, insert, update, delete on public.shrimp_species to authenticated;
grant select on public.shrimp_species to anon;

-- ============================================
-- 22. BİRLEŞİK UYUMLULUK SİSTEMİ
-- (balık-balık, balık-karides, balık-bitki, karides-karides vb. hepsi burada)
-- ============================================
create table if not exists public.livestock_compatibility (
  a_type text not null check (a_type in ('fish','shrimp','plant')),
  a_id text not null,
  b_type text not null check (b_type in ('fish','shrimp','plant')),
  b_id text not null,
  compatible boolean not null default false,
  created_at timestamptz not null default now(),
  primary key (a_type, a_id, b_type, b_id)
);

alter table public.livestock_compatibility enable row level security;

drop policy if exists "Uyumluluk (birleşik) herkese açık okunabilir" on public.livestock_compatibility;
create policy "Uyumluluk (birleşik) herkese açık okunabilir"
  on public.livestock_compatibility for select
  to anon, authenticated
  using (true);

drop policy if exists "Admin birleşik uyumluluk yönetebilir" on public.livestock_compatibility;
create policy "Admin birleşik uyumluluk yönetebilir"
  on public.livestock_compatibility for all
  to authenticated
  using (auth.jwt() ->> 'email' = 'turgayturan705@gmail.com')
  with check (auth.jwt() ->> 'email' = 'turgayturan705@gmail.com');

grant select, insert, update, delete on public.livestock_compatibility to authenticated;
grant select on public.livestock_compatibility to anon;

-- Eski balık-balık uyumsuzluk verisini yeni birleşik tabloya aktar
insert into public.livestock_compatibility (a_type, a_id, b_type, b_id, compatible)
select 'fish', fish_a, 'fish', fish_b, compatible
from public.fish_compatibility
on conflict (a_type, a_id, b_type, b_id) do nothing;

-- ============================================
-- 17. ERİŞİM İZİNLERİ (GRANT) — "permission denied" hatasını önler
-- ============================================
-- RLS politikaları erişimi KISITLAR ama temel tablo izni (GRANT) olmadan
-- hiçbir politika işe yaramaz. Bu bölüm tüm tablolara temel izinleri verir.

grant usage on schema public to anon, authenticated;

grant select on public.stock to anon, authenticated;
grant update on public.stock to authenticated;

grant select, insert on public.orders to anon, authenticated;
grant update on public.orders to authenticated;

grant select, insert on public.order_items to anon, authenticated;

grant select, insert, update on public.profiles to authenticated;

grant select, insert, update, delete on public.addresses to authenticated;

grant select, insert, delete on public.favorites to authenticated;

grant select, insert, update, delete on public.reviews to authenticated;
grant select on public.reviews to anon;

grant select, update, insert, delete on public.products to authenticated;
grant select on public.products to anon;

grant select, insert, update, delete on public.fish_species to authenticated;
grant select on public.fish_species to anon;

grant select, insert, update, delete on public.fish_compatibility to authenticated;
grant select on public.fish_compatibility to anon;

grant select on public.audit_logs to authenticated;

-- İleride oluşturulacak tablolar için de varsayılan izinleri ayarla
alter default privileges in schema public
  grant select, insert, update, delete on tables to authenticated;
alter default privileges in schema public
  grant select on tables to anon;

NOTIFY pgrst, 'reload schema';

-- ============================================
-- 23. ESKİ KISITLAMALARI KALDIR
-- (stock, order_items, favorites, reviews, products tabloları eskiden
--  product_id'yi sadece 'apollo'/'helios' ile sınırlıyordu — artık şablonla
--  eklenen ürünler de olduğu için bu kısıtlamayı kaldırıyoruz)
-- ============================================
alter table public.stock drop constraint if exists stock_product_id_check;
alter table public.order_items drop constraint if exists order_items_product_id_check;
alter table public.favorites drop constraint if exists favorites_product_id_check;
alter table public.reviews drop constraint if exists reviews_product_id_check;
alter table public.products drop constraint if exists products_product_id_check;

alter table public.order_items add column if not exists image_url text;

NOTIFY pgrst, 'reload schema';
