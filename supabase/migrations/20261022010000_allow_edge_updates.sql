drop policy if exists "Authenticated can update edges" on public.edges;

create policy "Authenticated can update edges" on public.edges
  for update to authenticated using (true) with check (true);

grant update on public.edges to authenticated;
