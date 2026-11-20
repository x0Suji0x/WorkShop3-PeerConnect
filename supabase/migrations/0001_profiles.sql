create type public.account_role as enum ('student', 'client');

create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  role public.account_role,
  full_name text,
  company_name text,
  avatar_url text,
  created_at timestamptz not null default now()
);

alter table public.profiles enable row level security;
create policy "Users can read own profile" on public.profiles for select to authenticated using ((select auth.uid()) = id);
create policy "Users can update own profile" on public.profiles for update to authenticated using ((select auth.uid()) = id) with check ((select auth.uid()) = id);
revoke update on public.profiles from authenticated;
grant update (full_name, company_name, avatar_url) on public.profiles to authenticated;
grant select on public.profiles to authenticated;

create function public.handle_new_user() returns trigger
language plpgsql security definer set search_path = '' as $$
declare raw_role text := new.raw_user_meta_data ->> 'role';
begin
  insert into public.profiles (id, role, full_name, company_name, avatar_url)
  values (
    new.id,
    case when raw_role in ('student', 'client') then raw_role::public.account_role else null end,
    coalesce(new.raw_user_meta_data ->> 'full_name', new.raw_user_meta_data ->> 'name'),
    new.raw_user_meta_data ->> 'company_name',
    coalesce(new.raw_user_meta_data ->> 'avatar_url', new.raw_user_meta_data ->> 'picture')
  );
  return new;
end;
$$;

create trigger on_auth_user_created after insert on auth.users for each row execute procedure public.handle_new_user();

create function public.choose_role(new_role public.account_role) returns public.account_role
language plpgsql security definer set search_path = '' as $$
declare chosen public.account_role;
begin
  update public.profiles set role = new_role where id = auth.uid() and role is null returning role into chosen;
  if chosen is null then raise exception 'Role has already been selected or profile is unavailable'; end if;
  return chosen;
end;
$$;
revoke all on function public.choose_role(public.account_role) from public;
grant execute on function public.choose_role(public.account_role) to authenticated;
