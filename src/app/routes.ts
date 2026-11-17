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

export const communityRoutes = {
  communities: '/communities',
  communityDetail: '/communities/:slug',
  teamFinder: '/team-finder',
  teamDetail: '/team-finder/:teamId',
  newTeam: '/team-finder/new',
  teamBuilder: '/team-finder/builder',
} as const

export const communityDetailRoute = (slug: string) => `/communities/${slug}`
export const teamDetailRoute = (id: string) => `/team-finder/${id}`
