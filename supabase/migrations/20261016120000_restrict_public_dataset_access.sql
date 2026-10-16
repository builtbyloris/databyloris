drop policy "Public can read datasets of published projects" on public.datasets;
drop policy "Public can read rows of published project datasets" on public.dataset_rows;

revoke select on table public.datasets, public.dataset_rows from anon;
