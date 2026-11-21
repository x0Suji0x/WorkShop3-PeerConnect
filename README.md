# PeerConnect

[Open PeerConnect on Vercel](https://work-shop3-peer-connect.vercel.app/)

PeerConnect helps students showcase their work and apply to projects. Clients can publish project briefs and review applicants. The app uses React, TypeScript, Vite, React Router, Tailwind CSS, and Supabase.

## How data is stored

- **Authentication is real Supabase Auth.** Email/password and Google OAuth use Supabase. Signup creates a base account record in `public.profiles`. Its `student` or `client` role determines the dashboard.
- **Student profiles are persisted to Supabase.** Onboarding and profile edits save to `public.student_profiles`. Profiles are private by default; students can opt into public discovery. The public profile fields contain no email or phone number.
- **Projects are persisted to Supabase.** Client-owned drafts remain private until published; published account projects appear alongside clearly labeled sample listings. Editing and closing a project are not available yet.
- **Marketplace applications and shortlists are persisted to Supabase.** Project owners can shortlist, accept, or reject applicants. Students can withdraw a submitted or shortlisted application. Accepted, rejected, and withdrawn applications are final. College event, volunteer, and club applications remain saved only in the current browser/device.
- **Verification requests are persisted to Supabase and reviewed manually.** Only an admin-approved request produces a verified badge. Email confirmation and Google sign-in do not establish student enrollment or company identity. There is no admin review screen or document upload yet; admins are configured and review requests through the [verification admin guide](docs/verification-admin.md).
- **Sample content remains illustrative.** The directory and project browser include labeled sample entries alongside account data. Sample ratings and reviews are illustrative, and Student Plus checkout is a demo.

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

## Vercel deployment

Set `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` in the Vercel project’s Production environment and redeploy so Vite includes them in the build. The SPA rewrite in [vercel.json](vercel.json) serves the app when someone opens a deep link such as `/auth/callback`. Configure the production origin and allowed auth redirects using the [Supabase setup guide](docs/supabase-setup.md).

## Checks

```bash
npm run build
npm test
npm run lint
```

The app handles missing Supabase environment variables without crashing; protected routes show a clear configuration message. Do not add the Supabase `service_role` key to client code or any `VITE_*` variable.
