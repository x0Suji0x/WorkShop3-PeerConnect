-- Exercise project ownership and public listing rules, then roll back fixtures.
begin;

create temporary table phase2_rls_users (
  client_a uuid not null,
  client_b uuid not null,
  student_a uuid not null
) on commit drop;

insert into phase2_rls_users values (gen_random_uuid(), gen_random_uuid(), gen_random_uuid());
grant select on phase2_rls_users to anon, authenticated;

insert into auth.users (
  id, aud, role, email, created_at, updated_at, raw_user_meta_data, is_sso_user, is_anonymous
)
select user_id, 'authenticated', 'authenticated', user_id::text || '@phase2.invalid',
       now(), now(), jsonb_build_object('role', account_role), false, false
from (
  select client_a as user_id, 'client' as account_role from phase2_rls_users
  union all
  select client_b, 'client' from phase2_rls_users
  union all
  select student_a, 'student' from phase2_rls_users
) test_users;

insert into public.projects (owner_id, title, description, budget_amount, budget_type, status)
select client_a, 'Client A draft', 'Private draft', 1000, 'Fixed-price', 'draft' from phase2_rls_users
union all
select client_b, 'Client B draft', 'Private draft', 2000, 'Fixed-price', 'draft' from phase2_rls_users
union all
select client_b, 'Client B published', 'Public project', 3000, 'Milestone-based', 'published' from phase2_rls_users;

select set_config(
  'request.jwt.claims',
  jsonb_build_object('sub', (select client_a::text from phase2_rls_users))::text,
  true
);
set local role authenticated;

do $$
declare
  target_id uuid;
  inserted_id uuid;
  affected integer;
  unauthorized_changes integer;
  forged_insert_rejected boolean := false;
  owner_change_rejected boolean := false;
begin
  select client_b into target_id from pg_temp.phase2_rls_users;

  if not exists (select 1 from public.projects where title = 'Client A draft')
     or exists (select 1 from public.projects where title = 'Client B draft')
     or not exists (select 1 from public.projects where title = 'Client B published') then
    raise exception 'client A project visibility is incorrect';
  end if;

  update public.projects set status = 'closed' where title = 'Client B published';
  get diagnostics unauthorized_changes = row_count;
  if unauthorized_changes <> 0 then
    raise exception 'client A updated client B project';
  end if;

  delete from public.projects where title = 'Client B published';
  get diagnostics unauthorized_changes = row_count;
  if unauthorized_changes <> 0 then
    raise exception 'client A deleted client B project';
  end if;

  insert into public.projects (owner_id, title, budget_amount, budget_type, status)
  values (auth.uid(), 'Client A created draft', 4500, 'Hourly', 'draft')
  returning id into inserted_id;

  begin
    insert into public.projects (owner_id, title, budget_amount, budget_type, status)
    values (target_id, 'Forged project', 1, 'Fixed-price', 'draft');
  exception when insufficient_privilege then
    forged_insert_rejected := true;
  end;
  if not forged_insert_rejected then
    raise exception 'client A inserted a project for client B';
  end if;

  update public.projects set status = 'published' where id = inserted_id;
  get diagnostics affected = row_count;
  if affected <> 1 then
    raise exception 'owner could not publish their project';
  end if;

  begin
    update public.projects set owner_id = target_id where id = inserted_id;
  exception when insufficient_privilege then
    owner_change_rejected := true;
  end;
  if not owner_change_rejected then
    raise exception 'client changed project ownership';
  end if;

  delete from public.projects where id = inserted_id;
  get diagnostics affected = row_count;
  if affected <> 1 then
    raise exception 'owner could not delete their own project';
  end if;
end;
$$;

reset role;
select set_config(
  'request.jwt.claims',
  jsonb_build_object('sub', (select student_a::text from phase2_rls_users))::text,
  true
);
set local role authenticated;

do $$
declare
  rejected boolean := false;
begin
  if exists (select 1 from public.projects where title in ('Client A draft', 'Client B draft')) then
    raise exception 'student can read a private project draft';
  end if;
  if (select count(*) from public.projects where status = 'published') <> 1 then
    raise exception 'student cannot see only published projects';
  end if;

  begin
    insert into public.projects (owner_id, title, budget_amount, budget_type, status)
    values (auth.uid(), 'Student project', 1, 'Fixed-price', 'published');
  exception when insufficient_privilege then
    rejected := true;
  end;
  if not rejected then
    raise exception 'student created a client project';
  end if;
end;
$$;

reset role;
set local role anon;

do $$
begin
  if (select count(*) from public.projects) <> 1
     or not exists (select 1 from public.projects where title = 'Client B published') then
    raise exception 'anon can read a draft or cannot read the published project';
  end if;
end;
$$;

rollback;
select 'phase2_projects_rls: PASS' as result;
