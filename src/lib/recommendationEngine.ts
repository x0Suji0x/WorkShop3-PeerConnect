/**
 * recommendationEngine.ts
 * Pure rule-based recommendation engine — no API calls, no external dependencies.
 */

import type {
  CommunityRecommendation,
  StudentMatchProfile,
  TeamBuilderSuggestion,
  SuggestedRole,
} from '../types/community'
import { communities } from '../data/communityMockData'
import { studentMatchProfiles } from '../data/teamFinderMockData'

// ─── Community keyword maps ───────────────────────────────────────────────────

/** Maps each community slug to the skills and interest keywords it covers. */
const communityKeywords: Record<string, string[]> = {
  'ai-ml': ['python', 'tensorflow', 'pytorch', 'machine learning', 'deep learning', 'nlp', 'computer vision', 'data science', 'ai', 'artificial intelligence', 'ml', 'kaggle', 'neural network', 'transformers', 'llm', 'generative ai'],
  'web-dev': ['react', 'next.js', 'node.js', 'typescript', 'javascript', 'css', 'html', 'rest', 'graphql', 'postgresql', 'mongodb', 'web development', 'frontend', 'backend', 'full stack'],
  'app-dev': ['flutter', 'react native', 'swift', 'kotlin', 'firebase', 'ios', 'android', 'mobile', 'dart', 'expo', 'swiftui', 'jetpack compose'],
  'competitive-programming': ['algorithms', 'data structures', 'c++', 'competitive programming', 'icpc', 'codeforces', 'leetcode', 'dynamic programming', 'greedy', 'graph theory', 'competitive coding'],
  'robotics': ['ros', 'arduino', 'raspberry pi', 'embedded systems', 'control theory', 'autonomous', 'slam', 'robotics', 'mechatronics', 'pcb', 'electronics'],
  'entrepreneurship': ['startup', 'fundraising', 'product-market fit', 'pitch', 'mvp', 'business model', 'vc', 'entrepreneur', 'saas', 'go-to-market', 'business development'],
  'graphic-design': ['adobe illustrator', 'photoshop', 'branding', 'typography', 'illustration', 'motion graphics', 'graphic design', 'visual design', 'indesign'],
  'photography': ['lightroom', 'portrait', 'landscape', 'street photography', 'composition', 'editing', 'photography', 'camera', 'photo'],
  'space-tech': ['orbital mechanics', 'cubesat', 'propulsion', 'aerospace', 'isro', 'rocketry', 'satellite', 'avionics', 'space', 'astrophysics'],
  'ui-ux': ['figma', 'user research', 'wireframing', 'prototyping', 'usability testing', 'design systems', 'framer', 'ui', 'ux', 'interaction design', 'user experience', 'ui/ux'],
  'blockchain': ['solidity', 'ethereum', 'web3', 'defi', 'smart contracts', 'hardhat', 'ipfs', 'solana', 'nft', 'blockchain', 'crypto'],
  'cybersecurity': ['ethical hacking', 'ctf', 'network security', 'penetration testing', 'kali linux', 'owasp', 'cryptography', 'cybersecurity', 'security', 'infosec', 'forensics'],
}

// ─── 1. recommendCommunities ─────────────────────────────────────────────────

/**
 * Recommends up to 5 communities based on a student's skills and interests.
 * Excludes communities the student has already joined.
 *
 * matchScore = (skillMatches + interestMatches) / totalRelevantKeywords * 100
 */
export function recommendCommunities(
  studentSkills: string[],
  studentInterests: string[],
  joinedCommunityIds: string[],
): CommunityRecommendation[] {
  const normalizedSkills = studentSkills.map((s) => s.toLowerCase().trim())
  const normalizedInterests = studentInterests.map((i) => i.toLowerCase().trim())

  const recommendations: CommunityRecommendation[] = []

  for (const community of communities) {
    // Skip already-joined communities
    if (joinedCommunityIds.includes(community.id)) continue

    const keywords = communityKeywords[community.slug] ?? []
    if (keywords.length === 0) continue

    const matchedSkillKeywords: string[] = []
    const matchedInterestKeywords: string[] = []

    for (const keyword of keywords) {
      const skillMatch = normalizedSkills.some(
        (skill) => skill.includes(keyword) || keyword.includes(skill),
      )
      const interestMatch = normalizedInterests.some(
        (interest) => interest.includes(keyword) || keyword.includes(interest),
      )
      if (skillMatch) matchedSkillKeywords.push(keyword)
      else if (interestMatch) matchedInterestKeywords.push(keyword)
    }

    const totalMatches = matchedSkillKeywords.length + matchedInterestKeywords.length
    if (totalMatches === 0) continue

    const matchScore = Math.min(100, Math.round((totalMatches / keywords.length) * 100))

    // Build a human-readable reason
    const displaySkills = matchedSkillKeywords.slice(0, 3).map(capitalize)
    const displayInterests = matchedInterestKeywords.slice(0, 2).map(capitalize)
    let reason = ''
    if (displaySkills.length > 0 && displayInterests.length > 0) {
      reason = `Your skills in ${displaySkills.join(', ')} and interest in ${displayInterests.join(', ')} align with this community.`
    } else if (displaySkills.length > 0) {
      reason = `Your skills in ${displaySkills.join(', ')} are a great fit for this community.`
    } else {
      reason = `Your interests in ${displayInterests.join(', ')} align well with this community.`
    }

    recommendations.push({
      community,
      reason,
      matchScore,
      matchedSkills: matchedSkillKeywords.map(capitalize),
      matchedInterests: matchedInterestKeywords.map(capitalize),
    })
  }

  // Sort descending by matchScore, return top 5
  return recommendations.sort((a, b) => b.matchScore - a.matchScore).slice(0, 5)
}

