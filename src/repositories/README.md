# Student profile repository boundary

Student-facing pages use the `StudentRepository` contract instead of reading profile data sources directly.

`StudentRepository` keeps profile pages independent of the storage backend. `MockStudentRepository` backs the illustrative sample profile. `SupabaseStudentRepository` loads and saves the signed-in student's `public.student_profiles` row and lists only profiles whose owner enabled `is_public`.

## Student profile field mapping

| App field | Supabase field | Notes |
| --- | --- | --- |
| `name` | `display_name` | Display name duplicated from the private account name so public profiles can be read without exposing `profiles`. |
| `headline`, `bio` / `about` | `headline`, `bio` | About and bio share the same text field. |
| `university`, `college`, `degree`, `fieldOfStudy`, `academicYear`, `graduationYear` | `university`, `college`, `degree`, `field_of_study`, `academic_year`, `graduation_year` | Education is self-reported. |
| `avatarUrl` | `avatar_url` | The student-provided image URL is public only after publication. |
| `skills`, `interests`, `availability`, `availabilityPreferences` | `skills`, `interests`, `availability`, `availability_preferences` | Lists and preferences are JSONB. Onboarding preferences retain all eight options. |
| `experiences`, `education`, `portfolioProjects`, `certifications`, `socialLinks` | same-named JSONB fields (snake case in SQL) | Self-reported profile content. |
| `isPublic` | `is_public` | Off by default; the directory only queries published profiles. |
| `featuredWork` | derived from first `portfolioProjects` item | No duplicate column. |

Auth email, phone, passwords, college email, selected document filenames, and verification state are intentionally not copied into this table. Approved badge state comes from the approved-only `public.verified_users` result; ratings, reviews, work counters, Plus status, and cover images remain illustrative or belong to later feature work. The database table contains only fields intended to be shown in a public profile; its row policies limit reads to the owner or explicitly published rows.

## Project field mapping

`ProjectRepository` keeps project pages independent from Supabase details. `SupabaseProjectRepository` is the active backend for drafts, published listings, project details, and the client dashboard.

| App field | `public.projects` field | Notes |
| --- | --- | --- |
| `id`, owner | `id`, `owner_id` | UUID and authenticated client owner. RLS checks the owner and the `client` role. |
| `title`, `description` | same-named columns | User-provided project brief. |
| `clientName`, `clientType`, `clientLocation` | `client_name`, `client_type`, `client_location` | Public-safe snapshots included in the project row; no join to private account profiles. |
| `budget`, `budgetType` | `budget_amount`, `budget_type` | Stored as INR amount and one of the supported schedule types. |
| `duration`, `hoursPerWeek`, `skillsRequired` | `duration`, `hours_per_week`, `skills_required` | Scope and skill details. |
| `category`, `workMode`, `deadline`, `deliverables` | same-named fields in snake case | Optional brief metadata. |
| `status` | `status` | `draft`, `published`, or `closed`; only published rows are publicly readable. |
| `createdAt`, `updatedAt` | `created_at`, `updated_at` | `updated_at` is set by a database trigger. |
| `postedTimeAgo` | derived from `created_at` | Display-only relative time. |
| `applicantsCount` | not stored on `projects` | Account project rows still report zero here; real application records and status are stored separately in `public.applications`. |
| `badge`, `clientLogo` | not stored | No fake urgency, featured, verification, or logo value is generated for account projects. |

The project browser keeps the existing fixture rows as clearly marked samples. Marketplace applications and shortlists are stored in Supabase. College event, volunteer, and club applications still use browser-only prototype storage.
