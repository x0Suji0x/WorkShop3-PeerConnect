export const routes = {
  home: '/',
  dashboard: '/dashboard',
  profiles: '/profiles',
  verification: '/verification',
  projects: '/projects',
  newProject: '/projects/new',
  applications: '/applications',
  colleges: '/colleges',
  clubs: '/clubs',
  events: '/events',
} as const

export const profileRoute = (profileId: string) => `/profiles/${profileId}`
export const projectRoute = (projectId: string) => `/projects/${projectId}`
