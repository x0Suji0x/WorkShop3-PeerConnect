# Verification admin workflow

Verification requests are manually reviewed. Adding an admin and reviewing a request requires access to the Supabase SQL Editor. Use a placeholder such as `you@example.com` below and replace it with the email on your own Supabase account only inside the SQL Editor. Never commit a real address or request evidence to this repository.

## Add an admin

Sign up and confirm the account first. Then run this in the Supabase SQL Editor:

```sql
insert into public.admins (user_id)
select id
from auth.users
where lower(email) = lower('you@example.com')
on conflict (user_id) do nothing;
```

If the command inserts no row, confirm that the account exists and the email matches. Do not grant admin membership to a user you have not verified independently.

## Review requests

List pending requests in the SQL Editor and confirm the submitted details through an appropriate independent source. The request fields are plain text; the prototype does not accept document uploads.

```sql
select id, user_id, kind, institution_or_company, official_email, evidence_notes, created_at
from public.verification_requests
where status = 'pending'
order by created_at;
```

Approve or reject by calling the admin-gated RPC. Set the request UUID and review note before running:

```sql
begin;
select set_config(
  'request.jwt.claims',
  json_build_object(
    'sub', (select id::text from auth.users where lower(email) = lower('you@example.com'))
  )::text,
  true
);
select public.review_verification(
  '00000000-0000-0000-0000-000000000000'::uuid,
  'approved',
  'Reviewed manually.'
);
commit;
```

Use `rejected` instead of `approved` when the request does not meet the review standard, and leave a concise note the user can act on. The RPC checks admin membership, updates the request and account verification state together, and allows only one review of a pending request. Only approved account IDs and badge types are visible through `verified_users`.

The current prototype has no admin review screen or file-upload workflow. Avoid copying sensitive identity numbers or unnecessary personal information into review notes.
