# Supabase data migration plan

Supabase Auth is implemented: email/password sign-in and sign-up, Google OAuth, recovery, role selection, session handling, and protected routes are in place. The `profiles` table currently stores the account role and basic name/company/avatar fields. The rest of the product data still uses prototype behavior, including browser storage and in-memory state.

The next phase is to move one data area at a time to Supabase tables. For each area, add and test its schema, ownership rules, and RLS policies; wire the UI to the Supabase repository; verify reload and cross-account behavior; then remove that area's localStorage or in-memory path. Do not remove browser behavior before its replacement works.

## Migration order

1. **Extended profiles**: move student details such as college, skills, bio, availability, and portfolio fields, plus client/company details, into appropriately scoped profile tables or columns. Keep public discovery limited to explicitly public fields. Remove the corresponding profile localStorage and in-memory edit paths after the database flow is verified.
2. **Projects**: add client-owned project creation, editing, publishing, closing, and listing. Enforce ownership in RLS. Replace project drafts and dashboard-only project mutations, then remove their localStorage/in-memory paths.
3. **Applications**: persist student submissions and their status transitions. Enforce one application per student per project and allow only authorized parties to read or update each record. Remove the marketplace and event/volunteer browser-storage application paths when their Supabase-backed flows are ready.
4. **Shortlists**: persist client shortlisting decisions and private notes, validating ownership through the related project. Remove local shortlist derivation and browser review state once server-side authorization is active.
5. **Verification**: define a real review process, evidence retention rules, and access controls before adding trusted verification state. Store evidence privately and audit decisions. Remove simulated statuses and any local verification state only after the real workflow is operating.

Keep each migration narrow and reversible. Add database constraints and policy tests for anonymous access, cross-user reads, forged IDs, ownership changes, and allowed status transitions before launch. The demo-banner dismissal is only a session-level presentation preference and is not account data.

## Current boundaries

- Authentication and account roles use Supabase Auth and `public.profiles`; roles are `student` or `client` and are never inferred from a URL query or local storage.
- Projects, applications, shortlists, extended profile details, and verification are not fully persisted in Supabase yet. Their current browser or in-memory behavior is temporary and should be labeled honestly in the UI.
- Supabase Auth does not verify student enrollment, a business, skills, work history, or portfolio ownership. Those require a separate trusted verification workflow.
- The browser uses only the publishable/anon key. Never put a service-role key, database password, OAuth secret, or signing key in frontend code or a `VITE_*` variable.

## Decisions still needed before the related migrations

1. Should student profiles be discoverable by signed-in clients only, or public by opt-in?
2. Which profile fields can clients see before a student applies, and when may contact details be revealed?
3. What exact verification process and evidence retention policy should PeerConnect use?
4. Which organization name, support email, privacy contact, retention period, and jurisdiction belong in finalized policies?
5. What production domains and hosting environment should be used for OAuth redirects?
