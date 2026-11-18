import type { Application } from '../types'

const STORAGE_KEY = 'peerconnect_applications_v1'

export interface ExtendedApplication extends Application {
  studentName?: string
  studentCollege?: string
  studentRole?: string
  studentAvatar?: string
  skills?: string[]
}

export function getStoredApplications(): ExtendedApplication[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return []
    return JSON.parse(raw) as ExtendedApplication[]
  } catch {
    return []
  }
}

export function saveApplication(
  app: Omit<ExtendedApplication, 'id'> & { id?: string }
): ExtendedApplication[] {
  try {
    const fullApp: ExtendedApplication = {
      ...app,
      id: app.id || `app-${Date.now()}`,
    }
    const current = getStoredApplications()
    // Avoid duplicate application to same project
    const filtered = current.filter((item) => item.projectId !== fullApp.projectId)
    const updated = [fullApp, ...filtered]
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated))
    window.dispatchEvent(new Event('peerconnect_applications_updated'))
    return updated
  } catch {
    return [app as ExtendedApplication]
  }
}

export function updateApplicationStatus(
  applicationId: string,
  status: Application['status']
): ExtendedApplication[] {
  try {
    const current = getStoredApplications()
    const updated = current.map((item) =>
      item.id === applicationId ? { ...item, status, updatedAt: 'Just now' } : item
    )
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated))
    window.dispatchEvent(new Event('peerconnect_applications_updated'))
    return updated
  } catch {
    return []
  }
}

export function removeApplication(applicationId: string): ExtendedApplication[] {
  try {
    const current = getStoredApplications()
    const updated = current.filter((item) => item.id !== applicationId)
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated))
    window.dispatchEvent(new Event('peerconnect_applications_updated'))
    return updated
  } catch {
    return []
  }
}
