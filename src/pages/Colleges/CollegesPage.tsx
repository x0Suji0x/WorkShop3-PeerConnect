import { Building2, CheckCircle2, GraduationCap } from 'lucide-react'
import { useMemo, useState } from 'react'
import { Badge } from '../../components/common/Badge'
import { Card } from '../../components/common/Card'
import { EmptyState } from '../../components/common/EmptyState'
import { PageHeading } from '../../components/common/PageHeading'
import { SearchBar } from '../../components/common/SearchBar'
import { CommunityTabs } from '../../components/communities/CommunityTabs'
import { FilterPills } from '../../components/communities/FilterPills'
import { colleges, collegeStates } from '../../data/communityDirectoryMockData'

export function CollegesPage() {
  const [query, setQuery] = useState('')
  const [state, setState] = useState('All')

  const filteredColleges = useMemo(() => colleges.filter((college) => {
    const matchesQuery = `${college.name} ${college.city} ${college.focusAreas?.join(' ')}`.toLowerCase().includes(query.toLowerCase())
    return matchesQuery && (state === 'All' || college.state === state)
  }), [query, state])

  return <div className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 sm:py-10 lg:px-8">
    <PageHeading eyebrow="Campus network" title="Find your campus community." description="Discover colleges where students are building, sharing work, and creating opportunities together." />
    <CommunityTabs />
    <section className="mt-7 rounded-2xl border border-[#E7E8E1] bg-[#F7F6F0] p-4 sm:p-5">
      <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-center"><SearchBar value={query} onChange={(event) => setQuery(event.target.value)} onClear={() => setQuery('')} placeholder="Search by college, city, or focus area" aria-label="Search colleges" /><FilterPills label="Filter colleges by state" options={collegeStates} value={state} onChange={setState} /></div>
    </section>
    <p className="mt-6 text-sm text-[#777A72]">{filteredColleges.length} {filteredColleges.length === 1 ? 'college' : 'colleges'} available</p>
    {filteredColleges.length ? <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">{filteredColleges.map((college) => <CollegeCard key={college.id} college={college} />)}</div> : <div className="mt-6"><EmptyState icon={Building2} title="No colleges match that search" description="Try another city, focus area, or clear the current filters." /></div>}
  </div>
}

function CollegeCard({ college }: { college: (typeof colleges)[number] }) {
  return <Card className="flex h-full flex-col" padding="md"><div className="flex items-start justify-between gap-3"><div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#E3F4EB] text-[#123D30]"><GraduationCap className="h-5 w-5" /></div>{college.verified ? <Badge variant="green" size="sm"><CheckCircle2 className="h-3 w-3" />Verified</Badge> : <Badge variant="neutral" size="sm">Community listed</Badge>}</div><h2 className="mt-5 text-lg font-black leading-tight text-[#171916]">{college.name}</h2><p className="mt-1 text-sm font-semibold text-[#08A876]">{college.city}, {college.state}</p><p className="mt-3 text-sm leading-relaxed text-[#525A55]">{college.description}</p><div className="mt-4 flex flex-wrap gap-1.5">{college.focusAreas?.map((area) => <Badge key={area} variant="neutral" size="sm">{area}</Badge>)}</div><div className="mt-5 grid grid-cols-3 border-t border-[#E7E8E1] pt-4 text-center"><Stat label="Students" value={college.studentCount ?? 0} /><Stat label="Clubs" value={college.clubCount ?? 0} /><Stat label="Events" value={college.eventCount ?? 0} /></div></Card>
}

function Stat({ label, value }: { label: string; value: number }) { return <div><p className="font-mono text-base font-black text-[#171916]">{value.toLocaleString()}</p><p className="mt-1 text-[11px] font-bold uppercase tracking-wide text-[#777A72]">{label}</p></div> }
