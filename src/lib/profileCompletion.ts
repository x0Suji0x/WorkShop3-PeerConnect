import type { Student } from '../types'

export interface ProfileCompletionReport {
  percentage: number
  completedCount: number
  totalCount: number
  missingItems: { key: string; label: string; route: string; impact: number }[]
  nextStepRecommendation: string
}

export function calculateProfileCompletion(student: Partial<Student>): ProfileCompletionReport {
  const criteria = [
    {
      key: 'basic_info',
      label: 'Full Name and Headline',
      completed: Boolean(student.name?.trim() && student.headline?.trim()),
      impact: 15,
      route: '/profiles/' + (student.id || 'demo'),
    },
    {
      key: 'avatar',
      label: 'Profile Photo',
      completed: Boolean(student.avatarUrl && !student.avatarUrl.includes('placeholder')),
      impact: 10,
      route: '/profiles/' + (student.id || 'demo'),
    },
    {
      key: 'college',
      label: 'College and Degree Information',
      completed: Boolean(student.college?.trim() && student.degree?.trim()),
      impact: 15,
      route: '/profiles/' + (student.id || 'demo'),
    },
    {
      key: 'about',
      label: 'About / Bio Statement',
      completed: Boolean((student.about?.trim() || student.bio?.trim()) && (student.about?.length || student.bio?.length || 0) > 30),
      impact: 10,
      route: '/profiles/' + (student.id || 'demo'),
    },
    {
      key: 'skills',
      label: 'Skills (at least 3 skills)',
      completed: Boolean(student.skills && student.skills.length >= 3),
      impact: 15,
      route: '/profiles/' + (student.id || 'demo'),
    },
    {
      key: 'interests',
      label: 'Areas of Interest',
      completed: Boolean(student.interests && student.interests.length >= 1),
      impact: 10,
      route: '/profiles/' + (student.id || 'demo'),
    },
    {
      key: 'availability',
      label: 'Availability & Collaboration Preferences',
      completed: Boolean(
        student.availability &&
        student.availabilityPreferences &&
        Object.values(student.availabilityPreferences).some(Boolean)
      ),
      impact: 10,
      route: '/profiles/' + (student.id || 'demo'),
    },
    {
      key: 'social_links',
      label: 'Social & Portfolio Links (GitHub, LinkedIn, or Portfolio)',
      completed: Boolean(
        student.socialLinks &&
        (student.socialLinks.github || student.socialLinks.linkedin || student.socialLinks.portfolio)
      ),
      impact: 8,
      route: '/profiles/' + (student.id || 'demo'),
    },
    {
      key: 'projects',
      label: 'Portfolio Project or Sample Work',
      completed: Boolean(student.portfolioProjects && student.portfolioProjects.length > 0),
      impact: 7,
      route: '/profiles/' + (student.id || 'demo'),
    },
  ]

  let percentage = 0
  let completedCount = 0
  const missingItems: { key: string; label: string; route: string; impact: number }[] = []

  for (const item of criteria) {
    if (item.completed) {
      percentage += item.impact
      completedCount++
    } else {
      missingItems.push({
        key: item.key,
        label: item.label,
        route: item.route,
        impact: item.impact,
      })
    }
  }

  // Ensure percentage stays between 0 and 100
  percentage = Math.min(100, Math.max(0, percentage))

  // Determine intelligent next recommendation
  let nextStepRecommendation = 'Your profile is ready for discovery!'
  if (percentage < 40) {
    nextStepRecommendation = 'Complete your basic and college information to establish your student identity.'
  } else if (!criteria.find((c) => c.key === 'skills')?.completed) {
    nextStepRecommendation = 'Add at least 3 skills to get matched with student teams and hackathons.'
  } else if (!criteria.find((c) => c.key === 'projects')?.completed) {
    nextStepRecommendation = 'Add your portfolio projects to improve your discovery by 3x.'
  } else if (!criteria.find((c) => c.key === 'social_links')?.completed) {
    nextStepRecommendation = 'Link your GitHub or LinkedIn to strengthen peer trust.'
  } else if (missingItems.length > 0) {
    nextStepRecommendation = `Complete ${missingItems[0].label.toLowerCase()} to boost your ranking.`
  }

  return {
    percentage,
    completedCount,
    totalCount: criteria.length,
    missingItems,
    nextStepRecommendation,
  }
}
