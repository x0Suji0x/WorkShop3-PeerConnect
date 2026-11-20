create or replace function public.set_application_status(application_id uuid, new_status text)
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
  v_current_status text;
begin
  if v_actor_id is null then
    raise exception using errcode = '42501', message = 'You must be signed in to update an application.';
  end if;

  if v_new_status is null or v_new_status not in ('shortlisted', 'accepted', 'rejected', 'withdrawn') then
    raise exception using errcode = '22023', message = 'Choose a valid application status.';
  end if;

  select p.role into v_actor_role
  from public.profiles p
  where p.id = v_actor_id;

  if v_actor_role = 'student'::public.account_role then
    select a.status into v_current_status
    from public.applications a
    where a.id = v_application_id and a.student_id = v_actor_id
    for update;

    if not found then
      raise exception using errcode = '42501', message = 'You can only withdraw your own application.';
    end if;

    if v_new_status = 'withdrawn' and v_current_status in ('submitted', 'shortlisted') then
      update public.applications a
      set status = 'withdrawn'
      where a.id = v_application_id;
      return;
    end if;

    raise exception using errcode = '22023',
      message = 'Students may withdraw only submitted or shortlisted applications. Final applications cannot be changed.';
  end if;

  if v_actor_role = 'client'::public.account_role then
    select a.status into v_current_status
    from public.applications a
    join public.projects p on p.id = a.project_id
    where a.id = v_application_id and p.owner_id = v_actor_id
    for update of a;

    if not found then
      raise exception using errcode = '42501', message = 'You can only review applications to your own projects.';
    end if;

    if v_current_status = 'submitted' and v_new_status in ('shortlisted', 'accepted', 'rejected') then
      update public.applications a
      set status = v_new_status
      where a.id = v_application_id;
      return;
    end if;

    if v_current_status = 'shortlisted' and v_new_status in ('accepted', 'rejected') then
      update public.applications a
      set status = v_new_status
      where a.id = v_application_id;
      return;
    end if;

    raise exception using errcode = '22023',
      message = 'Clients may move submitted applications to shortlisted, accepted, or rejected, and shortlisted applications to accepted or rejected. Accepted and rejected applications are final.';
  end if;

  raise exception using errcode = '42501', message = 'Your account role cannot change application status.';
end;
$$;

revoke all on function public.set_application_status(uuid, text) from public, anon, authenticated;
grant execute on function public.set_application_status(uuid, text) to authenticated;
