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

alter table if exists public.roles enable row level security;
alter table if exists public.membership_tiers enable row level security;
alter table if exists public.profiles enable row level security;
alter table if exists public.products enable row level security;
alter table if exists public.events enable row level security;
alter table if exists public.event_participants enable row level security;
alter table if exists public.posts enable row level security;
alter table if exists public.comments enable row level security;
alter table if exists public.notifications enable row level security;
alter table if exists public.learning_contents enable row level security;

drop policy if exists "roles are readable by authenticated users" on public.roles;
drop policy if exists "roles are manageable by admins" on public.roles;
drop policy if exists "membership tiers are readable by authenticated users" on public.membership_tiers;
drop policy if exists "membership tiers are manageable by admins" on public.membership_tiers;
drop policy if exists "profiles are readable by authenticated users" on public.profiles;
drop policy if exists "users can insert their own profile" on public.profiles;
drop policy if exists "users can update their own profile" on public.profiles;
drop policy if exists "admins can delete profiles" on public.profiles;
drop policy if exists "active products are readable by authenticated users" on public.products;
drop policy if exists "users can manage their own products" on public.products;
drop policy if exists "active events are readable by authenticated users" on public.events;
drop policy if exists "users can manage their own events" on public.events;
drop policy if exists "event participants are readable by authenticated users" on public.event_participants;
drop policy if exists "users can manage their own event participation" on public.event_participants;
drop policy if exists "active posts are readable by authenticated users" on public.posts;
drop policy if exists "users can manage their own posts" on public.posts;
drop policy if exists "active comments are readable by authenticated users" on public.comments;
drop policy if exists "users can manage their own comments" on public.comments;
drop policy if exists "users can read their own notifications" on public.notifications;
drop policy if exists "users can update their own notifications" on public.notifications;
drop policy if exists "admins can create notifications" on public.notifications;
drop policy if exists "admins can delete notifications" on public.notifications;
drop policy if exists "published learning content is readable by authenticated users" on public.learning_contents;
drop policy if exists "content authors can manage their own learning content" on public.learning_contents;

drop policy if exists "roles_select_authenticated" on public.roles;
drop policy if exists "roles_manage_admin" on public.roles;
drop policy if exists "membership_tiers_select_authenticated" on public.membership_tiers;
drop policy if exists "membership_tiers_manage_admin" on public.membership_tiers;
drop policy if exists "profiles_select_authenticated" on public.profiles;
drop policy if exists "profiles_insert_own" on public.profiles;
drop policy if exists "profiles_update_own_or_admin" on public.profiles;
drop policy if exists "products_select_authenticated" on public.products;
drop policy if exists "products_insert_own" on public.products;
drop policy if exists "products_update_own_or_admin" on public.products;
drop policy if exists "products_delete_own_or_admin" on public.products;
drop policy if exists "events_select_authenticated" on public.events;
drop policy if exists "events_insert_own" on public.events;
drop policy if exists "events_update_own_or_admin" on public.events;
drop policy if exists "events_delete_own_or_admin" on public.events;
drop policy if exists "event_participants_select_own_or_admin" on public.event_participants;
drop policy if exists "event_participants_insert_self" on public.event_participants;
drop policy if exists "event_participants_update_event_owner_or_admin" on public.event_participants;
drop policy if exists "event_participants_delete_self_or_admin" on public.event_participants;
drop policy if exists "posts_select_authenticated" on public.posts;
drop policy if exists "posts_insert_own" on public.posts;
drop policy if exists "posts_update_own_or_admin" on public.posts;
drop policy if exists "posts_delete_own_or_admin" on public.posts;
drop policy if exists "comments_select_authenticated" on public.comments;
drop policy if exists "comments_insert_own" on public.comments;
drop policy if exists "comments_update_own_or_admin" on public.comments;
drop policy if exists "comments_delete_own_or_admin" on public.comments;
drop policy if exists "notifications_select_own_or_admin" on public.notifications;
drop policy if exists "notifications_insert_admin_only" on public.notifications;
drop policy if exists "notifications_update_own_or_admin" on public.notifications;
drop policy if exists "learning_contents_select_authenticated" on public.learning_contents;
drop policy if exists "learning_contents_manage_admin" on public.learning_contents;

create policy "roles_select_authenticated"
on public.roles
for select
to authenticated
using (true);

create policy "roles_manage_admin"
on public.roles
for all
to authenticated
using (public.is_admin_user())
with check (public.is_admin_user());

create policy "membership_tiers_select_authenticated"
on public.membership_tiers
for select
to authenticated
using (true);

