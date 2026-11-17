import { CalendarDays, Check, MapPin, UsersRound } from 'lucide-react'
import { useMemo, useState } from 'react'
import { Badge } from '../../components/common/Badge'
import { Button } from '../../components/common/Button'
import { Card } from '../../components/common/Card'
import { EmptyState } from '../../components/common/EmptyState'
import { PageHeading } from '../../components/common/PageHeading'
import { SearchBar } from '../../components/common/SearchBar'
import { CommunityTabs } from '../../components/communities/CommunityTabs'
import { FilterPills } from '../../components/communities/FilterPills'
import { eventCategories, events } from '../../data/communityDirectoryMockData'

const formatEventDate = (date: string) => new Intl.DateTimeFormat('en-IN', { day: 'numeric', month: 'short', weekday: 'short', hour: 'numeric', minute: '2-digit' }).format(new Date(date))

export function EventsPage() {
  const [query, setQuery] = useState('')
  const [category, setCategory] = useState('All')
  const [interestedEventIds, setInterestedEventIds] = useState<string[]>([])
  const filteredEvents = useMemo(() => events.filter((event) => `${event.title} ${event.organizerName} ${event.location} ${event.category}`.toLowerCase().includes(query.toLowerCase()) && (category === 'All' || event.category === category)), [category, query])
  const toggleInterest = (eventId: string) => setInterestedEventIds((current) => current.includes(eventId) ? current.filter((id) => id !== eventId) : [...current, eventId])

  return <div className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 sm:py-10 lg:px-8"><PageHeading eyebrow="Campus calendar" title="Show up for what matters to you." description="Browse workshops, build sessions, meetups, and student-led events across the network." /><CommunityTabs />
    <section className="mt-7 rounded-2xl border border-[#E7E8E1] bg-[#F7F6F0] p-4 sm:p-5"><div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-center"><SearchBar value={query} onChange={(event) => setQuery(event.target.value)} onClear={() => setQuery('')} placeholder="Search events, organisers, or locations" aria-label="Search events" /><FilterPills label="Filter events by category" options={eventCategories} value={category} onChange={setCategory} /></div></section>
    <p className="mt-6 text-sm text-[#777A72]">{filteredEvents.length} upcoming {filteredEvents.length === 1 ? 'event' : 'events'}</p>{filteredEvents.length ? <div className="mt-4 space-y-4">{filteredEvents.map((event) => <EventCard key={event.id} event={event} interested={interestedEventIds.includes(event.id)} onToggleInterest={() => toggleInterest(event.id)} />)}</div> : <div className="mt-6"><EmptyState icon={CalendarDays} title="No events match that search" description="Try a different category or clear the current search." /></div>}</div>
}

function EventCard({ event, interested, onToggleInterest }: { event: (typeof events)[number]; interested: boolean; onToggleInterest: () => void }) { const spotsLeft = event.capacity ? Math.max(event.capacity - event.attendeeCount, 0) : null; return <Card padding="md"><div className="flex flex-col gap-5 md:flex-row md:items-start md:justify-between"><div className="flex min-w-0 gap-4"><div className="flex h-14 w-14 shrink-0 flex-col items-center justify-center rounded-xl bg-[#123D30] text-white"><span className="text-[10px] font-bold uppercase">{new Intl.DateTimeFormat('en-IN', { month: 'short' }).format(new Date(event.startsAt))}</span><span className="text-lg font-black leading-none">{new Date(event.startsAt).getDate()}</span></div><div><div className="flex flex-wrap gap-2"><Badge variant="green" size="sm">{event.category}</Badge>{event.isFree && <Badge variant="neutral" size="sm">Free</Badge>}</div><h2 className="mt-2 text-lg font-black text-[#171916]">{event.title}</h2><p className="mt-1 text-sm font-semibold text-[#08A876]">{event.organizerName}</p><p className="mt-2 max-w-2xl text-sm leading-relaxed text-[#525A55]">{event.description}</p><div className="mt-4 flex flex-wrap gap-x-4 gap-y-2 text-xs text-[#777A72]"><span className="inline-flex items-center gap-1.5"><CalendarDays className="h-3.5 w-3.5" />{formatEventDate(event.startsAt)}</span><span className="inline-flex items-center gap-1.5"><MapPin className="h-3.5 w-3.5" />{event.location}</span><span className="inline-flex items-center gap-1.5"><UsersRound className="h-3.5 w-3.5" />{event.attendeeCount} going{spotsLeft !== null ? ` · ${spotsLeft} spots left` : ''}</span></div></div></div><Button type="button" variant={interested ? 'secondary' : 'primary'} size="sm" onClick={onToggleInterest}>{interested && <Check className="h-3.5 w-3.5" />}{interested ? 'Interested' : 'I’m interested'}</Button></div></Card> }
