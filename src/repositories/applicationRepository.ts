import type { Application, ProjectOpportunity } from '../types'

export type ClientApplicationStatus = Extract<Application['status'], 'shortlisted' | 'accepted' | 'rejected'>

export interface PublicApplicantProfile {
  userId: string
  name: string
  headline: string
  college: string
  university: string
  avatarUrl: string
  skills: string[]
}

export interface AccountApplication extends Application {
  projectTitle: string
  clientName: string
  applicantProfile?: PublicApplicantProfile | null
}

export interface ApplicationRepository {
  getMineForProject: (studentId: string, projectId: string) => Promise<AccountApplication | null>
  listMine: (studentId: string) => Promise<AccountApplication[]>
  listForOwnerProjects: (
    projects: Array<Pick<ProjectOpportunity, 'id' | 'title' | 'clientName'>>,
  ) => Promise<AccountApplication[]>
  submit: (studentId: string, projectId: string, coverLetter: string) => Promise<AccountApplication>
  setClientStatus: (applicationId: string, status: ClientApplicationStatus) => Promise<void>
  withdraw: (applicationId: string) => Promise<void>
}
