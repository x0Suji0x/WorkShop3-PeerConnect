# Supabase setup for PeerConnect

This guide configures Supabase Auth and the persisted profile, project, application, shortlist, and manual verification features for local development. College event, volunteer, and club applications remain browser-only; see the README for current boundaries.

## 1. Create a Supabase project

Create a project in the Supabase dashboard and wait for the database to finish provisioning. Keep the project password and other secrets in a password manager.

## 2. Add the browser-safe project settings

In the project dashboard, open **Project Settings → API** (the API keys page may be labelled **Data API** in a newer dashboard). Copy the **Project URL** and the **publishable key** (or legacy `anon` key).

Create `.env.local` in the repository root by copying `.env.example`. Set:

```dotenv
VITE_SUPABASE_URL=https://<PROJECT-REF>.supabase.co
VITE_SUPABASE_ANON_KEY=<YOUR-PUBLISHABLE-OR-ANON-KEY>
```

The publishable/anon key is intended for the browser and relies on Row Level Security. **Never put the `service_role` key in `.env.local`, a `VITE_*` variable, source code, or a browser.** Restart `npm run dev` after changing environment variables.

## 3. Create the application tables and policies

Open **SQL Editor → New query**. Run these files in order, using the project owner/editor connection:

1. `supabase/migrations/0001_profiles.sql`
2. `supabase/migrations/0002_harden_profiles.sql`
3. `supabase/migrations/0003_student_profiles.sql`
4. `supabase/migrations/0004_projects.sql`
5. `supabase/migrations/0005_applications.sql`
6. `supabase/migrations/0006_verification.sql`

The first migration creates the account profile and one-time role-selection RPC. The next migrations add private-by-default student profiles, client-owned projects, marketplace applications, and manual verification. Each table has explicit grants and RLS policies. Do not run these migrations through the browser app. The matching rollback-only policy checks live under `supabase/tests/`.

## 4. Configure email authentication and redirects

Open **Authentication → Sign In / Providers → Email** (labels may vary slightly by dashboard version):

1. Enable Email sign-in and require email confirmation.
2. Set the minimum password length to at least 8 characters.
3. Under **URL Configuration**, set the local **Site URL** to the development origin you will use, for example `http://localhost:5173`.
4. Add these **Redirect URLs** for development:
   - `http://localhost:5173/**`
   - `http://127.0.0.1:5173/**`
   - `http://localhost:5173/auth/reset-password`
   - `http://127.0.0.1:5173/auth/reset-password`
5. In production, add the exact `https://<your-domain>/auth/callback` URL and a wildcard variant such as `https://<your-domain>/**` so confirmation and recovery links with query strings can return to the app.

Sign-up confirmation links include a `?next=` query string. If confirmation emails land on the site root instead of the callback page, check the Supabase Redirect URL allow-list first. `localhost` and `127.0.0.1` are different origins; choose one for local development and use it consistently in the app and dashboard configuration.

The built-in email sender is heavily rate-limited and is meant for evaluation. Configure custom SMTP before inviting real users, and verify delivery, sender reputation, and rate limits.

## 5. Configure Google OAuth (optional)

In **Google Cloud Console**:

1. Create or select a Google Cloud project.
2. Open **Google Auth Platform → Branding/Audience** (previously the OAuth consent screen) and configure the consent details and test users as needed. While the consent screen is in **Testing** mode, only listed test users can sign in.
3. Open **Clients → Create client → Web application**.
4. Add the same local origin you chose above (either `http://localhost:5173` or `http://127.0.0.1:5173`) as an **Authorized JavaScript origin**. Add the production origin later.
5. Add this **Authorized redirect URI**, replacing `<PROJECT-REF>` with the Supabase project reference:

   `https://<PROJECT-REF>.supabase.co/auth/v1/callback`

6. Copy the Google Client ID and Client Secret. In Supabase, open **Authentication → Providers → Google**, enable Google, and paste both values. Save.

The browser app redirects to `/auth/callback`; Google itself returns to Supabase's `/auth/v1/callback` endpoint. Keep the Google secret in Supabase, never in this repository or a `VITE_*` variable.

## 6. Inspect authentication data

- View accounts and confirmation status in **Authentication → Users**.
- Review authentication events and errors in **Logs** (or **Logs → Auth**, depending on the dashboard layout).
- For aggregate counts, run `supabase/queries/user-stats.sql` in the SQL Editor as a project administrator. It reads Supabase Auth tables and is for administrative use, not client-side queries.

## 7. Run a manual smoke check

With `.env.local` configured and `npm run dev` running, check:

1. Create a student account. Confirm the email and finish the student onboarding flow.
2. Create a client account and confirm the email.
3. Try a wrong password and check that the UI reports a generic sign-in error without saying whether an email is registered.
4. Sign in with Google as a new user, select one role, sign out, and sign in again. The returning account should keep its existing role and not be asked again.
5. Open `/dashboard` while signed out. It should redirect to `/signin?next=%2Fdashboard`.
6. Sign in as a student and open `/projects/new`. The page should explain that the route is for client accounts.
7. Sign in as a client, create a project draft, confirm it appears in the client dashboard after reload, then publish it and confirm it appears in `/projects` and its detail route.
8. While signed in as a student in the Vite dev app, try a direct profile role update from the browser console:

   ```js
   const { supabase } = await import('/src/lib/supabase.ts')
   const { data: { user } } = await supabase.auth.getUser()
   await supabase.from('profiles').update({ role: 'client' }).eq('id', user.id)
   ```

   The database should reject the direct role update. Role selection must go through `choose_role` and is allowed only while the stored role is null.

## 8. Security and verification notes

- Supabase may link identity providers that share a verified email. Review Supabase's account-linking behavior and decide whether it matches the product's policy.
- Email confirmation proves access to an email address. Google sign-in proves access to a Google account. Neither proves student enrollment, a real business, skills, work history, or portfolio ownership.
- Verification requests are reviewed manually; email confirmation and Google sign-in do not verify student enrollment or a business. Follow [verification-admin.md](verification-admin.md) to configure an admin and review requests. No document upload or admin UI is included.
- The browser app uses only the publishable/anon key. Authorization depends on database policies and the authenticated profile, never on a role query parameter or local storage.
