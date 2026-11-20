# Supabase data migration plan

Supabase Auth, extended student profiles, and core project persistence are implemented. The `profiles` table stores the account role and basic name/company/avatar fields. The `student_profiles` table stores onboarding and profile fields, with private-by-default opt-in discovery. The `projects` table stores client-owned drafts and published listings. Auth email, phone, passwords, and verification evidence are not copied into these feature tables.

The next phase is to move one data area at a time to Supabase tables. For each area, add and test its schema, ownership rules, and RLS policies; wire the UI to the Supabase repository; verify reload and cross-account behavior; then remove that area's localStorage or in-memory path. Do not remove browser behavior before its replacement works.

## Migration order

1. **Applications and shortlists**: persist student submissions and authorized status transitions. Enforce one application per student per project; let project owners review submissions and shortlist applicants. Remove the marketplace `applicationStorage` path after the Supabase flow is verified. The separate event/volunteer application flow remains browser-only and is out of scope for that phase.
2. **Verification**: implement manual review with admin-only decisions before showing any verified badge. Document the admin setup and keep evidence as plain text in the first version; do not imply email confirmation verifies identity.

Project creation, draft persistence, publishing, public listing/detail pages, and the client-owned dashboard list are implemented. Editing and closing project listings are not available yet.

Keep each migration narrow and reversible. Add database constraints and policy tests for anonymous access, cross-user reads, forged IDs, ownership changes, and allowed status transitions before launch. The demo-banner dismissal is only a session-level presentation preference and is not account data.

## Current boundaries

- Authentication and account roles use Supabase Auth and `public.profiles`; roles are `student` or `client` and are never inferred from a URL query or local storage.
- Student profile details, project drafts, and published project listings are persisted in Supabase. Marketplace applications and shortlists remain browser-only; verification is not implemented. The college event/volunteer applications remain in browser storage.
- Supabase Auth does not verify student enrollment, a business, skills, work history, or portfolio ownership. Those require a separate trusted verification workflow.
- The browser uses only the publishable/anon key. Never put a service-role key, database password, OAuth secret, or signing key in frontend code or a `VITE_*` variable.

## Decisions still needed before the related migrations

1. What exact verification process and evidence retention policy should PeerConnect use?
2. Which organization name, support email, privacy contact, retention period, and jurisdiction belong in finalized policies?
3. What production domains and hosting environment should be used for OAuth redirects?
