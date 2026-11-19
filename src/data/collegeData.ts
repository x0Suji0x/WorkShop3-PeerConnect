// ============================================================
// COLLEGE, CLUBS & EVENTS MODULE — Mock Data & Store
// ============================================================

export interface College {
  id: string
  name: string
  shortName: string
  logoUrl: string
  coverUrl: string
  location: string
  city: string
  state: string
  description: string
  registeredStudents: number
  established: number
  type: 'Engineering' | 'Liberal Arts' | 'Management' | 'Medical' | 'Arts & Design' | 'Science'
  website: string
  clubCount: number
  upcomingEventsCount: number
}

export interface Club {
  id: string
  collegeId: string
  name: string
  logoUrl: string
  coverUrl: string
  description: string
  category: ClubCategory
  memberCount: number
  foundedYear: number
  recruitmentStatus: 'Open' | 'Closed' | 'Coming Soon'
  openings: number
  socialLinks: {
    instagram?: string
    linkedin?: string
    twitter?: string
    website?: string
  }
  coreTeam: CoreTeamMember[]
  previousActivities: Activity[]
  upcomingEvents: string[] // event IDs
}

export type ClubCategory =
  | 'Technical'
  | 'Cultural'
  | 'Photography'
  | 'Sports'
  | 'Entrepreneurship'
  | 'Marketing'
  | 'Design'
  | 'Social Service'

export interface CoreTeamMember {
  name: string
  role: string
  avatarUrl: string
}

export interface Activity {
  title: string
  description: string
  date: string
  attendees: number
}

export interface ClubOpening {
  id: string
  clubId: string
  role: string
  count: number
  headline: string // e.g. "Photography Club – Recruiting 3 photographers"
  requirements: string[]
  responsibilities: string[]
  deadline: string
}

export interface Event {
  id: string
  title: string
  clubId: string
  collegeId: string
  date: string
  endDate?: string
  time: string
  location: string
  locationType: 'On-Campus' | 'Off-Campus' | 'Online' | 'Hybrid'
  description: string
  category: ClubCategory | 'Multi-Club'
  coverUrl: string
  registrationOpen: boolean
  volunteersNeeded: number
  volunteerRoles: VolunteerRole[]
  tags: string[]
  attendeesCount: number
}

export interface VolunteerRole {
  id: string
  title: VolunteerRoleType
  count: number
  description: string
  skills: string[]
}

export type VolunteerRoleType =
  | 'Photography'
  | 'Event Coordination'
  | 'Technical Support'
  | 'Marketing'
  | 'Design'
  | 'General Volunteering'

export interface CollegeStudent {
  id: string
  collegeId: string
  name: string
  avatarUrl: string
  major: string
  year: string
  skills: string[]
  clubAffiliation?: string
  bio: string
  availability: string
}

export interface SubmittedApplication {
  id: string
  type: 'club' | 'volunteer'
  targetTitle: string
  organization: string
  collegeName: string
  applicantName: string
  applicantEmail: string
  applicantPhone?: string
  appliedDate: string
  status: 'Pending Review' | 'Under Review' | 'Interview Scheduled' | 'Accepted'
  notes?: string
  portfolio?: string
  statement?: string
}

// ----------------------------------------------------------------
// 1. COLLEGES
// ----------------------------------------------------------------
import generatedColleges from './generatedColleges.json';

export const mockColleges: College[] = generatedColleges as any;

