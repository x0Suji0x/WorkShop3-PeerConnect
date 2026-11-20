-- Verify private requests, role-matched submissions, admin review, and approved-only badges.
-- All fixture users, requests, and decisions are rolled back.
begin;

create temporary table phase4_rls_users (
  student_a uuid not null,
  student_b uuid not null,
  client_a uuid not null,
  admin_user uuid not null,
  student_a_request uuid,
  student_b_request uuid,
  client_a_request uuid
) on commit drop;

insert into phase4_rls_users (student_a, student_b, client_a, admin_user)
values (gen_random_uuid(), gen_random_uuid(), gen_random_uuid(), gen_random_uuid());
grant select, update on phase4_rls_users to authenticated, anon;

insert into auth.users (
  id, aud, role, email, created_at, updated_at, raw_user_meta_data, is_sso_user, is_anonymous
)
select user_id, 'authenticated', 'authenticated', user_id::text || '@phase4.invalid',
       now(), now(), jsonb_build_object('role', account_role, 'full_name', 'Phase 4 Test'), false, false
from (
  select student_a as user_id, 'student' as account_role from phase4_rls_users
  union all select student_b, 'student' from phase4_rls_users
  union all select client_a, 'client' from phase4_rls_users
  union all select admin_user, 'client' from phase4_rls_users
) test_users;

insert into public.admins (user_id) select admin_user from phase4_rls_users;

insert into public.verification_requests (
  user_id, kind, institution_or_company, official_email, evidence_notes
)
select student_b, 'student', 'Other University', 'student-b@university.invalid', 'Request owned by another student.' from phase4_rls_users
union all
select client_a, 'business', 'Campus Studio', 'client@campus.invalid', 'Business request owned by client A.' from phase4_rls_users;

update phase4_rls_users set
  student_a_request = (
    select id from public.verification_requests
    where user_id = phase4_rls_users.student_a
  ),
  student_b_request = (
    select id from public.verification_requests
    where user_id = phase4_rls_users.student_b
  ),
  client_a_request = (
    select id from public.verification_requests
    where user_id = phase4_rls_users.client_a
  );

select set_config(
  'request.jwt.claims',
  jsonb_build_object('sub', (select student_a::text from phase4_rls_users))::text,
  true
);
set local role authenticated;

do $$
declare
  visible_count integer;
  direct_update_rejected boolean := false;
  self_approval_rejected boolean := false;
  role_mismatch_rejected boolean := false;
  profile_badge_update_rejected boolean := false;
  new_request uuid;
begin
  select count(*) into visible_count from public.verification_requests;
  if visible_count <> 0 or exists (
    select 1 from public.verification_requests where user_id <> auth.uid()
  ) then raise exception 'user can read another account verification request'; end if;

  begin
    update public.verification_requests set status = 'approved'
    where id = (select student_b_request from pg_temp.phase4_rls_users);
  exception when insufficient_privilege then
    direct_update_rejected := true;
  end;
  if not direct_update_rejected then raise exception 'user directly changed verification status'; end if;

  begin
    perform public.review_verification(
      (select student_b_request from pg_temp.phase4_rls_users), 'approved', 'self approval'
    );
  exception when insufficient_privilege then
    self_approval_rejected := true;
  end;
  if not self_approval_rejected then raise exception 'non-admin approved a verification request'; end if;

  begin
    update public.profiles set is_verified = true where id = auth.uid();
  exception when insufficient_privilege then
    profile_badge_update_rejected := true;
  end;
  if not profile_badge_update_rejected then raise exception 'user wrote their own verified badge'; end if;

  begin
    insert into public.verification_requests (
      user_id, kind, institution_or_company, official_email, evidence_notes
    ) values (auth.uid(), 'business', 'Wrong Role Co', 'wrong@business.invalid', 'This role does not match.');
  exception when insufficient_privilege then
    role_mismatch_rejected := true;
  end;
  if not role_mismatch_rejected then raise exception 'student submitted a business verification request'; end if;

  insert into public.verification_requests (
    user_id, kind, institution_or_company, official_email, evidence_notes
  ) values (auth.uid(), 'student', 'Student A University', 'a@student.invalid', 'Student A has supplied their request notes.')
  returning id into new_request;
  update pg_temp.phase4_rls_users set student_a_request = new_request;
  if not exists (
    select 1 from public.verification_requests where id = new_request and status = 'pending'
  ) then raise exception 'new request was not pending'; end if;
end;
$$;

reset role;
select set_config(
  'request.jwt.claims',
  jsonb_build_object('sub', (select admin_user::text from phase4_rls_users))::text,
  true
);
set local role authenticated;

do $$
declare
  visible_count integer;
begin
  select count(*) into visible_count from public.verification_requests;
  if visible_count <> 3 then raise exception 'admin cannot read all verification requests'; end if;

  perform public.review_verification(
    (select student_a_request from pg_temp.phase4_rls_users), 'approved', 'Reviewed manually.'
  );
  perform public.review_verification(
    (select client_a_request from pg_temp.phase4_rls_users), 'approved', 'Reviewed manually.'
  );

  if not exists (
    select 1 from public.verification_requests
    where id = (select student_a_request from pg_temp.phase4_rls_users)
      and status = 'approved' and reviewed_at is not null and reviewer_note = 'Reviewed manually.'
  ) then raise exception 'admin approval did not save the decision'; end if;
end;
$$;

reset role;
set local role anon;

do $$
declare
  request_read_protected boolean := false;
begin
  if not exists (
    select 1 from public.verified_users
    where user_id = (select student_a from pg_temp.phase4_rls_users) and kind = 'student'
  ) then raise exception 'approved student has no public verified badge row'; end if;
  if not exists (
    select 1 from public.verified_users
    where user_id = (select client_a from pg_temp.phase4_rls_users) and kind = 'business'
  ) then raise exception 'approved business has no public verified badge row'; end if;
  if exists (
    select 1 from public.verified_users
    where user_id = (select student_b from pg_temp.phase4_rls_users)
  ) then raise exception 'unreviewed student received a verified badge'; end if;
  begin
    perform 1 from public.verification_requests;
    raise exception 'anonymous user can read verification requests';
  exception when insufficient_privilege then
    request_read_protected := true;
  end;
  if not request_read_protected then raise exception 'anonymous user could read verification requests'; end if;
end;
$$;

rollback;
select 'phase4_verification_rls: PASS' as result;
