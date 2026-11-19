-- Run in the Supabase SQL Editor as project owner. Never expose these queries in the client app.
-- Total registered users
select count(*) as total_users from auth.users;
-- Confirmed vs unconfirmed email
select (email_confirmed_at is not null) as email_confirmed, count(*) from auth.users group by 1;
-- Users by chosen role
select role, count(*) from public.profiles group by role;
-- Users by sign-in provider
select provider, count(distinct user_id) from auth.identities group by provider order by provider;
-- Signups per day for the last 30 days
select date_trunc('day', created_at)::date as signup_day, count(*) from auth.users where created_at >= now() - interval '30 days' group by 1 order by 1;
-- Users active in the last 7 days
select count(*) as active_users_last_7_days from auth.users where last_sign_in_at >= now() - interval '7 days';
-- Users who have not chosen a role
select count(*) as users_without_role from public.profiles where role is null;
