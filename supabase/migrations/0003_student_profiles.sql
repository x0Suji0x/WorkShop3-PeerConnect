create table public.student_profiles (
  user_id uuid primary key references auth.users(id) on delete cascade,
  display_name text not null default '',
  headline text not null default '',
  bio text not null default '',
  university text not null default '',
  college text not null default '',
  degree text not null default '',
  field_of_study text not null default '',
  academic_year text not null default '',
  graduation_year text not null default '',
  avatar_url text not null default '',
  availability text not null default 'Available soon'
    check (availability in ('Available now', 'Available soon', 'Limited hours')),
  skills jsonb not null default '[]'::jsonb check (jsonb_typeof(skills) = 'array'),
  interests jsonb not null default '[]'::jsonb check (jsonb_typeof(interests) = 'array'),
  availability_preferences jsonb not null default '{}'::jsonb
    check (jsonb_typeof(availability_preferences) = 'object'),
  experiences jsonb not null default '[]'::jsonb check (jsonb_typeof(experiences) = 'array'),
  education jsonb not null default '[]'::jsonb check (jsonb_typeof(education) = 'array'),
  portfolio_projects jsonb not null default '[]'::jsonb
    check (jsonb_typeof(portfolio_projects) = 'array'),
  certifications jsonb not null default '[]'::jsonb
    check (jsonb_typeof(certifications) = 'array'),
  social_links jsonb not null default '{}'::jsonb
    check (jsonb_typeof(social_links) = 'object'),
  is_public boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.student_profiles enable row level security;

revoke all on table public.student_profiles from public, anon, authenticated;
grant select on table public.student_profiles to anon, authenticated;
grant insert (
  user_id, display_name, headline, bio, university, college, degree,
  field_of_study, academic_year, graduation_year, avatar_url, availability,
  skills, interests, availability_preferences, experiences, education,
  portfolio_projects, certifications, social_links, is_public
) on public.student_profiles to authenticated;
grant update (
  display_name, headline, bio, university, college, degree,
  field_of_study, academic_year, graduation_year, avatar_url, availability,
  skills, interests, availability_preferences, experiences, education,
  portfolio_projects, certifications, social_links, is_public
) on public.student_profiles to authenticated;

create policy "Owners can read their student profile"
  on public.student_profiles for select to authenticated
  using ((select auth.uid()) = user_id);

create policy "Public student profiles are discoverable"
  on public.student_profiles for select to anon, authenticated
  using (is_public);

create policy "Students can create their own profile"
  on public.student_profiles for insert to authenticated
  with check (
    user_id = (select auth.uid())
    and exists (
      select 1 from public.profiles p
      where p.id = (select auth.uid()) and p.role = 'student'::public.account_role
    )
  );

create policy "Students can update their own profile"
  on public.student_profiles for update to authenticated
  using (
    user_id = (select auth.uid())
    and exists (
      select 1 from public.profiles p
      where p.id = (select auth.uid()) and p.role = 'student'::public.account_role
    )
  )
  with check (
    user_id = (select auth.uid())
    and exists (
      select 1 from public.profiles p
      where p.id = (select auth.uid()) and p.role = 'student'::public.account_role
    )
  );

create function public.set_student_profile_updated_at()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  new.updated_at := pg_catalog.now();
  return new;
end;
$$;

revoke all on function public.set_student_profile_updated_at() from public, anon, authenticated;

create trigger set_student_profile_updated_at
  before update on public.student_profiles
  for each row execute function public.set_student_profile_updated_at();
