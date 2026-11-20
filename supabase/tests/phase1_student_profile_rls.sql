-- Exercise phase 1 policies as anon and authenticated users, then roll back
-- every fixture row so this check leaves the live project unchanged.
begin;

create temporary table phase1_rls_users (
  student_a uuid not null,
  student_b uuid not null,
  student_c uuid not null,
  client_id uuid not null
) on commit drop;

insert into phase1_rls_users values (gen_random_uuid(), gen_random_uuid(), gen_random_uuid(), gen_random_uuid());
grant select on phase1_rls_users to anon, authenticated;

insert into auth.users (
  id, aud, role, email, created_at, updated_at, raw_user_meta_data, is_sso_user, is_anonymous
)
select user_id, 'authenticated', 'authenticated', user_id::text || '@phase1.invalid',
       now(), now(), jsonb_build_object('role', account_role), false, false
from (
  select student_a as user_id, 'student' as account_role from phase1_rls_users
  union all
  select student_b, 'student' from phase1_rls_users
  union all
  select student_c, 'student' from phase1_rls_users
  union all
  select client_id, 'client' from phase1_rls_users
) test_users;

insert into public.student_profiles (user_id, display_name, headline, is_public)
select student_a, 'Private student A', 'Student A headline', false from phase1_rls_users
union all
select student_b, 'Private student B', 'Student B headline', false from phase1_rls_users;

select set_config(
  'request.jwt.claims',
  jsonb_build_object('sub', (select student_a::text from phase1_rls_users))::text,
  true
);
set local role authenticated;

do $$
declare
  target_id uuid;
  affected integer;
  role_change_rejected boolean := false;
  forged_insert_rejected boolean := false;
begin
  select student_b into target_id from pg_temp.phase1_rls_users;

  if (select count(*) from public.student_profiles) <> 1 then
    raise exception 'student A could read another student''s private profile';
  end if;

  update public.student_profiles set headline = 'forged edit' where user_id = target_id;
  get diagnostics affected = row_count;
  if affected <> 0 then
    raise exception 'student A edited another student''s profile';
  end if;

  update public.student_profiles set headline = 'Owner edit' where user_id = auth.uid();
  get diagnostics affected = row_count;
  if affected <> 1 then
    raise exception 'student A could not update their own profile';
  end if;

  begin
    insert into public.student_profiles (user_id, display_name)
    values (target_id, 'Forged owner');
  exception when insufficient_privilege then
    forged_insert_rejected := true;
  end;
  if not forged_insert_rejected then
    raise exception 'student A inserted a profile owned by another user';
  end if;

  begin
    update public.profiles set role = 'client' where id = auth.uid();
  exception when insufficient_privilege then
    role_change_rejected := true;
  end;
  if not role_change_rejected then
    raise exception 'student A changed their immutable account role';
  end if;
end;
$$;

reset role;
select set_config(
  'request.jwt.claims',
  jsonb_build_object('sub', (select student_c::text from phase1_rls_users))::text,
  true
);
set local role authenticated;

do $$
declare
  affected integer;
begin
  insert into public.student_profiles (user_id, display_name)
  values (auth.uid(), 'Student C profile');
  get diagnostics affected = row_count;
  if affected <> 1 then
    raise exception 'student could not insert their own profile';
  end if;

  if not exists (select 1 from public.student_profiles where user_id = auth.uid()) then
    raise exception 'student could not read their newly inserted profile';
  end if;
end;
$$;

reset role;
select set_config(
  'request.jwt.claims',
  jsonb_build_object('sub', (select client_id::text from phase1_rls_users))::text,
  true
);
set local role authenticated;

do $$
declare
  target_id uuid;
  affected integer;
  forged_insert_rejected boolean := false;
begin
  select student_a into target_id from pg_temp.phase1_rls_users;
  update public.student_profiles set headline = 'client edit' where user_id = target_id;
  get diagnostics affected = row_count;
  if affected <> 0 then
    raise exception 'client edited a student profile';
  end if;

  begin
    insert into public.student_profiles (user_id, display_name)
    values (target_id, 'Client forged profile');
  exception when insufficient_privilege then
    forged_insert_rejected := true;
  end;
  if not forged_insert_rejected then
    raise exception 'client inserted a student-owned profile';
  end if;
end;
$$;

reset role;
update public.student_profiles
set is_public = true
where user_id = (select student_b from phase1_rls_users);
set local role anon;

do $$
declare
  public_id uuid;
begin
  select student_b into public_id from pg_temp.phase1_rls_users;
  if (select count(*) from public.student_profiles) <> 1
     or not exists (select 1 from public.student_profiles where user_id = public_id) then
    raise exception 'anon could not read exactly the explicitly public profile';
  end if;
end;
$$;

rollback;
select 'phase1_student_profile_rls: PASS' as result;
