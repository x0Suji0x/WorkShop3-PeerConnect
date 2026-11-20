alter table public.profiles
  add column is_verified boolean not null default false;

create table public.admins (
  user_id uuid primary key references auth.users(id) on delete cascade,
  created_at timestamptz not null default now()
);

create table public.verification_requests (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  kind text not null check (kind in ('student', 'business')),
  institution_or_company text not null check (char_length(btrim(institution_or_company)) between 2 and 200),
  official_email text not null check (char_length(btrim(official_email)) between 3 and 320),
  evidence_notes text not null check (char_length(btrim(evidence_notes)) between 10 and 5000),
  status text not null default 'pending' check (status in ('pending', 'approved', 'rejected')),
  reviewer_note text check (reviewer_note is null or char_length(reviewer_note) <= 2000),
  created_at timestamptz not null default now(),
  reviewed_at timestamptz
);

create index verification_requests_user_created_at_idx
  on public.verification_requests (user_id, created_at desc);
create unique index verification_requests_one_pending_per_user_idx
  on public.verification_requests (user_id)
  where status = 'pending';

alter table public.admins enable row level security;
alter table public.verification_requests enable row level security;

revoke all on table public.admins from public, anon, authenticated;
revoke all on table public.verification_requests from public, anon, authenticated;
grant select on table public.admins to authenticated;
grant select on table public.verification_requests to authenticated;
grant insert (user_id, kind, institution_or_company, official_email, evidence_notes)
  on table public.verification_requests to authenticated;

create policy "Users can read their own admin membership"
  on public.admins for select to authenticated
  using (user_id = (select auth.uid()));

create policy "Users can read their own verification requests"
  on public.verification_requests for select to authenticated
  using (user_id = (select auth.uid()));

create policy "Admins can read all verification requests"
  on public.verification_requests for select to authenticated
  using (
    exists (
      select 1 from public.admins a
      where a.user_id = (select auth.uid())
    )
  );

create policy "Users can request verification for their account role"
  on public.verification_requests for insert to authenticated
  with check (
    user_id = (select auth.uid())
    and exists (
      select 1 from public.profiles p
      where p.id = (select auth.uid())
        and (
          (verification_requests.kind = 'student' and p.role = 'student'::public.account_role)
          or (verification_requests.kind = 'business' and p.role = 'client'::public.account_role)
        )
    )
  );

create function public.review_verification(request_id uuid, new_status text, note text default null)
returns void
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_actor_id uuid := auth.uid();
  v_user_id uuid;
  v_kind text;
begin
  if v_actor_id is null then
    raise exception using errcode = '42501', message = 'You must be signed in to review verification requests.';
  end if;

  if not exists (
    select 1 from public.admins a where a.user_id = v_actor_id
  ) then
    raise exception using errcode = '42501', message = 'Only verification admins can review requests.';
  end if;

  if new_status not in ('approved', 'rejected') then
    raise exception using errcode = '22023', message = 'A request can only be approved or rejected.';
  end if;

  update public.verification_requests vr
    set status = $2,
        reviewer_note = nullif(pg_catalog.btrim($3), ''),
        reviewed_at = pg_catalog.now()
    where vr.id = $1 and vr.status = 'pending'
    returning vr.user_id, vr.kind into v_user_id, v_kind;

  if not found then
    raise exception using errcode = 'P0002', message = 'This verification request is unavailable or already reviewed.';
  end if;

  update public.profiles p
    set is_verified = ($2 = 'approved')
    where p.id = v_user_id
      and (
        (v_kind = 'student' and p.role = 'student'::public.account_role)
        or (v_kind = 'business' and p.role = 'client'::public.account_role)
      );

  if not found then
    raise exception using errcode = '23514', message = 'The request no longer matches the account role.';
  end if;
end;
$$;

revoke all on function public.review_verification(uuid, text, text) from public, anon, authenticated;
grant execute on function public.review_verification(uuid, text, text) to authenticated;

-- This deliberately exposes only approved account IDs and the badge type.
-- The view owner can read profiles; anon/authenticated users cannot query profiles directly.
create view public.verified_users with (security_barrier = true) as
  select
    p.id as user_id,
    case when p.role = 'student'::public.account_role then 'student' else 'business' end as kind
  from public.profiles p
  where p.is_verified and p.role is not null;

revoke all on public.verified_users from public, anon, authenticated;
grant select on public.verified_users to anon, authenticated;
