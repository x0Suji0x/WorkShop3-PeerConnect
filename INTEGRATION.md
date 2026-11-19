# Archived: PeerConnect Student Communities & Team Finder Module

This guide describes an earlier isolated implementation in `src/features/community-team-finder/`. That directory was removed because the running application uses the active pages under `src/pages/Communities` and `src/pages/TeamFinder`. The import paths and integration steps below are historical and are not usable with the current codebase.

---

## Historical Integration Guide
## Integration Guide & Module Specification for Kritagya

This document outlines the architecture, routes, recommendation logic, components, and integration steps for the **AI-powered Student Communities and Team Finder** module.

---

### 1. Module Overview & Isolation

All new code has been authored in an isolated, self-contained feature directory:
`src/features/community-team-finder/`

Shared application files have **not** been modified:
- `src/App.tsx` (Untouched)
- `src/app/routes.ts` (Untouched)
- `src/components/layout/Navbar.tsx` (Untouched)
- `src/components/layout/AppShell.tsx` (Untouched)
- `src/components/layout/Footer.tsx` (Untouched)
- `src/styles/index.css` (Untouched)
- `package.json` (0 new npm dependencies added)

---

### 2. Exact Route Lines to Wire into Global Routing

Kritagya, to connect this module to the global routing tree in [src/App.tsx](file:///Users/jheelsantani/empty_folder/WorkShop3-PeerConnect/src/App.tsx) and [src/app/routes.ts](file:///Users/jheelsantani/empty_folder/WorkShop3-PeerConnect/src/app/routes.ts):

#### A. In `src/app/routes.ts`:
```typescript
// Add or verify communityRoutes:
export const communityRoutes = {
  communities: '/communities',
  communityDetail: '/communities/:slug',
  myCommunities: '/my-communities',
  teamFinder: '/team-finder',
  teamDetail: '/team-finder/:teamId',
  newTeam: '/team-finder/new',
  teamBuilder: '/team-finder/builder',
} as const

export const communityDetailRoute = (slug: string) => `/communities/${slug}`
export const teamDetailRoute = (id: string) => `/team-finder/${id}`
```

#### B. In `src/App.tsx`:
```typescript
// 1. Import pages from the feature directory:
import {
  CommunitiesPage,
  CommunityDetailPage,
  MyCommunitiesPage,
  TeamFinderPage,
  TeamDetailPage,
  NewTeamPage,
  TeamBuilderPage,
} from './features/community-team-finder'

// 2. Add these route elements inside <Routes>:
<Route path={communityRoutes.communities} element={<CommunitiesPage />} />
<Route path={communityRoutes.communityDetail} element={<CommunityDetailPage />} />
<Route path="/my-communities" element={<MyCommunitiesPage />} />
<Route path={communityRoutes.teamFinder} element={<TeamFinderPage />} />
<Route path={communityRoutes.newTeam} element={<NewTeamPage />} />
<Route path={communityRoutes.teamBuilder} element={<TeamBuilderPage />} />
<Route path={communityRoutes.teamDetail} element={<TeamDetailPage />} />
```

Alternatively, to mount the entire module at once as a sub-router:
```typescript
import { CommunityTeamFinderApp } from './features/community-team-finder'

// Inside <Routes>:
<Route path="/communities-app/*" element={<CommunityTeamFinderApp />} />
```

---

### 3. File Directory & Artifacts Created

```
src/features/community-team-finder/
├── types/
│   └── index.ts                     # TypeScript data models for communities, posts, teams, AI matching
├── data/
│   ├── communitiesData.ts          # 12 Interest circles, guidelines, categories, member rosters
│   ├── discussionsData.ts          # Realistic posts, pinned announcements, threaded replies
│   └── teamFinderData.ts           # Team recruitment posts & student candidate matching profiles
├── engine/
│   └── recommendationEngine.ts     # Transparent rule-based AI recommendation & teammate matching engine
├── components/
│   ├── CommunityCard.tsx           # Directory card with cover, emoji, activity dot, live join toggle
│   ├── CommunityRecommendationCard.tsx # AI match badge, calculated %, transparent reasoning
│   ├── DiscussionPostCard.tsx      # Post card with author link, likes, threaded replies, tags
│   ├── CreatePostModal.tsx         # Modal for discussions with topic chips and announcements
│   ├── TeamPostCard.tsx            # Squad recruitment post with roles preview, capacity, deadline
│   ├── StudentMatchCard.tsx        # AI candidate match card with skill chips, why-matched box, invite action
│   └── ApplicationForm.tsx         # Apply form with target role dropdown, availability, pitch note
├── pages/
│   ├── CommunitiesPage.tsx         # Directory with search, category filters, AI recommendation shelf
│   ├── CommunityDetailPage.tsx     # Hub with tabs (Discussions, Member directory, Guidelines/Charter)
│   ├── MyCommunitiesPage.tsx       # Joined circles overview and aggregated multi-circle activity stream
│   ├── TeamFinderPage.tsx          # Multi-faceted squad search (category, remote/hybrid/on-campus format, open)
│   ├── TeamDetailPage.tsx          # Project brief, roles, squad roster, lead review controls, AI teammate shelf
│   ├── TeamBuilderPage.tsx         # AI Squad Architect with concept decomposition & 1-click conversion to post
│   └── NewTeamPage.tsx             # Collaboration post creator with dynamic role builder (supports pre-fill)
├── CommunityTeamFinderRoutes.tsx   # Standalone router & route constants
└── index.ts                        # Unified public module export
```

---

### 4. AI Recommendation & Matching Logic Explained

All matching algorithms are implemented in `src/features/community-team-finder/engine/recommendationEngine.ts`. The implementation is strictly deterministic, transparent, and modular so real embedding or LLM APIs can be introduced later without changing UI consumers.

#### 1. Community Recommendation (`recommendCommunities`)
Recommends up to 5 non-joined student communities based on:
- **Direct Skill Overlap ($20\text{ pts per match}$):** Compares the student's listed skills against the community's keyword dictionary.
- **Interest Alignment ($15\text{ pts per match}$):** Compares the student's stated interests against community topics.
- **Academic Major Affinity ($25\text{ pts bonus}$):** Identifies curriculum synergy (e.g., *Interaction Design* yields an affinity for *UI/UX Design* and *Graphic Design*; *Computer Science* yields an affinity for *AI/ML*, *Web Dev*, and *Cybersecurity*).
- **Career Goals ($15\text{ pts bonus}$):** Rewards alignments with hackathons, venture startups, or paid engineering projects.

$$\text{matchScore} = \min\left(99, \max\left(25, \operatorname{round}(\text{skillScore} + \text{interestScore} + \text{academicScore} + \text{goalScore})\right)\right)$$

Every recommendation generates an honest, human-readable reason string (e.g., *"Aligned with your studies in Interaction Design and your skills in Figma and Design Systems."*).

#### 2. Teammate Matching (`matchTeammates`)
Ranks peer candidates for open projects:
- **Required Skill Overlap (up to $60\text{ pts}$):**
  $$\text{skillScore} = \operatorname{round}\left(\frac{|\text{matchedSkills}|}{\max(|\text{requiredSkills}|, 1)} \times 60\right)$$
- **Collaboration Format Alignment ($10\text{ to }15\text{ pts}$):** Full points for matching preferences (Remote / Hybrid / On-Campus).
- **Complementary Skills ($5\text{ pts per skill, up to }15\text{ pts}$):** Rewards auxiliary competencies like Git, Docker, Testing, or Design Systems.
- **Availability ($8\text{ to }10\text{ pts}$):** Rewards high-capacity commitments during hackathons or sprint breaks.

#### 3. AI Project Team Builder (`suggestTeamRoles`)
Decomposes natural language project descriptions into:
- Core and optional roles with required skill sets.
- Target communities where those specialists actively participate.
- Includes a 1-click **"Post This Project Now"** action passing structured state to `NewTeamPage`.

---

### 5. Collaboration Management Workflow

1. **Creating Posts (`/team-finder/new`):**
   Students can specify title, category, format (Remote, On-Campus, Hybrid), deadline, target squad size, required skill tags, and dynamic role specifications. Can be pre-filled automatically by the AI Team Builder.
2. **Applying to Squads (`/team-finder/:teamId`):**
   Students select an open role, specify weekly availability (e.g., 10-15 hrs/week), and write a contextual pitch.
3. **Project Lead Controls:**
   On the team detail page, project leads can view pending applications with applicant college and profile links. Clicking **"Accept & Add to Squad"** marks the application accepted, appends the student to `currentMembers`, marks the corresponding role as filled, and recalculates remaining capacity.

---

### 6. Design & UX System Conformity

- Follows PeerConnect's established palette (`#171916` ink, `#08C58A` / `#08A876` emerald accents, `#FAF8F5` background, `#E7E8E1` borders).
- Responsive layouts across desktop, tablet, and mobile.
- Clear empty states, hover micro-interactions, and accessible form controls.
- Author avatars and names link directly to student profiles (`/profiles/:id`).

---

### 7. Build and Lint Verification

- **Linter (`oxlint`):** Passed with 0 errors and 0 warnings.
- **TypeScript & Vite build (`tsc -b && vite build`):** Passed with clean compilation.

