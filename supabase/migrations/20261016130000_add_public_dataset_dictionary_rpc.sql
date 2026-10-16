-- Public dictionary metadata follows the same published-project and Explorer opt-in gate
-- as get_published_explorer_page. No direct SELECT grant is added.
create function public.get_published_explorer_dictionary(p_slug text, p_dataset_id uuid)
returns jsonb
language plpgsql
stable
security definer
set search_path = ''
as $$
declare
  v_dataset public.datasets%rowtype;
  v_dictionary jsonb;
begin
  if p_slug is null or p_dataset_id is null
    or public.get_published_explorer_page(p_slug, p_dataset_id, 0, 1) is null then
    return null;
  end if;

  select d.* into v_dataset
  from public.datasets d
  join public.projects p on p.id = d.project_id
  where p.slug = p_slug and p.status = 'published'
    and d.id = p_dataset_id and d.explorer_enabled = true;
  if not found then return null; end if;

  select coalesce(pg_catalog.jsonb_object_agg(field, pg_catalog.jsonb_strip_nulls(
    pg_catalog.jsonb_build_object(
      'label', pg_catalog.jsonb_build_object(
        'it', v_dataset.schema -> 'dictionary' -> field -> 'label' ->> 'it',
        'en', v_dataset.schema -> 'dictionary' -> field -> 'label' ->> 'en'
      ),
      'description', pg_catalog.jsonb_build_object(
        'it', v_dataset.schema -> 'dictionary' -> field -> 'description' ->> 'it',
        'en', v_dataset.schema -> 'dictionary' -> field -> 'description' ->> 'en'
      ),
      'dataType', v_dataset.schema -> 'dictionary' -> field ->> 'dataType',
      'unit', v_dataset.schema -> 'dictionary' -> field ->> 'unit',
      'format', v_dataset.schema -> 'dictionary' -> field ->> 'format'
    )
  )), '{}'::jsonb) into v_dictionary
  from pg_catalog.unnest(v_dataset.explorer_fields) as field
  where pg_catalog.jsonb_typeof(v_dataset.schema -> 'dictionary' -> field) = 'object';

  return v_dictionary;
end;
$$;

revoke all on function public.get_published_explorer_dictionary(text, uuid) from public, anon, authenticated;
grant execute on function public.get_published_explorer_dictionary(text, uuid) to anon, authenticated;
