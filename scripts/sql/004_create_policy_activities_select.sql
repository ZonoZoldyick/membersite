create policy "activities_select_authenticated"
on public.activities
for select
to authenticated
using (true);
