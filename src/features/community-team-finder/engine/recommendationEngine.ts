/**
 * recommendationEngine.ts
 *
 * Transparent, deterministic rule-based matching engine for Student Communities
 * and Team Finder squads. Designed with clean interfaces to enable drop-in
 * integration of real AI/LLM models or embedding vectors in the future.
 */

import type {
  CommunityRecommendation,
  StudentMatchProfile,
  TeamBuilderSuggestion,
  SuggestedRole,
  CollabType,
} from '../types'
import { communities } from '../data/communitiesData'
import { studentMatchProfiles } from '../data/teamFinderData'

// ─── Community Keyword & Academic Affinity Dictionaries ────────────────────────

const communityKeywords: Record<string, string[]> = {
  'ai-ml': [
    'python', 'tensorflow', 'pytorch', 'machine learning', 'deep learning',
    'nlp', 'computer vision', 'data science', 'ai', 'artificial intelligence',
    'ml', 'kaggle', 'transformers', 'llm', 'generative ai', 'scikit-learn',
  ],
  'web-dev': [
    'react', 'next.js', 'node.js', 'typescript', 'javascript', 'css', 'html',
    'rest', 'graphql', 'postgresql', 'mongodb', 'web development', 'frontend',
    'backend', 'full stack', 'tailwind', 'tailwindcss',
  ],
  'app-dev': [
    'flutter', 'react native', 'swift', 'kotlin', 'firebase', 'ios', 'android',
    'mobile', 'dart', 'expo', 'swiftui', 'jetpack compose',
  ],
  'competitive-programming': [
    'algorithms', 'data structures', 'c++', 'competitive programming', 'icpc',
    'codeforces', 'leetcode', 'dynamic programming', 'graph theory', 'dsa',
  ],
  'robotics': [
    'ros', 'arduino', 'raspberry pi', 'embedded systems', 'control theory',
    'autonomous', 'slam', 'robotics', 'mechatronics', 'pcb', 'electronics', 'lidar',
  ],
  'entrepreneurship': [
    'startup', 'fundraising', 'product-market fit', 'pitch', 'mvp',
    'business model', 'vc', 'entrepreneur', 'saas', 'go-to-market', 'business development', 'growth',
  ],
  'graphic-design': [
    'adobe illustrator', 'photoshop', 'branding', 'typography', 'illustration',
    'motion graphics', 'graphic design', 'visual design', 'indesign', 'blender',
  ],
  'photography': [
    'lightroom', 'portrait', 'landscape', 'street photography', 'composition',
    'editing', 'photography', 'camera', 'photo', 'color grading',
  ],
  'space-tech': [
    'orbital mechanics', 'cubesat', 'propulsion', 'aerospace', 'isro',
    'rocketry', 'satellite', 'avionics', 'space', 'astrophysics',
  ],
  'ui-ux': [
    'figma', 'user research', 'wireframing', 'prototyping', 'usability testing',
    'design systems', 'framer', 'ui', 'ux', 'interaction design', 'user experience', 'ui/ux',
  ],
  'blockchain': [
    'solidity', 'ethereum', 'web3', 'defi', 'smart contracts', 'hardhat',
    'ipfs', 'solana', 'nft', 'blockchain', 'crypto', 'zero-knowledge',
  ],
  'cybersecurity': [
    'ethical hacking', 'ctf', 'network security', 'penetration testing',
    'kali linux', 'owasp', 'cryptography', 'cybersecurity', 'security', 'infosec', 'forensics',
  ],
}

/** Academic fields that naturally align with specific community slugs */
const academicAffinityMap: Record<string, string[]> = {
  'computer science': ['ai-ml', 'web-dev', 'app-dev', 'competitive-programming', 'cybersecurity', 'blockchain'],
  'information technology': ['web-dev', 'app-dev', 'cybersecurity', 'ai-ml'],
  'interaction design': ['ui-ux', 'graphic-design', 'web-dev'],
  'design': ['ui-ux', 'graphic-design', 'photography'],
  'electrical': ['robotics', 'space-tech'],
  'mechanical': ['robotics', 'space-tech'],
  'aerospace': ['space-tech', 'robotics'],
  'business': ['entrepreneurship'],
  'management': ['entrepreneurship'],
}

// ─── 1. recommendCommunities ─────────────────────────────────────────────────

export interface StudentRecommendationContext {
  skills: string[]
  interests: string[]
  joinedCommunityIds?: string[]
  academicField?: string
  careerGoals?: string[]
}

