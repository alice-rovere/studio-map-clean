insert into public.nodes (id, label, category, position_x, position_y)
values ('vite', 'Vite', 'tools', 700, 320)
on conflict (id) do update
set label = excluded.label,
    category = excluded.category;

insert into public.edges (id, source, target, type)
values
  ('e-react-vite', 'react', 'vite', 'smoothstep'),
  ('e-pnpm-vite', 'pnpm', 'vite', 'smoothstep')
on conflict (id) do nothing;

insert into public.node_details (
  node_id,
  description,
  best_practices,
  naming_conventions,
  associated_software,
  study_urls
)
values (
  'vite',
  'Tool di sviluppo frontend che offre un server locale rapido e prepara gli asset per la produzione.',
  'Usa gli script del package.json per avviare il server di sviluppo e generare la build. Configura plugin e variabili d''ambiente secondo le esigenze del progetto.',
  array[
    'Configura gli script dev, build e preview nel package.json.',
    'Mantieni i segreti fuori dalle variabili VITE_, perché vengono esposte al codice client.',
    'Aggiungi plugin solo quando servono e verifica la build di produzione.'
  ]::text[],
  array['React', 'pnpm', 'Node.js']::text[],
  '[{"label":"Documentazione Vite","url":"https://vite.dev/guide/"}]'::jsonb
)
on conflict (node_id) do update
set description = excluded.description,
    best_practices = excluded.best_practices,
    naming_conventions = excluded.naming_conventions,
    associated_software = excluded.associated_software,
    study_urls = excluded.study_urls;
