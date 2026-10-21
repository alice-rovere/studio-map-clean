create policy "Public can create nodes" on public.nodes
  for insert to anon with check (true);

grant insert on public.nodes to anon;
