-- ==========================================================
--  東大阪市吹奏楽フェスタ：掲載店の申し込みデータ
--  Supabase の SQL Editor に貼って一度だけ実行する（Claude から実行してもOK）
-- ==========================================================

-- ---------- 申し込みの表 ----------
create table if not exists public.fes_shops (
  id             uuid primary key default gen_random_uuid(),
  created_at     timestamptz not null default now(),

  -- 管理用（Table Editor で切り替える）
  status         text not null default 'pending'
                 check (status in ('pending', 'published', 'hidden')),  -- pending=確認待ち / published=公開 / hidden=非公開
  paid           boolean not null default false,                         -- 入金を確認したら true
  sort           integer not null default 0,                             -- 大きいほど上に表示（ピックアップの順番調整）
  admin_memo     text,
  pin            text check (pin ~ '^[0-9]{4}$'),                    -- 店舗コード（当日のもぎり用・4桁・非公開）

  -- 申し込み内容（公開されるもの）
  plan           text not null
                 check (plan in ('p1', 'p2', 'p4', 'web_pick', 'web_std', 'support')),
  shop_name      text not null check (char_length(shop_name) between 1 and 60),
  shop_kana      text check (char_length(shop_kana) <= 80),
  genre          text check (char_length(genre) <= 30),
  catch          text check (char_length(catch) <= 40),     -- ひとこと
  intro          text check (char_length(intro) <= 400),    -- 紹介文
  coupon         text check (char_length(coupon) <= 60),    -- クーポン内容
  coupon_note    text check (char_length(coupon_note) <= 100),
  address        text check (char_length(address) <= 120),
  hours          text check (char_length(hours) <= 100),
  url            text check (char_length(url) <= 300),
  photo_path     text check (char_length(photo_path) <= 300),

  -- 申し込み内容（公開されないもの）
  contact_name   text not null check (char_length(contact_name) between 1 and 60),
  email          text not null check (char_length(email) between 3 and 200),
  phone          text check (char_length(phone) <= 30),
  payment_method text check (payment_method in ('card', 'bank')),
  message        text check (char_length(message) <= 1000)
);

-- ---------- だれが何をできるか ----------
alter table public.fes_shops enable row level security;

-- 外から（ログインなし）は「書き込み」だけ。必ず「確認待ち・未入金」で入る
drop policy if exists "fes_shops anyone can apply" on public.fes_shops;
create policy "fes_shops anyone can apply" on public.fes_shops
  for insert to anon
  with check (status = 'pending' and paid = false and sort = 0 and admin_memo is null);

-- 外から見えるのは「公開」にしたお店だけ
drop policy if exists "fes_shops public can read published" on public.fes_shops;
create policy "fes_shops public can read published" on public.fes_shops
  for select to anon
  using (status = 'published');

-- 列ごとの権限：連絡先などの公開しない列は、外からは読めない
revoke all on public.fes_shops from anon;
grant insert (plan, shop_name, shop_kana, genre, catch, intro, coupon, coupon_note,
              address, hours, url, photo_path,
              contact_name, email, phone, payment_method, message)
  on public.fes_shops to anon;
grant select (id, created_at, plan, shop_name, shop_kana, genre, catch, intro,
              coupon, coupon_note, address, hours, url, photo_path, sort, status)
  on public.fes_shops to anon;

-- ---------- 写真の置き場所 ----------
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('shop-photos', 'shop-photos', true, 5242880, array['image/jpeg', 'image/png', 'image/webp'])
on conflict (id) do nothing;

drop policy if exists "shop-photos anyone can upload" on storage.objects;
create policy "shop-photos anyone can upload" on storage.objects
  for insert to anon
  with check (bucket_id = 'shop-photos');

-- ---------- 止まらないようにするための軽い確認用 ----------
-- GitHub Actions から週に1回これを呼んで、無料プランの自動停止を防ぐ
create or replace function public.fes_ping() returns text
  language sql stable as $$ select 'ok'::text $$;
grant execute on function public.fes_ping() to anon;
