# Supabase authentication setup

1. Create a Supabase project. Copy its Project URL and publishable (anon) key into a local `.env.local` created from `.env.example`. Never use or expose the `service_role` key in the browser.
2. In the Supabase SQL Editor, run `supabase/migrations/0001_profiles.sql`.
3. Enable Email under Authentication → Providers and require email confirmation. Set the minimum password length to at least 8. Set Site URL to `http://localhost:5173` and add redirect URLs `http://localhost:5173/auth/callback` and `http://localhost:5173/auth/reset-password` (add the production domain when deployed). Supabase's built-in sender is heavily rate-limited; configure custom SMTP before real users.
4. In Google Cloud Console, create a project, configure OAuth consent, and create an OAuth client ID of type Web application. Add JavaScript origin `http://localhost:5173` (and production later). Add redirect URI `https://<PROJECT-REF>.supabase.co/auth/v1/callback`. In Supabase Authentication → Providers → Google, paste the client ID and secret and enable Google.
5. Inspect accounts and authentication logs in Authentication → Users and Logs. Run `supabase/queries/user-stats.sql` in the SQL Editor for aggregate sign-in statistics.
6. Manual checks: register a student and confirm email; register a client; reject a wrong password; sign in with Google as a new user and choose a role once; verify signed-out `/dashboard` redirects; verify a student cannot open client-only pages; attempt `supabase.from('profiles').update({role:'client'})` as a student and confirm it fails.
7. Supabase may link accounts that share a verified email. Email confirmation and Google sign-in do not prove student enrollment or that a company is real. Verification is a separate feature and must remain described as not implemented.

Student onboarding details beyond the account name remain in memory for this prototype; applications, projects, shortlists, verification, payments, and student profile persistence are out of scope for the current implementation.
