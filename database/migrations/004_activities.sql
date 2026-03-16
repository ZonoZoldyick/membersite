create table if not exists public.activities (
  id uuid primary key default gen_random_uuid(),
  actor_id uuid not null references public.profiles (id) on delete cascade,
  type text not null,
  entity_type text not null,
  entity_id uuid not null,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default timezone('utc', now())
);

create index if not exists idx_activities_actor_id on public.activities (actor_id);
create index if not exists idx_activities_type on public.activities (type);
create index if not exists idx_activities_created_at on public.activities (created_at desc);
create index if not exists idx_activities_entity on public.activities (entity_type, entity_id);

alter table public.activities enable row level security;

drop policy if exists "activities_select_authenticated" on public.activities;
drop policy if exists "activities_insert_own_or_admin" on public.activities;

create policy "activities_select_authenticated"
on public.activities
for select
to authenticated
using (true);

create policy "activities_insert_own_or_admin"
on public.activities
for insert
to authenticated
with check (actor_id = auth.uid() or public.is_admin_user());

