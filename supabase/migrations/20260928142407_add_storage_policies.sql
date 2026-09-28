create policy "Admins can list project media"
on storage.objects
for select
to authenticated
using (
  bucket_id = 'project-media'
  and (select public.is_admin())
);

create policy "Admins can upload project media"
on storage.objects
for insert
to authenticated
with check (
  bucket_id = 'project-media'
  and (select public.is_admin())
);

create policy "Admins can update project media"
on storage.objects
for update
to authenticated
using (
  bucket_id = 'project-media'
  and (select public.is_admin())
)
with check (
  bucket_id = 'project-media'
  and (select public.is_admin())
);

create policy "Admins can delete project media"
on storage.objects
for delete
to authenticated
using (
  bucket_id = 'project-media'
  and (select public.is_admin())
);

create policy "Admins can list datasets"
on storage.objects
for select
to authenticated
using (
  bucket_id = 'datasets'
  and (select public.is_admin())
);

create policy "Admins can upload datasets"
on storage.objects
for insert
to authenticated
with check (
  bucket_id = 'datasets'
  and (select public.is_admin())
);

create policy "Admins can update datasets"
on storage.objects
for update
to authenticated
using (
  bucket_id = 'datasets'
  and (select public.is_admin())
)
with check (
  bucket_id = 'datasets'
  and (select public.is_admin())
);

create policy "Admins can delete datasets"
on storage.objects
for delete
to authenticated
using (
  bucket_id = 'datasets'
  and (select public.is_admin())
);