// ----------------------------------------------------------------
// 2. CLUBS (Covering all 8 required categories)
// ----------------------------------------------------------------
export const mockClubs: Club[] = [
  {
    id: 'club1',
    collegeId: 'col1',
    name: 'Aperture Photography Club',
    logoUrl: 'https://images.unsplash.com/photo-1502920917128-1aa500764cbd?auto=format&fit=crop&w=200&q=80',
    coverUrl: 'https://images.unsplash.com/photo-1500051638674-ff996a0ec29e?auto=format&fit=crop&w=1200&q=80',
    description: 'Aperture is IIT Bombay\'s official photography club dedicated to exploring visual storytelling through the lens. From astrophotography to street documentation, we cover every genre.',
    category: 'Photography',
    memberCount: 94,
    foundedYear: 2008,
    recruitmentStatus: 'Open',
    openings: 3,
    socialLinks: {
      instagram: 'https://instagram.com/aperture_iitb',
      linkedin: 'https://linkedin.com',
      website: 'https://aperture.iitb.ac.in',
    },
    coreTeam: [
      { name: 'Riya Sharma', role: 'President', avatarUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=200&q=80' },
      { name: 'Arjun Mehta', role: 'Technical Lead', avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80' },
      { name: 'Pooja Nair', role: 'Events Head', avatarUrl: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=200&q=80' },
    ],
    previousActivities: [
      { title: 'Monsoon Frames', description: 'Campus-wide photo walk capturing the beauty of Mumbai monsoon.', date: 'August 2026', attendees: 60 },
      { title: 'Dark Room Workshop', description: 'Hands-on session on analogue film development techniques.', date: 'June 2026', attendees: 32 },
    ],
    upcomingEvents: ['evt1', 'evt4'],
  },
  {
    id: 'club2',
    collegeId: 'col1',
    name: 'E-Cell IIT Bombay',
    logoUrl: 'https://images.unsplash.com/photo-1559136555-9303baea8ebd?auto=format&fit=crop&w=200&q=80',
    coverUrl: 'https://images.unsplash.com/photo-1559136555-9303baea8ebd?auto=format&fit=crop&w=1200&q=80',
    description: 'The Entrepreneurship Cell at IIT Bombay is one of Asia\'s largest student-run entrepreneurship organisations, fostering the startup ecosystem and connecting founders with mentors and capital.',
    category: 'Entrepreneurship',
    memberCount: 215,
    foundedYear: 1998,
    recruitmentStatus: 'Open',
    openings: 5,
    socialLinks: {
      instagram: 'https://instagram.com/ecell_iitb',
      linkedin: 'https://linkedin.com',
      twitter: 'https://twitter.com/ecell_iitb',
      website: 'https://ecell.in',
    },
    coreTeam: [
      { name: 'Karan Gupta', role: 'President', avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80' },
      { name: 'Sneha Kapoor', role: 'Head of Strategy', avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80' },
    ],
    previousActivities: [
      { title: 'Eureka! 2026', description: 'Asia\'s largest business model competition attracting 10,000+ participants.', date: 'September 2026', attendees: 500 },
      { title: 'FounderTalks', description: 'Monthly speaker series with successful startup founders.', date: 'October 2026', attendees: 200 },
    ],
    upcomingEvents: ['evt2'],
  },
  {
    id: 'club3',
    collegeId: 'col4',
    name: 'Manipal Tech Club',
    logoUrl: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&w=200&q=80',
    coverUrl: 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&w=1200&q=80',
    description: 'MIT Manipal\'s largest technical club driving innovation in AI, robotics, web development, and competitive programming through workshops, hackathons, and open-source contributions.',
    category: 'Technical',
    memberCount: 320,
    foundedYear: 2003,
    recruitmentStatus: 'Open',
    openings: 7,
    socialLinks: {
      instagram: 'https://instagram.com/manipal_techclub',
      linkedin: 'https://linkedin.com',
      website: 'https://techclub.manipal.edu',
    },
    coreTeam: [
      { name: 'Nikhil Rao', role: 'President', avatarUrl: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=200&q=80' },
      { name: 'Divya Krishnan', role: 'AI Domain Lead', avatarUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=200&q=80' },
      { name: 'Rahul Singh', role: 'Robotics Lead', avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80' },
    ],
    previousActivities: [
      { title: 'HackMIT 2026', description: '24-hour hackathon with ₹1.5L prize pool and industry mentors.', date: 'July 2026', attendees: 180 },
      { title: 'AI Workshop Series', description: '5-session deep dive into LLMs, CV, and RL.', date: 'August 2026', attendees: 120 },
    ],
    upcomingEvents: ['evt3', 'evt5'],
  },
  {
    id: 'club4',
    collegeId: 'col2',
    name: 'Lens & Canvas Photography',
    logoUrl: 'https://images.unsplash.com/photo-1452587925148-ce544e77e70d?auto=format&fit=crop&w=200&q=80',
    coverUrl: 'https://images.unsplash.com/photo-1452587925148-ce544e77e70d?auto=format&fit=crop&w=1200&q=80',
    description: 'Delhi College of Art\'s creative photography and visual arts club bridging traditional fine art techniques with contemporary digital photography and documentary storytelling.',
    category: 'Photography',
    memberCount: 68,
    foundedYear: 2011,
    recruitmentStatus: 'Open',
    openings: 3,
    socialLinks: {
      instagram: 'https://instagram.com/lensandcanvas_dca',
      website: 'https://dca.ac.in/clubs/lens-canvas',
    },
    coreTeam: [
      { name: 'Meera Joshi', role: 'President', avatarUrl: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=200&q=80' },
      { name: 'Aditya Sen', role: 'Exhibitions Head', avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80' },
    ],
    previousActivities: [
      { title: 'Urban Stories Exhibition', description: 'Street photography exhibit at India Habitat Centre.', date: 'October 2026', attendees: 300 },
    ],
    upcomingEvents: ['evt4'],
  },
  {
    id: 'club5',
    collegeId: 'col3',
    name: 'Consult Club IIM-A',
    logoUrl: 'https://images.unsplash.com/photo-1664575602554-2087b04935a5?auto=format&fit=crop&w=200&q=80',
    coverUrl: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=1200&q=80',
    description: 'IIM Ahmedabad\'s premier consulting and strategy club helping students excel in case interviews, business analysis, and landing roles at top global consulting firms.',
    category: 'Entrepreneurship',
    memberCount: 110,
    foundedYear: 2001,
    recruitmentStatus: 'Coming Soon',
    openings: 0,
    socialLinks: {
      linkedin: 'https://linkedin.com',
      website: 'https://iima.ac.in/clubs',
    },
    coreTeam: [
      { name: 'Priya Verma', role: 'Club President', avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80' },
      { name: 'Rohit Agarwal', role: 'Case Prep Head', avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80' },
    ],
    previousActivities: [
      { title: 'Consult-A-Thon 2026', description: 'Live case study competition with BCG and McKinsey mentors.', date: 'September 2026', attendees: 85 },
    ],
    upcomingEvents: ['evt6'],
  },
  {
    id: 'club6',
    collegeId: 'col4',
    name: 'Manipal Design Studio',
    logoUrl: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?auto=format&fit=crop&w=200&q=80',
    coverUrl: 'https://images.unsplash.com/photo-1626785774573-4b799315345d?auto=format&fit=crop&w=1200&q=80',
    description: 'MIT Manipal\'s creative design collective working at the intersection of UX, branding, and product design — building real-world projects for student startups and campus initiatives.',
    category: 'Design',
    memberCount: 76,
    foundedYear: 2015,
    recruitmentStatus: 'Open',
    openings: 4,
    socialLinks: {
      instagram: 'https://instagram.com/manipal_designstudio',
      linkedin: 'https://linkedin.com',
    },
    coreTeam: [
      { name: 'Anjali Patel', role: 'Creative Director', avatarUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=200&q=80' },
    ],
    previousActivities: [
      { title: 'Design Sprint Week', description: '5-day product design challenge with real client briefs.', date: 'August 2026', attendees: 60 },
    ],
    upcomingEvents: ['evt5'],
  },
  {
    id: 'club7',
    collegeId: 'col6',
    name: 'NSS NIT Trichy',
    logoUrl: 'https://images.unsplash.com/photo-1593113616828-6f22bca04804?auto=format&fit=crop&w=200&q=80',
    coverUrl: 'https://images.unsplash.com/photo-1593113616828-6f22bca04804?auto=format&fit=crop&w=1200&q=80',
    description: 'The National Service Scheme unit at NIT Trichy connecting engineering students with rural communities through social impact projects in education, health, and environmental sustainability.',
    category: 'Social Service',
    memberCount: 180,
    foundedYear: 1972,
    recruitmentStatus: 'Open',
    openings: 10,
    socialLinks: {
      instagram: 'https://instagram.com/nss_nitt',
    },
    coreTeam: [
      { name: 'Surya Kumar', role: 'Programme Officer', avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80' },
      { name: 'Lakshmi R.', role: 'Secretary', avatarUrl: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=200&q=80' },
    ],
    previousActivities: [
      { title: 'Swachh Campus Drive', description: 'Campus and village cleanliness campaign with 300+ volunteers.', date: 'October 2026', attendees: 320 },
      { title: 'Teach for Trichy', description: 'Free tutoring programme for government school students.', date: 'September 2026', attendees: 150 },
    ],
    upcomingEvents: ['evt7'],
  },
  {
    id: 'club8',
    collegeId: 'col5',
    name: 'SID Marketing Club',
    logoUrl: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=200&q=80',
    coverUrl: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1200&q=80',
    description: 'Symbiosis Institute of Design\'s marketing and brand strategy club where designers learn to position products, craft campaigns, and build memorable brand narratives.',
    category: 'Marketing',
    memberCount: 55,
    foundedYear: 2010,
    recruitmentStatus: 'Open',
    openings: 4,
    socialLinks: {
      instagram: 'https://instagram.com/sid_marketing',
      linkedin: 'https://linkedin.com',
    },
    coreTeam: [
      { name: 'Ishaan Kapoor', role: 'President', avatarUrl: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=200&q=80' },
    ],
    previousActivities: [
      { title: 'Brand Blitz', description: 'Inter-college brand strategy competition with live client brief.', date: 'September 2026', attendees: 80 },
    ],
    upcomingEvents: [],
  },
  {
    id: 'club9',
    collegeId: 'col1',
    name: 'Dhwani Cultural & Music Society',
    logoUrl: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=200&q=80',
    coverUrl: 'https://images.unsplash.com/photo-1465847899084-d164df4dedc6?auto=format&fit=crop&w=1200&q=80',
    description: 'IIT Bombay\'s flagship cultural society bringing together classical, fusion, rock music, theatre, and dance. Dhwani organizes Mood Indigo music showcases and university-level competitions.',
    category: 'Cultural',
    memberCount: 145,
    foundedYear: 1982,
    recruitmentStatus: 'Open',
    openings: 5,
    socialLinks: {
      instagram: 'https://instagram.com/dhwani_iitb',
      website: 'https://dhwani.iitb.ac.in',
    },
    coreTeam: [
      { name: 'Varun Iyer', role: 'Cultural Secretary', avatarUrl: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=200&q=80' },
      { name: 'Tanvi Deshmukh', role: 'Music Director', avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80' },
    ],
    previousActivities: [
      { title: 'Acoustic Unplugged', description: 'Open-air acoustic evening by the Powai lakeside.', date: 'October 2026', attendees: 240 },
      { title: 'Battle of the Bands', description: 'Inter-hostel live music competition.', date: 'August 2026', attendees: 450 },
    ],
    upcomingEvents: ['evt8'],
  },
  {
    id: 'club10',
    collegeId: 'col4',
    name: 'Strikers Sports & Athletics Club',
    logoUrl: 'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?auto=format&fit=crop&w=200&q=80',
    coverUrl: 'https://images.unsplash.com/photo-1517649763962-0c623266ddc0?auto=format&fit=crop&w=1200&q=80',
    description: 'MIT Manipal\'s central athletics and sports council managing football, basketball, track & field, and marathon teams. Host of the national inter-university tournament Revels Cup.',
    category: 'Sports',
    memberCount: 260,
    foundedYear: 1992,
    recruitmentStatus: 'Open',
    openings: 4,
    socialLinks: {
      instagram: 'https://instagram.com/strikers_manipal',
      website: 'https://sports.manipal.edu',
    },
    coreTeam: [
      { name: 'Samarjeet Gill', role: 'Sports Captain', avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80' },
      { name: 'Pooja Reddy', role: 'Fitness & Events Lead', avatarUrl: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=200&q=80' },
    ],
    previousActivities: [
      { title: 'Manipal Night Run 10K', description: 'Annual night marathon with 800+ participants.', date: 'September 2026', attendees: 800 },
      { title: 'Inter-Collegiate Football Cup', description: '16 college teams competing for the state trophy.', date: 'October 2026', attendees: 500 },
    ],
    upcomingEvents: ['evt9'],
  },
  {
    id: 'club11',
    collegeId: 'col2',
    name: 'Tarang Cultural Troupe',
    logoUrl: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=200&q=80',
    coverUrl: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=1200&q=80',
    description: 'Delhi College of Art\'s performing arts and theatre collective blending street plays (Nukkad Natak), classical kathak fusion, and contemporary performance art to address social themes.',
    category: 'Cultural',
    memberCount: 82,
    foundedYear: 2005,
    recruitmentStatus: 'Open',
    openings: 3,
    socialLinks: {
      instagram: 'https://instagram.com/tarang_dca',
    },
    coreTeam: [
      { name: 'Radhika Sen', role: 'Troupe Leader', avatarUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=200&q=80' },
    ],
    previousActivities: [
      { title: 'Dilli Dastak Street Play', description: 'Nukkad Natak on environmental sustainability performed at Connaught Place.', date: 'September 2026', attendees: 400 },
    ],
    upcomingEvents: [],
  },
  {
    id: 'club12',
    collegeId: 'col6',
    name: 'Trichy Coding & Robotics Club',
    logoUrl: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?auto=format&fit=crop&w=200&q=80',
    coverUrl: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?auto=format&fit=crop&w=1200&q=80',
    description: 'NIT Trichy\'s technical community specializing in autonomous bots, embedded systems, drone development, and competitive programming with international accolades.',
    category: 'Technical',
    memberCount: 195,
    foundedYear: 2004,
    recruitmentStatus: 'Open',
    openings: 3,
    socialLinks: {
      instagram: 'https://instagram.com/tcrc_nitt',
      linkedin: 'https://linkedin.com',
    },
    coreTeam: [
      { name: 'Karthik S.', role: 'Lead Architect', avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80' },
    ],
    previousActivities: [
      { title: 'RoboWars 2026', description: 'Combative robotics arena with 24 teams from across South India.', date: 'August 2026', attendees: 350 },
    ],
    upcomingEvents: [],
  },
  {
    id: 'club-adypu-innovation',
    collegeId: 'col-adypu-pune',
    name: 'ADYPU Design Thinking & AI Guild',
    logoUrl: 'https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&w=200&q=80',
    coverUrl: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=1200&q=80',
    description: "ADYPU's premier cross-disciplinary guild bringing together product designers, AI engineers, and automotive innovators building tangible future-tech prototypes.",
    category: 'Design',
    memberCount: 140,
    foundedYear: 2018,
    recruitmentStatus: 'Open',
    openings: 5,
    socialLinks: {
      instagram: 'https://instagram.com/adypu_guild',
      linkedin: 'https://linkedin.com',
      website: 'https://adypu.edu.in',
    },
    coreTeam: [
      { name: 'Sameer Joshi', role: 'President', avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80' },
      { name: 'Aanya Patil', role: 'Design Lead', avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80' },
    ],
    previousActivities: [
      { title: 'Future Mobility Sprint', description: '48-hour electric vehicle UI/UX hackathon.', date: 'September 2026', attendees: 120 },
    ],
    upcomingEvents: ['evt-adypu-1'],
  },
  {
    id: 'club-mastersunion-vc',
    collegeId: 'col-masters-union-gurugram',
    name: "Masters' Union Venture & PE Club",
    logoUrl: 'https://images.unsplash.com/photo-1551836022-d5d88e9218df?auto=format&fit=crop&w=200&q=80',
    coverUrl: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1200&q=80',
    description: "Masters' Union student-run venture syndicate where students analyze real tech startups, conduct investment due diligence, and shadow partner VCs in Gurugram.",
    category: 'Entrepreneurship',
    memberCount: 95,
    foundedYear: 2021,
    recruitmentStatus: 'Open',
    openings: 4,
    socialLinks: {
      linkedin: 'https://linkedin.com',
      website: 'https://mastersunion.org',
    },
    coreTeam: [
      { name: 'Kabir Singhania', role: 'Managing Partner', avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80' },
      { name: 'Mehak Chawla', role: 'Research Lead', avatarUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=200&q=80' },
    ],
    previousActivities: [
      { title: 'Cyber City Angel Pitch', description: 'Live deal-room pitching with 15 venture funds.', date: 'October 2026', attendees: 160 },
    ],
    upcomingEvents: ['evt-mu-1'],
  },
  {
    id: 'club-upgrad-pune-devs',
    collegeId: 'col-upgrad-tech-pune',
    name: 'upGrad Pune Code & Cloud Collective',
    logoUrl: 'https://images.unsplash.com/photo-1618401471353-b98afee0b2eb?auto=format&fit=crop&w=200&q=80',
    coverUrl: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&w=1200&q=80',
    description: 'Hands-on developer group building open-source projects, high-throughput microservices, and micro-frontend architectures in Pune.',
    category: 'Technical',
    memberCount: 88,
    foundedYear: 2023,
    recruitmentStatus: 'Open',
    openings: 6,
    socialLinks: {
      instagram: 'https://instagram.com/upgradtech_pune',
      website: 'https://upgrad.com',
    },
    coreTeam: [
      { name: 'Aditya Deshpande', role: 'Lead Architect', avatarUrl: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=200&q=80' },
    ],
    previousActivities: [
      { title: 'Cloud Deploy 101', description: 'Zero-downtime Kubernetes CI/CD workshop.', date: 'August 2026', attendees: 75 },
    ],
    upcomingEvents: ['evt-upgrad-pune-1'],
  },
  {
    id: 'club-upgrad-blr-ai',
    collegeId: 'col-upgrad-tech-bengaluru',
    name: 'upGrad BLR Agentic AI & Robotics Society',
    logoUrl: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?auto=format&fit=crop&w=200&q=80',
    coverUrl: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=1200&q=80',
    description: "Bengaluru's flagship student AI society building autonomous agent swarms, fine-tuned SLMs, and spatial compute experiments in Electronic City.",
    category: 'Technical',
    memberCount: 110,
    foundedYear: 2023,
    recruitmentStatus: 'Open',
    openings: 8,
    socialLinks: {
      instagram: 'https://instagram.com/upgradtech_blr',
      website: 'https://upgrad.com',
    },
    coreTeam: [
      { name: 'Siddharth Iyer', role: 'AI Lead', avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80' },
      { name: 'Pooja Hegde', role: 'Hackathon Director', avatarUrl: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=200&q=80' },
    ],
    previousActivities: [
      { title: 'Electronic City AI Sprint', description: '36-hour hackathon with 40 builder teams.', date: 'September 2026', attendees: 140 },
    ],
    upcomingEvents: ['evt-upgrad-blr-1'],
  },
]

// ----------------------------------------------------------------
// 3. CLUB OPENINGS (Recruitment Listings)
// ----------------------------------------------------------------
export const mockClubOpenings: ClubOpening[] = [
  {
    id: 'op1',
    clubId: 'club1',
    role: 'Photographer',
    count: 3,
    headline: 'Photography Club – Recruiting 3 photographers.',
    requirements: [
      'Own DSLR or mirrorless camera',
      'Solid command of manual exposure (aperture, shutter speed, ISO)',
      'Portfolio of minimum 10 photos (landscapes, events, or portraits)',
      'Familiarity with Adobe Lightroom or open-source RAW processors',
    ],
    responsibilities: [
      'Cover campus events, student festivals, and official ceremonies',
      'Contribute to the monthly themed campus photo exhibition series',
      'Mentor junior members during weekend photo walks',
      'Manage club Instagram showcase galleries and photo curation',
    ],
    deadline: '2026-12-15',
  },
  {
    id: 'op2',
    clubId: 'club2',
    role: 'Strategy & Research Analyst',
    count: 2,
    headline: 'E-Cell IIT Bombay – Recruiting 2 Strategy Analysts.',
    requirements: [
      'Strong analytical thinking and interest in Indian startup ecosystems',
      'Excellent written communication and presentation deck skills',
      'Ability to liaise with founders, angel investors, and accelerator directors',
    ],
    responsibilities: [
      'Research early-stage startup trends and curate pitch opportunities',
      'Assist in vetting student ventures applying for seed grants',
      'Draft case studies and publish the monthly campus venture newsletter',
    ],
    deadline: '2026-12-20',
  },
  {
    id: 'op3',
    clubId: 'club2',
    role: 'Events Coordinator',
    count: 3,
    headline: 'E-Cell IIT Bombay – Recruiting 3 Events Coordinators.',
    requirements: [
      'Prior on-ground event management experience preferred',
      'High attention to detail and ability to coordinate large crowds',
      'Availability on scheduled event weekends and evenings',
    ],
    responsibilities: [
      'Coordinate logistics for Eureka! and FounderTalks speaker series',
      'Liaise with visiting VCs, mentors, and keynote speakers',
      'Manage stage operations, registration desks, and volunteer teams',
    ],
    deadline: '2026-12-20',
  },
  {
    id: 'op4',
    clubId: 'club3',
    role: 'Full-Stack Web Developer',
    count: 4,
    headline: 'Manipal Tech Club – Recruiting 4 Full-Stack Web Developers.',
    requirements: [
      'Proficiency in modern TypeScript, React, and REST / GraphQL APIs',
      'Clean Git workflow and collaborative open-source experience',
      'Understanding of responsive UI and web performance optimization',
    ],
    responsibilities: [
      'Develop and maintain student portals and hackathon platforms',
      'Build internal automation tools and club discord/slack integrations',
      'Conduct beginner workshops on modern frontend development',
    ],
    deadline: '2026-12-18',
  },
  {
    id: 'op5',
    clubId: 'club3',
    role: 'AI / ML Research Associate',
    count: 3,
    headline: 'Manipal Tech Club – Recruiting 3 AI / ML Researchers.',
    requirements: [
      'Strong Python foundations and familiarity with PyTorch or TensorFlow',
      'Understanding of modern transformer architectures, LLMs, or Vision models',
      'Demonstrated project or Kaggle / research paper experience',
    ],
    responsibilities: [
      'Collaborate on student research papers submitted to student conferences',
      'Build generative AI demos and domain-specific campus assistants',
      'Lead AI hands-on labs for first-year engineering students',
    ],
    deadline: '2026-12-18',
  },
  {
    id: 'op6',
    clubId: 'club4',
    role: 'Documentary Photographer',
    count: 3,
    headline: 'Lens & Canvas – Recruiting 3 Documentary Photographers.',
    requirements: [
      'Keen eye for candid street composition and natural light',
      'Demonstrated portfolio in documentary or fine art photography',
      'Interest in mixed-media exhibitions and gallery printing',
    ],
    responsibilities: [
      'Document Delhi\'s historical monuments and urban subcultures',
      'Curate prints for the annual winter exhibition at Habitat Centre',
      'Produce visual essays for the DCA quarterly design journal',
    ],
    deadline: '2026-12-10',
  },
  {
    id: 'op7',
    clubId: 'club6',
    role: 'Product & UX Designer',
    count: 2,
    headline: 'Manipal Design Studio – Recruiting 2 Product & UX Designers.',
    requirements: [
      'Figma expertise including auto-layout, design tokens, and prototyping',
      'Portfolio demonstrating user journeys, wireframes, and testable prototypes',
      'Solid appreciation for micro-interactions and design systems',
    ],
    responsibilities: [
      'Design user experiences for campus startups incubated on campus',
      'Collaborate with developers to ensure design fidelity',
      'Host bi-weekly design critique and Figma tip sessions',
    ],
    deadline: '2026-12-22',
  },
  {
    id: 'op8',
    clubId: 'club6',
    role: 'Visual Brand Designer',
    count: 2,
    headline: 'Manipal Design Studio – Recruiting 2 Visual Brand Designers.',
    requirements: [
      'Adobe Illustrator & Photoshop proficiency',
      'Strong typographic sensibility, color theory, and layout aesthetics',
      'Experience crafting identities, posters, or digital media assets',
    ],
    responsibilities: [
      'Design event branding, identity collateral, and social motion assets',
      'Work with campus student initiatives to elevate visual identity',
    ],
    deadline: '2026-12-22',
  },
  {
    id: 'op9',
    clubId: 'club7',
    role: 'Community Outreach Volunteer',
    count: 10,
    headline: 'NSS NIT Trichy – Recruiting 10 Community Volunteers.',
    requirements: [
      'High passion for grassroots social work and community welfare',
      'Willingness to dedicate 3-4 hours on weekends for field visits',
      'Fluency in Tamil or English for community communication',
    ],
    responsibilities: [
      'Participate in rural village visits and tutoring government school students',
      'Organize campus blood donation and e-waste recycling drives',
      'Document field activities and compile project impact reports',
    ],
    deadline: '2026-12-31',
  },
  {
    id: 'op10',
    clubId: 'club8',
    role: 'Digital Marketing Strategist',
    count: 2,
    headline: 'SID Marketing Club – Recruiting 2 Digital Marketing Strategists.',
    requirements: [
      'Interest in consumer psychology, brand storytelling, and campaign analytics',
      'Strong copycraft and experience with Instagram reels / LinkedIn threads',
    ],
    responsibilities: [
      'Develop campaign growth blueprints for student business initiatives',
      'Manage club brand voice across digital and on-campus touchpoints',
    ],
    deadline: '2026-12-25',
  },
  {
    id: 'op11',
    clubId: 'club8',
    role: 'Content Creator',
    count: 2,
    headline: 'SID Marketing Club – Recruiting 2 Content Creators.',
    requirements: [
      'Skilled in short-form video editing (Premiere / CapCut / After Effects)',
      'Storyboarding and narrative pacing skills',
    ],
    responsibilities: [
      'Create high-engagement reels capturing design studio work in progress',
      'Interview student designers and produce behind-the-scenes content',
    ],
    deadline: '2026-12-25',
  },
  {
    id: 'op12',
    clubId: 'club9',
    role: 'Performing Artist & Vocalist',
    count: 3,
    headline: 'Dhwani Cultural Society – Recruiting 3 Performing Vocalists.',
    requirements: [
      'Training or natural aptitude in vocal music (Indian classical, western, or acoustic)',
      'Ability to perform live on stage and blend in vocal harmonies',
      'Commitment to scheduled band rehearsals leading up to cultural fest',
    ],
    responsibilities: [
      'Perform as part of Dhwani core ensemble at inter-collegiate festivals',
      'Contribute to composing original band tracks and acoustic covers',
      'Assist in sound testing and stage rehearsals for music showcases',
    ],
    deadline: '2026-12-16',
  },
  {
    id: 'op13',
    clubId: 'club9',
    role: 'Stage & Production Coordinator',
    count: 2,
    headline: 'Dhwani Cultural Society – Recruiting 2 Stage Coordinators.',
    requirements: [
      'Interest in live performance staging, sound engineering, and backstage flow',
      'Calm problem-solving under fast-paced live festival conditions',
    ],
    responsibilities: [
      'Manage backstage equipment, instrument changeovers, and artist call sheets',
      'Coordinate sound checks and lighting cues with campus technicians',
    ],
    deadline: '2026-12-16',
  },
  {
    id: 'op14',
    clubId: 'club10',
    role: 'Sports Coordinator & Fitness Lead',
    count: 4,
    headline: 'Strikers Sports Club – Recruiting 4 Sports Coordinators.',
    requirements: [
      'Passion for sports (football, basketball, badminton, or athletics)',
      'Leadership and crowd organization skills',
      'First-aid awareness or eagerness to be certified',
    ],
    responsibilities: [
      'Officiate and schedule league fixtures during inter-hostel tournaments',
      'Supervise campus gym training facilities and equipment upkeep',
      'Coordinate athlete hospitality and medical desk during Revels Cup',
    ],
    deadline: '2026-12-24',
  },
]

// ----------------------------------------------------------------
// 4. EVENTS (Showing all 7 required fields)
// ----------------------------------------------------------------
export const mockEvents: Event[] = [
  {
    id: 'evt1',
    title: 'GoldenHour PhotoWalk — Marine Drive',
    clubId: 'club1',
    collegeId: 'col1',
    date: '2026-12-05',
    time: '5:30 PM',
    location: 'Marine Drive Promenade, Mumbai',
    locationType: 'Off-Campus',
    description: 'Join Aperture for our signature sunset photo walk along Marine Drive. Capture Mumbai\'s golden hour, art-deco architecture, and street life alongside fellow photographers with expert mentoring on aperture and street composition.',
    category: 'Photography',
    coverUrl: 'https://images.unsplash.com/photo-1500051638674-ff996a0ec29e?auto=format&fit=crop&w=1200&q=80',
    registrationOpen: true,
    volunteersNeeded: 5,
    volunteerRoles: [
      { id: 'vr1', title: 'Photography', count: 2, description: 'Document attendees and capture behind-the-scenes portraits for club archives.', skills: ['DSLR/Mirrorless', 'Street Candid', 'RAW Editing'] },
      { id: 'vr2', title: 'Event Coordination', count: 2, description: 'Manage attendee check-ins, guide small groups, and maintain promenade route safety.', skills: ['Communication', 'Crowd Management', 'Route Planning'] },
      { id: 'vr3', title: 'General Volunteering', count: 1, description: 'Help with water distribution, emergency kit carrying, and attendee inquiries.', skills: ['Patience', 'Team Spirit'] },
    ],
    tags: ['Photography', 'PhotoWalk', 'Mumbai', 'Sunset', 'StreetArt'],
    attendeesCount: 42,
  },
  {
    id: 'evt2',
    title: 'Startup Pitch Night — Cohort 7',
    clubId: 'club2',
    collegeId: 'col1',
    date: '2026-12-08',
    time: '6:00 PM',
    location: 'Victor Menezes Convention Centre, IIT Bombay',
    locationType: 'On-Campus',
    description: 'E-Cell\'s flagship monthly pitch event where 10 selected student startups pitch to an elite panel of angel investors and seed VCs. Features live Q&A, demo tables, and a high-value networking mixer.',
    category: 'Entrepreneurship',
    coverUrl: 'https://images.unsplash.com/photo-1559136555-9303baea8ebd?auto=format&fit=crop&w=1200&q=80',
    registrationOpen: true,
    volunteersNeeded: 10,
    volunteerRoles: [
      { id: 'vr4', title: 'Photography', count: 2, description: 'Capture stage pitches, investor reactions, and post-pitch networking candids.', skills: ['Low-Light Photography', 'Flash Photography'] },
      { id: 'vr5', title: 'Technical Support', count: 3, description: 'Operate podium microphones, projector switching, and livestream stream decks.', skills: ['AV Hardware', 'OBS Studio', 'Audio Mixing'] },
      { id: 'vr6', title: 'Marketing', count: 2, description: 'Live-tweet pitch highlights, capture founder reel quotes, and upload instant stories.', skills: ['Copywriting', 'Mobile Video', 'Social Media'] },
      { id: 'vr7', title: 'Event Coordination', count: 3, description: 'Manage VIP investor lounge reception, badge verification, and speaker timekeeping.', skills: ['Hospitality', 'Time Management', 'Professional Demeanour'] },
    ],
    tags: ['Startup', 'Pitch', 'VentureCapital', 'Innovation', 'Networking'],
    attendeesCount: 180,
  },
  {
    id: 'evt3',
    title: 'HackMIT 2.0 — 36-Hour National Hackathon',
    clubId: 'club3',
    collegeId: 'col4',
    date: '2026-12-13',
    endDate: '2026-12-14',
    time: '9:00 AM',
    location: 'Innovation Centre, MIT Manipal',
    locationType: 'On-Campus',
    description: 'Manipal Tech Club\'s flagship 36-hour hackathon. 80 teams building solutions across AI, FinTech, Web3, and HealthTech tracks. ₹2.5 Lakhs in prizes, cloud credits, and direct interview fast-tracks.',
    category: 'Technical',
    coverUrl: 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&w=1200&q=80',
    registrationOpen: true,
    volunteersNeeded: 20,
    volunteerRoles: [
      { id: 'vr8', title: 'Photography', count: 3, description: 'Document coding marathons, team huddles, prototype demos, and trophy presentations.', skills: ['Event Photography', 'Fast Curation'] },
      { id: 'vr9', title: 'Technical Support', count: 8, description: 'Assist hacker teams with network cables, API token setups, and hardware bench issues.', skills: ['Linux', 'Cloud Platforms', 'Git Debugging'] },
      { id: 'vr10', title: 'Event Coordination', count: 5, description: 'Manage team desk assignments, midnight snack drops, mentor scheduling, and stage timer.', skills: ['Multitasking', 'Stamina', 'Team Leadership'] },
      { id: 'vr11', title: 'General Volunteering', count: 4, description: 'Help setup tables, manage swag kits, distribute badges, and handle venue operations.', skills: ['Reliability', 'Cooperation'] },
    ],
    tags: ['Hackathon', 'AI', 'Coding', '36Hours', 'Prizes', 'Manipal'],
    attendeesCount: 320,
  },
  {
    id: 'evt4',
    title: 'Frames & Stories — Annual Photo Exhibition',
    clubId: 'club1',
    collegeId: 'col1',
    date: '2026-12-18',
    time: '11:00 AM',
    location: 'Student Activity Centre Gallery, IIT Bombay',
    locationType: 'On-Campus',
    description: 'Aperture\'s annual gallery exhibition presenting 80+ curated prints by student photographers. Includes artist talks, live darkroom printing demonstrations, and a print sales counter supporting charity.',
    category: 'Photography',
    coverUrl: 'https://images.unsplash.com/photo-1502920917128-1aa500764cbd?auto=format&fit=crop&w=1200&q=80',
    registrationOpen: false,
    volunteersNeeded: 8,
    volunteerRoles: [
      { id: 'vr12', title: 'Design', count: 2, description: 'Layout exhibition display walls, design artist label plaques, and print visitor brochures.', skills: ['Typography', 'Gallery Layout', 'Print Production'] },
      { id: 'vr13', title: 'Event Coordination', count: 3, description: 'Escort faculty and visitors, handle guest book entries, and oversee gallery lighting.', skills: ['Communication', 'Art Appreciation'] },
      { id: 'vr14', title: 'Marketing', count: 2, description: 'Photograph visitor interactions and stream artist talk sessions online.', skills: ['Social Media', 'Interviewing'] },
      { id: 'vr15', title: 'General Volunteering', count: 1, description: 'Assist with gallery opening setup, print mounting, and reception desk.', skills: ['Careful Handling', 'Helpfulness'] },
    ],
    tags: ['Exhibition', 'ArtGallery', 'Photography', 'Curated', 'Prints'],
    attendeesCount: 250,
  },
  {
    id: 'evt5',
    title: 'Design Bytes — UX & Product Design Symposium',
    clubId: 'club6',
    collegeId: 'col4',
    date: '2026-12-20',
    time: '10:00 AM',
    location: 'Sir M.V. Seminar Hall, MIT Manipal',
    locationType: 'On-Campus',
    description: 'A full-day design symposium featuring keynote design leaders from Swiggy, Razorpay, and CRED. Includes hands-on workshops on design systems, mobile UX research, and motion micro-interactions.',
    category: 'Design',
    coverUrl: 'https://images.unsplash.com/photo-1626785774573-4b799315345d?auto=format&fit=crop&w=1200&q=80',
    registrationOpen: true,
    volunteersNeeded: 12,
    volunteerRoles: [
      { id: 'vr16', title: 'Photography', count: 2, description: 'Shoot speakers on stage, interactive audience workshops, and whiteboard design sessions.', skills: ['Indoor Photography', 'Candid Portraits'] },
      { id: 'vr17', title: 'Design', count: 3, description: 'Design slide title cards, workshop handouts, digital stage banners, and directional signs.', skills: ['Figma', 'Brand Identity', 'Print Layout'] },
      { id: 'vr18', title: 'Technical Support', count: 3, description: 'Manage stage presentation clickers, workshop Figma mirror displays, and stream audio.', skills: ['Figma Live', 'Audio Equipment', 'Display Setup'] },
      { id: 'vr19', title: 'Marketing', count: 2, description: 'Draft live session takeaways, tweet key speaker quotes, and publish LinkedIn recaps.', skills: ['Design Writing', 'Social Media'] },
      { id: 'vr20', title: 'Event Coordination', count: 2, description: 'Host registration desks, guide speakers to green room, and manage audience Q&A mics.', skills: ['Hospitality', 'Stage Presence'] },
    ],
    tags: ['Design', 'UX', 'Figma', 'ProductDesign', 'Workshop', 'Symposium'],
    attendeesCount: 190,
  },
  {
    id: 'evt6',
    title: 'Case Crunch 2026 — National Consulting Cup',
    clubId: 'club5',
    collegeId: 'col3',
    date: '2027-01-10',
    time: '8:00 AM',
    location: 'K.L. Murgai Auditorium, IIM Ahmedabad',
    locationType: 'On-Campus',
    description: 'IIM Ahmedabad\'s premier nationwide consulting case challenge. 24 finalist teams crack a real-time ESG supply chain strategy case under a 90-minute time cap before McKinsey and BCG jury members.',
    category: 'Entrepreneurship',
    coverUrl: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=1200&q=80',
    registrationOpen: true,
    volunteersNeeded: 15,
    volunteerRoles: [
      { id: 'vr21', title: 'Event Coordination', count: 6, description: 'Supervise breakout case deliberation rooms, enforce strict timers, and coordinate jury scoring.', skills: ['Process Rigour', 'Timekeeping', 'Confidentiality'] },
      { id: 'vr22', title: 'Technical Support', count: 4, description: 'Distribute encrypted case briefs, support deck projections, and verify score tabulations.', skills: ['Google Sheets', 'Secure File Sharing', 'AV Controls'] },
      { id: 'vr23', title: 'Photography', count: 2, description: 'Document high-pressure boardroom presentations, jury feedback, and awards ceremony.', skills: ['Executive Photography', 'Discreet Coverage'] },
      { id: 'vr24', title: 'General Volunteering', count: 3, description: 'Provide hospitality to corporate delegates, manage delegate kits, and guide attendees.', skills: ['Professional Demeanour', 'Reliability'] },
    ],
    tags: ['Consulting', 'CaseCompetition', 'Strategy', 'Business', 'IIMA'],
    attendeesCount: 210,
  },
  {
    id: 'evt7',
    title: 'Green Campus Mela — Zero-Waste Fair',
    clubId: 'club7',
    collegeId: 'col6',
    date: '2026-12-22',
    time: '9:00 AM',
    location: 'NIT Trichy Central Lawn, Tiruchirappalli',
    locationType: 'On-Campus',
    description: 'NSS NIT Trichy\'s annual sustainability fair featuring zero-waste stalls, recycled art installations, a 1,000-sapling plantation marathon, solar tech demos, and environmental workshops for rural kids.',
    category: 'Social Service',
    coverUrl: 'https://images.unsplash.com/photo-1593113616828-6f22bca04804?auto=format&fit=crop&w=1200&q=80',
    registrationOpen: true,
    volunteersNeeded: 30,
    volunteerRoles: [
      { id: 'vr25', title: 'General Volunteering', count: 15, description: 'Manage plantation pits, guide school children, oversee waste sorting bins, and water trees.', skills: ['Physical Stamina', 'Enthusiasm', 'Teamwork'] },
      { id: 'vr26', title: 'Photography', count: 3, description: 'Capture plantation milestones, student volunteer interactions, and drone overheads.', skills: ['Outdoor Photography', 'Candid Moments'] },
      { id: 'vr27', title: 'Marketing', count: 5, description: 'Run the green pledge signature campaign and broadcast live stories to campus channels.', skills: ['Campaigning', 'Storytelling'] },
      { id: 'vr28', title: 'Event Coordination', count: 7, description: 'Coordinate 30+ exhibition stall allocations, volunteer shift rotations, and medical desk.', skills: ['Leadership', 'Logistics'] },
    ],
    tags: ['Sustainability', 'SocialService', 'Environment', 'TreePlantation', 'NITTrichy'],
    attendeesCount: 400,
  },
  {
    id: 'evt8',
    title: 'Dhwani Fest 2026 — Inter-University Music Showcase',
    clubId: 'club9',
    collegeId: 'col1',
    date: '2026-12-28',
    time: '5:00 PM',
    location: 'Open Air Theatre (OAT), IIT Bombay',
    locationType: 'On-Campus',
    description: 'An open-air evening celebrating Indian classical fusion, rock bands, and acoustic ensembles across 12 university troupes under the stars. Special guest judging by celebrated alumni artists.',
    category: 'Cultural',
    coverUrl: 'https://images.unsplash.com/photo-1465847899084-d164df4dedc6?auto=format&fit=crop&w=1200&q=80',
    registrationOpen: true,
    volunteersNeeded: 18,
    volunteerRoles: [
      { id: 'vr29', title: 'Event Coordination', count: 6, description: 'Manage artist backstage queues, green room requirements, and VIP seating hospitality.', skills: ['Stage Coordination', 'Communication'] },
      { id: 'vr30', title: 'Technical Support', count: 5, description: 'Set up audio monitors, microphone cords, amplifier stacks, and lighting rigs.', skills: ['Live Sound', 'Stage Lighting', 'Audio Patching'] },
      { id: 'vr31', title: 'Photography', count: 4, description: 'Capture live stage performance motion, stage pyrotechnics, and crowd reactions.', skills: ['Low-Light Concert Photography', 'Dynamic Shots'] },
      { id: 'vr32', title: 'Marketing', count: 3, description: 'Broadcast live streams, interview band leads right off stage, and publish reel recaps.', skills: ['Live Streaming', 'Reel Editing'] },
    ],
    tags: ['Music', 'Cultural', 'BandBattle', 'Concert', 'IITBombay', 'LiveOAT'],
    attendeesCount: 650,
  },
  {
    id: 'evt9',
    title: 'Manipal Inter-Collegiate Revels Cup 2026',
    clubId: 'club10',
    collegeId: 'col4',
    date: '2027-01-15',
    endDate: '2027-01-17',
    time: '7:30 AM',
    location: 'Marena Indoor Sports Complex, MIT Manipal',
    locationType: 'On-Campus',
    description: '3-day inter-collegiate sports festival bringing 32 universities together in football, basketball, badminton, and 4x100m relays. Features professional referees and live video scoreboards.',
    category: 'Sports',
    coverUrl: 'https://images.unsplash.com/photo-1517649763962-0c623266ddc0?auto=format&fit=crop&w=1200&q=80',
    registrationOpen: true,
    volunteersNeeded: 22,
    volunteerRoles: [
      { id: 'vr33', title: 'Event Coordination', count: 8, description: 'Coordinate team match lineups, score table verification, and referee support across courts.', skills: ['Sports Rules', 'Scorekeeping', 'Decisiveness'] },
      { id: 'vr34', title: 'General Volunteering', count: 6, description: 'Court water attendants, ball boys, player warm-up zone management, and trophy staging.', skills: ['Agility', 'Teamwork', 'Punctuality'] },
      { id: 'vr35', title: 'Photography', count: 4, description: 'Shoot high-shutter sports action, winning goals, team celebrations, and podium ceremonies.', skills: ['Telephoto Action', 'Burst Photography'] },
      { id: 'vr36', title: 'Marketing', count: 4, description: 'Update digital live scoreboard tickers, interview player of the match, and manage reels.', skills: ['Sports Journalism', 'Fast Social Posting'] },
    ],
    tags: ['Sports', 'Football', 'Basketball', 'Athletics', 'RevelsCup', 'Tournament'],
    attendeesCount: 520,
  },
  {
    id: 'evt-adypu-1',
    title: 'ADYPU Design Conclave & Future Hack',
    clubId: 'club-adypu-innovation',
    collegeId: 'col-adypu-pune',
    date: '2026-11-28',
    time: '10:00 AM - 6:00 PM',
    location: 'ADYPU Innovation Dome, Lohegaon, Pune',
    locationType: 'On-Campus',
    description: 'Annual inter-college showcase of speculative design, generative AI UI, and sustainable industrial products with automotive leaders.',
    category: 'Design',
    coverUrl: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&w=1200&q=80',
    registrationOpen: true,
    volunteersNeeded: 6,
    volunteerRoles: [
      {
        id: 'vr-adypu-1',
        title: 'Event Coordination',
        count: 4,
        description: 'Coordinate visiting design leads and student showcase booths.',
        skills: ['Team Coordination', 'Communication'],
      },
      {
        id: 'vr-adypu-2',
        title: 'Design',
        count: 2,
        description: 'Assist with live display badges and digital projections.',
        skills: ['Figma', 'Graphic Design'],
      },
    ],
    tags: ['Design', 'Hackathon', 'AI', 'Automotive'],
    attendeesCount: 220,
  },
  {
    id: 'evt-mu-1',
    title: "Masters' Union Cyber City Demo Day",
    clubId: 'club-mastersunion-vc',
    collegeId: 'col-masters-union-gurugram',
    date: '2026-12-05',
    time: '2:00 PM - 7:30 PM',
    location: 'DLF Cyber City Auditorium, Tower 10, Gurugram',
    locationType: 'On-Campus',
    description: 'High-stakes student startup demo day pitching before 20+ Tier-1 seed venture capital funds and angel syndicates.',
    category: 'Entrepreneurship',
    coverUrl: 'https://images.unsplash.com/photo-1475721027785-f74eccf877e2?auto=format&fit=crop&w=1200&q=80',
    registrationOpen: true,
    volunteersNeeded: 4,
    volunteerRoles: [
      {
        id: 'vr-mu-1',
        title: 'Event Coordination',
        count: 4,
        description: 'Manage investor check-in and stage mic handling.',
        skills: ['Professionalism', 'Event Ops'],
      },
    ],
    tags: ['Startups', 'Venture Capital', 'Pitch', 'Founders'],
    attendeesCount: 180,
  },
  {
    id: 'evt-upgrad-pune-1',
    title: 'upGrad Pune Full-Stack & DevRel Summit',
    clubId: 'club-upgrad-pune-devs',
    collegeId: 'col-upgrad-tech-pune',
    date: '2026-12-02',
    time: '11:00 AM - 5:00 PM',
    location: 'Tech Hub Arena, upGrad Campus, Lohegaon, Pune',
    locationType: 'On-Campus',
    description: 'Deep dive into modern web architecture, edge compute, and building high-performance dev communities.',
    category: 'Technical',
    coverUrl: 'https://images.unsplash.com/photo-1517048676732-d65bc937f952?auto=format&fit=crop&w=1200&q=80',
    registrationOpen: true,
    volunteersNeeded: 5,
    volunteerRoles: [
      {
        id: 'vr-ugp-1',
        title: 'Technical Support',
        count: 3,
        description: 'Set up audio-visual, live stream, and WiFi debugging for coders.',
        skills: ['AV Setup', 'Linux / Networking'],
      },
    ],
    tags: ['FullStack', 'WebDev', 'PuneTech', 'OpenSource'],
    attendeesCount: 150,
  },
  {
    id: 'evt-upgrad-blr-1',
    title: 'Bengaluru Agent Hack 2026',
    clubId: 'club-upgrad-blr-ai',
    collegeId: 'col-upgrad-tech-bengaluru',
    date: '2026-12-12',
    time: '9:00 AM - 9:00 PM',
    location: 'AI Sandbox, Electronic City, Bengaluru',
    locationType: 'Hybrid',
    description: '36-hour hackathon building autonomous LLM agents and computer-use bots with ₹2L prizes and fast-track hiring interviews.',
    category: 'Technical',
    coverUrl: 'https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&w=1200&q=80',
    registrationOpen: true,
    volunteersNeeded: 8,
    volunteerRoles: [
      {
        id: 'vr-ugb-1',
        title: 'Technical Support',
        count: 4,
        description: 'Mentor novice teams on agent frameworks and API integrations.',
        skills: ['Python', 'LangChain', 'APIs'],
      },
    ],
    tags: ['AI Agents', 'HackBLR', 'ElectronicCity', 'BTech'],
    attendeesCount: 300,
  },
]

// ----------------------------------------------------------------
// 5. COLLEGE STUDENT DIRECTORY (Demo Profiles linked to Colleges)
// ----------------------------------------------------------------
export const mockCollegeStudents: CollegeStudent[] = [
  {
    id: 'cstud1',
    collegeId: 'col1',
    name: 'Aaditya Sharma',
    avatarUrl: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=300&q=80',
    major: 'Computer Science & Engineering',
    year: '3rd Year B.Tech',
    skills: ['React', 'TypeScript', 'PyTorch', 'Distributed Systems'],
    clubAffiliation: 'E-Cell IIT Bombay',
    bio: 'Building developer tools & exploring agentic architectures. Active contributor to student-led open source.',
    availability: 'Available for projects & clubs',
  },
  {
    id: 'cstud2',
    collegeId: 'col1',
    name: 'Rhea Kulkarni',
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80',
    major: 'Electrical Engineering & Signal Processing',
    year: '4th Year B.Tech',
    skills: ['Signal Processing', 'Audio Tech', 'C++', 'Aperture Lead'],
    clubAffiliation: 'Aperture Photography Club',
    bio: 'Photographer and audio systems enthusiast. Documenting campus heritage and monsoon stories.',
    availability: 'Mentoring junior members',
  },
  {
    id: 'cstud3',
    collegeId: 'col1',
    name: 'Devansh Parekh',
    avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80',
    major: 'Mechanical Engineering',
    year: '2nd Year B.Tech',
    skills: ['CAD / SolidWorks', 'Acoustic Guitar', 'Robotics'],
    clubAffiliation: 'Dhwani Cultural Society',
    bio: 'Robotics builder by day, lead guitarist by night. Passionate about hardware design and acoustic fusion.',
    availability: 'Open for collaborations',
  },
  {
    id: 'cstud4',
    collegeId: 'col2',
    name: 'Ananya Sen',
    avatarUrl: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=300&q=80',
    major: 'Applied Art & Visual Communication',
    year: '3rd Year B.F.A.',
    skills: ['Editorial Design', 'Darkroom Printing', 'Brand Identity', 'Typography'],
    clubAffiliation: 'Lens & Canvas',
    bio: 'Visual artist documenting Delhi street life and vernacular typography across old bazaars.',
    availability: 'Available for creative direction',
  },
  {
    id: 'cstud5',
    collegeId: 'col2',
    name: 'Kabir Malhotra',
    avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=300&q=80',
    major: 'Painting & Printmaking',
    year: '4th Year B.F.A.',
    skills: ['Printmaking', 'Curating', 'Stage Scenography'],
    clubAffiliation: 'Tarang Cultural Troupe',
    bio: 'Stage designer and printmaker interested in large-scale murals and public performance spaces.',
    availability: 'Curating winter show',
  },
  {
    id: 'cstud6',
    collegeId: 'col3',
    name: 'Siddharth Menon',
    avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80',
    major: 'Postgraduate Programme in Management (PGP)',
    year: 'PGP Year 2',
    skills: ['Corporate Strategy', 'Financial Modeling', 'Private Equity', 'M&A'],
    clubAffiliation: 'Consult Club IIM-A',
    bio: 'Ex-engineer pivoting to strategy consulting. Case coach for inter-B-school competitions.',
    availability: 'Mentoring case study teams',
  },
  {
    id: 'cstud7',
    collegeId: 'col4',
    name: 'Nisha Hegde',
    avatarUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=300&q=80',
    major: 'Computer & Communication Engineering',
    year: '3rd Year B.Tech',
    skills: ['Figma', 'React', 'Design Systems', 'Design Sprint Lead'],
    clubAffiliation: 'Manipal Design Studio',
    bio: 'Design engineer bridging wireframes and clean React code. Hackathon enthusiast with 4 wins.',
    availability: 'Available for design sprints',
  },
  {
    id: 'cstud8',
    collegeId: 'col4',
    name: 'Vikramaditya Roy',
    avatarUrl: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=300&q=80',
    major: 'Information Technology',
    year: '4th Year B.Tech',
    skills: ['Full Stack', 'Cloud Architecture', 'Varsity Football Captain'],
    clubAffiliation: 'Strikers Sports Club',
    bio: 'Captain of MIT Manipal football squad & backend architect. Believes in discipline on field and in code.',
    availability: 'Leading Revels Cup prep',
  },
  {
    id: 'cstud9',
    collegeId: 'col5',
    name: 'Meghna Bhasin',
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80',
    major: 'User Experience & Interaction Design',
    year: '3rd Year B.Des',
    skills: ['UX Research', 'Micro-interactions', 'After Effects', 'Design Systems'],
    clubAffiliation: 'SID Marketing Club',
    bio: 'Passionate about accessible interaction design for mobile applications and sustainable branding.',
    availability: 'Available for freelance gigs',
  },
  {
    id: 'cstud10',
    collegeId: 'col6',
    name: 'Goutham Sundaram',
    avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=300&q=80',
    major: 'Electronics & Communication Engineering',
    year: '3rd Year B.Tech',
    skills: ['Embedded Systems', 'ROS2', 'Community Fieldwork', 'Robotics'],
    clubAffiliation: 'Trichy Coding & Robotics Club',
    bio: 'Robotics developer and NSS volunteer. Designed affordable soil testing sensors for rural farmers.',
    availability: 'Active in community labs',
  },
]

// ----------------------------------------------------------------
// 6. DEFAULT DEMO APPLICATIONS (For Instant Status Checking)
// ----------------------------------------------------------------
export const defaultApplications: SubmittedApplication[] = [
  {
    id: 'APP-7021',
    type: 'club',
    targetTitle: 'Photographer',
    organization: 'Aperture Photography Club',
    collegeName: 'IIT Bombay',
    applicantName: 'Marcus Chen',
    applicantEmail: 'marcus.chen@student.iitb.ac.in',
    appliedDate: '2026-11-12',
    status: 'Under Review',
    notes: 'Portfolio received. Core committee has completed round 1 screening; interview call scheduled soon.',
  },
  {
    id: 'APP-6844',
    type: 'volunteer',
    targetTitle: 'Technical Support',
    organization: 'HackMIT 2.0 — 36-Hour Hackathon',
    collegeName: 'MIT Manipal',
    applicantName: 'Aria Vance',
    applicantEmail: 'aria.vance@mitmanipal.edu',
    appliedDate: '2026-11-15',
    status: 'Interview Scheduled',
    notes: 'Technical briefing call confirmed for Dec 2 at 4:00 PM via Google Meet.',
  },
  {
    id: 'APP-6512',
    type: 'volunteer',
    targetTitle: 'General Volunteering',
    organization: 'Green Campus Mela — Zero-Waste Fair',
    collegeName: 'NIT Trichy',
    applicantName: 'Kavya Patel',
    applicantEmail: 'kavya.patel@nitt.edu',
    appliedDate: '2026-11-16',
    status: 'Accepted',
    notes: 'Welcome aboard! Join the volunteer WhatsApp community group via the link sent to your email.',
  },
]

// ----------------------------------------------------------------
// LOCAL APPLICATION STORE HELPERS (Client-side persistence)
// ----------------------------------------------------------------
const STORAGE_KEY = 'peerconnect_submitted_applications'

export function getStoredApplications(): SubmittedApplication[] {
  try {
    const raw = typeof window !== 'undefined' ? window.localStorage.getItem(STORAGE_KEY) : null
    if (!raw) return defaultApplications
    const parsed = JSON.parse(raw) as SubmittedApplication[]
    return Array.isArray(parsed) && parsed.length > 0 ? parsed : defaultApplications
  } catch {
    return defaultApplications
  }
}

export function saveStoredApplication(
  app: Omit<SubmittedApplication, 'id' | 'appliedDate' | 'status'>
): SubmittedApplication {
  const existing = getStoredApplications()
  const randomNum = Math.floor(1000 + Math.random() * 9000)
  const newApp: SubmittedApplication = {
    ...app,
    id: `APP-${randomNum}`,
    appliedDate: new Date().toISOString().split('T')[0],
    status: 'Pending Review',
    notes: 'Application received and logged. Team coordinator will review and contact you via email.',
  }
  const updated = [newApp, ...existing]
  try {
    if (typeof window !== 'undefined') {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(updated))
    }
  } catch {
    // ignore storage quota error
  }
  return newApp
}

// ----------------------------------------------------------------
// QUERY HELPERS
// ----------------------------------------------------------------
function normalizeCollegeIds(collegeId: string): string[] {
  const ids = [collegeId]
  if (collegeId === 'col-iit-bombay' || collegeId === 'col1') ids.push('col1', 'col-iit-bombay')
  if (collegeId === 'col-dca-delhi' || collegeId === 'col2') ids.push('col2', 'col-dca-delhi')
  if (collegeId === 'col-iim-ahmedabad' || collegeId === 'col3') ids.push('col3', 'col-iim-ahmedabad')
  if (collegeId === 'col-manipal-mit' || collegeId === 'col4') ids.push('col4', 'col-manipal-mit')
  if (collegeId === 'col-sid-pune' || collegeId === 'col5') ids.push('col5', 'col-sid-pune')
  if (collegeId === 'col-ashoka-univ' || collegeId === 'col6') ids.push('col6', 'col-ashoka-univ')
  return ids
}

function generateFallbackClubs(college: College): Club[] {
  const short = college.shortName || college.name
  const baseId = college.id

  if (college.type === 'Management') {
    return [
      {
        id: `club-${baseId}-consulting`,
        collegeId: college.id,
        name: `${short} Consulting & Strategy Guild`,
        logoUrl: 'https://images.unsplash.com/photo-1551836022-d5d88e9218df?auto=format&fit=crop&w=200&q=80',
        coverUrl: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1200&q=80',
        description: `${short}'s premier student consulting group preparing future business analysts for global strategy and venture roles.`,
        category: 'Entrepreneurship',
        memberCount: 88,
        foundedYear: Math.max(college.established, 2012),
        recruitmentStatus: 'Open',
        openings: 3,
        socialLinks: { website: college.website },
        coreTeam: [{ name: 'Aarav Mehta', role: 'President', avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80' }],
        previousActivities: [{ title: 'Case Sprint 2026', description: 'Live case competition with industry mentors.', date: 'September 2026', attendees: 120 }],
        upcomingEvents: [`evt-${baseId}-1`],
      },
      {
        id: `club-${baseId}-marketing`,
        collegeId: college.id,
        name: `${short} Product & Marketing Club`,
        logoUrl: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=200&q=80',
        coverUrl: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1200&q=80',
        description: 'Student community mastering product positioning, digital growth marketing, and corporate communication.',
        category: 'Marketing',
        memberCount: 72,
        foundedYear: Math.max(college.established, 2015),
        recruitmentStatus: 'Open',
        openings: 2,
        socialLinks: { website: college.website },
        coreTeam: [{ name: 'Tanvi Shah', role: 'Convenor', avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80' }],
        previousActivities: [{ title: 'Brand Hackathon', description: 'Interactive brand positioning sprint.', date: 'August 2026', attendees: 85 }],
        upcomingEvents: [],
      },
    ]
  }

  if (college.type === 'Arts & Design' || college.type === 'Liberal Arts') {
    return [
      {
        id: `club-${baseId}-design`,
        collegeId: college.id,
        name: `${short} Creative Studio & UI Lab`,
        logoUrl: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?auto=format&fit=crop&w=200&q=80',
        coverUrl: 'https://images.unsplash.com/photo-1626785774573-4b799315345d?auto=format&fit=crop&w=1200&q=80',
        description: `${short}'s design collective exploring visual identity, human-computer interaction, typography, and motion design.`,
        category: 'Design',
        memberCount: 95,
        foundedYear: Math.max(college.established, 2014),
        recruitmentStatus: 'Open',
        openings: 4,
        socialLinks: { website: college.website },
        coreTeam: [{ name: 'Maya Sen', role: 'Creative Lead', avatarUrl: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=200&q=80' }],
        previousActivities: [{ title: 'Annual Design Expo', description: 'Curated showcase of student portfolio projects.', date: 'October 2026', attendees: 180 }],
        upcomingEvents: [`evt-${baseId}-1`],
      },
      {
        id: `club-${baseId}-photo`,
        collegeId: college.id,
        name: `${short} Shutter & Documentary Club`,
        logoUrl: 'https://images.unsplash.com/photo-1452587925148-ce544e77e70d?auto=format&fit=crop&w=200&q=80',
        coverUrl: 'https://images.unsplash.com/photo-1452587925148-ce544e77e70d?auto=format&fit=crop&w=1200&q=80',
        description: 'Visual storytelling, documentary photography, and campus archive projects.',
        category: 'Photography',
        memberCount: 65,
        foundedYear: Math.max(college.established, 2016),
        recruitmentStatus: 'Open',
        openings: 2,
        socialLinks: { website: college.website },
        coreTeam: [{ name: 'Rohan Roy', role: 'Lead Photographer', avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80' }],
        previousActivities: [{ title: 'Monsoon Photo Walk', description: 'City exploration through the lens.', date: 'July 2026', attendees: 60 }],
        upcomingEvents: [],
      },
    ]
  }

  // Default / Engineering / Science / Medical
  return [
    {
      id: `club-${baseId}-tech`,
      collegeId: college.id,
      name: `${short} Code & AI Collective`,
      logoUrl: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&w=200&q=80',
      coverUrl: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&w=1200&q=80',
      description: `${short}'s central developer society building open-source web apps, autonomous AI agents, and competitive programming teams.`,
      category: 'Technical',
      memberCount: 160,
      foundedYear: Math.max(college.established, 2010),
      recruitmentStatus: 'Open',
      openings: 5,
      socialLinks: { website: college.website },
      coreTeam: [{ name: 'Karan Patel', role: 'President', avatarUrl: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=200&q=80' }],
      previousActivities: [{ title: 'Campus Hackathon 24H', description: 'Flagship 24-hour hackathon with cash prizes.', date: 'August 2026', attendees: 220 }],
      upcomingEvents: [`evt-${baseId}-1`],
    },
    {
      id: `club-${baseId}-ecell`,
      collegeId: college.id,
      name: `${short} E-Cell & Venture Studio`,
      logoUrl: 'https://images.unsplash.com/photo-1559136555-9303baea8ebd?auto=format&fit=crop&w=200&q=80',
      coverUrl: 'https://images.unsplash.com/photo-1559136555-9303baea8ebd?auto=format&fit=crop&w=1200&q=80',
      description: 'Empowering student founders, hosting startup pitch days, and connecting student ventures with mentors and seed capital.',
      category: 'Entrepreneurship',
      memberCount: 115,
      foundedYear: Math.max(college.established, 2012),
      recruitmentStatus: 'Open',
      openings: 4,
      socialLinks: { website: college.website },
      coreTeam: [{ name: 'Nisha Verma', role: 'Operations Lead', avatarUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=200&q=80' }],
      previousActivities: [{ title: 'Founders Mixer', description: 'Alumni founders sharing playbook lessons.', date: 'September 2026', attendees: 130 }],
      upcomingEvents: [],
    },
    {
      id: `club-${baseId}-robotics`,
      collegeId: college.id,
      name: `${short} Robotics & IoT Hub`,
      logoUrl: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?auto=format&fit=crop&w=200&q=80',
      coverUrl: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?auto=format&fit=crop&w=1200&q=80',
      description: 'Hardware prototyping, robotic combat arenas, drone mechanics, and embedded micro-controller labs.',
      category: 'Technical',
      memberCount: 90,
      foundedYear: Math.max(college.established, 2015),
      recruitmentStatus: 'Open',
      openings: 3,
      socialLinks: { website: college.website },
      coreTeam: [{ name: 'Vikram Nair', role: 'Tech Lead', avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80' }],
      previousActivities: [{ title: 'RoboRace Challenge', description: 'Autonomous obstacle course race.', date: 'July 2026', attendees: 105 }],
      upcomingEvents: [],
    },
  ]
}

function generateFallbackEvents(college: College): Event[] {
  const short = college.shortName || college.name
  const baseId = college.id
  return [
    {
      id: `evt-${baseId}-1`,
      title: `${short} Annual Tech & Innovation Hackathon`,
      clubId: `club-${baseId}-tech`,
      collegeId: college.id,
      date: '2026-12-08',
      time: '10:00 AM - 6:00 PM',
      location: `${college.location}`,
      locationType: 'On-Campus',
      description: '36-hour inter-collegiate coding sprint, open hardware showcases, and mentorship from startup tech leads.',
      category: college.type === 'Management' ? 'Entrepreneurship' : 'Technical',
      coverUrl: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&w=1200&q=80',
      registrationOpen: true,
      volunteersNeeded: 6,
      volunteerRoles: [
        {
          id: `vr-${baseId}-1`,
          title: 'Event Coordination',
          count: 4,
          description: 'Help coordinate participant registrations and demo room tracks.',
          skills: ['Communication', 'Event Logistics'],
        },
        {
          id: `vr-${baseId}-2`,
          title: 'Technical Support',
          count: 2,
          description: 'Assist teams with WiFi access and hardware table kits.',
          skills: ['Troubleshooting', 'Git'],
        },
      ],
      tags: ['Hackathon', 'Innovation', 'StudentBuilders', 'TechSprint'],
      attendeesCount: 240,
    },
  ]
}

function generateFallbackStudents(college: College): CollegeStudent[] {
  const short = college.shortName || college.name
  const baseId = college.id
  return [
    {
      id: `stud-${baseId}-1`,
      collegeId: college.id,
      name: `${short} Peer Ambassador`,
      avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80',
      major: college.type === 'Management' ? 'Business Analytics & Finance' : 'Computer Science & AI',
      year: '3rd Year Student',
      skills: ['FullStack', 'Python', 'Leadership', 'Hackathons'],
      clubAffiliation: `${short} Student Council`,
      bio: `Enthusiastic builder and campus community lead at ${short}. Always open to collaborate on projects.`,
      availability: 'Open for collaborations',
    },
    {
      id: `stud-${baseId}-2`,
      collegeId: college.id,
      name: `Lead Dev @ ${short}`,
      avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80',
      major: college.type === 'Arts & Design' ? 'Interaction & Motion Design' : 'Software Engineering',
      year: '4th Year Student',
      skills: ['TypeScript', 'Cloud Systems', 'OpenSource', 'UI/UX'],
      clubAffiliation: `${short} Tech Guild`,
      bio: 'Final-year student working on high-performance web tooling and scalable architectures.',
      availability: 'Available for freelance & clubs',
    },
  ]
}

export function getCollegeById(id: string): College | undefined {
  const found = mockColleges.find((c) => c.id === id)
  if (found) return found
  if (id === 'col1') return mockColleges.find((c) => c.id === 'col-iit-bombay')
  if (id === 'col2') return mockColleges.find((c) => c.id === 'col-dca-delhi')
  if (id === 'col3') return mockColleges.find((c) => c.id === 'col-iim-ahmedabad')
  if (id === 'col4') return mockColleges.find((c) => c.id === 'col-manipal-mit')
  if (id === 'col5') return mockColleges.find((c) => c.id === 'col-sid-pune')
  if (id === 'col6') return mockColleges.find((c) => c.id === 'col-ashoka-univ')
  return undefined
}

export function getClubById(id: string): Club | undefined {
  const found = mockClubs.find((c) => c.id === id)
  if (found) return found
  for (const college of mockColleges) {
    const fallbackClubs = generateFallbackClubs(college)
    const match = fallbackClubs.find((c) => c.id === id)
    if (match) return match
  }
  return undefined
}

export function getEventById(id: string): Event | undefined {
  const found = mockEvents.find((e) => e.id === id)
  if (found) return found
  for (const college of mockColleges) {
    const fallbackEvents = generateFallbackEvents(college)
    const match = fallbackEvents.find((e) => e.id === id)
    if (match) return match
  }
  return undefined
}

export function getClubsByCollege(collegeId: string): Club[] {
  const targetIds = normalizeCollegeIds(collegeId)
  const matches = mockClubs.filter((c) => targetIds.includes(c.collegeId))
  if (matches.length > 0) return matches
  const college = getCollegeById(collegeId)
  return college ? generateFallbackClubs(college) : []
}

export function getEventsByClub(clubId: string): Event[] {
  return mockEvents.filter((e) => e.clubId === clubId)
}

export function getEventsByCollege(collegeId: string): Event[] {
  const targetIds = normalizeCollegeIds(collegeId)
  const matches = mockEvents.filter((e) => targetIds.includes(e.collegeId))
  if (matches.length > 0) return matches
  const college = getCollegeById(collegeId)
  return college ? generateFallbackEvents(college) : []
}

export function getOpeningsByClub(clubId: string): ClubOpening[] {
  return mockClubOpenings.filter((o) => o.clubId === clubId)
}

export function getStudentsByCollege(collegeId: string): CollegeStudent[] {
  const targetIds = normalizeCollegeIds(collegeId)
  const matches = mockCollegeStudents.filter((s) => targetIds.includes(s.collegeId))
  if (matches.length > 0) return matches
  const college = getCollegeById(collegeId)
  return college ? generateFallbackStudents(college) : []
}

// ----------------------------------------------------------------
// CATEGORIES & PALETTES
// ----------------------------------------------------------------
export const CLUB_CATEGORIES: ClubCategory[] = [
  'Technical',
  'Cultural',
  'Photography',
  'Sports',
  'Entrepreneurship',
  'Marketing',
  'Design',
  'Social Service',
]

export const CATEGORY_COLORS: Record<ClubCategory, { bg: string; text: string; border: string }> = {
  Technical:        { bg: 'bg-sky-50',     text: 'text-sky-800',     border: 'border-sky-200/80' },
  Cultural:         { bg: 'bg-purple-50',  text: 'text-purple-800',  border: 'border-purple-200/80' },
  Photography:      { bg: 'bg-amber-50',   text: 'text-amber-800',   border: 'border-amber-200/80' },
  Sports:           { bg: 'bg-emerald-50', text: 'text-emerald-800', border: 'border-emerald-200/80' },
  Entrepreneurship: { bg: 'bg-[#E3F4EB]',  text: 'text-[#123D30]',   border: 'border-[#08C58A]/40' },
  Marketing:        { bg: 'bg-pink-50',    text: 'text-pink-800',    border: 'border-pink-200/80' },
  Design:           { bg: 'bg-violet-50',  text: 'text-violet-800',  border: 'border-violet-200/80' },
  'Social Service': { bg: 'bg-teal-50',    text: 'text-teal-800',    border: 'border-teal-200/80' },
}
