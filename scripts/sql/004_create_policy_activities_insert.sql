create policy "activities_insert_own_or_admin"
on public.activities
for insert
to authenticated
with check (actor_id = auth.uid() or public.is_admin_user());
