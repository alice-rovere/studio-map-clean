alter table public.nodes
  add column if not exists subcategory text;

update public.nodes as node
set subcategory = mapping.subcategory
from (
  values
    ('html', 'linguaggio-markup'),
    ('css', 'linguaggio-di-stile'),
    ('js', 'linguaggio-programmazione'),
    ('ts', 'linguaggio-programmazione'),
    ('bootstrap', 'framework'),
    ('tailwind', 'framework'),
    ('react', 'libreria'),
    ('react-flow', 'libreria'),
    ('nextjs', 'framework'),
    ('vue', 'framework'),
    ('nuxt', 'framework'),
    ('angular', 'framework'),
    ('svelte', 'framework'),
    ('nodejs', 'runtime'),
    ('nestjs', 'framework'),
    ('php', 'linguaggio-programmazione'),
    ('python', 'linguaggio-programmazione'),
    ('fastapi', 'framework'),
    ('go', 'linguaggio-programmazione'),
    ('prisma', 'orm'),
    ('drizzle', 'orm'),
    ('postgresql', 'database-relazionale'),
    ('mysql', 'database-relazionale'),
    ('mongodb', 'database-documentale'),
    ('redis', 'database-chiave-valore'),
    ('supabase', 'baas'),
    ('firebase', 'baas'),
    ('milvus', 'database-vettoriale'),
    ('git', 'sistema-controllo-versione'),
    ('github', 'piattaforma'),
    ('docker', 'container'),
    ('pnpm', 'package-manager'),
    ('github-actions', 'ci-cd'),
    ('vscode', 'editor'),
    ('dbeaver', 'software'),
    ('figma', 'software'),
    ('postman', 'software'),
    ('vite', 'build-tool')
) as mapping(node_id, subcategory)
where node.id = mapping.node_id;

update public.nodes
set subcategory = 'software'
where subcategory is null;

alter table public.nodes
  alter column subcategory set not null;

alter table public.nodes
  drop constraint if exists nodes_subcategory_check;

alter table public.nodes
  add constraint nodes_subcategory_check check (
    subcategory in (
      'linguaggio-markup',
      'linguaggio-di-stile',
      'linguaggio-programmazione',
      'framework',
      'libreria',
      'runtime',
      'orm',
      'database-relazionale',
      'database-documentale',
      'database-chiave-valore',
      'database-vettoriale',
      'baas',
      'sistema-controllo-versione',
      'piattaforma',
      'container',
      'package-manager',
      'ci-cd',
      'editor',
      'software',
      'build-tool'
    )
  );
