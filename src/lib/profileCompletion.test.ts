import { describe, expect, it } from 'vitest'
import { demoStudent } from '../data/studentMockData'
import { calculateProfileCompletion } from './profileCompletion'

describe('calculateProfileCompletion', () => {
  it('reports the complete demo profile as ready for discovery', () => {
    const report = calculateProfileCompletion(demoStudent)

    expect(report.percentage).toBe(100)
    expect(report.missingItems).toEqual([])
    expect(report.nextStepRecommendation).toBe('Your profile is ready for discovery!')
  })

  it('identifies the highest-value missing profile information', () => {
    const report = calculateProfileCompletion({ id: 'new-student' })

    expect(report.percentage).toBe(0)
    expect(report.completedCount).toBe(0)
    expect(report.totalCount).toBe(9)
    expect(report.missingItems.map((item) => item.key)).toContain('skills')
    expect(report.nextStepRecommendation).toContain('basic and college information')
  })
})
