import type { StudentProfile } from '../types'

type TalentSample = Omit<StudentProfile, 'avatarUrl' | 'hourlyRate' | 'projectsCompleted' | 'availability' | 'graduationYear' | 'featuredWork' | 'bio' | 'skills'> & {
  category: 'design' | 'dev' | 'ai' | 'other'
  sampleWork: string
}

const portraits = [
  'photo-1534528741775-53994a69daeb', 'photo-1517841905240-472988babdf9',
  'photo-1500648767791-00dcc994a43e', 'photo-1531123897727-8f129e1688ce',
  'photo-1506794778202-cad84cf45f1d', 'photo-1544005313-94ddf0286df2',
  'photo-1507003211169-0a1dd7228f2d', 'photo-1534528741775-53994a69daeb',
  'photo-1500648767791-00dcc994a43e', 'photo-1517841905240-472988babdf9',
  'photo-1531123897727-8f129e1688ce', 'photo-1544005313-94ddf0286df2',
  'photo-1506794778202-cad84cf45f1d', 'photo-1534528741775-53994a69daeb',
  'photo-1507003211169-0a1dd7228f2d', 'photo-1517841905240-472988babdf9',
  'photo-1531123897727-8f129e1688ce', 'photo-1544005313-94ddf0286df2',
  'photo-1500648767791-00dcc994a43e', 'photo-1506794778202-cad84cf45f1d',
]

