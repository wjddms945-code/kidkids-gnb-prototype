create index if not exists membership_content_thumbnails_updated_by_idx
  on public.membership_content_thumbnails (updated_by);

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
  (select auth.uid()) is not null
  and ((select auth.jwt()) -> 'app_metadata' ->> 'membership_thumbnail_admin') = 'true'
  and updated_by = (select auth.uid())
);

create policy "Thumbnail admins can update membership thumbnails"
on public.membership_content_thumbnails
for update
to authenticated
using (
  ((select auth.jwt()) -> 'app_metadata' ->> 'membership_thumbnail_admin') = 'true'
)
with check (
  ((select auth.jwt()) -> 'app_metadata' ->> 'membership_thumbnail_admin') = 'true'
  and updated_by = (select auth.uid())
);

create policy "Thumbnail admins can delete membership thumbnails"
on public.membership_content_thumbnails
for delete
to authenticated
using (
  ((select auth.jwt()) -> 'app_metadata' ->> 'membership_thumbnail_admin') = 'true'
);

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
  and ((select auth.jwt()) -> 'app_metadata' ->> 'membership_thumbnail_admin') = 'true'
  and lower(storage.extension(name)) in ('webp', 'jpg', 'jpeg', 'png')
);

create policy "Thumbnail admins can delete membership images"
on storage.objects
for delete
to authenticated
using (
  bucket_id = 'membership-thumbnails'
  and ((select auth.jwt()) -> 'app_metadata' ->> 'membership_thumbnail_admin') = 'true'
);

revoke execute on function public.rls_auto_enable() from public, anon, authenticated;
