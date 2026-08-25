create table if not exists public.projects (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  name text not null, website_url text not null default '', product_description text not null, target_customer text not null,
  analysis jsonb, concept jsonb, conversation jsonb not null default '[]'::jsonb,
  created_at timestamptz not null default now(), updated_at timestamptz not null default now()
);
alter table public.projects enable row level security;
create policy "Users manage their own projects" on public.projects for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
create or replace function public.update_updated_at_column() returns trigger language plpgsql as $$ begin new.updated_at = now(); return new; end; $$;
create trigger projects_updated_at before update on public.projects for each row execute function public.update_updated_at_column();
