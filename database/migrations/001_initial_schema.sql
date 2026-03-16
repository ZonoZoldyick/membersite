create extension if not exists pgcrypto;

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = timezone('utc', now());
  return new;
end;
$$;

create table if not exists public.roles (
  id bigint generated always as identity primary key,
  name text not null unique,
  description text,
  created_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.membership_tiers (
  id bigint generated always as identity primary key,
  name text not null unique,
  description text,
  created_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  email text not null unique,
  display_name text not null,
  role_id bigint not null references public.roles (id),
  membership_tier_id bigint not null references public.membership_tiers (id),
  status text not null default 'pending' check (status in ('pending', 'active', 'suspended')),
  bio text,
  avatar_url text,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.products (
  id uuid primary key default gen_random_uuid(),
  profile_id uuid not null references public.profiles (id) on delete cascade,
  title text not null,
  description text not null,
  price numeric(12, 2),
  url text,
  tags text[] not null default '{}',
  published_at timestamptz,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now()),
  deleted_at timestamptz
);

create table if not exists public.events (
  id uuid primary key default gen_random_uuid(),
  profile_id uuid not null references public.profiles (id) on delete cascade,
  title text not null,
  description text not null,
  event_date timestamptz not null,
  location text,
  url text,
  capacity integer check (capacity is null or capacity > 0),
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now()),
  deleted_at timestamptz
);

create table if not exists public.event_participants (
  id uuid primary key default gen_random_uuid(),
  event_id uuid not null references public.events (id) on delete cascade,
  profile_id uuid not null references public.profiles (id) on delete cascade,
  status text not null default 'pending' check (status in ('pending', 'approved', 'cancelled')),
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now()),
  unique (event_id, profile_id)
);

create table if not exists public.posts (
  id uuid primary key default gen_random_uuid(),
  profile_id uuid not null references public.profiles (id) on delete cascade,
  type text not null check (type in ('post', 'announcement', 'knowledge', 'question')),
  content text not null,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now()),
  deleted_at timestamptz
);

create table if not exists public.comments (
  id uuid primary key default gen_random_uuid(),
  post_id uuid not null references public.posts (id) on delete cascade,
  profile_id uuid not null references public.profiles (id) on delete cascade,
  content text not null,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now()),
  deleted_at timestamptz
);

create table if not exists public.notifications (
  id uuid primary key default gen_random_uuid(),
  profile_id uuid not null references public.profiles (id) on delete cascade,
  type text not null check (type in ('event_join', 'comment', 'approval_request', 'new_post')),
  reference_id uuid,
  is_read boolean not null default false,
  created_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.learning_contents (
  id uuid primary key default gen_random_uuid(),
  profile_id uuid not null references public.profiles (id) on delete cascade,
  membership_tier_id bigint not null references public.membership_tiers (id),
  title text not null,
  description text,
  content_type text not null check (content_type in ('video', 'document', 'course')),
  content_url text,
  is_published boolean not null default false,
  published_at timestamptz,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now()),
  deleted_at timestamptz
);

insert into public.roles (name, description)
values
  ('system_admin', 'Full system access'),
  ('team_leader', 'Approves members and manages teams'),
  ('member_normal', 'Standard community member'),
  ('member_gold', 'Gold member with premium learning access'),
  ('member_platinum', 'Platinum member with full learning access')
on conflict (name) do nothing;

insert into public.membership_tiers (name, description)
values
  ('normal', 'Standard membership tier'),
  ('gold', 'Gold membership tier'),
  ('platinum', 'Platinum membership tier')
on conflict (name) do nothing;

create trigger set_profiles_updated_at
before update on public.profiles
for each row
execute function public.set_updated_at();

create trigger set_products_updated_at
before update on public.products
for each row
execute function public.set_updated_at();

create trigger set_events_updated_at
before update on public.events
for each row
execute function public.set_updated_at();

create trigger set_event_participants_updated_at
before update on public.event_participants
for each row
execute function public.set_updated_at();

create trigger set_posts_updated_at
before update on public.posts
for each row
execute function public.set_updated_at();

create trigger set_comments_updated_at
before update on public.comments
for each row
execute function public.set_updated_at();

create trigger set_learning_contents_updated_at
before update on public.learning_contents
for each row
execute function public.set_updated_at();

alter table public.roles enable row level security;
alter table public.membership_tiers enable row level security;
alter table public.profiles enable row level security;
alter table public.products enable row level security;
alter table public.events enable row level security;
alter table public.event_participants enable row level security;
alter table public.posts enable row level security;
alter table public.comments enable row level security;
alter table public.notifications enable row level security;
alter table public.learning_contents enable row level security;

create or replace function public.is_admin_user()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.profiles p
    join public.roles r on r.id = p.role_id
    where p.id = auth.uid()
      and r.name in ('system_admin', 'team_leader')
  );
$$;

create or replace function public.membership_tier_rank(tier_name text)
returns integer
language sql
immutable
as $$
  select case tier_name
    when 'normal' then 1
    when 'gold' then 2
    when 'platinum' then 3
    else 0
  end;
$$;

