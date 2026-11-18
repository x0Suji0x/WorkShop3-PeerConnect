import { useState, useMemo } from 'react'
import { Link } from 'react-router-dom'
import { Users, Plus, Sparkles, Search } from 'lucide-react'
import { teamPosts } from '../data/teamFinderData'
import { TeamPostCard } from '../components/TeamPostCard'
import { EmptyState } from '../../../components/common/EmptyState'
import type { CollabCategory, CollabType } from '../types'

export function TeamFinderPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<string>('all')
  const [selectedCollabType, setSelectedCollabType] = useState<string>('all')
  const [statusFilter, setStatusFilter] = useState<'all' | 'open' | 'filled'>('all')

  const categories: { id: CollabCategory | 'all'; label: string }[] = [
    { id: 'all', label: 'All Opportunities' },
    { id: 'hackathon', label: 'Hackathons' },
    { id: 'startup', label: 'Startups' },
    { id: 'college-project', label: 'College Capstones' },
    { id: 'research', label: 'Research Papers' },
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
            Form high-performing student squads for hackathons, research capstones, campus startups, and open-source packages.
          </p>
        </div>

        {/* Action buttons */}
        <div className="flex shrink-0 flex-wrap items-center gap-2.5">
          <Link
            to="/team-finder/builder"
            className="inline-flex items-center gap-1.5 rounded-full border border-[#08C58A] bg-[#E3F4EB]/50 px-4 py-2.5 text-xs font-bold text-[#123D30] transition-colors hover:bg-[#E3F4EB]"
          >
            <Sparkles className="h-3.5 w-3.5 text-[#08C58A]" />
            AI Team Builder
          </Link>
          <Link
            to="/team-finder/new"
            className="inline-flex items-center gap-1.5 rounded-full bg-[#171916] px-5 py-2.5 text-xs font-bold text-white shadow-2xs hover:bg-[#2A2E28] transition-colors"
          >
            <Plus className="h-3.5 w-3.5" />
            Create Collaboration
          </Link>
        </div>
      </div>

      {/* Filter and Search Section */}
      <div className="mt-8 space-y-4">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="relative w-full sm:max-w-md">
            <Search className="absolute left-3.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-[#777A72]" />
            <input
              type="text"
              placeholder="Search by title, role (e.g. Frontend), skill (e.g. PyTorch)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-full border border-[#E7E8E1] bg-white py-2 pl-9 pr-4 text-xs text-[#171916] outline-none transition focus:border-[#08C58A] focus:ring-1 focus:ring-[#08C58A]"
            />
          </div>

          <div className="flex items-center gap-2 text-xs">
            <span className="font-semibold text-[#777A72]">Status:</span>
            <div className="inline-flex rounded-full border border-[#E7E8E1] bg-white p-0.5">
              {(['all', 'open', 'filled'] as const).map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => setStatusFilter(s)}
                  className={`rounded-full px-3 py-1 font-bold capitalize transition ${statusFilter === s ? 'bg-[#171916] text-white' : 'text-[#525A55] hover:text-[#171916]'
                    }`}
                >
                  {s === 'all' ? 'All' : s}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Category Pills */}
        <div className="flex flex-wrap items-center gap-1.5 overflow-x-auto pb-1">
          {categories.map((cat) => (
            <button
              key={cat.id}
              type="button"
              onClick={() => setSelectedCategory(cat.id)}
              className={`rounded-full px-3.5 py-1.5 text-xs font-bold transition-all ${selectedCategory === cat.id
                  ? 'bg-[#171916] text-white shadow-2xs'
                  : 'border border-[#E7E8E1] bg-white text-[#525A55] hover:border-[#171916] hover:text-[#171916]'
                }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Format Selector */}
        <div className="flex items-center gap-1.5 text-xs text-[#525A55]">
          <span className="font-semibold text-[#777A72]">Format:</span>
          {collabTypes.map((type) => (
            <button
              key={type.id}
              type="button"
              onClick={() => setSelectedCollabType(type.id)}
              className={`rounded-md px-2.5 py-1 font-medium transition ${selectedCollabType === type.id
                  ? 'bg-[#E3F4EB] text-[#123D30] font-bold'
                  : 'text-[#777A72] hover:bg-[#F7F6F0]'
                }`}
            >
              {type.label}
            </button>
          ))}
        </div>
      </div>

      {/* Results Grid */}
      <div className="mt-8">
        <div className="flex items-center justify-between pb-3">
          <p className="text-xs font-bold text-[#525A55]">
            Showing {filteredPosts.length} collaboration opportunities
          </p>
        </div>

        {filteredPosts.length > 0 ? (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {filteredPosts.map((post) => (
              <TeamPostCard key={post.id} post={post} />
            ))}
          </div>
        ) : (
          <div className="py-12">
            <EmptyState
              title="No open teams matched your filters"
              description="Try adjusting your category or collaboration format filters, or be the first to post a new squad opening!"
              action={
                <Link
                  to="/team-finder/new"
                  className="rounded-full bg-[#171916] px-5 py-2 text-xs font-bold text-white hover:bg-[#2A2E28]"
                >
                  Create Collaboration Post
                </Link>
              }
            />
          </div>
        )}
      </div>
    </div>
  )
}