/**
 * Deterministically recommends up to 5 communities for a student.
 * Uses skills (weight 2.0), interests (weight 1.5), academic field (weight 2.0),
 * and career goals (weight 1.0) while excluding already-joined circles.
 */
export function recommendCommunities(
  context: StudentRecommendationContext,
): CommunityRecommendation[] {
  const {
    skills,
    interests,
    joinedCommunityIds = [],
    academicField = '',
    careerGoals = [],
  } = context

  const normalizedSkills = skills.map((s) => s.toLowerCase().trim())
  const normalizedInterests = interests.map((i) => i.toLowerCase().trim())
  const normalizedField = academicField.toLowerCase().trim()
  const normalizedGoals = careerGoals.map((g) => g.toLowerCase().trim())

  const recommendations: CommunityRecommendation[] = []

  for (const community of communities) {
    if (joinedCommunityIds.includes(community.id)) continue

    const keywords = communityKeywords[community.slug] ?? []
    if (keywords.length === 0) continue

    const matchedSkillKeywords: string[] = []
    const matchedInterestKeywords: string[] = []

    // Match skills
    for (const keyword of keywords) {
      if (normalizedSkills.some((s) => s.includes(keyword) || keyword.includes(s))) {
        matchedSkillKeywords.push(keyword)
      } else if (normalizedInterests.some((i) => i.includes(keyword) || keyword.includes(i))) {
        matchedInterestKeywords.push(keyword)
      }
    }

    // Match academic affinity
    let hasAcademicAffinity = false
    let matchedAcademicLabel = ''
    for (const [dept, slugs] of Object.entries(academicAffinityMap)) {
      if (normalizedField.includes(dept) && slugs.includes(community.slug)) {
        hasAcademicAffinity = true
        matchedAcademicLabel = academicField
        break
      }
    }

    // Match career goals
    let hasGoalAffinity = false
    if (
      normalizedGoals.some((g) => g.includes('hackathon') || g.includes('co-founder') || g.includes('startup')) &&
      ['entrepreneurship', 'ai-ml', 'web-dev'].includes(community.slug)
    ) {
      hasGoalAffinity = true
    }

    // Calculate score
    const skillScore = matchedSkillKeywords.length * 20
    const interestScore = matchedInterestKeywords.length * 15
    const academicScore = hasAcademicAffinity ? 25 : 0
    const goalScore = hasGoalAffinity ? 15 : 0

    const rawScore = skillScore + interestScore + academicScore + goalScore
    if (rawScore === 0) continue

    const matchScore = Math.min(99, Math.max(25, Math.round(rawScore)))

    // Formulate transparent explanation
    const displaySkills = matchedSkillKeywords.slice(0, 3).map(capitalize)
    const displayInterests = matchedInterestKeywords.slice(0, 2).map(capitalize)

    let reason = ''
    if (hasAcademicAffinity && displaySkills.length > 0) {
      reason = `Aligned with your studies in ${matchedAcademicLabel} and your skills in ${displaySkills.join(', ')}.`
    } else if (displaySkills.length > 0 && displayInterests.length > 0) {
      reason = `Matches your expertise in ${displaySkills.join(', ')} and interest in ${displayInterests.join(', ')}.`
    } else if (displaySkills.length > 0) {
      reason = `Recommended because you listed ${displaySkills.join(', ')} among your core skills.`
    } else if (hasAcademicAffinity) {
      reason = `Complements your curriculum in ${matchedAcademicLabel} with active campus projects.`
    } else {
      reason = `Directly reflects your focus on ${displayInterests.join(', ')}.`
    }

    recommendations.push({
      community,
      reason,
      matchScore,
      matchedSkills: matchedSkillKeywords.map(capitalize),
      matchedInterests: matchedInterestKeywords.map(capitalize),
      matchedAcademicField: hasAcademicAffinity ? matchedAcademicLabel : undefined,
    })
  }

  return recommendations.sort((a, b) => b.matchScore - a.matchScore).slice(0, 5)
}

// ─── 2. matchTeammates ───────────────────────────────────────────────────────

/**
 * Matches candidates against project requirements.
 * Score calculation:
 * - Direct required skill overlap: up to 60 points
 * - Collaboration preference alignment: 15 points
 * - Complementary skills bonus: up to 15 points
 * - Availability / capacity match: 10 points
 */