create policy "roles are readable by authenticated users"
on public.roles
for select
to authenticated
using (true);

create policy "roles are manageable by admins"
on public.roles
for all
to authenticated
using (public.is_admin_user())
with check (public.is_admin_user());

create policy "membership tiers are readable by authenticated users"
on public.membership_tiers
for select
to authenticated
using (true);

create policy "membership tiers are manageable by admins"
on public.membership_tiers
for all
to authenticated
using (public.is_admin_user())
with check (public.is_admin_user());

create policy "profiles are readable by authenticated users"
on public.profiles
for select
to authenticated
using (true);

create policy "users can insert their own profile"
on public.profiles
for insert
to authenticated
with check (auth.uid() = id);

create policy "users can update their own profile"
on public.profiles
for update
to authenticated
using (auth.uid() = id or public.is_admin_user())
with check (auth.uid() = id or public.is_admin_user());

create policy "admins can delete profiles"
on public.profiles
for delete
to authenticated
using (public.is_admin_user());

create policy "active products are readable by authenticated users"
on public.products
for select
to authenticated
using (deleted_at is null);

create policy "users can manage their own products"
on public.products
for all
to authenticated
using (auth.uid() = profile_id or public.is_admin_user())
with check (auth.uid() = profile_id or public.is_admin_user());

create policy "active events are readable by authenticated users"
on public.events
for select
to authenticated
using (deleted_at is null);

create policy "users can manage their own events"
on public.events
for all
to authenticated
using (auth.uid() = profile_id or public.is_admin_user())
with check (auth.uid() = profile_id or public.is_admin_user());

create policy "event participants are readable by authenticated users"
on public.event_participants
for select
to authenticated
using (true);

create policy "users can manage their own event participation"
on public.event_participants
for all
to authenticated
using (auth.uid() = profile_id or public.is_admin_user())
with check (auth.uid() = profile_id or public.is_admin_user());

create policy "active posts are readable by authenticated users"
on public.posts
for select
to authenticated
using (deleted_at is null);

create policy "users can manage their own posts"
on public.posts
for all
to authenticated
using (auth.uid() = profile_id or public.is_admin_user())
with check (auth.uid() = profile_id or public.is_admin_user());

create policy "active comments are readable by authenticated users"
on public.comments
for select
to authenticated
using (deleted_at is null);

create policy "users can manage their own comments"
on public.comments
for all
to authenticated
using (auth.uid() = profile_id or public.is_admin_user())
with check (auth.uid() = profile_id or public.is_admin_user());

create policy "users can read their own notifications"
on public.notifications
for select
to authenticated
using (auth.uid() = profile_id or public.is_admin_user());

create policy "users can update their own notifications"
on public.notifications
for update
to authenticated
using (auth.uid() = profile_id or public.is_admin_user())
with check (auth.uid() = profile_id or public.is_admin_user());

create policy "admins can create notifications"
on public.notifications
for insert
to authenticated
with check (public.is_admin_user());

create policy "admins can delete notifications"
on public.notifications
for delete
to authenticated
using (public.is_admin_user());

create policy "published learning content is readable by authenticated users"
on public.learning_contents
for select
to authenticated
using (
  (
    deleted_at is null
    and is_published = true
    and exists (
      select 1
      from public.profiles viewer
      join public.membership_tiers viewer_tier on viewer_tier.id = viewer.membership_tier_id
      join public.membership_tiers required_tier on required_tier.id = public.learning_contents.membership_tier_id
      where viewer.id = auth.uid()
        and public.membership_tier_rank(viewer_tier.name) >= public.membership_tier_rank(required_tier.name)
    )
  )
  or auth.uid() = profile_id
  or public.is_admin_user()
);

create policy "content authors can manage their own learning content"
on public.learning_contents
for all
to authenticated
using (auth.uid() = profile_id or public.is_admin_user())
with check (auth.uid() = profile_id or public.is_admin_user());

create index if not exists idx_profiles_role_id on public.profiles (role_id);
create index if not exists idx_profiles_membership_tier_id on public.profiles (membership_tier_id);
create index if not exists idx_profiles_status on public.profiles (status);
create index if not exists idx_products_profile_id on public.products (profile_id);
create index if not exists idx_products_published_at on public.products (published_at);
create index if not exists idx_events_profile_id on public.events (profile_id);
create index if not exists idx_events_event_date on public.events (event_date);
create index if not exists idx_event_participants_event_id on public.event_participants (event_id);
create index if not exists idx_event_participants_profile_id on public.event_participants (profile_id);
create index if not exists idx_posts_profile_id on public.posts (profile_id);
create index if not exists idx_comments_post_id on public.comments (post_id);
create index if not exists idx_comments_profile_id on public.comments (profile_id);
create index if not exists idx_notifications_profile_id on public.notifications (profile_id);
create index if not exists idx_notifications_is_read on public.notifications (is_read);
create index if not exists idx_learning_contents_profile_id on public.learning_contents (profile_id);
create index if not exists idx_learning_contents_membership_tier_id on public.learning_contents (membership_tier_id);
create index if not exists idx_learning_contents_is_published on public.learning_contents (is_published);
