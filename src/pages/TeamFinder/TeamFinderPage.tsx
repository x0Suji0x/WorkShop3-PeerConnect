import { useState, useMemo } from 'react'
import { Link } from 'react-router-dom'
import { Users, Plus, Sparkles, Filter } from 'lucide-react'
import { teamPosts } from '../../data/teamFinderMockData'
import { communityRoutes } from '../../app/routes'
import { TeamPostCard } from '../../components/teamfinder/TeamPostCard'
import { SearchBar } from '../../components/common/SearchBar'
import { EmptyState } from '../../components/common/EmptyState'
import type { CollabCategory, CollabType } from '../../types/community'

export function TeamFinderPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<string>('all')
  const [selectedCollabType, setSelectedCollabType] = useState<string>('all')
  const [statusFilter, setStatusFilter] = useState<'all' | 'open' | 'filled'>('all')

  const categories: { id: CollabCategory | 'all'; label: string }[] = [
    { id: 'all', label: 'All Types' },
    { id: 'hackathon', label: 'Hackathons' },
    { id: 'startup', label: 'Startups' },
    { id: 'college-project', label: 'College Projects' },
    { id: 'research', label: 'Research' },
    { id: 'open-source', label: 'Open Source' },
    { id: 'personal-project', label: 'Personal Projects' },
  ]

  const collabTypes: { id: CollabType | 'all'; label: string }[] = [
    { id: 'all', label: 'Any Format' },
    { id: 'remote', label: 'Remote' },
    { id: 'on-campus', label: 'On Campus' },
    { id: 'hybrid', label: 'Hybrid' },
  ]

  const filteredPosts = useMemo(() => {
    return teamPosts.filter((post) => {
      const q = searchQuery.toLowerCase().trim()
      const matchesSearch =
        q === '' ||
        post.title.toLowerCase().includes(q) ||
        post.description.toLowerCase().includes(q) ||
        post.skills.some((s) => s.toLowerCase().includes(q)) ||
        post.roles.some((r) => r.title.toLowerCase().includes(q))

      const matchesCategory = selectedCategory === 'all' || post.category === selectedCategory
      const matchesCollabType = selectedCollabType === 'all' || post.collabType === selectedCollabType
      const matchesStatus = statusFilter === 'all' || post.status === statusFilter

      return matchesSearch && matchesCategory && matchesCollabType && matchesStatus
    })
  }, [searchQuery, selectedCategory, selectedCollabType, statusFilter])

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="flex flex-col gap-4 border-b border-[#E7E8E1] pb-7 sm:flex-row sm:items-end sm:justify-between">
        <div className="max-w-2xl space-y-2">
          <div className="flex items-center gap-2">
            <span className="flex h-6 w-6 items-center justify-center rounded-lg bg-[#E3F4EB] text-[#08C58A]">
              <Users className="h-3.5 w-3.5" />
            </span>
            <p className="text-xs font-bold uppercase tracking-[0.14em] text-[#08A876]">
              Team Finder & Collaboration
            </p>
          </div>
          <h1 className="text-3xl font-black tracking-tight text-[#171916] sm:text-4xl">
            Find teammates for your next breakthrough.
          </h1>
          <p className="text-sm leading-relaxed text-[#525A55] sm:text-base">
            Form high-performing student squads for hackathons, research papers, campus capstones, and venture prototypes.
          </p>
        </div>

        {/* Action buttons */}
        <div className="flex shrink-0 flex-wrap items-center gap-2.5">
          <Link
            to={communityRoutes.teamBuilder}
            className="inline-flex items-center gap-1.5 rounded-full border border-[#08C58A] bg-[#E3F4EB]/50 px-4 py-2.5 text-xs font-bold text-[#123D30] transition-colors hover:bg-[#E3F4EB]"
          >
            <Sparkles className="h-3.5 w-3.5 text-[#08C58A]" />
            AI Team Builder
          </Link>
          <Link
            to={communityRoutes.newTeam}
            className="inline-flex items-center gap-1.5 rounded-full bg-[#171916] px-5 py-2.5 text-xs font-bold text-white shadow-2xs hover:bg-[#2A2E28] transition-colors"
          >
            <Plus className="h-3.5 w-3.5" />
            Create Collaboration
          </Link>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="mt-8 space-y-4">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="w-full sm:max-w-md">
            <SearchBar
              placeholder="Search by project title, skill (e.g. PyTorch, React), or role..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onClear={() => setSearchQuery('')}
            />
          </div>

          {/* Quick status filter */}
          <div className="flex items-center gap-1.5 self-start sm:self-auto text-xs">
            <span className="font-semibold text-[#777A72]">Status:</span>
            {(['all', 'open', 'filled'] as const).map((st) => (
              <button
                key={st}
                type="button"
                onClick={() => setStatusFilter(st)}
                className={`rounded-lg px-2.5 py-1 font-semibold transition-all capitalize ${
                  statusFilter === st
                    ? 'bg-[#171916] text-white'
                    : 'bg-white text-[#525A55] border border-[#E7E8E1] hover:text-[#171916]'
                }`}
              >
                {st === 'open' ? 'Recruiting' : st === 'filled' ? 'Full' : 'All'}
              </button>
            ))}
          </div>
        </div>

        {/* Category Pills & Collab Format */}
        <div className="flex flex-col gap-2.5 lg:flex-row lg:items-center lg:justify-between border-y border-[#E7E8E1] py-3">
          {/* Categories */}
          <div className="flex flex-wrap items-center gap-1.5">
            <Filter className="h-3.5 w-3.5 text-[#777A72] mr-1 hidden sm:block" />
            {categories.map((cat) => (
              <button
                key={cat.id}
                type="button"
                onClick={() => setSelectedCategory(cat.id)}
                className={`rounded-full px-3 py-1 text-xs font-semibold transition-all ${
                  selectedCategory === cat.id
                    ? 'bg-[#123D30] text-white shadow-2xs'
                    : 'bg-white text-[#525A55] border border-[#E7E8E1] hover:text-[#171916]'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>

          {/* Format pills */}
          <div className="flex flex-wrap items-center gap-1.5">
            {collabTypes.map((type) => (
              <button
                key={type.id}
                type="button"
                onClick={() => setSelectedCollabType(type.id)}
                className={`rounded-full px-2.5 py-0.5 text-xs font-medium transition-all ${
                  selectedCollabType === type.id
                    ? 'bg-[#E3F4EB] text-[#123D30] font-bold border border-[#08C58A]/40'
                    : 'bg-transparent text-[#777A72] hover:text-[#171916]'
                }`}
              >
                {type.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Grid of Team Posts */}
      <div className="mt-6">
        {filteredPosts.length > 0 ? (
          <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-2">
            {filteredPosts.map((post) => (
              <TeamPostCard key={post.id} post={post} />
            ))}
          </div>
        ) : (
          <EmptyState
            title="No collaboration posts found"
            description="Try modifying your search keywords or switching filters to see more open student projects."
            action={
              <button
                type="button"
                onClick={() => {
                  setSearchQuery('')
                  setSelectedCategory('all')
                  setSelectedCollabType('all')
                  setStatusFilter('all')
                }}
                className="rounded-full bg-[#171916] px-4 py-2 text-xs font-semibold text-white"
              >
                Reset All Filters
              </button>
            }
          />
        )}
      </div>
    </div>
  )
}
