create table public.applications (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references public.projects(id) on delete cascade,
  student_id uuid not null references auth.users(id) on delete cascade,
  cover_letter text not null check (char_length(btrim(cover_letter)) between 1 and 5000),
  status text not null default 'submitted'
    check (status in ('submitted', 'shortlisted', 'accepted', 'rejected', 'withdrawn')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint applications_one_per_student_project unique (project_id, student_id)
);

create index applications_student_created_at_idx
  on public.applications (student_id, created_at desc);
create index applications_project_created_at_idx
  on public.applications (project_id, created_at desc);

alter table public.applications enable row level security;

revoke all on table public.applications from public, anon, authenticated;
grant select on table public.applications to authenticated;
grant insert (project_id, student_id, cover_letter)
  on table public.applications to authenticated;

create policy "Students can submit applications to published projects"
  on public.applications for insert to authenticated
  with check (
    student_id = (select auth.uid())
    and exists (
      select 1 from public.profiles p
      where p.id = (select auth.uid())
        and p.role = 'student'::public.account_role
    )
    and exists (
      select 1 from public.projects p
      where p.id = applications.project_id
        and p.status = 'published'
        and p.owner_id <> (select auth.uid())
    )
  );

create policy "Students can read their own applications"
  on public.applications for select to authenticated
  using (student_id = (select auth.uid()));

create policy "Project owners can read applications to their projects"
  on public.applications for select to authenticated
  using (
    exists (
      select 1
      from public.projects p
      join public.profiles owner_profile on owner_profile.id = p.owner_id
      where p.id = applications.project_id
        and p.owner_id = (select auth.uid())
        and owner_profile.role = 'client'::public.account_role
    )
  );

create function public.set_application_status(application_id uuid, new_status text)
returns void
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_actor_id uuid := auth.uid();
  v_application_id uuid := $1;
  v_new_status text := $2;
  v_actor_role public.account_role;
begin
  if v_actor_id is null then
    raise exception using errcode = '42501', message = 'You must be signed in to update an application.';
  end if;

  if v_new_status not in ('shortlisted', 'accepted', 'rejected', 'withdrawn') then
    raise exception using errcode = '22023', message = 'Choose a valid application status.';
  end if;

  select p.role into v_actor_role
  from public.profiles p
  where p.id = v_actor_id;

  if v_actor_role = 'student'::public.account_role and v_new_status = 'withdrawn' then
    update public.applications a
      set status = v_new_status
      where a.id = v_application_id and a.student_id = v_actor_id;
    if not found then
      raise exception using errcode = '42501', message = 'You can only withdraw your own application.';
    end if;
    return;
  end if;

  if v_actor_role = 'client'::public.account_role
    and v_new_status in ('shortlisted', 'accepted', 'rejected') then
    update public.applications a
      set status = v_new_status
      from public.projects p
      where a.id = v_application_id
        and p.id = a.project_id
        and p.owner_id = v_actor_id;
    if not found then
      raise exception using errcode = '42501', message = 'You can only review applications to your own projects.';
    end if;
    return;
  end if;

  raise exception using errcode = '42501',
    message = 'Project owners may shortlist, accept, or reject applications; students may withdraw their own.';
end;
$$;

revoke all on function public.set_application_status(uuid, text) from public, anon, authenticated;
grant execute on function public.set_application_status(uuid, text) to authenticated;

create function public.set_application_updated_at()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  new.updated_at := pg_catalog.now();
  return new;
end;
$$;

revoke all on function public.set_application_updated_at() from public, anon, authenticated;

create trigger set_application_updated_at
  before update on public.applications
  for each row execute function public.set_application_updated_at();
