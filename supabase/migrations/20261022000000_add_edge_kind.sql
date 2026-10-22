alter table public.edges
  add column if not exists kind text not null default 'usa';

alter table public.edges
  drop constraint if exists edges_kind_check;

alter table public.edges
  add constraint edges_kind_check check (
    kind in (
      'richiede',
      'usa',
      'estende',
      'alternativa',
      'si_integra',
      'strumento',
      'ospita'
    )
  );

update public.edges set source = 'html', target = 'css', kind = 'usa'
  where id = 'e-html-css';
update public.edges set source = 'bootstrap', target = 'css', kind = 'estende'
  where id = 'e-css-bootstrap';
update public.edges set source = 'tailwind', target = 'css', kind = 'estende'
  where id = 'e-css-tailwind';
update public.edges set source = 'css', target = 'js', kind = 'si_integra'
  where id = 'e-css-js';
update public.edges set source = 'ts', target = 'js', kind = 'richiede'
  where id = 'e-js-ts';
update public.edges set source = 'react', target = 'js', kind = 'usa'
  where id = 'e-ts-react';
update public.edges set source = 'nextjs', target = 'react', kind = 'estende'
  where id = 'e-react-nextjs';
update public.edges set source = 'react-flow', target = 'react', kind = 'usa'
  where id = 'e-react-rf';
update public.edges set source = 'vue', target = 'js', kind = 'usa'
  where id = 'e-ts-vue';
update public.edges set source = 'nuxt', target = 'vue', kind = 'estende'
  where id = 'e-vue-nuxt';
update public.edges set source = 'angular', target = 'ts', kind = 'richiede'
  where id = 'e-ts-angular';
update public.edges set source = 'svelte', target = 'js', kind = 'usa'
  where id = 'e-ts-svelte';
update public.edges set source = 'nodejs', target = 'js', kind = 'usa'
  where id = 'e-js-node';
update public.edges set source = 'nestjs', target = 'ts', kind = 'richiede'
  where id = 'e-ts-nestjs';
update public.edges set source = 'nestjs', target = 'nodejs', kind = 'usa'
  where id = 'e-node-nestjs';
update public.edges set source = 'prisma', target = 'nodejs', kind = 'usa'
  where id = 'e-node-prisma';
update public.edges set source = 'drizzle', target = 'nodejs', kind = 'usa'
  where id = 'e-node-drizzle';
update public.edges set source = 'fastapi', target = 'python', kind = 'richiede'
  where id = 'e-python-fastapi';
update public.edges set source = 'prisma', target = 'postgresql', kind = 'si_integra'
  where id = 'e-prisma-postgres';
update public.edges set source = 'drizzle', target = 'postgresql', kind = 'si_integra'
  where id = 'e-drizzle-postgres';
update public.edges set source = 'prisma', target = 'mysql', kind = 'si_integra'
  where id = 'e-prisma-mysql';
update public.edges set source = 'supabase', target = 'postgresql', kind = 'usa'
  where id = 'e-postgres-supabase';
update public.edges set source = 'firebase', target = 'mongodb', kind = 'alternativa'
  where id = 'e-mongodb-firebase';
update public.edges set source = 'python', target = 'milvus', kind = 'usa'
  where id = 'e-python-milvus';
update public.edges set source = 'nodejs', target = 'redis', kind = 'usa'
  where id = 'e-node-redis';
update public.edges set source = 'dbeaver', target = 'postgresql', kind = 'strumento'
  where id = 'e-dbeaver-postgres';
update public.edges set source = 'dbeaver', target = 'mysql', kind = 'strumento'
  where id = 'e-dbeaver-mysql';
update public.edges set source = 'postman', target = 'nestjs', kind = 'strumento'
  where id = 'e-postman-nestjs';
update public.edges set source = 'postman', target = 'fastapi', kind = 'strumento'
  where id = 'e-postman-fastapi';
update public.edges set source = 'figma', target = 'tailwind', kind = 'si_integra'
  where id = 'e-figma-tailwind';
update public.edges set source = 'vscode', target = 'git', kind = 'strumento'
  where id = 'e-vscode-git';
update public.edges set source = 'github', target = 'git', kind = 'usa'
  where id = 'e-git-github';
update public.edges set source = 'github-actions', target = 'github', kind = 'usa'
  where id = 'e-github-actions';
update public.edges set source = 'pnpm', target = 'nodejs', kind = 'strumento'
  where id = 'e-pnpm-node';
update public.edges set source = 'docker', target = 'postgresql', kind = 'ospita'
  where id = 'e-docker-postgres';
update public.edges set source = 'vite', target = 'react', kind = 'strumento'
  where id = 'e-react-vite';
update public.edges set source = 'pnpm', target = 'vite', kind = 'strumento'
  where id = 'e-pnpm-vite';
