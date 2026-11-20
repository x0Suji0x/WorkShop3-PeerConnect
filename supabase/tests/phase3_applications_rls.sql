-- Exercise application ownership, project access, role actions, and status RPC rules.
-- All fixture rows and status changes are rolled back at the end.
begin;

create temporary table phase3_rls_users (
  client_a uuid not null,
  client_b uuid not null,
  student_a uuid not null,
  student_b uuid not null,
  client_a_project uuid,
  client_a_draft uuid,
  client_b_project uuid,
  student_a_project uuid,
  student_a_application uuid,
  student_b_application uuid
) on commit drop;

insert into phase3_rls_users (client_a, client_b, student_a, student_b)
values (gen_random_uuid(), gen_random_uuid(), gen_random_uuid(), gen_random_uuid());
grant select, update on phase3_rls_users to authenticated;

insert into auth.users (
  id, aud, role, email, created_at, updated_at, raw_user_meta_data, is_sso_user, is_anonymous
)
select user_id, 'authenticated', 'authenticated', user_id::text || '@phase3.invalid',
       now(), now(), jsonb_build_object('role', account_role, 'full_name', 'Phase 3 Test'), false, false
from (
  select client_a as user_id, 'client' as account_role from phase3_rls_users
  union all select client_b, 'client' from phase3_rls_users
  union all select student_a, 'student' from phase3_rls_users
  union all select student_b, 'student' from phase3_rls_users
) test_users;

insert into public.student_profiles (user_id, display_name, college, is_public)
select student_a, 'Public Test Student', 'Test University', true from phase3_rls_users
union all
select student_b, 'Private Test Student', 'Private University', false from phase3_rls_users;

insert into public.projects (owner_id, title, description, budget_amount, budget_type, status)
select client_a, 'Client A published project', 'Public brief', 1000, 'Fixed-price', 'published' from phase3_rls_users
union all
select client_a, 'Client A draft project', 'Private brief', 1500, 'Fixed-price', 'draft' from phase3_rls_users
union all
select client_b, 'Client B published project', 'Other client brief', 2000, 'Hourly', 'published' from phase3_rls_users
union all
select student_a, 'Student A forged-owned project', 'Must not accept self application', 2500, 'Milestone-based', 'published' from phase3_rls_users;

update phase3_rls_users set
  client_a_project = (select id from public.projects where title = 'Client A published project'),
  client_a_draft = (select id from public.projects where title = 'Client A draft project'),
  client_b_project = (select id from public.projects where title = 'Client B published project'),
  student_a_project = (select id from public.projects where title = 'Student A forged-owned project');

insert into public.applications (project_id, student_id, cover_letter)
select client_a_project, student_b, 'Seeded application from another student' from phase3_rls_users
union all
select client_b_project, student_a, 'Seeded application to another client' from phase3_rls_users
returning id;

update phase3_rls_users set
  student_b_application = (
    select a.id from public.applications a
    join public.projects p on p.id = a.project_id
    where p.title = 'Client A published project'
  ),
  student_a_application = (
    select a.id from public.applications a
    join public.projects p on p.id = a.project_id
    where p.title = 'Client B published project'
  );

select set_config(
  'request.jwt.claims',
  jsonb_build_object('sub', (select student_a::text from phase3_rls_users))::text,
  true
);
set local role authenticated;

do $$
declare
  new_application uuid;
  duplicate_rejected boolean := false;
  draft_rejected boolean := false;
  own_project_rejected boolean := false;
  other_student_update_rejected boolean := false;
  direct_status_update_rejected boolean := false;
  visible_count integer;
