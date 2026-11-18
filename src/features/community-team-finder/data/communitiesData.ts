import type { Community, CommunityCategory, CommunityMember } from '../types'

export const communityCategories: CommunityCategory[] = [
  { id: 'all', label: 'All Circles', color: '#6366f1' },
  { id: 'technology', label: 'Technology', color: '#3b82f6' },
  { id: 'engineering', label: 'Engineering', color: '#f59e0b' },
  { id: 'design', label: 'Design & UX', color: '#ec4899' },
  { id: 'business', label: 'Business & Startups', color: '#10b981' },
  { id: 'creative', label: 'Creative Arts', color: '#8b5cf6' },
]

export const communities: Community[] = [
  // 1. AI & Machine Learning
  {
    id: 'comm-1',
    name: 'AI & Machine Learning',
    slug: 'ai-ml',
    tagline: 'Build the future with intelligent systems & foundational models',
    description:
      'A community for students passionate about artificial intelligence, machine learning, deep learning, NLP, computer vision, and data science. Share research papers, benchmark architectures, and collaborate on cutting-edge AI hackathons.',
    category: 'technology',
    tags: ['Python', 'TensorFlow', 'PyTorch', 'Deep Learning', 'NLP', 'Computer Vision', 'Data Science', 'LLMs'],
    coverImageUrl: 'https://images.unsplash.com/photo-1677442135703-1787eea5ce01?w=1200&q=80',
    logoEmoji: '🤖',
    memberCount: 2847,
    postCount: 1243,
    isJoined: true,
    guidelines: [
      'Share original research, benchmarks, and model architectures',
      'Cite sources when sharing academic papers or open-source datasets',
      'Constructive feedback only — be welcoming to ML beginners',
      'Tag posts with clear domain tags (#NLP, #CV, #RL, #LLM)',
      'No proprietary tool spam without open educational value',
    ],
    createdAt: '2023-08-15T10:00:00Z',
    activityLevel: 'very-active',
  },
  // 2. Web Development
  {
    id: 'comm-2',
    name: 'Web Development',
    slug: 'web-dev',
    tagline: 'Craft modern, high-performance web applications',
    description:
      'From fundamentals to scalable full-stack architectures — discuss React, Next.js, TypeScript, backend APIs, distributed databases, serverless platforms, and web performance. Share projects and receive constructive peer reviews.',
    category: 'technology',
    tags: ['React', 'Next.js', 'Node.js', 'TypeScript', 'CSS', 'REST', 'GraphQL', 'PostgreSQL', 'TailwindCSS'],
    coverImageUrl: 'https://images.unsplash.com/photo-1627398242454-45a1465c2479?w=1200&q=80',
    logoEmoji: '🌐',
    memberCount: 3521,
    postCount: 1876,
    isJoined: true,
    guidelines: [
      'Include a GitHub repo or minimal reproduction code with technical questions',
      'Respect framework diversity — focus on architectural tradeoffs',
      'Share live deployed projects in the showcase section',
      'Prioritize web accessibility (a11y) and performance best practices',
    ],
    createdAt: '2023-07-01T10:00:00Z',
    activityLevel: 'very-active',
  },
  // 3. App Development
  {
    id: 'comm-3',
    name: 'App Development',
    slug: 'app-dev',
    tagline: 'Ship native & cross-platform mobile apps that delight users',
    description:
      'Mobile and cross-platform app ecosystem. Discuss Flutter, React Native, Swift, Kotlin Multiplatform, Jetpack Compose, Firebase architecture, and App Store optimization. Form squads to build and publish consumer apps.',
    category: 'technology',
    tags: ['Flutter', 'React Native', 'Swift', 'Kotlin', 'Firebase', 'iOS', 'Android', 'Dart'],
    coverImageUrl: 'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=1200&q=80',
    logoEmoji: '📱',
    memberCount: 1984,
    postCount: 892,
    isJoined: false,
    guidelines: [
      'Attach UI recordings or device logs when troubleshooting mobile layout bugs',
      'Both iOS and Android ecosystems are celebrated equally',
      'Publish APK/TestFlight links only when accompanied by project descriptions',
    ],
    createdAt: '2023-09-10T10:00:00Z',
    activityLevel: 'active',
  },
  // 4. Competitive Programming
  {
    id: 'comm-4',
    name: 'Competitive Programming',
    slug: 'competitive-programming',
    tagline: 'Master algorithms, data structures & ICPC contests',
    description:
      'Codeforces specialists, LeetCode grinders, and ICPC contenders. Discuss dynamic programming, segment trees, graph algorithms, contest strategies, and interview prep. Regular virtual contests and editorial write-ups.',
    category: 'technology',
    tags: ['Algorithms', 'Data Structures', 'C++', 'ICPC', 'Codeforces', 'LeetCode', 'Dynamic Programming'],
    coverImageUrl: 'https://images.unsplash.com/photo-1515879218367-8466d910aaa4?w=1200&q=80',
    logoEmoji: '⚡',
    memberCount: 2210,
    postCount: 1420,
    isJoined: false,
    guidelines: [
      'Do not post active contest solutions or solicit live contest assistance',
      'Use spoiler tags when discussing recent problem editorial solutions',
      'Keep code clean, commented, and complexity-analyzed',
    ],
    createdAt: '2023-06-20T10:00:00Z',
    activityLevel: 'very-active',
  },
  // 5. Robotics
  {
    id: 'comm-5',
    name: 'Robotics',
    slug: 'robotics',
    tagline: 'Where hardware meets intelligent control & autonomy',
    description:
      'For mechatronics enthusiasts, rover builders, drone designers, and embedded engineers. Discuss ROS 2, SLAM algorithms, motor drivers, PCB design, autonomous navigation, and university rover competitions.',
    category: 'engineering',
    tags: ['ROS', 'Arduino', 'Raspberry Pi', 'Embedded Systems', 'SLAM', 'Control Theory', 'Mechatronics'],
    coverImageUrl: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=1200&q=80',
    logoEmoji: '🤖',
    memberCount: 1145,
    postCount: 432,
    isJoined: false,
    guidelines: [
      'Prioritize electrical safety when demonstrating high-voltage or LiPo setups',
      'Share CAD files and schematics (KiCAD/Eagle) to foster open hardware',
      'Document sensor calibrations and ROS node graphs',
    ],
    createdAt: '2023-10-05T10:00:00Z',
    activityLevel: 'moderate',
  },
  // 6. Entrepreneurship
  {
    id: 'comm-6',
    name: 'Entrepreneurship',
    slug: 'entrepreneurship',
    tagline: 'Transform student concepts into sustainable campus ventures',
    description:
      'Student founders, product thinkers, and operators. Discuss customer discovery, MVP validation, pitch decks, angel grants, product-market fit, and university incubators. Find technical co-founders and growth leads.',
    category: 'business',
    tags: ['Startups', 'Venture Capital', 'Product-Market Fit', 'Pitching', 'SaaS', 'B2B', 'Growth'],
    coverImageUrl: 'https://images.unsplash.com/photo-1559136555-9303baea8ebd?w=1200&q=80',
    logoEmoji: '🚀',
    memberCount: 2650,
    postCount: 978,
    isJoined: false,
    guidelines: [
      'Share candid learnings from both customer successes and failed experiments',
      'No multi-level marketing (MLM) or get-rich-quick schemes',
      'Provide genuine constructive feedback on peer pitch decks',
    ],
    createdAt: '2023-08-01T10:00:00Z',
    activityLevel: 'active',
  },
  // 7. Graphic Design
  {
    id: 'comm-7',
    name: 'Graphic Design',
    slug: 'graphic-design',
    tagline: 'Visual identities, typography & creative brand craft',
    description:
      'A sanctuary for visual creators, brand designers, illustrators, and motion artists. Showcase editorial layouts, poster design, 3D renders, typography experiments, and campus cultural festival branding.',
    category: 'creative',
    tags: ['Illustrator', 'Photoshop', 'Branding', 'Typography', 'Visual Design', 'Motion Graphics', 'Blender'],
    coverImageUrl: 'https://images.unsplash.com/photo-1626785774573-4b799315345d?w=1200&q=80',
    logoEmoji: '🎨',
    memberCount: 1830,
    postCount: 654,
    isJoined: false,
    guidelines: [
      'Provide context on project briefs when asking for portfolio critique',
      'Respect copyright and credit all original asset creators',
      'Encourage constructive critique focusing on typography and visual hierarchy',
    ],
    createdAt: '2023-09-18T10:00:00Z',
    activityLevel: 'moderate',
  },
  // 8. Photography
  {
    id: 'comm-8',
    name: 'Photography',
    slug: 'photography',
    tagline: 'Capture campus culture, landscapes & storytelling frames',
    description:
      'For student shutterbugs, photojournalists, and digital editors. Discuss camera gear, color grading in Lightroom, street compositions, portrait lighting, and event coverage across university sports and festivals.',
    category: 'creative',
    tags: ['Lightroom', 'Portrait', 'Street Photography', 'Composition', 'Color Grading', 'Visual Stories'],
    coverImageUrl: 'https://images.unsplash.com/photo-1542038784456-1ea8e935640e?w=1200&q=80',
    logoEmoji: '📸',
    memberCount: 1420,
    postCount: 521,
    isJoined: false,
    guidelines: [
      'Always obtain consent when photographing individuals in private spaces',
      'Include EXIF metadata (f-stop, shutter speed, ISO) when posting technical questions',
      'Constructive editing advice is encouraged',
    ],
    createdAt: '2023-10-12T10:00:00Z',
    activityLevel: 'moderate',
  },
  // 9. Space Technology
  {
    id: 'comm-9',
    name: 'Space Technology',
    slug: 'space-tech',
    tagline: 'Orbital mechanics, student CubeSats & aerospace frontiers',
    description:
      'For astronomy, aerospace, and satellite technology scholars. Discuss cubesat telemetry, orbital mechanics, propulsion systems, ISRO/NASA missions, ground stations, and satellite communication payloads.',
    category: 'engineering',
    tags: ['CubeSat', 'Orbital Mechanics', 'Propulsion', 'Aerospace', 'Avionics', 'Satellite', 'ISRO'],
    coverImageUrl: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=1200&q=80',
    logoEmoji: '🛰️',
    memberCount: 960,
    postCount: 289,
    isJoined: false,
    guidelines: [
      'Ground discussions in verified aerospace physics and engineering literature',
      'Share open satellite observation passes and amateur radio ground telemetry',
      'Collaborate on university rocketry and cansat design reviews',
    ],
    createdAt: '2023-11-01T10:00:00Z',
    activityLevel: 'moderate',
  },
  // 10. UI/UX Design
  {
    id: 'comm-10',
    name: 'UI/UX Design',
    slug: 'ui-ux',
    tagline: 'Design empathetic, accessible & polished digital interfaces',
    description:
      'Design systems architects, UX researchers, and interaction designers. Share Figma design systems, usability test findings, wireframes, micro-interactions, and accessibility audits. Collaborate with student devs to ship real products.',
    category: 'design',
    tags: ['Figma', 'User Research', 'Design Systems', 'Prototyping', 'Usability', 'Interaction Design', 'UI/UX'],
    coverImageUrl: 'https://images.unsplash.com/photo-1581291518857-4e27b48ff24e?w=1200&q=80',
    logoEmoji: '✨',
    memberCount: 3120,
    postCount: 1540,
    isJoined: true,
    guidelines: [
      'Link Figma files in view-only mode with clear component architecture',
      'Explain the problem statement and target persona before showing mockups',
      'Prioritize WCAG AA compliance and accessible color contrast',
    ],
    createdAt: '2023-07-15T10:00:00Z',
    activityLevel: 'very-active',
  },
  // 11. Blockchain
  {
    id: 'comm-11',
    name: 'Blockchain',
    slug: 'blockchain',
    tagline: 'Decentralized systems, smart contracts & Web3 protocols',
    description:
      'Builders in cryptography, Ethereum smart contracts, DeFi protocols, zero-knowledge proofs, and decentralized governance. Review Solidity security patterns, participate in Web3 hackathons, and analyze on-chain data.',
    category: 'technology',
    tags: ['Solidity', 'Ethereum', 'Web3', 'DeFi', 'Smart Contracts', 'Zero Knowledge', 'Hardhat'],
    coverImageUrl: 'https://images.unsplash.com/photo-1639762681485-074b7f938ba0?w=1200&q=80',
    logoEmoji: '⛓️',
    memberCount: 1680,
    postCount: 712,
    isJoined: false,
    guidelines: [
      'Zero tolerance for meme tokens, token shilling, or speculative trading spam',
      'Focus strictly on cryptography, smart contract security, and protocol engineering',
      'Include test suites and Slither/Echidna audit findings when sharing contracts',
    ],
    createdAt: '2023-08-28T10:00:00Z',
    activityLevel: 'active',
  },
  // 12. Cybersecurity
  {
    id: 'comm-12',
    name: 'Cybersecurity',
    slug: 'cybersecurity',
    tagline: 'Ethical hacking, defense-in-depth & CTF warfare',
    description:
      'Ethical hackers, security analysts, and CTF warriors. Discuss OWASP Top 10 vulnerabilities, binary exploitation, network defense, reverse engineering, cloud security, and bug bounty methodologies.',
    category: 'technology',
    tags: ['Ethical Hacking', 'CTF', 'Network Security', 'Penetration Testing', 'OWASP', 'Cryptography', 'Forensics'],
    coverImageUrl: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=1200&q=80',
    logoEmoji: '🛡️',
    memberCount: 2340,
    postCount: 1105,
    isJoined: false,
    guidelines: [
      'Strict adherence to responsible disclosure and ethical guidelines only',
      'No sharing of active exploits against non-consenting systems or university portals',
      'Publish writeups only after CTF contest deadlines close',
    ],
    createdAt: '2023-06-10T10:00:00Z',
    activityLevel: 'very-active',
  },
]

