import { useState, useMemo } from 'react'
import { Link } from 'react-router-dom'
import { Sparkles, Users, CheckCircle2 } from 'lucide-react'
import { communities, communityCategories } from '../../data/communityMockData'
import { demoStudent } from '../../data/studentMockData'
import { recommendCommunities } from '../../lib/recommendationEngine'
import { CommunityCard } from '../../components/communities/CommunityCard'
import { CommunityRecommendationCard } from '../../components/communities/CommunityRecommendationCard'
import { SearchBar } from '../../components/common/SearchBar'
import { EmptyState } from '../../components/common/EmptyState'

export function CommunitiesPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<string>('all')

  // Maintain local state of joined communities (defaults to initial isJoined flags)
  const [joinedCommunityIds, setJoinedCommunityIds] = useState<string[]>(() =>
    communities.filter((c) => c.isJoined).map((c) => c.id),
  )

  const handleJoinToggle = (communityId: string) => {
    setJoinedCommunityIds((prev) =>
      prev.includes(communityId) ? prev.filter((id) => id !== communityId) : [...prev, communityId],
    )
  }

  // AI-Powered Community Recommendations
  const recommendations = useMemo(() => {
    const studentSkills = demoStudent.skills.map((s) => s.name)
    const studentInterests = demoStudent.interests
    return recommendCommunities(studentSkills, studentInterests, joinedCommunityIds)
  }, [joinedCommunityIds])

  // Filtered communities for the main directory
  const filteredCommunities = useMemo(() => {
    return communities.filter((comm) => {
      const matchesSearch =
        searchQuery.trim() === '' ||
        comm.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        comm.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        comm.tags.some((tag) => tag.toLowerCase().includes(searchQuery.toLowerCase()))

      const matchesCategory =
        selectedCategory === 'all' || comm.category.toLowerCase() === selectedCategory.toLowerCase()

      return matchesSearch && matchesCategory
    })
  }, [searchQuery, selectedCategory])

  return (
    <div className="peer-page-surface min-h-[calc(100vh-80px)] relative overflow-hidden pb-16">
      {/* Ambient lighting glows identical to home page */}
      <div className="peer-ambient-glow peer-glow-gold -top-24 -left-24 h-96 w-96" />
      <div className="peer-ambient-glow peer-glow-rose top-1/4 -right-24 h-96 w-96" />
      <div className="peer-ambient-glow peer-glow-mint -bottom-24 left-1/3 h-96 w-96" />
      <div className="pointer-events-none absolute inset-0 bg-grid-pattern opacity-30 -z-0" />

      <div className="relative z-10 mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Top Page Heading */}
        <div className="flex flex-col gap-4 peer-divider-fade pb-7 sm:flex-row sm:items-end sm:justify-between">
          <div className="max-w-2xl space-y-2">
            <div className="peer-eyebrow-pill mb-1">
              <span className="dot" aria-hidden="true" />
              STUDENT COMMUNITIES
            </div>
            <h1 className="text-3xl font-black tracking-tight text-[#171916] sm:text-4xl">
              Find your people. Build together.
            </h1>
            <p className="text-sm leading-relaxed text-[#525A55] sm:text-base">
              Discover peer circles across engineering, design, AI, and entrepreneurship. Share knowledge,
              collaborate on hackathons, and expand your campus network.
            </p>
          </div>

          <div className="flex shrink-0 items-center gap-3">
            <Link
              to="/my-communities"
              className="inline-flex items-center gap-1.5 rounded-full border border-[rgba(91,112,96,0.18)] bg-white/80 backdrop-blur-xs px-4 py-2 text-xs font-bold text-[#171916] shadow-2xs transition-all hover:border-[#171916]"
            >
              <CheckCircle2 className="h-3.5 w-3.5 text-[#08C58A]" />
              My Communities ({joinedCommunityIds.length})
            </Link>
            <Link
              to="/team-finder"
              className="inline-flex items-center gap-1.5 rounded-full bg-[#123D30] px-4 py-2 text-xs font-bold text-white shadow-2xs transition-all hover:bg-[#0E3127]"
            >
              <Users className="h-3.5 w-3.5 text-[#08C58A]" />
              Explore Teams
            </Link>
          </div>
        </div>

      {/* AI Recommendations Section */}
      {recommendations.length > 0 && (
        <section className="mt-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-emerald-100 text-[#08A876]">
                <Sparkles className="h-4 w-4" />
              </span>
              <div>
                <h2 className="text-lg font-bold text-[#171916]">
                  AI-Powered Recommendations for You
                </h2>
                <p className="text-xs text-[#525A55]">
                  Tailored based on your skills in {demoStudent.skills.map((s) => s.name).slice(0, 3).join(', ')} and your listed interests.
                </p>
              </div>
            </div>
            <span className="hidden sm:inline-block rounded-full bg-[#E3F4EB] px-3 py-1 text-xs font-medium text-[#123D30]">
              Rule-based matching engine
            </span>
          </div>

          <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
            {recommendations.slice(0, 3).map((rec) => (
              <CommunityRecommendationCard
                key={rec.community.id}
                recommendation={rec}
                isJoined={joinedCommunityIds.includes(rec.community.id)}
                onJoinToggle={handleJoinToggle}
              />
            ))}
          </div>
        </section>
      )}

      {/* Search and Category Filters */}
      <section className="mt-10">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="w-full sm:max-w-md">
            <SearchBar
              placeholder="Search by community name, topic or #tag..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onClear={() => setSearchQuery('')}
            />
          </div>

          {/* Category Tabs */}
          <div className="flex flex-wrap gap-1.5 overflow-x-auto pb-1">
            <button
              type="button"
              onClick={() => setSelectedCategory('all')}
              className={`rounded-full px-3.5 py-1.5 text-xs font-semibold transition-all ${
                selectedCategory === 'all'
                  ? 'bg-[#171916] text-white shadow-2xs'
                  : 'bg-white text-[#525A55] border border-[#E7E8E1] hover:text-[#171916]'
              }`}
            >
              All Categories
            </button>
            {communityCategories.map((cat) => (
              <button
                key={cat.id}
                type="button"
                onClick={() => setSelectedCategory(cat.id)}
                className={`rounded-full px-3.5 py-1.5 text-xs font-semibold transition-all ${
                  selectedCategory === cat.id
                    ? 'bg-[#171916] text-white shadow-2xs'
                    : 'bg-white text-[#525A55] border border-[#E7E8E1] hover:text-[#171916]'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>

        {/* Community Grid */}
        <div className="mt-6">
          {filteredCommunities.length > 0 ? (
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {filteredCommunities.map((community) => (
                <CommunityCard
                  key={community.id}
                  community={community}
                  isJoined={joinedCommunityIds.includes(community.id)}
                  onJoinToggle={handleJoinToggle}
                />
              ))}
            </div>
          ) : (
            <EmptyState
              title="No communities found"
              description="No communities matched your search criteria. Try a different search term or category filter."
              action={
                <button
                  type="button"
                  onClick={() => {
                    setSearchQuery('')
                    setSelectedCategory('all')
                  }}
                  className="rounded-full bg-[#171916] px-4 py-2 text-xs font-semibold text-white"
                >
                  Clear Filters
                </button>
              }
            />
          )}
        </div>
      </section>
      </div>
    </div>
  )
}