export function matchTeammates(
  requiredSkills: string[],
  _category: string,
  preferredCollabType?: CollabType,
): StudentMatchProfile[] {
  const normalizedRequired = requiredSkills.map((s) => s.toLowerCase().trim())

  const scored = studentMatchProfiles.map((profile) => {
    // 1. Direct skill overlap
    const directMatches = profile.skills.filter((skill) =>
      normalizedRequired.some(
        (req) => skill.toLowerCase().includes(req) || req.includes(skill.toLowerCase()),
      ),
    )

    const skillRatio = directMatches.length / Math.max(normalizedRequired.length, 1)
    const skillScore = Math.round(skillRatio * 60)

    // 2. Format match
    let formatScore = 10
    if (preferredCollabType) {
      if (profile.preferredCollabType === preferredCollabType) {
        formatScore = 15
      } else if (profile.preferredCollabType === 'hybrid') {
        formatScore = 12
      }
    }

    // 3. Complementary skills (Git, DevOps, Design, Cloud)
    const complementaryPool = ['git', 'docker', 'figma', 'fastapi', 'postgresql', 'testing']
    const complementaryMatches = profile.skills.filter((skill) =>
      complementaryPool.includes(skill.toLowerCase()) && !directMatches.includes(skill),
    )
    const compScore = Math.min(15, complementaryMatches.length * 5)

    // 4. Availability
    const availScore = profile.availability.toLowerCase().includes('full-time') ? 10 : 8

    const totalScore = Math.min(99, Math.max(30, skillScore + formatScore + compScore + availScore))

    // Match explanation
    let matchReason = ''
    if (directMatches.length >= 3) {
      matchReason = `Exceptional fit! Directly brings ${directMatches.slice(0, 3).join(', ')} with strong hackathon readiness.`
    } else if (directMatches.length > 0) {
      matchReason = `Matches key requirement ${directMatches.join(', ')} with complementary knowledge in ${profile.skills.slice(0, 2).join(', ')}.`
    } else {
      matchReason = `Brings complementary capabilities in ${profile.skills.slice(0, 3).join(', ')}.`
    }

    return {
      ...profile,
      matchedSkills: directMatches,
      complementarySkills: complementaryMatches,
      matchScore: totalScore,
      matchReason,
    }
  })

  return scored.sort((a, b) => b.matchScore - a.matchScore).slice(0, 8)
}

// ─── 3. suggestTeamRoles ─────────────────────────────────────────────────────

/**
 * Natural Language Project Decomposition Heuristic
 * Parses concept descriptions and extracts required tech roles,
 * recommended tech stacks, and relevant peer communities.
 */
