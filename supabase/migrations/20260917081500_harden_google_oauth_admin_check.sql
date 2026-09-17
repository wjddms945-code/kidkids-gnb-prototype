grant select (email) on public.membership_thumbnail_admins to authenticated;

create policy "Users can check their own thumbnail admin membership"
on public.membership_thumbnail_admins
for select
to authenticated
using (
  email = lower(coalesce((select auth.jwt()) ->> 'email', ''))
);

create or replace function public.is_membership_thumbnail_admin()
returns boolean
language sql
stable
security invoker
set search_path = ''
as $$
  select
    (select auth.uid()) is not null
    and exists (
      select 1
      from public.membership_thumbnail_admins as admin
      where admin.email = lower(coalesce((select auth.jwt()) ->> 'email', ''))
    );
$$;

revoke all on function public.is_membership_thumbnail_admin() from public, anon;
grant execute on function public.is_membership_thumbnail_admin() to authenticated;
