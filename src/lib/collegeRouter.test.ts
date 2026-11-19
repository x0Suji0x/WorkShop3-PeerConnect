import { describe, expect, it } from 'vitest'
import { decodeRoute, encodeRoute } from './collegeRouter'

describe('campus route helpers', () => {
  it('round-trips a club recruitment route with its opening', () => {
    const route = { page: 'club-recruitment' as const, clubId: 'design-club', openingId: 'design-lead' }

    expect(decodeRoute(encodeRoute(route))).toEqual(route)
  })

  it('retains filters when encoding an events route', () => {
    const route = { page: 'events' as const, category: 'Hackathon', collegeId: 'iit-bombay' }

    expect(decodeRoute(encodeRoute(route))).toEqual(route)
  })

  it('falls back to the college directory for an unrelated hash', () => {
    expect(decodeRoute('#overview')).toEqual({ page: 'colleges' })
  })
})
