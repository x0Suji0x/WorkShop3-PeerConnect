import { ArrowRight, UsersRound } from 'lucide-react'
import { useMemo, useState } from 'react'
import { Badge } from '../../components/common/Badge'
import { Card } from '../../components/common/Card'
import { EmptyState } from '../../components/common/EmptyState'
import { PageHeading } from '../../components/common/PageHeading'
import { SearchBar } from '../../components/common/SearchBar'
import { CommunityTabs } from '../../components/communities/CommunityTabs'
import { FilterPills } from '../../components/communities/FilterPills'
import { clubCategories, clubs } from '../../data/communityDirectoryMockData'

export function ClubsPage() {
  const [query, setQuery] = useState('')
  const [category, setCategory] = useState('All')
  const [openOnly, setOpenOnly] = useState(false)
  const [joinedClubIds, setJoinedClubIds] = useState<string[]>([])
  const filteredClubs = useMemo(() => clubs.filter((club) => {
    const matchesQuery = `${club.name} ${club.collegeName} ${club.category} ${club.tags?.join(' ')}`.toLowerCase().includes(query.toLowerCase())
    return matchesQuery && (category === 'All' || club.category === category) && (!openOnly || club.isOpenToMembers)
  }), [category, openOnly, query])
  const toggleJoin = (clubId: string) => setJoinedClubIds((current) => current.includes(clubId) ? current.filter((id) => id !== clubId) : [...current, clubId])

  return <div className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 sm:py-10 lg:px-8"><PageHeading eyebrow="Campus communities" title="Find a club where you can contribute." description="Meet focused student groups, explore upcoming activity, and save communities you want to join." /><CommunityTabs />
    <section className="mt-7 rounded-2xl border border-[#E7E8E1] bg-[#F7F6F0] p-4 sm:p-5"><div className="flex flex-col gap-4"><SearchBar value={query} onChange={(event) => setQuery(event.target.value)} onClear={() => setQuery('')} placeholder="Search clubs, colleges, or skills" aria-label="Search clubs" /><div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between"><FilterPills label="Filter clubs by category" options={clubCategories} value={category} onChange={setCategory} /><button type="button" onClick={() => setOpenOnly((current) => !current)} aria-pressed={openOnly} className={`shrink-0 rounded-full px-3.5 py-2 text-xs font-bold transition ${openOnly ? 'bg-[#123D30] text-white' : 'border border-[#E7E8E1] bg-white text-[#525A55] hover:border-[#08C58A]'}`}>Open to new members</button></div></div></section>
    <p className="mt-6 text-sm text-[#777A72]">{filteredClubs.length} {filteredClubs.length === 1 ? 'club' : 'clubs'} available</p>{filteredClubs.length ? <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">{filteredClubs.map((club) => <ClubCard key={club.id} club={club} joined={joinedClubIds.includes(club.id)} onToggleJoin={() => toggleJoin(club.id)} />)}</div> : <div className="mt-6"><EmptyState icon={UsersRound} title="No clubs match that search" description="Try a broader category or turn off the membership filter." /></div>}</div>
}

function ClubCard({ club, joined, onToggleJoin }: { club: (typeof clubs)[number]; joined: boolean; onToggleJoin: () => void }) { return <Card className="flex h-full flex-col" padding="md"><div className="flex items-start justify-between gap-3"><div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#E3F4EB] text-[#123D30]"><UsersRound className="h-5 w-5" /></div><Badge variant={club.isOpenToMembers ? 'green' : 'neutral'} size="sm">{club.isOpenToMembers ? 'Recruiting' : 'Full team'}</Badge></div><p className="mt-5 text-xs font-bold uppercase tracking-[0.12em] text-[#08A876]">{club.category}</p><h2 className="mt-1 text-lg font-black text-[#171916]">{club.name}</h2><p className="mt-1 text-sm text-[#777A72]">{club.collegeName}</p><p className="mt-3 text-sm leading-relaxed text-[#525A55]">{club.description}</p><div className="mt-4 flex flex-wrap gap-1.5">{club.tags?.map((tag) => <Badge key={tag} variant="neutral" size="sm">{tag}</Badge>)}</div><div className="mt-5 border-t border-[#E7E8E1] pt-4"><p className="text-xs text-[#777A72]"><span className="font-bold text-[#171916]">{club.memberCount}</span> members</p><p className="mt-1 text-xs font-semibold text-[#08A876]">{club.nextEvent}</p><button type="button" onClick={onToggleJoin} disabled={!club.isOpenToMembers && !joined} className={`mt-4 inline-flex items-center gap-1.5 text-sm font-bold transition ${joined ? 'text-[#08A876]' : 'text-[#123D30] hover:text-[#08A876] disabled:cursor-not-allowed disabled:text-[#9A9D96]'}`}>{joined ? 'Saved to my clubs' : club.isOpenToMembers ? 'Save this club' : 'Membership currently full'}<ArrowRight className="h-3.5 w-3.5" /></button></div></Card> }
