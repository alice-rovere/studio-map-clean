drop policy if exists "Public can update nodes" on public.nodes;
drop policy if exists "Public can delete nodes" on public.nodes;
drop policy if exists "Public can create nodes" on public.nodes;
drop policy if exists "Public can create edges" on public.edges;
drop policy if exists "Public can delete edges" on public.edges;
drop policy if exists "Public can create node details" on public.node_details;
drop policy if exists "Public can update node details" on public.node_details;
drop policy if exists "Public can add glossary terms" on public.glossary;

drop policy if exists "Public can read nodes" on public.nodes;
drop policy if exists "Public can read edges" on public.edges;
drop policy if exists "Public can read node details" on public.node_details;
drop policy if exists "Public can read glossary" on public.glossary;

create policy "Public can read nodes" on public.nodes
  for select to anon, authenticated using (true);

create policy "Public can read edges" on public.edges
  for select to anon, authenticated using (true);

create policy "Public can read node details" on public.node_details
  for select to anon, authenticated using (true);

create policy "Public can read glossary" on public.glossary
  for select to anon, authenticated using (true);

create policy "Authenticated can create nodes" on public.nodes
  for insert to authenticated with check (true);

create policy "Authenticated can update nodes" on public.nodes
  for update to authenticated using (true) with check (true);

create policy "Authenticated can delete nodes" on public.nodes
  for delete to authenticated using (true);

create policy "Authenticated can create edges" on public.edges
  for insert to authenticated with check (true);

create policy "Authenticated can delete edges" on public.edges
  for delete to authenticated using (true);

create policy "Authenticated can create node details" on public.node_details
  for insert to authenticated with check (true);

create policy "Authenticated can update node details" on public.node_details
  for update to authenticated using (true) with check (true);

create policy "Authenticated can add glossary terms" on public.glossary
  for insert to authenticated with check (true);

revoke insert, update, delete on public.nodes from anon;
revoke insert, delete on public.edges from anon;
revoke insert, update, delete on public.node_details from anon;
revoke insert (node_id, extended_content), update (extended_content)
  on public.node_details from anon;
revoke insert, update, delete on public.glossary from anon;

revoke insert, update, delete on public.nodes from public;
revoke insert, update, delete on public.edges from public;
revoke insert, update, delete on public.node_details from public;
revoke insert (node_id, extended_content), update (extended_content)
  on public.node_details from public;
revoke insert, update, delete on public.glossary from public;

grant select on public.nodes, public.edges, public.node_details, public.glossary
  to anon, authenticated;
grant insert, update, delete on public.nodes to authenticated;
grant insert, delete on public.edges to authenticated;
grant insert (node_id, extended_content), update (extended_content)
  on public.node_details to authenticated;
grant insert on public.glossary to authenticated;
