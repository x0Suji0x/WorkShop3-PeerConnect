import { Link } from 'react-router-dom'
import { ArrowLeft, CheckCircle2, Compass, MessageSquare, ArrowRight } from 'lucide-react'
import { communities } from '../data/communitiesData'
import { communityDiscussions } from '../data/discussionsData'
import { DiscussionPostCard } from '../components/DiscussionPostCard'
import { EmptyState } from '../../../components/common/EmptyState'
import { useStudentProfile } from '../../../hooks/useStudentProfile'

export function MyCommunitiesPage() {
  const { student } = useStudentProfile()
  // Mock joined communities
  const joinedCommunities = communities.filter((c) => c.isJoined)

  // Aggregate discussions from all joined communities
  const aggregatedPosts = joinedCommunities.flatMap(
    (comm) => communityDiscussions[comm.id] || [],
  )

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="flex flex-col gap-4 border-b border-[#E7E8E1] pb-7 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <Link
            to="/communities"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-[#08A876] hover:underline mb-2"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            Back to All Communities
          </Link>
          <div className="flex items-center gap-2">
            <span className="flex h-6 w-6 items-center justify-center rounded-lg bg-[#E3F4EB] text-[#08C58A]">
              <CheckCircle2 className="h-3.5 w-3.5" />
            </span>
            <p className="text-xs font-bold uppercase tracking-[0.14em] text-[#08A876]">
              Your Network Circles
            </p>
          </div>
          <h1 className="mt-1 text-3xl font-black text-[#171916]">My Communities</h1>
          <p className="text-xs text-[#525A55] sm:text-sm">
            Activity, updates, and discussions across circles you actively participate in.
          </p>
        </div>

        <Link
          to="/communities"
          className="inline-flex items-center gap-1.5 rounded-full border border-[#171916] px-4 py-2 text-xs font-bold text-[#171916] hover:bg-[#171916] hover:text-white transition-all self-start sm:self-auto"
        >
          <Compass className="h-3.5 w-3.5" />
          Discover More Circles
        </Link>
      </div>

      {/* Grid of joined communities summary */}
      <section className="mt-6">
        <h2 className="text-sm font-bold uppercase tracking-wider text-[#123D30] mb-3">
          Joined Circles ({joinedCommunities.length})
        </h2>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {joinedCommunities.map((c) => (
            <Link
              key={c.id}
              to={`/communities/${c.slug}`}
              className="flex items-center justify-between rounded-2xl border border-[#E7E8E1] bg-white p-4 shadow-2xs hover:border-[#08C58A]/50 transition-all"
            >
              <div className="flex items-center gap-3">
                <span className="text-2xl">{c.logoEmoji}</span>
                <div>
                  <h3 className="font-bold text-sm text-[#171916]">{c.name}</h3>
                  <p className="text-[11px] text-[#777A72]">{c.memberCount.toLocaleString()} peers</p>
                </div>
              </div>
              <ArrowRight className="h-4 w-4 text-[#777A72]" />
            </Link>
          ))}
        </div>
      </section>

      {/* Feed Stream */}
      <section className="mt-10">
        <div className="flex items-center gap-2 border-b border-[#F2F1EA] pb-3 mb-5">
          <MessageSquare className="h-4 w-4 text-[#08A876]" />
          <h2 className="text-base font-bold text-[#171916]">
            Aggregated Circle Stream ({aggregatedPosts.length})
          </h2>
        </div>

        {aggregatedPosts.length > 0 ? (
          <div className="max-w-3xl space-y-4">
            {aggregatedPosts.map((post) => (
              <DiscussionPostCard
                key={post.id}
                post={post}
                currentUserId={student?.id}
                currentUserName={student?.name}
                currentUserAvatar={student?.avatarUrl}
                currentUserCollege={student?.college}
              />
            ))}
          </div>
        ) : (
          <EmptyState
            title="No activity yet in your joined circles"
            description="Explore the community directory to join circles aligning with your tech stack!"
            action={
              <Link
                to="/communities"
                className="rounded-full bg-[#171916] px-5 py-2 text-xs font-bold text-white"
              >
                Browse All Communities
              </Link>
            }
          />
        )}
      </section>
    </div>
  )
}

