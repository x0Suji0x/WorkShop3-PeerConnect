import type { Application } from '../types'

export type ClientApplicationAction = 'shortlisted' | 'accepted' | 'rejected'

export function canClientTransitionApplication(status: Application['status']) {
  return status === 'submitted' || status === 'shortlisted'
}

export function canStudentWithdrawApplication(status: Application['status']) {
  return status === 'submitted' || status === 'shortlisted'
}

export function clientApplicationActions(status: Application['status']): ClientApplicationAction[] {
  if (status === 'submitted') return ['shortlisted', 'accepted', 'rejected']
  if (status === 'shortlisted') return ['accepted', 'rejected']
  return []
}
