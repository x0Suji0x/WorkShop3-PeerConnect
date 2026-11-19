# Student profile repository boundary

Student-facing pages use the `StudentRepository` contract instead of reading profile data sources directly.

`MockStudentRepository` is the active implementation for public sample browsing. Its edits live in memory and reset on reload. A signed-in student gets a separate, blank account draft in `StudentProfileProvider`; that draft is also in memory. Only the account `full_name` is currently written to the Supabase `profiles` row.

When profile persistence is implemented, add a `SupabaseStudentRepository` that uses the existing Supabase client and approved profile tables. Keep the current contract so page components do not depend on a backend-specific API. Do not add an Express server or treat sample profiles as signed-in users' data.
