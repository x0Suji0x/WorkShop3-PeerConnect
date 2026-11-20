# PeerConnect

PeerConnect is a React + TypeScript student talent and project collaboration prototype, built with Vite, React Router, Tailwind CSS, and Supabase Auth.

## Current implementation boundary

- **Authentication is real Supabase Auth.** Email/password and Google OAuth use Supabase. The account role is `student` or `client` and comes from the Supabase profile, not a URL or browser setting.
- **Student profiles are persisted to Supabase.** Onboarding and profile edits save to `public.student_profiles`. Profiles are private by default; students can opt into public discovery. The public profile fields contain no email or phone number.
- **Projects are persisted to Supabase.** Client-owned drafts remain private until published; published account projects appear alongside clearly labeled sample listings. Editing and closing a project are not available yet.
- **Marketplace applications and shortlists are persisted to Supabase.** Students can track application status, and project owners can review applicants and shortlist them. College event, volunteer, and club applications remain saved only in the current browser/device.
- **Verification requests are persisted to Supabase and reviewed manually.** Only an admin-approved request produces a verified badge. Email confirmation and Google sign-in do not establish student enrollment or company identity. There is no admin review screen or document upload yet; admins are configured and review requests through the documented SQL workflow.
- **Sample content remains illustrative.** Marketplace listings, sample talent profiles, ratings, and reviews are not real user submissions or evidence of verified work.

The shared demo notice describes these limits in the app. Verification notes are visible to the account owner and verification admins; avoid entering sensitive identity numbers or other unnecessary personal information.

## Local development

Requirements: Node.js and npm.

```bash
npm ci
cp .env.example .env.local
# Add VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY to .env.local.
npm run dev
```

The dev server is available at [http://localhost:5173](http://localhost:5173). Supabase project setup, migrations, email, Google OAuth, and smoke checks are documented in [docs/supabase-setup.md](docs/supabase-setup.md).

Useful routes:

- `/` — public landing page
- `/get-started` — browse-first student/client chooser
- `/profiles` — public student profiles and clearly labeled sample profiles
- `/projects` — published Supabase projects and labeled sample listings
- `/signup/student` — student account and onboarding flow
- `/signin` — sign in or register a client account
- `/dashboard` — authenticated student or client dashboard
- `/terms` and `/privacy` — draft policies pending legal review

## Checks

```bash
npm run build
npm test
npm run lint
```

The app handles missing Supabase environment variables without crashing; protected routes show a clear configuration message. Do not add the Supabase `service_role` key to client code or any `VITE_*` variable.
