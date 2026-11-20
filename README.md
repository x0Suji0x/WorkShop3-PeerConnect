# PeerConnect

PeerConnect is a React + TypeScript student talent and project collaboration prototype, built with Vite, React Router, Tailwind CSS, and Supabase Auth.

## Current implementation boundary

- **Authentication is real Supabase Auth.** Email/password and Google OAuth use Supabase. The account role is `student` or `client` and comes from the Supabase profile, not a URL or browser setting.
- **Student profiles are persisted to Supabase.** Onboarding and profile edits save to `public.student_profiles`. Profiles are private by default; students can opt into public discovery. The public profile fields contain no email or phone number.
- **Projects are persisted to Supabase.** Client-owned drafts remain private until published; published account projects appear alongside clearly labeled sample listings. Editing and closing a project are not available yet.
- **Marketplace applications and shortlists are still prototype features.** They are saved only in this browser/device. The separate college event and volunteer applications also remain browser-only.
- **Verification is not implemented.** Email confirmation and Google sign-in do not establish student enrollment, company identity, skills, or portfolio ownership. Sample talent profiles, ratings, and reviews are illustrative content.

The shared demo notice describes these limits in the app. Avoid entering sensitive personal information in prototype features.

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
