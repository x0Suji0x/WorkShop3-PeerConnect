import type { StudentPlusPlan } from '../types'

export const studentPlusPlan: StudentPlusPlan = {
  id: 'student-plus-monthly',
  name: 'Student Plus',
  price: 99,
  currency: 'INR',
  billingInterval: 'month',
  benefits: [
    'Featured profile placement in relevant talent searches',
    'A Student Plus badge on your public profile',
    'Profile-view analytics to understand your visibility',
    'Project-interest analytics to see which opportunities engage you',
  ],
}

export const studentPlusAnalyticsPreview = [
  { label: 'Profile appearances', value: '1,284', detail: 'in the last 30 days' },
  { label: 'Profile views', value: '248', detail: 'in the last 30 days' },
  { label: 'Project interest', value: '36', detail: 'saves and shortlist views' },
]
