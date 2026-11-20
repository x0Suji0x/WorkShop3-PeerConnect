create table public.projects (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references auth.users(id) on delete cascade,
  title text not null check (char_length(btrim(title)) between 3 and 160),
  description text not null default '' check (char_length(description) <= 10000),
  client_name text not null default '',
  client_type text not null default '',
  client_location text not null default '',
  budget_amount numeric(12, 2) not null check (budget_amount >= 0),
  budget_type text not null check (budget_type in ('Fixed-price', 'Milestone-based', 'Hourly')),
  duration text not null default '',
  hours_per_week text not null default '',
  skills_required text[] not null default '{}',
  category text not null default '',
  work_mode text not null default 'Remote' check (work_mode in ('Remote', 'Hybrid', 'On-site')),
  deadline date,
  deliverables text[] not null default '{}',
  status text not null default 'draft' check (status in ('draft', 'published', 'closed')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index projects_published_created_at_idx
  on public.projects (created_at desc)
  where status = 'published';
create index projects_owner_created_at_idx
  on public.projects (owner_id, created_at desc);

alter table public.projects enable row level security;

revoke all on table public.projects from public, anon, authenticated;
grant select on table public.projects to anon, authenticated;
grant insert (
  owner_id, title, description, client_name, client_type, client_location,
  budget_amount, budget_type, duration, hours_per_week, skills_required,
  category, work_mode, deadline, deliverables, status
) on public.projects to authenticated;
grant update (
  title, description, client_name, client_type, client_location,
  budget_amount, budget_type, duration, hours_per_week, skills_required,
  category, work_mode, deadline, deliverables, status
) on public.projects to authenticated;
grant delete on table public.projects to authenticated;

create policy "Anyone can read published projects"
  on public.projects for select to anon, authenticated
  using (status = 'published');

create policy "Owners can read their projects"
  on public.projects for select to authenticated
  using (
    owner_id = (select auth.uid())
    and exists (
      select 1 from public.profiles p
      where p.id = (select auth.uid()) and p.role = 'client'::public.account_role
    )
  );

create policy "Clients can create their own projects"
  on public.projects for insert to authenticated
  with check (
    owner_id = (select auth.uid())
    and exists (
      select 1 from public.profiles p
      where p.id = (select auth.uid()) and p.role = 'client'::public.account_role
    )
  );

create policy "Clients can update their own projects"
  on public.projects for update to authenticated
  using (
    owner_id = (select auth.uid())
    and exists (
      select 1 from public.profiles p
      where p.id = (select auth.uid()) and p.role = 'client'::public.account_role
    )
  )
  with check (
    owner_id = (select auth.uid())
    and exists (
      select 1 from public.profiles p
      where p.id = (select auth.uid()) and p.role = 'client'::public.account_role
    )
  );

create policy "Clients can delete their own projects"
  on public.projects for delete to authenticated
  using (
    owner_id = (select auth.uid())
    and exists (
      select 1 from public.profiles p
      where p.id = (select auth.uid()) and p.role = 'client'::public.account_role
    )
  );

create function public.set_project_updated_at()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  new.updated_at := pg_catalog.now();
  return new;
end;
$$;

revoke all on function public.set_project_updated_at() from public, anon, authenticated;

create trigger set_project_updated_at
  before update on public.projects
  for each row execute function public.set_project_updated_at();