begin
  select count(*) into visible_count from public.applications;
  if visible_count <> 1 or exists (
    select 1 from public.applications where student_id <> auth.uid()
  ) then
    raise exception 'student can read another student application';
  end if;

  insert into public.applications (project_id, student_id, cover_letter)
  values ((select client_a_project from pg_temp.phase3_rls_users), auth.uid(), 'My proposal pitch')
  returning id into new_application;
  update pg_temp.phase3_rls_users set student_a_application = new_application;

  begin
    insert into public.applications (project_id, student_id, cover_letter)
    values ((select client_a_project from pg_temp.phase3_rls_users), auth.uid(), 'Duplicate pitch');
  exception when unique_violation then
    duplicate_rejected := true;
  end;
  if not duplicate_rejected then raise exception 'duplicate application was accepted'; end if;

  begin
    insert into public.applications (project_id, student_id, cover_letter)
    values ((select client_a_draft from pg_temp.phase3_rls_users), auth.uid(), 'Draft pitch');
  exception when insufficient_privilege then
    draft_rejected := true;
  end;
  if not draft_rejected then raise exception 'application to a draft project was accepted'; end if;

  begin
    insert into public.applications (project_id, student_id, cover_letter)
    values ((select student_a_project from pg_temp.phase3_rls_users), auth.uid(), 'Self pitch');
  exception when insufficient_privilege then
    own_project_rejected := true;
  end;
  if not own_project_rejected then raise exception 'application to an owned project was accepted'; end if;

  begin
    perform public.set_application_status(
      (select student_b_application from pg_temp.phase3_rls_users), 'withdrawn'
    );
  exception when insufficient_privilege then
    other_student_update_rejected := true;
  end;
  if not other_student_update_rejected then raise exception 'student withdrew another student application'; end if;

  begin
    update public.applications set status = 'accepted'
    where id = (select student_a_application from pg_temp.phase3_rls_users);
  exception when insufficient_privilege then
    direct_status_update_rejected := true;
  end;
  if not direct_status_update_rejected then raise exception 'student directly updated status'; end if;

  begin
    perform public.set_application_status(new_application, 'accepted');
    raise exception 'student accepted their own application';
  exception when insufficient_privilege then
    null;
  end;

  perform public.set_application_status(new_application, 'withdrawn');
  if not exists (select 1 from public.applications where id = new_application and status = 'withdrawn') then
    raise exception 'student could not withdraw their own application';
  end if;
end;
$$;

reset role;
select set_config(
  'request.jwt.claims',
  jsonb_build_object('sub', (select client_a::text from phase3_rls_users))::text,
  true
);
set local role authenticated;

do $$
declare
  affected integer;
  wrong_status_rejected boolean := false;
  unauthorized_direct_update_rejected boolean := false;
  visible_count integer;
begin
  select count(*) into visible_count from public.applications;
  if visible_count <> 2 then raise exception 'client A cannot read only their own project applications'; end if;
  if exists (
    select 1 from public.applications a
    join public.projects p on p.id = a.project_id
    where p.owner_id <> auth.uid()
  ) then raise exception 'client A read an application for another client project'; end if;

  perform public.set_application_status(
    (select student_a_application from pg_temp.phase3_rls_users), 'shortlisted'
  );
  if not exists (
    select 1 from public.applications
    where id = (select student_a_application from pg_temp.phase3_rls_users)
      and status = 'shortlisted'
  ) then raise exception 'project owner could not shortlist an applicant'; end if;

  begin
    perform public.set_application_status(
      (select student_a_application from pg_temp.phase3_rls_users), 'withdrawn'
    );
  exception when insufficient_privilege then
    wrong_status_rejected := true;
  end;
  if not wrong_status_rejected then raise exception 'client withdrew an application'; end if;

  begin
    update public.applications set status = 'rejected'
    where id = (select student_a_application from pg_temp.phase3_rls_users);
  exception when insufficient_privilege then
    unauthorized_direct_update_rejected := true;
  end;
  if not unauthorized_direct_update_rejected then raise exception 'client directly updated application status'; end if;
end;
$$;

reset role;
select set_config(
  'request.jwt.claims',
  jsonb_build_object('sub', (select client_b::text from phase3_rls_users))::text,
  true
);
set local role authenticated;

do $$
declare
  unauthorized_read_count integer;
  unauthorized_update_rejected boolean := false;
begin
  select count(*) into unauthorized_read_count from public.applications;
  if unauthorized_read_count <> 1 then raise exception 'client B can read applications to client A projects'; end if;

  begin
    perform public.set_application_status(
      (select student_a_application from pg_temp.phase3_rls_users), 'rejected'
    );
  exception when insufficient_privilege then
    unauthorized_update_rejected := true;
  end;
  if not unauthorized_update_rejected then raise exception 'client B changed another client application'; end if;
end;
$$;

rollback;
select 'phase3_applications_rls: PASS' as result;
