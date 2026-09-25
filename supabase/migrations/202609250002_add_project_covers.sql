alter table public.projects
add column cover_path text;

alter table public.projects
add constraint projects_cover_path_check
check (
  cover_path is null
  or cover_path ~ '^projects/[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}/cover-[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}\.(jpg|png|webp)$'
);

insert into storage.buckets (
  id,
  name,
  public,
  file_size_limit,
  allowed_mime_types
)
values (
  'project-covers',
  'project-covers',
  true,
  5242880,
  array['image/jpeg', 'image/png', 'image/webp']
)
on conflict (id) do update
set
  public = excluded.public,
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;

-- Public downloads are enabled by the bucket's public flag. Object listing and
-- every mutation remain protected by RLS. Admin SELECT is required for upserts.
create policy "Administrators can inspect project covers"
on storage.objects
for select
to authenticated
using (
  bucket_id = 'project-covers'
  and (select private.is_admin())
  and name ~ '^projects/[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}/cover-[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}\.(jpg|png|webp)$'
);

create policy "Administrators can upload project covers"
on storage.objects
for insert
to authenticated
with check (
  bucket_id = 'project-covers'
  and (select private.is_admin())
  and name ~ '^projects/[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}/cover-[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}\.(jpg|png|webp)$'
  and exists (
    select 1
    from public.projects
    where id::text = (storage.foldername(name))[2]
  )
);

create policy "Administrators can replace project covers"
on storage.objects
for update
to authenticated
using (
  bucket_id = 'project-covers'
  and (select private.is_admin())
  and name ~ '^projects/[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}/cover-[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}\.(jpg|png|webp)$'
)
with check (
  bucket_id = 'project-covers'
  and (select private.is_admin())
  and name ~ '^projects/[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}/cover-[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}\.(jpg|png|webp)$'
  and exists (
    select 1
    from public.projects
    where id::text = (storage.foldername(name))[2]
  )
);

-- Deletion intentionally does not require the project row to still exist. This
-- permits best-effort cleanup after the database record is deleted safely.
create policy "Administrators can delete project covers"
on storage.objects
for delete
to authenticated
using (
  bucket_id = 'project-covers'
  and (select private.is_admin())
  and name ~ '^projects/[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}/cover-[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}\.(jpg|png|webp)$'
);
