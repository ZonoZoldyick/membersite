create table if not exists public.likes (
  id uuid primary key default gen_random_uuid(),
  profile_id uuid not null references public.profiles (id) on delete cascade,
  entity_type text not null check (entity_type in ('post', 'comment', 'product')),
  entity_id uuid not null,
  created_at timestamptz not null default timezone('utc', now()),
  unique (profile_id, entity_type, entity_id)
);

create index if not exists idx_likes_profile_id on public.likes (profile_id);
create index if not exists idx_likes_entity on public.likes (entity_type, entity_id);
create index if not exists idx_likes_created_at on public.likes (created_at desc);

alter table public.likes enable row level security;

drop policy if exists "likes_select_authenticated" on public.likes;
drop policy if exists "likes_insert_own_or_admin" on public.likes;
drop policy if exists "likes_delete_own_or_admin" on public.likes;

create policy "likes_select_authenticated"
on public.likes
for select
to authenticated
using (true);

create policy "likes_insert_own_or_admin"
on public.likes
for insert
to authenticated
with check (profile_id = auth.uid() or public.is_admin_user());

create policy "likes_delete_own_or_admin"
on public.likes
for delete
to authenticated
using (profile_id = auth.uid() or public.is_admin_user());