export const communityMembers: Record<string, CommunityMember[]> = {
  'comm-1': [
    { id: 'm1-1', name: 'Arjun Sharma', avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&q=80', college: 'IIT Delhi', skills: ['PyTorch', 'Computer Vision', 'Python'], role: 'admin', joinedAt: 'Aug 2023' },
    { id: 'm1-2', name: 'Priya Nair', avatarUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&q=80', college: 'IISc Bangalore', skills: ['NLP', 'Transformers', 'FastAPI'], role: 'moderator', joinedAt: 'Sep 2023' },
    { id: 'm1-3', name: 'Rohan Deshmukh', avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&q=80', college: 'BITS Pilani', skills: ['Reinforcement Learning', 'JAX'], role: 'member', joinedAt: 'Oct 2023' },
    { id: 'm1-4', name: 'Sofia Rodriguez', avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&q=80', college: 'National Institute of Design', skills: ['Design Systems', 'AI Prototyping'], role: 'member', joinedAt: 'Jan 2024' },
  ],
  'comm-2': [
    { id: 'm2-1', name: 'Tanvi Joshi', avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&q=80', college: 'IIT Bombay', skills: ['React', 'Next.js', 'TypeScript'], role: 'admin', joinedAt: 'Jul 2023' },
    { id: 'm2-2', name: 'Karthik Rao', avatarUrl: 'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=150&q=80', college: 'NIT Trichy', skills: ['PostgreSQL', 'Go', 'GraphQL'], role: 'moderator', joinedAt: 'Aug 2023' },
    { id: 'm2-3', name: 'Sofia Rodriguez', avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&q=80', college: 'National Institute of Design', skills: ['React', 'TailwindCSS'], role: 'member', joinedAt: 'Jan 2024' },
  ],
  'comm-10': [
    { id: 'm10-1', name: 'Sofia Rodriguez', avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&q=80', college: 'National Institute of Design', skills: ['Figma', 'Interaction Design', 'Design Systems'], role: 'moderator', joinedAt: 'Jul 2023' },
    { id: 'm10-2', name: 'Kabir Sen', avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&q=80', college: 'Srishti Institute', skills: ['UX Research', 'Framer'], role: 'admin', joinedAt: 'Jul 2023' },
    { id: 'm10-3', name: 'Meera Chawla', avatarUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&q=80', college: 'IIT Guwahati (DoD)', skills: ['Typography', 'Visual Identity'], role: 'member', joinedAt: 'Aug 2023' },
  ],
}

