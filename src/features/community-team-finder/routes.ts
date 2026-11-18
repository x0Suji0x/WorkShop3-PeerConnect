export const communityTeamFinderRoutes = {
  communities: '/communities',
  communityDetail: '/communities/:slug',
  myCommunities: '/my-communities',
  teamFinder: '/team-finder',
  teamDetail: '/team-finder/:teamId',
  newTeam: '/team-finder/new',
  teamBuilder: '/team-finder/builder',
} as const

export const communityDetailPath = (slug: string) => `/communities/${slug}`
export const teamDetailPath = (id: string) => `/team-finder/${id}`

