import { useState, useMemo } from 'react'
import { Link } from 'react-router-dom'
import { Sparkles, Users, Compass, CheckCircle2, Search } from 'lucide-react'
import { communities, communityCategories } from '../data/communitiesData'
import { recommendCommunities } from '../engine/recommendationEngine'
import { CommunityCard } from '../components/CommunityCard'
import { CommunityRecommendationCard } from '../components/CommunityRecommendationCard'
import { useStudentProfile } from '../../../hooks/useStudentProfile'
import { EmptyState } from '../../../components/common/EmptyState'

export function CommunitiesPage() {
  const { student } = useStudentProfile()
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<string>('all')

  // Maintain local state of joined communities (initialized from mock data)
  const [joinedCommunityIds, setJoinedCommunityIds] = useState<string[]>(() =>
    communities.filter((c) => c.isJoined).map((c) => c.id),
  )

  const handleJoinToggle = (communityId: string) => {
    setJoinedCommunityIds((prev) =>
      prev.includes(communityId)
        ? prev.filter((id) => id !== communityId)
        : [...prev, communityId],
    )
  }

  // AI-Powered Community Recommendations
  const recommendations = useMemo(() => {
    const studentSkills = student?.skills?.map((s) => s.name) || ['Figma', 'React', 'Design Systems']
    const studentInterests = student?.interests || ['Inclusive design', 'Creative technology']
    const academicField = student?.fieldOfStudy || 'Interaction Design'
    const careerGoals = ['Paid projects', 'Hackathons', 'Collaborators']

    return recommendCommunities({
      skills: studentSkills,
      interests: studentInterests,
      joinedCommunityIds,
      academicField,
      careerGoals,
    })
  }, [student, joinedCommunityIds])

  // Filtered communities for directory
  const filteredCommunities = useMemo(() => {
    return communities.filter((comm) => {
      const q = searchQuery.toLowerCase().trim()
      const matchesSearch =
        q === '' ||
        comm.name.toLowerCase().includes(q) ||
        comm.description.toLowerCase().includes(q) ||
        comm.tagline.toLowerCase().includes(q) ||
        comm.tags.some((tag) => tag.toLowerCase().includes(q))

      const matchesCategory =
        selectedCategory === 'all' || comm.category.toLowerCase() === selectedCategory.toLowerCase()

      return matchesSearch && matchesCategory
    })
  }, [searchQuery, selectedCategory])

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      {/* Page Header */}
      <div className="flex flex-col gap-4 border-b border-[#E7E8E1] pb-7 sm:flex-row sm:items-end sm:justify-between">
        <div className="max-w-2xl space-y-2">
          <div className="flex items-center gap-2">
            <span className="flex h-6 w-6 items-center justify-center rounded-lg bg-[#E3F4EB] text-[#08C58A]">
              <Compass className="h-3.5 w-3.5" />
            </span>
            <p className="text-xs font-bold uppercase tracking-[0.14em] text-[#08A876]">
              Student Communities Ecosystem
            </p>
          </div>
          <h1 className="text-3xl font-black tracking-tight text-[#171916] sm:text-4xl">
            Find your people. Build together.
          </h1>
          <p className="text-sm leading-relaxed text-[#525A55] sm:text-base">
            Discover 12 interest-driven circles across software, AI, robotics, design, and campus startups.
            Connect with peers, share benchmarks, and find teammates for hackathons.
          </p>
        </div>

        <div className="flex shrink-0 items-center gap-3">
          <Link
            to="/my-communities"
            className="inline-flex items-center gap-1.5 rounded-full border border-[#E7E8E1] bg-white px-4 py-2 text-xs font-bold text-[#171916] shadow-2xs transition-all hover:border-[#171916]"
          >
            <CheckCircle2 className="h-3.5 w-3.5 text-[#08C58A]" />
            My Circles ({joinedCommunityIds.length})
          </Link>
          <Link
            to="/team-finder"
            className="inline-flex items-center gap-1.5 rounded-full bg-[#171916] px-4 py-2 text-xs font-bold text-white shadow-2xs transition-all hover:bg-[#2A2E28]"
          >
            <Users className="h-3.5 w-3.5" />
            Explore Teams
          </Link>
        </div>
      </div>

      {/* AI Recommendations Shelf */}
      {recommendations.length > 0 && (
        <section className="mt-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-emerald-100 text-[#08A876]">
                <Sparkles className="h-4 w-4" />
              </span>
              <div>
                <h2 className="text-lg font-black text-[#171916]">
                  AI-Powered Recommendations for You
                </h2>
                <p className="text-xs text-[#525A55]">
                  Personalized matching against your skills, portfolio projects, and academic background
                </p>
              </div>
            </div>
            <span className="hidden sm:inline-flex text-xs font-semibold text-[#08A876]">
              {recommendations.length} circles recommended
            </span>
          </div>

          <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {recommendations.map((rec) => (
              <CommunityRecommendationCard
                key={rec.community.id}
                recommendation={rec}
                isJoined={joinedCommunityIds.includes(rec.community.id)}
                onToggleJoin={handleJoinToggle}
              />
            ))}
          </div>
        </section>
      )}

      {/* Directory Search & Filters */}
      <section className="mt-10">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b border-[#F2F1EA] pb-5">
          <div>
            <h2 className="text-xl font-black text-[#171916]">All Student Circles</h2>
            <p className="text-xs text-[#525A55]">Browse all 12 communities or filter by technical domain</p>
          </div>

          {/* Search Bar */}
          <div className="relative w-full sm:w-80">
            <Search className="absolute left-3.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-[#777A72]" />
            <input
              type="text"
              placeholder="Search by topic, skill (e.g. PyTorch), name..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-full border border-[#E7E8E1] bg-white py-2 pl-9 pr-4 text-xs text-[#171916] outline-none transition focus:border-[#08C58A] focus:ring-1 focus:ring-[#08C58A]"
            />
          </div>
        </div>

        {/* Category Pill Filters */}
        <div className="mt-4 flex flex-wrap items-center gap-1.5 overflow-x-auto pb-2">
          {communityCategories.map((cat) => {
            const isActive = selectedCategory === cat.id
            return (
              <button
                key={cat.id}
                type="button"
                onClick={() => setSelectedCategory(cat.id)}
                className={`rounded-full px-3.5 py-1.5 text-xs font-bold transition-all ${
                  isActive
                    ? 'bg-[#171916] text-white shadow-2xs'
                    : 'border border-[#E7E8E1] bg-white text-[#525A55] hover:border-[#171916] hover:text-[#171916]'
                }`}
              >
                {cat.label}
              </button>
            )
          })}
        </div>

        {/* Directory Grid */}
        <div className="mt-6">
          {filteredCommunities.length > 0 ? (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {filteredCommunities.map((community) => (
                <CommunityCard
                  key={community.id}
                  community={community}
                  isJoined={joinedCommunityIds.includes(community.id)}
                  onToggleJoin={handleJoinToggle}
                />
              ))}
            </div>
          ) : (
            <div className="py-12">
              <EmptyState
                title="No communities match your criteria"
                description={`We couldn't find any communities matching "${searchQuery}". Try searching for another skill tag or clearing your category filter.`}
                action={
                  <button
                    type="button"
                    onClick={() => {
                      setSearchQuery('')
                      setSelectedCategory('all')
                    }}
                    className="rounded-full bg-[#171916] px-5 py-2 text-xs font-bold text-white hover:bg-[#2A2E28]"
                  >
                    Reset Search Filters
                  </button>
                }
              />
            </div>
          )}
        </div>
      </section>
    </div>
  )
}

