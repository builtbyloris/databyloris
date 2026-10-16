-- Metadata-only discovery for the public Dataset Explorer.
-- Row data continues to be served solely by get_published_explorer_page.
create function public.get_published_explorer_dataset_id(p_slug text)
returns uuid
language plpgsql
stable
security definer
set search_path = ''
as $$
declare
  v_id uuid;
begin
  if p_slug is null then return null; end if;

  select d.id into v_id
  from public.datasets d
  join public.projects p on p.id = d.project_id
  where p.slug = p_slug
    and p.status = 'published'
    and d.explorer_enabled = true
    and public.get_published_explorer_page(p_slug, d.id, 0, 1) is not null
  order by d.updated_at desc, d.id
  limit 1;

  return v_id;
end;
$$;

revoke all on function public.get_published_explorer_dataset_id(text) from public, anon, authenticated;
grant execute on function public.get_published_explorer_dataset_id(text) to anon, authenticated;
