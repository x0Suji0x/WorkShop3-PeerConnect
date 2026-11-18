# PeerConnect – Student Talent Marketplace & Collaboration Network

**PeerConnect** is a modern student talent marketplace and professional networking ecosystem connecting students, campus clubs, hackathons, college directories, startups, and clients.

---

## 🚀 Local Development Links

Once the development server is running (`npm run dev`), access PeerConnect locally at:

- **🏠 Main Application (Localhost):** [http://localhost:5173/](http://localhost:5173/)

### Quick Access Routes

| Route | Local URL | Description |
|---|---|---|
| **Landing Page** | [http://localhost:5173/](http://localhost:5173/) | Hero showcase, student talent highlights, marketplace preview |
| **Sign Up Landing** | [http://localhost:5173/signup](http://localhost:5173/signup) | Student & creator onboarding entry point |
| **Student Registration** | [http://localhost:5173/signup/student](http://localhost:5173/signup/student) | 6-step multi-step registration flow |
| **Sign In** | [http://localhost:5173/signin](http://localhost:5173/signin) | Student authentication with one-click demo access |
| **Student Dashboard** | [http://localhost:5173/dashboard](http://localhost:5173/dashboard) | Active metrics, verification status & momentum score |
| **Student Profile** | [http://localhost:5173/profiles/sofia-rodriguez](http://localhost:5173/profiles/sofia-rodriguez) | Public portfolio, skills, experience & verified identity |
| **Verification Centre** | [http://localhost:5173/verification](http://localhost:5173/verification) | Institutional email, phone, and portfolio verification signals |
| **Communities** | [http://localhost:5173/communities](http://localhost:5173/communities) | 12 student interest circles, filters & AI recommendations |
| **Community Detail** | [http://localhost:5173/communities/ai-ml](http://localhost:5173/communities/ai-ml) | Discussions feed, member roster, and guidelines |
| **My Communities** | [http://localhost:5173/my-communities](http://localhost:5173/my-communities) | Joined circles & aggregated discussion stream |
| **Team Finder** | [http://localhost:5173/team-finder](http://localhost:5173/team-finder) | Hackathon squads, research capstones & startup projects |
| **AI Team Builder** | [http://localhost:5173/team-finder/builder](http://localhost:5173/team-finder/builder) | AI-powered squad architect decomposing project ideas into roles |
| **Create Collaboration** | [http://localhost:5173/team-finder/new](http://localhost:5173/team-finder/new) | Create a team recruitment post with custom role requirements |
| **Colleges Directory** | [http://localhost:5173/colleges](http://localhost:5173/colleges) | Campus directory across leading institutions |
| **Campus Clubs** | [http://localhost:5173/clubs](http://localhost:5173/clubs) | College clubs, technical societies, and recruitment |
| **Campus Events** | [http://localhost:5173/events](http://localhost:5173/events) | Hackathons, workshops, conferences, and volunteering |

---

## 🛠️ Getting Started

### Prerequisites

- Node.js (v18 or higher recommended)
- npm or pnpm

### Installation & Setup

1. **Clone the repository:**
   ```bash
   git clone https://github.com/x0Suji0x/WorkShop3-PeerConnect.git
   cd WorkShop3-PeerConnect
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Start the local Vite dev server:**
   ```bash
   npm run dev
   ```
   Open [http://localhost:5173/](http://localhost:5173/) in your browser.

4. **Run TypeScript build check:**
   ```bash
   npm run build
   ```

5. **Run Linting:**
   ```bash
   npm run lint
   ```

---

## 🌟 Core Features & Modules

### 1. Student Sign-Up & Multi-Step Onboarding (`/signup`)
- **Step 1 – Basic Credentials:** Name, headline, password with live strength evaluation, avatar presets, and phone privacy protections.
- **Step 2 – University Identity:** College autocomplete, degree, branch, year, and verification paths (Option A: College Email OTP simulation, Option B: College ID Card upload with manual review badge).
- **Step 3 – Skills & Interests:** Searchable skill tags, custom tag input, and interest domain selection.
- **Step 4 – Goals & Availability:** Multi-select opportunity cards (Paid projects, Internships, Hackathons, Co-founders) and working availability selector.
- **Step 5 – Portfolio & Craft (Skippable):** GitHub, LinkedIn, Behance, and portfolio links, short bio, and featured project summary.
- **Step 6 – Review & Launch:** Section-by-section review with edit shortcuts, Terms & Privacy consent, and real-time profile completion score calculation.

### 2. AI-Powered Student Communities (`/communities`)
- 12 Interest circles (AI/ML, Web Dev, Mobile App, Competitive Programming, Robotics, Entrepreneurship, Graphic Design, Photography, Space Tech, UI/UX, Blockchain, Cybersecurity).
- Real-time search, category filters, and live join/leave states.
- Discussions feed with Latest vs Popular sorting, likes, comments, and pinned announcements.
- Rule-based AI community recommendations matching student skills and interests with clear reasoning.

### 3. AI Team Finder & Teammate Matching (`/team-finder`)
- Categorized team recruitment posts for Hackathons, Startups, College Capstones, Research, and Open Source.
- Filter by collaboration format (Remote, On-Campus, Hybrid) and status.
- Role-specific application workflow with project lead review (accept/decline applications and squad roster management).
- Intelligent teammate recommendation system calculating deterministic match scores ($\text{score} = \frac{|\text{matchedSkills}|}{|\text{requiredSkills}|} \times 100$) with candidate profile cards.

### 4. AI Project Team Builder (`/team-finder/builder`)
- Natural language project concept input (or preset example idea prompts).
- Rule-based squad architecture decomposition: identifies core and optional roles, required tech stacks, and relevant communities for finding collaborators.
- Direct "Post Project Now" conversion workflow.

### 5. Campus Ecosystem & Student Dashboard
- **Student Dashboard (`/dashboard`):** Profile momentum bar with live completion percentage, pending verification status, and recommended project opportunities.
- **Student Profile (`/profiles/:id`):** Public-facing student portfolio, verified credentials, and availability badges.
- **Colleges, Clubs & Events (`/colleges`, `/clubs`, `/events`):** Campus discovery and student society recruitment.

---

## 📦 Tech Stack

- **Framework:** React 19 + TypeScript
- **Bundler & Dev Server:** Vite
- **Styling:** Tailwind CSS v4
- **Routing:** React Router v7
- **Icons:** Lucide React
- **Linter:** Oxlint
