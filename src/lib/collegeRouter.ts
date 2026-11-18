// ============================================================
// College, Clubs & Events — Client-Side Router (hash-based)
// ============================================================
// No external router library needed. Uses URL hash (#cc?...)
// to store the active page and coordinates deep linking
// without modifying global navigation or external pages.

export type CollegeRoute =
  | { page: 'colleges' }
  | { page: 'college-detail'; collegeId: string }
  | { page: 'clubs'; category?: string; collegeId?: string }
  | { page: 'club-profile'; clubId: string }
  | { page: 'club-recruitment'; clubId: string; openingId?: string }
  | { page: 'events'; category?: string; collegeId?: string }
  | { page: 'event-detail'; eventId: string }
  | { page: 'volunteer-apply'; eventId: string; roleId: string }
  | { page: 'applications'; filterEmail?: string }

export function encodeRoute(route: CollegeRoute): string {
  const params = new URLSearchParams()
  params.set('page', route.page)
  if (route.page === 'college-detail') {
    params.set('id', route.collegeId)
  }
  if (route.page === 'clubs') {
    if (route.category) params.set('cat', route.category)
    if (route.collegeId) params.set('col', route.collegeId)
  }
  if (route.page === 'club-profile') {
    params.set('id', route.clubId)
  }
  if (route.page === 'club-recruitment') {
    params.set('id', route.clubId)
    if (route.openingId) params.set('op', route.openingId)
  }
  if (route.page === 'events') {
    if (route.category) params.set('cat', route.category)
    if (route.collegeId) params.set('col', route.collegeId)
  }
  if (route.page === 'event-detail') {
    params.set('id', route.eventId)
  }
  if (route.page === 'volunteer-apply') {
    params.set('id', route.eventId)
    params.set('role', route.roleId)
  }
  if (route.page === 'applications' && route.filterEmail) {
    params.set('email', route.filterEmail)
  }
  return `#cc?${params.toString()}`
}

export function decodeRoute(hash: string): CollegeRoute {
  if (!hash.startsWith('#cc?')) return { page: 'colleges' }
  const params = new URLSearchParams(hash.slice(4))
  const page = params.get('page') ?? 'colleges'
  if (page === 'college-detail') {
    return { page, collegeId: params.get('id') ?? '' }
  }
  if (page === 'clubs') {
    return {
      page,
      category: params.get('cat') ?? undefined,
      collegeId: params.get('col') ?? undefined,
    }
  }
  if (page === 'club-profile') {
    return { page, clubId: params.get('id') ?? '' }
  }
  if (page === 'club-recruitment') {
    return {
      page,
      clubId: params.get('id') ?? '',
      openingId: params.get('op') ?? undefined,
    }
  }
  if (page === 'events') {
    return {
      page,
      category: params.get('cat') ?? undefined,
      collegeId: params.get('col') ?? undefined,
    }
  }
  if (page === 'event-detail') {
    return { page, eventId: params.get('id') ?? '' }
  }
  if (page === 'volunteer-apply') {
    return {
      page,
      eventId: params.get('id') ?? '',
      roleId: params.get('role') ?? '',
    }
  }
  if (page === 'applications') {
    return {
      page,
      filterEmail: params.get('email') ?? undefined,
    }
  }
  return { page: 'colleges' }
}
