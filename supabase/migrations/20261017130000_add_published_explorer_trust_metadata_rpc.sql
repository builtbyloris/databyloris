-- Expose only non-sensitive dataset metadata after the existing Explorer gate.
-- Private schema field names and row values never leave this function.
create function public.get_published_explorer_trust_metadata(p_slug text, p_dataset_id uuid)
returns jsonb
language plpgsql
stable
security definer
set search_path = ''
as $$
declare
  v_page jsonb;
  v_dataset public.datasets%rowtype;
begin
  if p_slug is null or p_dataset_id is null then return null; end if;

  v_page := public.get_published_explorer_page(p_slug, p_dataset_id, 0, 1);
  if v_page is null then return null; end if;

  select d.* into v_dataset
  from public.datasets d
  join public.projects p on p.id = d.project_id
  where d.id = p_dataset_id and p.slug = p_slug
    and p.status = 'published' and d.explorer_enabled = true;
  if not found then return null; end if;

  return pg_catalog.jsonb_build_object(
    'name', v_dataset.name,
    'originalFilename', case
      when pg_catalog.jsonb_typeof(v_dataset.schema -> 'originalFilename') = 'string'
        then nullif(pg_catalog.btrim(v_dataset.schema ->> 'originalFilename'), '')
      else null end,
    'schemaFieldCount', pg_catalog.jsonb_array_length(v_dataset.schema -> 'columns'),
    'publicFieldCount', pg_catalog.jsonb_array_length(v_page -> 'columns'),
    'explorerEnabled', true,
    'updatedAt', v_dataset.updated_at
  );
end;
$$;

revoke all on function public.get_published_explorer_trust_metadata(text, uuid) from public, anon, authenticated;
grant execute on function public.get_published_explorer_trust_metadata(text, uuid) to anon, authenticated;
