create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  default_role_id bigint;
  default_membership_tier_id bigint;
begin
  select id
  into default_role_id
  from public.roles
  where name = 'member_normal'
  limit 1;

  select id
  into default_membership_tier_id
  from public.membership_tiers
  where name = 'normal'
  limit 1;

  insert into public.profiles (
    id,
    email,
    display_name,
    role_id,
    membership_tier_id,
    status
  )
  values (
    new.id,
    coalesce(new.email, ''),
    coalesce(new.raw_user_meta_data ->> 'display_name', split_part(coalesce(new.email, ''), '@', 1)),
    default_role_id,
    default_membership_tier_id,
    'pending'
  )
  on conflict (id) do nothing;

  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;

create trigger on_auth_user_created
after insert on auth.users
for each row
execute function public.handle_new_user();
