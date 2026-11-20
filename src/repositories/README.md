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

Auth email, phone, passwords, college email, selected document filenames, and verification states are intentionally not copied into this table. Ratings, reviews, work counters, Plus status, and cover images remain illustrative or belong to later feature work. The database table contains only fields intended to be shown in a public profile; its row policies limit reads to the owner or explicitly published rows.
