import type { Application } from '../types'

const STORAGE_KEY = 'peerconnect_applications_v1'

function getAuthHeaders(): Record<string, string> {
  try {
    const token = localStorage.getItem('peerconnect_token')
    return token ? { Authorization: `Bearer ${token}` } : {}
  } catch {
    return {}
  }
}

export interface ExtendedApplication extends Application {
  studentName?: string
  studentCollege?: string
  studentRole?: string
  studentAvatar?: string
  skills?: string[]
  portfolioUrl?: string
  proposedRate?: string | number
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

export async function syncApplicationsWithBackend(): Promise<ExtendedApplication[]> {
  try {
    const headers = getAuthHeaders()
    if (!headers.Authorization) return getStoredApplications()

    const res = await fetch('/api/applications', { headers })
    if (res.ok) {
      const data = (await res.json()) as { applications: ExtendedApplication[] }
      if (Array.isArray(data.applications)) {
        const local = getStoredApplications()
        const localIds = new Set(local.map((a) => a.id))
        const backendNew = data.applications.filter((a) => !localIds.has(a.id))
        const merged = [...local, ...backendNew]
        localStorage.setItem(STORAGE_KEY, JSON.stringify(merged))
        window.dispatchEvent(new Event('peerconnect_applications_updated'))
        return merged
      }
    }
  } catch {
    // fallback to local storage
  }
  return getStoredApplications()
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

    // Asynchronously synchronize with SQLite backend
    void fetch('/api/applications', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', ...getAuthHeaders() },
      body: JSON.stringify({
        projectId: fullApp.projectId,
        coverLetter: fullApp.coverLetter,
        portfolioLink: fullApp.portfolioUrl,
        expectedStipend: fullApp.proposedRate ? `₹${fullApp.proposedRate}` : '',
      }),
    }).catch(() => {
      // ignore network errors in background sync
    })

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

    // Asynchronously synchronize status with SQLite backend
    void fetch(`/api/applications/${applicationId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json', ...getAuthHeaders() },
      body: JSON.stringify({ status }),
    }).catch(() => {
      // ignore network errors in background sync
    })

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
