import { useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowLeft, Users, MessageSquare } from 'lucide-react'
import { communities, communityPosts } from '../../data/communityMockData'
import { communityRoutes } from '../../app/routes'
import { CommunityCard } from '../../components/communities/CommunityCard'
import { DiscussionPostCard } from '../../components/communities/DiscussionPostCard'
import { EmptyState } from '../../components/common/EmptyState'

export function MyCommunitiesPage() {
  const [joinedCommunityIds, setJoinedCommunityIds] = useState<string[]>(() =>
    communities.filter((c) => c.isJoined).map((c) => c.id),
  )

  const handleJoinToggle = (communityId: string) => {
    setJoinedCommunityIds((prev) =>
      prev.includes(communityId) ? prev.filter((id) => id !== communityId) : [...prev, communityId],
    )
  }

  const joinedCommunities = communities.filter((c) => joinedCommunityIds.includes(c.id))

  // Posts from joined communities
  const joinedPosts = joinedCommunities.flatMap((c) => communityPosts[c.id] || [])

  return (
    <div className="peer-page-surface min-h-[calc(100vh-80px)] relative overflow-hidden pb-16">
      <div className="peer-ambient-glow peer-glow-gold -top-24 -left-24 h-96 w-96 pointer-events-none" />
      <div className="peer-ambient-glow peer-glow-rose top-1/4 -right-24 h-96 w-96 pointer-events-none" />
      <div className="peer-ambient-glow peer-glow-mint -bottom-24 left-1/3 h-96 w-96 pointer-events-none" />
      <div className="pointer-events-none absolute inset-0 bg-grid-pattern opacity-30 -z-0" />

      <div className="relative z-10 mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col gap-4 peer-divider-fade pb-7 sm:flex-row sm:items-end sm:justify-between">
          <div className="max-w-2xl space-y-2">
            <Link
              to={communityRoutes.communities}
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#08A876] transition-colors hover:text-[#06805a]"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              Back to All Communities
            </Link>
            <div className="peer-eyebrow-pill">
              My Circles
            </div>
            <h1 className="text-3xl font-black tracking-tight text-[#171916] sm:text-4xl">
              My Communities
            </h1>
            <p className="text-sm leading-relaxed text-[#525A55] sm:text-base">
              Communities you have joined. Keep up with project calls, peer discussions, and announcements.
            </p>
          </div>

          <Link
            to={communityRoutes.communities}
            className="inline-flex items-center gap-1.5 rounded-full bg-[#171916] px-4 py-2 text-xs font-bold text-white shadow-2xs hover:bg-[#2A2E28]"
          >
            <Users className="h-3.5 w-3.5" />
            Browse More Circles
          </Link>
        </div>

      {/* Content */}
      <div className="mt-8">
        {joinedCommunities.length > 0 ? (
          <div className="space-y-12">
            {/* Joined Circles Grid */}
            <section>
              <h2 className="text-lg font-bold text-[#171916]">
                Joined Circles ({joinedCommunities.length})
              </h2>
              <div className="mt-4 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
                {joinedCommunities.map((community) => (
                  <CommunityCard
                    key={community.id}
                    community={community}
                    isJoined={true}
                    onJoinToggle={handleJoinToggle}
                  />
                ))}
              </div>
            </section>

            {/* Feed from Joined Circles */}
            <section className="peer-divider-fade-t pt-8">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#E3F4EB] text-[#123D30]">
                    <MessageSquare className="h-4 w-4" />
                  </span>
                  <h2 className="text-lg font-bold text-[#171916]">
                    Recent Updates from Your Communities
                  </h2>
                </div>
                <span className="text-xs text-[#777A72]">
                  {joinedPosts.length} discussions in your feed
                </span>
              </div>

              <div className="mt-5 grid grid-cols-1 gap-4 lg:grid-cols-2">
                {joinedPosts.map((post) => (
                  <DiscussionPostCard key={post.id} post={post} />
                ))}
              </div>
            </section>
          </div>
        ) : (
          <EmptyState
            title="You haven't joined any communities yet"
            description="Explore interest-based student communities in AI, Web Development, Design, Robotics and more."
            action={
              <Link
                to={communityRoutes.communities}
                className="rounded-full bg-[#08C58A] px-5 py-2.5 text-xs font-bold text-[#0A261D]"
              >
                Discover Communities
              </Link>
            }
          />
        )}
      </div>
      </div>
    </div>
  )
}