export function suggestTeamRoles(projectDescription: string): TeamBuilderSuggestion {
  const desc = projectDescription.toLowerCase()
  const suggestedRoles: SuggestedRole[] = []

  // AI / ML
  if (/ai|artificial intelligence|machine learning|deep learning|neural|nlp|llm|gpt|model|vision|dataset/.test(desc)) {
    suggestedRoles.push({
      title: 'AI/ML Engineer',
      description: 'Design, evaluate, and fine-tune machine learning architectures and inference endpoints.',
      skills: ['Python', 'PyTorch', 'TensorFlow', 'FastAPI', 'HuggingFace'],
      priority: 'required',
    })
  }

  // Web Frontend
  if (/web|react|frontend|interface|ui|dashboard|next\.?js|tailwind|client|portal/.test(desc)) {
    suggestedRoles.push({
      title: 'Frontend Architect',
      description: 'Build responsive web interfaces, client state stores, and accessible user flows.',
      skills: ['React', 'TypeScript', 'TailwindCSS', 'Next.js'],
      priority: 'required',
    })
  }

  // Backend / Database
  if (/backend|api|server|database|rest|graphql|postgres|sql|auth|microservice|node|fastapi/.test(desc)) {
    suggestedRoles.push({
      title: 'Backend & Systems Engineer',
      description: 'Build high-throughput REST/GraphQL APIs, database schemas, and background job workers.',
      skills: ['Node.js', 'PostgreSQL', 'FastAPI', 'Redis', 'Docker'],
      priority: 'required',
    })
  }

  // Mobile App
  if (/mobile|app|ios|android|flutter|react native|smartphone|tablet/.test(desc)) {
    suggestedRoles.push({
      title: 'Mobile App Developer',
      description: 'Build native or cross-platform mobile apps with offline caching and device sensors.',
      skills: ['Flutter', 'React Native', 'Kotlin', 'Swift', 'Firebase'],
      priority: 'required',
    })
  }

  // UI/UX Design
  if (/design|ux|ui\/ux|experience|figma|wireframe|prototype|usability|aesthetic/.test(desc)) {
    suggestedRoles.push({
      title: 'UI/UX Product Designer',
      description: 'Conduct user research interviews, design Figma design systems, and craft micro-interactions.',
      skills: ['Figma', 'UI/UX', 'Design Systems', 'User Research', 'Prototyping'],
      priority: 'required',
    })
  }

  // Web3 / Blockchain
  if (/blockchain|crypto|solidity|ethereum|web3|smart contract|nft|defi|token/.test(desc)) {
    suggestedRoles.push({
      title: 'Smart Contract Developer',
      description: 'Write gas-optimized Solidity contracts, Hardhat test suites, and Web3 event listeners.',
      skills: ['Solidity', 'Ethereum', 'Hardhat', 'wagmi', 'viem'],
      priority: 'required',
    })
  }

  // Robotics / IoT
  if (/robot|hardware|rover|arduino|raspberry pi|ros|sensor|embedded|firmware|iot/.test(desc)) {
    suggestedRoles.push({
      title: 'Robotics & Embedded Engineer',
      description: 'Write ROS 2 control nodes, sensor fusion algorithms, and microcontroller firmware.',
      skills: ['ROS', 'C++', 'Arduino', 'Embedded Systems', 'SLAM'],
      priority: 'required',
    })
  }

  // Security / Auditing
  if (/security|vulnerability|audit|ctf|cyber|auth|encryption|penetration/.test(desc)) {
    suggestedRoles.push({
      title: 'Security & Penetration Tester',
      description: 'Conduct code audits, threat modeling, and ensure OWASP compliance.',
      skills: ['OWASP', 'Penetration Testing', 'Cryptography', 'Network Security'],
      priority: 'optional',
    })
  }

  // Fallback if generic
  if (suggestedRoles.length === 0) {
    suggestedRoles.push(
      {
        title: 'Full-Stack Developer',
        description: 'Build end-to-end functionality across web UI and backend services.',
        skills: ['React', 'Node.js', 'TypeScript', 'PostgreSQL'],
        priority: 'required',
      },
      {
        title: 'UI/UX Designer',
        description: 'Translate user workflows into clean, interactive wireframes and components.',
        skills: ['Figma', 'Prototyping', 'User Research'],
        priority: 'required',
      },
    )
  }

  // Find relevant communities
  const communityKeywordsPair: [RegExp, string][] = [
    [/ai|ml|learning|data|nlp|vision/, 'ai-ml'],
    [/web|react|frontend|backend|api/, 'web-dev'],
    [/mobile|app|ios|android|flutter/, 'app-dev'],
    [/algorithm|competitive|contest/, 'competitive-programming'],
    [/robot|rover|embedded|hardware/, 'robotics'],
    [/startup|business|monetiz|saas/, 'entrepreneurship'],
    [/design|graphic|branding|visual/, 'graphic-design'],
    [/space|satellite|aerospace|orbit/, 'space-tech'],
    [/ui|ux|figma|experience|wireframe/, 'ui-ux'],
    [/blockchain|solidity|ethereum|web3/, 'blockchain'],
    [/security|cyber|hack|vulnerability/, 'cybersecurity'],
  ]

  const matchedSlugs = new Set<string>()
  for (const [pattern, slug] of communityKeywordsPair) {
    if (pattern.test(desc)) {
      matchedSlugs.add(slug)
    }
  }

  // Always include at least 2 relevant communities
  if (matchedSlugs.size === 0) {
    matchedSlugs.add('web-dev')
    matchedSlugs.add('ui-ux')
  }

  const suggestedCommunities = communities
    .filter((c) => matchedSlugs.has(c.slug))
    .slice(0, 4)
    .map((c) => ({
      id: c.id,
      name: c.name,
      slug: c.slug,
      logoEmoji: c.logoEmoji,
      description: c.tagline,
    }))

  return {
    roles: suggestedRoles,
    communities: suggestedCommunities,
  }
}

// ─── Utility Helpers ──────────────────────────────────────────────────────────

function capitalize(str: string): string {
  if (!str) return ''
  return str.charAt(0).toUpperCase() + str.slice(1)
}