create policy "membership_tiers_manage_admin"
on public.membership_tiers
for all
to authenticated
using (public.is_admin_user())
with check (public.is_admin_user());

create policy "profiles_select_authenticated"
on public.profiles
for select
to authenticated
using (true);

create policy "profiles_insert_own"
on public.profiles
for insert
to authenticated
with check (auth.uid() = id);

create policy "profiles_update_own_or_admin"
on public.profiles
for update
to authenticated
using (auth.uid() = id or public.is_admin_user())
with check (auth.uid() = id or public.is_admin_user());

create policy "products_select_authenticated"
on public.products
for select
to authenticated
using (deleted_at is null or public.is_admin_user());

create policy "products_insert_own"
on public.products
for insert
to authenticated
with check (profile_id = auth.uid() or public.is_admin_user());

create policy "products_update_own_or_admin"
on public.products
for update
to authenticated
using (profile_id = auth.uid() or public.is_admin_user())
with check (profile_id = auth.uid() or public.is_admin_user());

create policy "products_delete_own_or_admin"
on public.products
for delete
to authenticated
using (profile_id = auth.uid() or public.is_admin_user());

create policy "events_select_authenticated"
on public.events
for select
to authenticated
using (deleted_at is null or public.is_admin_user());

create policy "events_insert_own"
on public.events
for insert
to authenticated
with check (profile_id = auth.uid() or public.is_admin_user());

create policy "events_update_own_or_admin"
on public.events
for update
to authenticated
using (profile_id = auth.uid() or public.is_admin_user())
with check (profile_id = auth.uid() or public.is_admin_user());

create policy "events_delete_own_or_admin"
on public.events
for delete
to authenticated
using (profile_id = auth.uid() or public.is_admin_user());

create policy "event_participants_select_own_or_admin"
on public.event_participants
for select
to authenticated
using (profile_id = auth.uid() or public.is_admin_user());

create policy "event_participants_insert_self"
on public.event_participants
for insert
to authenticated
with check (profile_id = auth.uid() or public.is_admin_user());

create policy "event_participants_update_event_owner_or_admin"
on public.event_participants
for update
to authenticated
using (
  public.is_admin_user()
  or exists (
    select 1
    from public.events e
    where e.id = event_participants.event_id
      and e.profile_id = auth.uid()
  )
)
with check (
  public.is_admin_user()
  or exists (
    select 1
    from public.events e
    where e.id = event_participants.event_id
      and e.profile_id = auth.uid()
  )
);

create policy "event_participants_delete_self_or_admin"
on public.event_participants
for delete
to authenticated
using (profile_id = auth.uid() or public.is_admin_user());

create policy "posts_select_authenticated"
on public.posts
for select
to authenticated
using (deleted_at is null or public.is_admin_user());

create policy "posts_insert_own"
on public.posts
for insert
to authenticated
with check (profile_id = auth.uid() or public.is_admin_user());

create policy "posts_update_own_or_admin"
on public.posts
for update
to authenticated
using (profile_id = auth.uid() or public.is_admin_user())
with check (profile_id = auth.uid() or public.is_admin_user());

create policy "posts_delete_own_or_admin"
on public.posts
for delete
to authenticated
using (profile_id = auth.uid() or public.is_admin_user());

create policy "comments_select_authenticated"
on public.comments
for select
to authenticated
using (deleted_at is null or public.is_admin_user());

create policy "comments_insert_own"
on public.comments
for insert
to authenticated
with check (profile_id = auth.uid() or public.is_admin_user());

create policy "comments_update_own_or_admin"
on public.comments
for update
to authenticated
using (profile_id = auth.uid() or public.is_admin_user())
with check (profile_id = auth.uid() or public.is_admin_user());

create policy "comments_delete_own_or_admin"
on public.comments
for delete
to authenticated
using (profile_id = auth.uid() or public.is_admin_user());

create policy "notifications_select_own_or_admin"
on public.notifications
for select
to authenticated
using (profile_id = auth.uid() or public.is_admin_user());

create policy "notifications_insert_admin_only"
on public.notifications
for insert
to authenticated
with check (public.is_admin_user());

create policy "notifications_update_own_or_admin"
on public.notifications
for update
to authenticated
using (profile_id = auth.uid() or public.is_admin_user())
with check (profile_id = auth.uid() or public.is_admin_user());

create policy "learning_contents_select_authenticated"
on public.learning_contents
for select
to authenticated
using (
  (deleted_at is null and is_published = true)
  or auth.uid() = profile_id
  or public.is_admin_user()
);

create policy "learning_contents_manage_admin"
on public.learning_contents
for all
to authenticated
using (public.is_admin_user())
with check (public.is_admin_user());