const samples: TalentSample[] = [
  { id: 'aarav-deshmukh', name: 'Aarav Deshmukh', headline: 'Content Creator & Copywriter', university: 'Ajeenkya DY Patil University', rating: 4.8, reviewsCount: 14, sampleReview: 'Aarav delivered the Instagram captions right on schedule. Very engaging tone!', category: 'other', sampleWork: 'Social captions and short-form brand copy' },
  { id: 'sneha-kulkarni', name: 'Sneha Kulkarni', headline: 'Graphic Designer & Illustrator', university: 'Fergusson College, Pune', rating: 4.2, reviewsCount: 9, sampleReview: 'Good design sense, though we had to ask for one revision on the color palette.', category: 'design', sampleWork: 'Illustration and campaign graphics' },
  { id: 'rohan-verma', name: 'Rohan Verma', headline: 'Frontend Web Developer', university: 'COEP Technological University', rating: 3.5, reviewsCount: 6, sampleReview: 'He built the landing page cleanly, but communication could have been a bit faster during exams.', category: 'dev', sampleWork: 'Responsive landing page development' },
  { id: 'ananya-iyer', name: 'Ananya Iyer', headline: 'Video Editor & Reel Maker', university: 'MIT World Peace University', rating: 5.0, reviewsCount: 22, sampleReview: 'Absolute lifesaver for our college fest reels. Cut the footage brilliantly!', category: 'other', sampleWork: 'College fest reels and event edits' },
  { id: 'kabir-mehta', name: 'Kabir Mehta', headline: 'UI/UX Designer', university: 'Symbiosis Institute of Technology', rating: 2.8, reviewsCount: 4, sampleReview: 'Missed the initial deadline by a day, but the final Figma wireframes were decent.', category: 'design', sampleWork: 'Figma wireframes and interface flows' },
  { id: 'priya-nair', name: 'Priya Nair', headline: 'Social Media Manager', university: 'St. Xavier’s College, Mumbai', rating: 4.6, reviewsCount: 18, sampleReview: 'Understands local cafe trends very well. Increased our engagement noticeably.', category: 'other', sampleWork: 'Local social media planning' },
  { id: 'tanmay-joshi', name: 'Tanmay Joshi', headline: 'Full-Stack Developer', university: 'PICT Pune', rating: 4.0, reviewsCount: 11, sampleReview: 'Solid code quality for our small business inventory script. Fixed bugs promptly.', category: 'dev', sampleWork: 'Small business inventory tool' },
  { id: 'diya-sharma', name: 'Diya Sharma', headline: 'Technical Writer & Blogger', university: 'FLAME University', rating: 4.9, reviewsCount: 27, sampleReview: 'Extremely thorough researcher. Her tech articles required zero editing from our side.', category: 'other', sampleWork: 'Technology articles and explainers' },
  { id: 'yash-shinde', name: 'Yash Shinde', headline: 'Motion Graphics Artist', university: 'Vishwakarma Institute of Technology', rating: 3.1, reviewsCount: 5, sampleReview: 'The animation was creative, but the file formats were a bit messy to handle.', category: 'design', sampleWork: 'Motion graphics and animated titles' },
  { id: 'meera-pillai', name: 'Meera Pillai', headline: 'Graphic & Brand Designer', university: 'NIFT Mumbai', rating: 4.7, reviewsCount: 31, sampleReview: 'Fantastic logo concepts provided for our clothing line startup. Highly recommended!', category: 'design', sampleWork: 'Logo concepts and brand identity' },
  { id: 'aditya-jadhav', name: 'Aditya Jadhav', headline: 'Video Editor & Color Grader', university: 'Dr. D.Y. Patil Institute of Technology', rating: 1.5, reviewsCount: 3, sampleReview: 'Failed to submit the project on time and stopped responding midway. Disappointing.', category: 'other', sampleWork: 'Video editing and color grading' },
  { id: 'simran-kaur', name: 'Simran Kaur', headline: 'Content Strategist & Copywriter', university: 'Jesus and Mary College, Delhi', rating: 4.5, reviewsCount: 16, sampleReview: 'Great command over English and Hindi copywriting for our ad campaigns.', category: 'other', sampleWork: 'Bilingual campaign copy' },
  { id: 'karan-patil', name: 'Karan Patil', headline: 'Android App Developer', university: 'upGrad School of Technology', rating: 3.8, reviewsCount: 8, sampleReview: 'Delivered the app prototype on time. A few minor UI glitches on older devices, but fixed them later.', category: 'dev', sampleWork: 'Android app prototype' },
  { id: 'neha-gokhale', name: 'Neha Gokhale', headline: 'Event Photographer & Editor', university: 'Brihan Maharashtra College of Commerce (BMCC)', rating: 4.9, reviewsCount: 25, sampleReview: 'Captured our cafe launch event beautifully. The turnaround time for photos was super fast.', category: 'other', sampleWork: 'Event photography and edited selects' },
  { id: 'akash-gupta', name: 'Akash Gupta', headline: 'SEO & Digital Marketer', university: 'IIT Bombay', rating: 4.3, reviewsCount: 12, sampleReview: 'Good keyword strategy for our local store website. Saw an uptick in organic traffic.', category: 'other', sampleWork: 'Local SEO and keyword planning' },
  { id: 'rutuja-more', name: 'Rutuja More', headline: 'Graphic Designer & Poster Artist', university: 'Bharati Vidyapeeth Deemed University', rating: 2.0, reviewsCount: 4, sampleReview: 'The flyer design looked a bit outdated, didn’t quite match our modern cafe vibe.', category: 'design', sampleWork: 'Poster and flyer concepts' },
  { id: 'siddharth-rao', name: 'Siddharth Rao', headline: 'Copywriter & Marathi/English Translator', university: 'Savitribai Phule Pune University', rating: 4.4, reviewsCount: 10, sampleReview: 'Very accurate translations and localized copywriting for our promotional pamphlets.', category: 'other', sampleWork: 'Localized Marathi and English copy' },
  { id: 'ananya-ghosh', name: 'Ananya Ghosh', headline: 'UI Designer & Illustrator', university: 'Srishti Institute of Art, Design and Technology', rating: 4.7, reviewsCount: 19, sampleReview: 'Incredible illustration work! She gave our app a unique, warm hand-drawn feel.', category: 'design', sampleWork: 'Illustrated app interface concepts' },
  { id: 'nikhil-kumar', name: 'Nikhil Kumar', headline: 'Backend Developer & Scripter', university: 'BITS Pilani', rating: 3.9, reviewsCount: 7, sampleReview: 'Handled the data scraping task efficiently. Code was well-documented.', category: 'dev', sampleWork: 'Data collection scripts and backend tools' },
  { id: 'pooja-thakur', name: 'Pooja Thakur', headline: 'Social Media Content Creator', university: 'St. Mira’s College for Girls, Pune', rating: 5.0, reviewsCount: 29, sampleReview: 'Brought amazing creative ideas to our local bakery’s page. Her reels went viral locally!', category: 'other', sampleWork: 'Bakery social content and reels' },
]

export const talentDirectoryStudents: StudentProfile[] = samples.map((sample, index) => {
  const { category, sampleWork, ...profile } = sample
  return {
    ...profile,
    graduationYear: 'Undergrad',
    avatarUrl: `https://images.unsplash.com/${portraits[index]}?auto=format&fit=crop&w=400&q=80`,
    hourlyRate: 0,
    projectsCompleted: 0,
    availability: index % 3 === 0 ? 'Available now' : index % 3 === 1 ? 'Available soon' : 'Limited hours',
    skills: profile.headline.split(/\s+&\s+|\s+and\s+|,\s*/i).map((name) => ({ name, category })),
    featuredWork: sampleWork,
    bio: `Sample ${profile.headline.toLowerCase()} profile. Ratings and review text are illustrative demo content.`,
  }
})
