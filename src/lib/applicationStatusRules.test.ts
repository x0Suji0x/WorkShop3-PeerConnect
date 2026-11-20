import { describe, expect, it } from 'vitest'
import { canClientTransitionApplication, canStudentWithdrawApplication, clientApplicationActions } from './applicationStatusRules'
import type { Application } from '../types'

const statuses: Application['status'][] = ['submitted', 'shortlisted', 'accepted', 'rejected', 'withdrawn']

describe('application status transition affordances', () => {
  it('offers all client transitions from submitted', () => {
    expect(clientApplicationActions('submitted')).toEqual(['shortlisted', 'accepted', 'rejected'])
  })

  it('offers only final decisions from shortlisted', () => {
    expect(clientApplicationActions('shortlisted')).toEqual(['accepted', 'rejected'])
  })

  it('hides client actions for accepted, rejected, and withdrawn applications', () => {
    for (const status of ['accepted', 'rejected', 'withdrawn'] as const) {
      expect(canClientTransitionApplication(status)).toBe(false)
      expect(clientApplicationActions(status)).toEqual([])
    }
  })

  it('allows student withdrawal only from submitted and shortlisted', () => {
    expect(statuses.filter(canStudentWithdrawApplication)).toEqual(['submitted', 'shortlisted'])
  })
})