// ─── 2. matchTeammates ───────────────────────────────────────────────────────

/**
 * Finds the top 8 student profiles that match the given required skills and category.
 * Profiles are sorted by matchScore descending.
 */
export function matchTeammates(
  requiredSkills: string[],
  _category: string,
): StudentMatchProfile[] {
  const normalizedRequired = requiredSkills.map((s) => s.toLowerCase().trim())

  // Re-compute live matchScore based on the caller's required skills
  const scored = studentMatchProfiles.map((profile) => {
    const matchedSkills = profile.skills.filter((skill) =>
      normalizedRequired.some(
        (req) =>
          skill.toLowerCase().includes(req) || req.includes(skill.toLowerCase()),
      ),
    )
    const matchScore = Math.round((matchedSkills.length / Math.max(normalizedRequired.length, 1)) * 100)
    return { ...profile, matchedSkills, matchScore }
  })

  return scored.sort((a, b) => b.matchScore - a.matchScore).slice(0, 8)
}

// ─── 3. suggestTeamRoles ─────────────────────────────────────────────────────

/**
 * Rule-based keyword analysis of a project description.
 * Suggests team roles and relevant communities.
 */
export function suggestTeamRoles(projectDescription: string): TeamBuilderSuggestion {
  const desc = projectDescription.toLowerCase()

  const suggestedRoles: SuggestedRole[] = []

  // AI / Machine Learning
  if (/ai|artificial intelligence|machine learning|deep learning|neural|nlp|llm|gpt|ml model|computer vision|dataset|train a model/.test(desc)) {
    suggestedRoles.push({
      title: 'AI/ML Engineer',
      description: 'Design, train, and deploy machine learning models. Responsible for model architecture, evaluation, and optimization.',
      skills: ['Python', 'TensorFlow', 'PyTorch', 'Scikit-learn', 'Pandas'],
      priority: 'required',
    })
  }

  // Frontend / Web
  if (/web|react|frontend|front-end|dashboard|interface|ui|user interface|html|css|next\.?js|vue|angular/.test(desc)) {
    suggestedRoles.push({
      title: 'Frontend Developer',
      description: 'Build the user-facing web application. Own the React component architecture, state management, and UI performance.',
      skills: ['React', 'TypeScript', 'TailwindCSS', 'Next.js'],
      priority: 'required',
    })
  }

  // Backend / API
  if (/backend|api|server|database|rest|graphql|microservice|node|django|fastapi|postgresql|mongodb|auth/.test(desc)) {
    suggestedRoles.push({
      title: 'Backend Developer',
      description: 'Build and maintain the server-side logic, APIs, and database schemas. Ensure scalability and security.',
      skills: ['Node.js', 'FastAPI', 'PostgreSQL', 'Redis', 'Docker'],
      priority: 'required',
    })
  }

  // Mobile
  if (/mobile|app|ios|android|flutter|react native|phone|smartphone/.test(desc)) {
    suggestedRoles.push({
      title: 'Mobile Developer',
      description: 'Build the mobile application for iOS and/or Android. Own offline sync, push notifications, and native integrations.',
      skills: ['Flutter', 'React Native', 'Firebase', 'Dart'],
      priority: 'required',
    })
  }

  // UX/UI Design
  if (/design|ux|ui\/ux|user experience|figma|wireframe|prototype|usability|user research/.test(desc)) {
    suggestedRoles.push({
      title: 'UX/UI Designer',
      description: 'Own the product\'s visual design and user experience. Conduct user research, create wireframes, and produce high-fidelity prototypes.',
      skills: ['Figma', 'User Research', 'Prototyping', 'Design Systems'],
      priority: 'required',
    })
  }

  // Data / Analytics
  if (/data|analytics|dashboard|insights|visualization|bigquery|spark|pipeline|etl|warehouse/.test(desc)) {
    suggestedRoles.push({
      title: 'Data Engineer / Analyst',
      description: 'Build data pipelines, design schemas, and create analytical dashboards. Turn raw data into actionable insights.',
      skills: ['Python', 'SQL', 'dbt', 'Apache Spark', 'Tableau'],
      priority: 'optional',
    })
  }

  // Blockchain / Web3
  if (/blockchain|smart contract|solidity|ethereum|web3|nft|defi|crypto|decentralized/.test(desc)) {
    suggestedRoles.push({
      title: 'Blockchain Developer',
      description: 'Write, test, and deploy smart contracts. Build the Web3 integration layer connecting frontend to blockchain.',
      skills: ['Solidity', 'Hardhat', 'Ethereum', 'wagmi', 'viem'],
      priority: 'required',
    })
  }

  // DevOps / Cloud
  if (/deploy|cloud|aws|gcp|azure|kubernetes|docker|ci\/cd|devops|infrastructure|scale/.test(desc)) {
    suggestedRoles.push({
      title: 'DevOps / Cloud Engineer',
      description: 'Set up CI/CD pipelines, containerize services, and manage cloud infrastructure. Ensure reliable deployment and monitoring.',
      skills: ['Docker', 'Kubernetes', 'GitHub Actions', 'AWS', 'Terraform'],
      priority: 'optional',
    })
  }

  // Product / Business
  if (/startup|product|market|growth|customer|business|revenue|saas|b2b|b2c|pitch|investor/.test(desc)) {
    suggestedRoles.push({
      title: 'Product Manager / Business Lead',
      description: 'Define the product roadmap, conduct market research, and own the go-to-market strategy. Bridge business goals and engineering.',
      skills: ['Product Strategy', 'Market Research', 'OKRs', 'User Interviews'],
      priority: 'optional',
    })
  }

  // Security
  if (/security|cybersecurity|hack|vulnerabilit|encrypt|auth|oauth|zero trust|penetration/.test(desc)) {
    suggestedRoles.push({
      title: 'Security Engineer',
      description: 'Audit the codebase for vulnerabilities, implement secure authentication, and ensure compliance with security best practices.',
      skills: ['OWASP', 'Penetration Testing', 'Cryptography', 'OAuth'],
      priority: 'optional',
    })
  }

  // If no roles matched, suggest a general team
  if (suggestedRoles.length === 0) {
    suggestedRoles.push(
      {
        title: 'Full-Stack Developer',
        description: 'Build both the frontend and backend of the application.',
        skills: ['React', 'Node.js', 'TypeScript', 'PostgreSQL'],
        priority: 'required',
      },
      {
        title: 'UX/UI Designer',
        description: 'Design the product experience from wireframes to high-fidelity prototypes.',
        skills: ['Figma', 'User Research', 'Prototyping'],
        priority: 'required',
      },
    )
  }

  // Suggest relevant communities based on description keywords
  const relevantCommunities: { id: string; name: string; slug: string }[] = []
  const communityMatches: [string, string, string][] = [
    ['comm-1', 'AI & Machine Learning', 'ai-ml'],
    ['comm-2', 'Web Development', 'web-dev'],
    ['comm-3', 'App Development', 'app-dev'],
    ['comm-4', 'Competitive Programming', 'competitive-programming'],
    ['comm-5', 'Robotics', 'robotics'],
    ['comm-6', 'Entrepreneurship', 'entrepreneurship'],
    ['comm-7', 'Graphic Design', 'graphic-design'],
    ['comm-9', 'Space Technology', 'space-tech'],
    ['comm-10', 'UI/UX Design', 'ui-ux'],
    ['comm-11', 'Blockchain', 'blockchain'],
    ['comm-12', 'Cybersecurity', 'cybersecurity'],
  ]
  const keywordToCommunity: [RegExp, string][] = [
    [/ai|machine learning|nlp|neural|deep learning|ml/, 'comm-1'],
    [/web|react|frontend|next\.?js|css|html/, 'comm-2'],
    [/mobile|flutter|ios|android|app/, 'comm-3'],
    [/algorithm|competitive|icpc|codeforces/, 'comm-4'],
    [/robot|ros|autonomous|embedded/, 'comm-5'],
    [/startup|business|entrepreneur|saas|pitch/, 'comm-6'],
    [/design|graphic|visual|branding|illustration/, 'comm-7'],
    [/space|satellite|rocket|aerospace|orbital/, 'comm-9'],
    [/ui|ux|figma|wireframe|prototype|user experience/, 'comm-10'],
    [/blockchain|smart contract|ethereum|defi|web3/, 'comm-11'],
    [/security|hack|ctf|cybersecurity|exploit/, 'comm-12'],
  ]

  const addedCommunityIds = new Set<string>()
  for (const [pattern, commId] of keywordToCommunity) {
    if (pattern.test(desc) && !addedCommunityIds.has(commId)) {
      const match = communityMatches.find(([id]) => id === commId)
      if (match) {
        relevantCommunities.push({ id: match[0], name: match[1], slug: match[2] })
        addedCommunityIds.add(commId)
      }
    }
  }

  return { roles: suggestedRoles, communities: relevantCommunities.slice(0, 4) }
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function capitalize(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1)
}
