create table if not exists public.membership_thumbnail_admins (
  email text primary key,
  created_at timestamptz not null default now(),
  constraint membership_thumbnail_admins_email_normalized
    check (email = lower(btrim(email)))
);

comment on table public.membership_thumbnail_admins is
  'Google OAuth email whitelist for membership thumbnail editors.';

alter table public.membership_thumbnail_admins enable row level security;

revoke all on table public.membership_thumbnail_admins from public, anon, authenticated;

insert into public.membership_thumbnail_admins (email)
values ('wjddms945@gmail.com')
on conflict (email) do nothing;

create or replace function public.is_membership_thumbnail_admin()
returns boolean
language sql
stable
security definer
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

drop policy if exists "Thumbnail admins can insert membership thumbnails"
  on public.membership_content_thumbnails;
drop policy if exists "Thumbnail admins can update membership thumbnails"
  on public.membership_content_thumbnails;
drop policy if exists "Thumbnail admins can delete membership thumbnails"
  on public.membership_content_thumbnails;

create policy "Thumbnail admins can insert membership thumbnails"
on public.membership_content_thumbnails
for insert
to authenticated
with check (
  (select public.is_membership_thumbnail_admin())
  and updated_by = (select auth.uid())
);

create policy "Thumbnail admins can update membership thumbnails"
on public.membership_content_thumbnails
for update
to authenticated
using ((select public.is_membership_thumbnail_admin()))
with check (
  (select public.is_membership_thumbnail_admin())
  and updated_by = (select auth.uid())
);

create policy "Thumbnail admins can delete membership thumbnails"
on public.membership_content_thumbnails
for delete
to authenticated
using ((select public.is_membership_thumbnail_admin()));

drop policy if exists "Thumbnail admins can upload membership images"
  on storage.objects;
drop policy if exists "Thumbnail admins can delete membership images"
  on storage.objects;

create policy "Thumbnail admins can upload membership images"
on storage.objects
for insert
to authenticated
with check (
  bucket_id = 'membership-thumbnails'
  and (select public.is_membership_thumbnail_admin())
  and lower(storage.extension(name)) in ('webp', 'jpg', 'jpeg', 'png')
);

create policy "Thumbnail admins can delete membership images"
on storage.objects
for delete
to authenticated
using (
  bucket_id = 'membership-thumbnails'
  and (select public.is_membership_thumbnail_admin())
);
