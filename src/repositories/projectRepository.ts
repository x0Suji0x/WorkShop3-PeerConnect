import type { ProjectOpportunity } from '../types'

export type AccountProject = ProjectOpportunity & {
  ownerId: string
  status: 'draft' | 'published' | 'closed'
  createdAt: string
  updatedAt: string
  source: 'account'
}

export type ProjectCreateInput = Pick<
  ProjectOpportunity,
  | 'title'
  | 'clientName'
  | 'clientType'
  | 'clientLocation'
  | 'budget'
  | 'budgetType'
  | 'duration'
  | 'hoursPerWeek'
  | 'description'
  | 'skillsRequired'
> & Pick<ProjectOpportunity, 'category' | 'workMode' | 'deadline' | 'deliverables'>

export interface ProjectRepository {
  listPublished: () => Promise<ProjectOpportunity[]>
  getPublishedById: (projectId: string) => Promise<ProjectOpportunity | null>
  listMine: (ownerId: string) => Promise<AccountProject[]>
  create: (ownerId: string, project: ProjectCreateInput, status: 'draft' | 'published') => Promise<AccountProject>
  publish: (projectId: string) => Promise<AccountProject>
}
