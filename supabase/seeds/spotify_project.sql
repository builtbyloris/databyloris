-- Manual, idempotent seed template for the canonical Spotify demo metadata.
-- Run after the project migration and after the single administrator has been
-- added to public.admin_users. The Admin UUID is resolved from that allowlist;
-- no personal identifier is stored in source control.

do $$
declare
  admin_count integer;
  admin_id uuid;
begin
  select count(*) into admin_count from public.admin_users;

  if admin_count <> 1 then
    raise exception
      'Expected exactly one row in public.admin_users before seeding Spotify metadata.';
  end if;

  select user_id into admin_id from public.admin_users limit 1;

  insert into public.projects (
    slug,
    title,
    category,
    question,
    description,
    period,
    tags,
    featured,
    demo,
    status,
    dataset_grain,
    dataset_source,
    dataset_records,
    created_by,
    published_at
  )
  values (
    'spotify-listening-trends',
    'Spotify Listening Trends',
    'Music',
    'What can streaming data tell us about how people listen?',
    'Explore listening patterns, artists, genres, markets and trends through an interactive data story.',
    '2022–2025',
    array['music', 'streaming', 'trends', 'demo']::text[],
    true,
    true,
    'published',
    'One track × one country × one month',
    'Synthetic illustrative demo dataset',
    '1,536 synthetic rows',
    admin_id,
    now()
  )
  on conflict (slug) do nothing;
end;
$$;
