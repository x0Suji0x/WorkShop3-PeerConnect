revoke all on public.profiles from anon;
revoke insert, delete on public.profiles from authenticated;
revoke execute on function public.choose_role(public.account_role) from anon;
