# Supabase data migration plan

Authentication, account profiles, student profiles, projects, marketplace applications and shortlists, and manual verification requests are implemented with Supabase. Keep future migrations incremental: define ownership and RLS, test cross-account access, wire the UI, verify reload behavior, then remove that feature's browser-storage path.

## Persisted in Supabase

- `profiles` stores account role, name, company name, avatar, and the admin-managed verification flag. Account roles are `student` or `client`.
- `student_profiles` stores student onboarding and profile details. Profiles are private unless the student enables public discovery.
- `projects` stores client-owned drafts and published listings.
- `applications` stores marketplace applications and their status transitions, including shortlists.
- `verification_requests` stores the review request and decision. Only verification admins can make a decision; the approved-only `verified_users` result exposes account IDs and badge type.

## Still illustrative or browser-only

- Marketplace project fixtures and sample talent profiles, ratings, and reviews are illustrative content.
- College event, volunteer, and club applications still use browser storage and do not sync across devices or accounts.
- Verification has no admin screen or document upload. A person must review each request using the SQL workflow in [verification-admin.md](verification-admin.md). Email confirmation alone does not create a verified badge.
- Project editing and closing are not available yet. The demo-banner dismissal is a session-level presentation preference.

## Next data areas

If campus features are brought into the persistence scope, migrate event, volunteer, and club applications one feature at a time. Ratings and reviews also need a defined source and moderation model before they can represent real work history.

Never put a service-role key, database password, OAuth secret, or signing key in frontend code or a `VITE_*` variable. The browser uses only the publishable/anon key; authorization depends on RLS and trusted database operations.
