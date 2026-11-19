# Phase 5: backend and authentication plan

This plan is for a later production phase. The current React app remains a frontend prototype; this document does not add a backend or change authentication.

## Recommended backend: Supabase

Use Supabase Auth and managed PostgreSQL, with Row Level Security (RLS) enabled on every user-facing table. It fits the relational shape of PeerConnect: student and employer profiles relate to projects, applications, and shortlists. PostgreSQL constraints and transactions help keep application ownership and status changes consistent, while RLS keeps access rules close to the data.

| Option | Benefits | Tradeoffs |
| --- | --- | --- |
| **Supabase (recommended)** | Managed Postgres, Auth, RLS, migrations, and generated TypeScript types in one service; SQL suits the project/application relationships. | RLS needs careful policy design and tests; hosted service limits and pricing need review; avoid exposing the service role key. |
| Firebase | Fast setup, managed Auth, realtime listeners, mature client SDKs. | Firestore’s document model is less natural for relational applications and status transitions; security rules and query constraints need careful duplication. |
| Custom Node.js + PostgreSQL API | Full control of authorization, workflows, deployment, and integrations. | More engineering and operational work: API hosting, authentication/session design, migrations, monitoring, backups, and patching. |

Keep business rules behind a small repository/service boundary in the React app. Use the Supabase anon key only in the browser; server-only credentials must never ship to the client.

## Authentication plan

1. Use Supabase Auth email/password first. Add Google OAuth only after callback URLs, account linking, and consent flows are defined.
2. Add password reset, email verification, sign-out, session expiry handling, and clear account recovery states.
3. Protect student, employer, and dashboard routes. Derive authorization from the authenticated user and database role; never trust the URL query, local storage, or a client-supplied role as permission.
4. Remove the any-password sign-in handlers. A demo entry must be a separate **Try demo** action that signs into a seeded, non-production account with read-only or resettable sample data. Keep it disabled in production unless explicitly configured.
5. Store sessions using the provider’s supported secure flow. Do not store passwords or privileged tokens in local storage.

## Initial data model

- **users**: auth user ID, role (`student` or `employer`), display name, creation/update timestamps. The auth provider remains the source of credentials.
- **student_profiles**: user ID, headline, college, degree, graduation year, bio, availability, public portfolio fields, visibility, and verification state. Keep private contact details out of public profile responses.
- **employer_profiles**: user ID, company name, website, business description, and review/verification state.
- **projects**: employer owner ID, title, description, budget/currency, work mode, timeline, skills, status, and timestamps.
- **applications**: project ID, student ID, proposal, status (`submitted`, `shortlisted`, `rejected`, `accepted`, or withdrawn), and timestamps. Enforce one application per student per project with a unique constraint.
- **shortlists**: project ID, employer ID, student ID, note and timestamps. Enforce a unique project/student pair and verify that the employer owns the project.

Use foreign keys, check constraints, and indexes for ownership and common list filters. Keep audit fields for status transitions and verification changes; do not treat a profile badge as proof until a trusted verification workflow exists.

### RLS policy outline

- Enable RLS on all six tables before exposing any table to the client.
- A user can read and update only their own `users` row and profile row. Public talent discovery returns only fields explicitly marked public; private email, phone, and identity evidence remain owner-only.
- Anyone may read published/open projects. Only the owning employer may create, update, close, or delete a project.
- An authenticated student may create an application for themselves on an open project. Students may read and withdraw their own applications, but cannot set review status.
- The employer who owns the related project may read its applications and change allowed review states. Other employers and students cannot read those applications.
- Only the employer who owns the related project may manage its shortlist. A student may see only a shortlist state intended to be visible to them, not private employer notes.
- Verification evidence should use private storage with narrowly scoped, expiring access. RLS alone does not secure public object URLs.

Write policy tests for anonymous access, cross-user reads, forged IDs, ownership changes, and each allowed status transition before launch.

## Migration order

1. **Student profile edits**: add authenticated profile reads/updates; migrate session-only mock updates to the database; confirm reload behavior; then remove the session mock repository path and any profile state cache that becomes redundant.
2. **Project drafts**: add employer-owned project create/edit/publish/archive; then remove the in-memory `ClientDashboardView` project mutations and the screen-only `NewProjectPage` draft path.
3. **Applications and status**: move submission, withdrawal, and status transitions to the API/database; add ownership and uniqueness constraints; then remove `peerconnect_applications_v1` and its browser storage helper.
4. **Shortlisting and client review**: query applications by owned project and persist shortlist decisions; then remove local shortlist derivation and local review state. Do not migrate client review until employer authorization is enforced server-side.
5. **Verification last**: select a real provider and consent/data-retention model; persist server-authoritative status and audit events; then remove demo verification states and any local status simulation.

For each migration, ship the server-backed path, verify it, and only then delete the old browser-storage path. Current keys found in the repo include `peerconnect_applications_v1`, `peerconnect_active_role`, `peerconnect_client_auth`, and `peerconnect_submitted_applications`; remove each only when its corresponding source of truth has migrated. `peerconnect_demo_banner_dismissed_v1` is a session-only presentation preference and can remain or be removed independently.

## Security checklist

- No Supabase service-role key, database password, OAuth secret, or signing key in frontend code or Vite `VITE_*` variables.
- RLS enabled and tested for every table and storage bucket; default is deny.
- Validate input on the server/database boundary, including IDs, URLs, text lengths, budget ranges, status transitions, and uploaded file type/size.
- Rate-limit sign-in, password reset, application submission, messaging, and verification endpoints; add abuse monitoring.
- Protect private student contact details and verification documents; collect only what the feature needs and define deletion/retention.
- Use HTTPS, secure session handling, CSRF protections where applicable, safe redirect allowlists, and strict CORS configuration.
- Add audit records for employer review and verification actions; avoid logging passwords, tokens, private messages, or identity evidence.
- Review dependency updates, backups, incident response, and data export/deletion processes before public release.

## Open questions before implementation

1. Is PeerConnect launching only for Indian colleges, or should the data model and policies support multiple countries from day one?
2. Should student profiles be public by default, discoverable only after opt-in, or visible only to signed-in employers?
3. Which exact fields can an employer see before a student applies, and when may direct contact details be revealed?
4. Will PeerConnect handle payments/escrow, or will payment agreements and transfers happen outside the product?
5. What constitutes employer verification, who reviews it, and which evidence must be retained?
6. Should a demo account be available in production, and if so, what data and actions must be read-only or reset?
7. What organization name, support email, privacy contact, retention period, and jurisdiction belong in the final policies?
8. Which Google OAuth project, callback domains, and production hosting environment will be used, if Google sign-in is approved?
