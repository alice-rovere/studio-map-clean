create policy "Public can create node details" on public.node_details
  for insert to anon with check (true);

create policy "Public can update node details" on public.node_details
  for update to anon using (true) with check (true);

grant insert (node_id, extended_content), update (extended_content)
  on public.node_details to anon;
