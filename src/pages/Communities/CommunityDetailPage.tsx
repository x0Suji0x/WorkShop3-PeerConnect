import { useState, useMemo } from 'react'
import { useParams, Link } from 'react-router-dom'
import {
  ArrowLeft,
  Users,
  MessageSquare,
  Sparkles,
  Check,
  Plus,
  ShieldCheck,
  Award,
  Megaphone,
  BookOpen,
} from 'lucide-react'
import { communities, communityPosts, communityMembers } from '../../data/communityMockData'
import { communityRoutes } from '../../app/routes'
import { DiscussionPostCard } from '../../components/communities/DiscussionPostCard'
import { CreatePostForm } from '../../components/communities/CreatePostForm'
import { Badge } from '../../components/common/Badge'
import { EmptyState } from '../../components/common/EmptyState'
import type { CommunityPost } from '../../types/community'

export function CommunityDetailPage() {
  const { slug } = useParams<{ slug: string }>()
  const community = communities.find((c) => c.slug === slug)

  // Local state for joined status & member count
  const [isJoined, setIsJoined] = useState(community?.isJoined ?? false)
  const [memberCount, setMemberCount] = useState(community?.memberCount ?? 0)

  // Active tab: 'discussions' | 'members' | 'about'
  const [activeTab, setActiveTab] = useState<'discussions' | 'members' | 'about'>('discussions')
  const [discussionSort, setDiscussionSort] = useState<'latest' | 'popular'>('latest')
  const [showCreatePost, setShowCreatePost] = useState(false)

  // Community posts state
  const initialPosts = useMemo(() => {
    if (!community) return []
    return communityPosts[community.id] || []
  }, [community])

  const [posts, setPosts] = useState<CommunityPost[]>(initialPosts)

  if (!community) {
    return (
      <div className="peer-page-surface min-h-screen flex items-center justify-center px-4 py-16 text-center">
        <EmptyState
          title="Community not found"
          description="The community you are looking for does not exist or has been relocated."
          action={
            <Link
              to={communityRoutes.communities}
              className="rounded-full bg-[#171916] px-5 py-2 text-xs font-semibold text-white"
            >
              Browse All Communities
            </Link>
          }
        />
      </div>
    )
  }

  const handleJoinToggle = () => {
    if (isJoined) {
      setIsJoined(false)
      setMemberCount((prev) => prev - 1)
    } else {
      setIsJoined(true)
      setMemberCount((prev) => prev + 1)
    }
  }

  const handleCreatePost = (newPostData: Omit<CommunityPost, 'id' | 'createdAt' | 'likes' | 'comments'>) => {
    const newPost: CommunityPost = {
      ...newPostData,
      id: `post-${Date.now()}`,
      createdAt: 'Just now',
      likes: 0,
      comments: [],
    }
    setPosts([newPost, ...posts])
    setShowCreatePost(false)
  }

  // Sorted posts
  const sortedPosts = [...posts].sort((a, b) => {
    if (a.isPinned && !b.isPinned) return -1
    if (!a.isPinned && b.isPinned) return 1
    if (discussionSort === 'popular') {
      return b.likes + (b.comments?.length || 0) - (a.likes + (a.comments?.length || 0))
    }
    return 0 // Keep order (latest first)
  })

  const announcements = posts.filter((p) => p.isAnnouncement)
  const members = communityMembers[community.id] || []

  return (
    <div className="peer-page-surface min-h-screen pb-16 relative overflow-hidden">
      <div className="peer-ambient-glow peer-glow-gold -top-24 -left-24 h-96 w-96 pointer-events-none" />
      <div className="peer-ambient-glow peer-glow-rose top-1/3 -right-24 h-96 w-96 pointer-events-none" />
      <div className="peer-ambient-glow peer-glow-mint -bottom-24 left-1/3 h-96 w-96 pointer-events-none" />
      <div className="pointer-events-none absolute inset-0 bg-grid-pattern opacity-30 -z-0" />

      <div className="relative z-10">
        {/* Cover Image Banner */}
        <div className="relative h-56 w-full overflow-hidden bg-[#123D30] sm:h-72 lg:h-80">
        <img
          src={community.coverImageUrl}
          alt={community.name}
          className="h-full w-full object-cover opacity-60"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#123D30] via-black/30 to-black/20" />

        <div className="absolute top-6 left-4 sm:left-8">
          <Link
            to={communityRoutes.communities}
            className="inline-flex items-center gap-1.5 rounded-full bg-white/20 px-3.5 py-1.5 text-xs font-semibold text-white backdrop-blur-md transition-colors hover:bg-white/30"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            Back to Communities
          </Link>
        </div>

        {/* Hero Details in Banner */}
        <div className="absolute bottom-6 left-4 right-4 mx-auto max-w-7xl sm:left-8 sm:right-8">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div className="flex items-center gap-4">
              <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-2xl bg-white text-4xl shadow-md border-2 border-white sm:h-24 sm:w-24 sm:text-5xl">
                {community.logoEmoji}
              </div>
              <div className="text-white">
                <div className="flex items-center gap-2">
                  <h1 className="text-2xl font-black sm:text-3xl lg:text-4xl">{community.name}</h1>
                </div>
                <p className="mt-1 text-xs text-white/90 sm:text-sm max-w-2xl">{community.tagline}</p>
                <div className="mt-2 flex flex-wrap items-center gap-3 text-xs text-white/80">
                  <span className="flex items-center gap-1">
                    <Users className="h-3.5 w-3.5" />
                    {memberCount.toLocaleString()} members
                  </span>
                  <span>•</span>
                  <span className="flex items-center gap-1">
                    <MessageSquare className="h-3.5 w-3.5" />
                    {posts.length} discussions
                  </span>
                  <span>•</span>
                  <span className="capitalize">{community.category} circle</span>
                </div>
              </div>
            </div>

            {/* Join Button */}
            <div className="flex shrink-0 items-center gap-3">
              <button
                type="button"
                onClick={handleJoinToggle}
                className={`inline-flex items-center gap-1.5 rounded-full px-5 py-2.5 text-sm font-bold shadow-sm transition-all ${
                  isJoined
                    ? 'bg-white text-[#123D30] hover:bg-gray-100'
                    : 'bg-[#08C58A] text-[#0A261D] hover:bg-[#07B27C]'
                }`}
              >
                {isJoined ? (
                  <>
                    <Check className="h-4 w-4 stroke-[2.5]" />
                    Joined Community
                  </>
                ) : (
                  <>
                    <Plus className="h-4 w-4" />
                    Join Community
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Container */}
      <div className="mx-auto max-w-7xl px-4 pt-6 sm:px-6 lg:px-8">
        {/* Navigation Tabs */}
        <div className="flex items-center gap-2 peer-divider-fade pb-3 text-sm font-bold">
          <button
            type="button"
            onClick={() => setActiveTab('discussions')}
            className={`rounded-xl px-4 py-2 transition-all ${
              activeTab === 'discussions'
                ? 'bg-[#171916] text-white'
                : 'text-[#525A55] hover:bg-white hover:text-[#171916]'
            }`}
          >
            Discussions ({posts.length})
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('members')}
            className={`rounded-xl px-4 py-2 transition-all ${
              activeTab === 'members'
                ? 'bg-[#171916] text-white'
                : 'text-[#525A55] hover:bg-white hover:text-[#171916]'
            }`}
          >
            Members ({members.length})
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('about')}
            className={`rounded-xl px-4 py-2 transition-all ${
              activeTab === 'about'
                ? 'bg-[#171916] text-white'
                : 'text-[#525A55] hover:bg-white hover:text-[#171916]'
            }`}
          >
            About & Guidelines
          </button>
        </div>

        {/* Tab 1: Discussions */}
        {activeTab === 'discussions' && (
          <div className="mt-6 grid grid-cols-1 gap-8 lg:grid-cols-3">
            {/* Feed Column */}
            <div className="space-y-5 lg:col-span-2">
              {/* Controls bar: Create post toggle + Sort toggle */}
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <button
                  type="button"
                  onClick={() => setShowCreatePost(!showCreatePost)}
                  className="inline-flex items-center gap-2 rounded-xl border border-[#E7E8E1] bg-white px-4 py-2.5 text-xs font-bold text-[#171916] shadow-2xs hover:border-[#08C58A] transition-colors"
                >
                  <Plus className="h-4 w-4 text-[#08C58A]" />
                  {showCreatePost ? 'Close Post Editor' : 'Start a Discussion'}
                </button>

                <div className="flex items-center gap-1 rounded-xl border border-[#E7E8E1] bg-white p-1 text-xs">
                  <span className="px-2 font-medium text-[#777A72]">Sort:</span>
                  <button
                    type="button"
                    onClick={() => setDiscussionSort('latest')}
                    className={`rounded-lg px-2.5 py-1 font-semibold transition-colors ${
                      discussionSort === 'latest'
                        ? 'bg-[#171916] text-white'
                        : 'text-[#525A55] hover:text-[#171916]'
                    }`}
                  >
                    Latest
                  </button>
                  <button
                    type="button"
                    onClick={() => setDiscussionSort('popular')}
                    className={`rounded-lg px-2.5 py-1 font-semibold transition-colors ${
                      discussionSort === 'popular'
                        ? 'bg-[#171916] text-white'
                        : 'text-[#525A55] hover:text-[#171916]'
                    }`}
                  >
                    Popular
                  </button>
                </div>
              </div>

              {/* Inline Create Post Form */}
              {showCreatePost && (
                <CreatePostForm
                  communityId={community.id}
                  onSubmit={handleCreatePost}
                  onCancel={() => setShowCreatePost(false)}
                />
              )}

              {/* Announcements Section (if any exist) */}
              {announcements.length > 0 && (
                <div className="rounded-2xl border border-amber-200 bg-amber-50/40 p-4">
                  <div className="flex items-center gap-2 text-xs font-bold text-amber-900">
                    <Megaphone className="h-4 w-4 text-amber-600" />
                    Pinned Community Announcements
                  </div>
                  <div className="mt-2 space-y-2">
                    {announcements.map((ann) => (
                      <div key={ann.id} className="rounded-xl bg-white p-3 border border-amber-200/60">
                        <h4 className="text-xs font-bold text-[#171916]">{ann.title}</h4>
                        <p className="mt-1 text-xs text-[#525A55] line-clamp-2">{ann.content}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Posts Feed */}
              <div className="space-y-4">
                {sortedPosts.length > 0 ? (
                  sortedPosts.map((post) => (
                    <DiscussionPostCard key={post.id} post={post} />
                  ))
                ) : (
                  <EmptyState
                    title="No discussions yet"
                    description="Be the first to ask a question, share a project, or start a conversation in this community."
                    action={
                      <button
                        type="button"
                        onClick={() => setShowCreatePost(true)}
                        className="rounded-full bg-[#171916] px-4 py-2 text-xs font-semibold text-white"
                      >
                        Start the First Post
                      </button>
                    }
                  />
                )}
              </div>
            </div>

            {/* Sidebar info */}
            <div className="space-y-5">
              {/* About Card */}
              <div className="peer-card-glass p-5">
                <h3 className="text-sm font-bold text-[#171916]">About {community.name}</h3>
                <p className="mt-2 text-xs leading-relaxed text-[#525A55]">{community.description}</p>

                <div className="mt-4 flex flex-wrap gap-1">
                  {community.tags.map((tag) => (
                    <span
                      key={tag}
                      className="rounded-md bg-[#F7F6F0] px-2 py-0.5 text-xs font-medium text-[#525A55]"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>

                <div className="mt-5 border-t border-[#F2F1EA] pt-4 space-y-2 text-xs text-[#525A55]">
                  <div className="flex justify-between">
                    <span>Created:</span>
                    <span className="font-semibold text-[#171916]">{community.createdAt}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Category:</span>
                    <span className="font-semibold capitalize text-[#171916]">{community.category}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Activity index:</span>
                    <span className="font-semibold capitalize text-[#08A876]">{community.activityLevel}</span>
                  </div>
                </div>
              </div>

              {/* Guidelines summary */}
              <div className="peer-card-glass p-5">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="h-4 w-4 text-[#08C58A]" />
                  <h3 className="text-sm font-bold text-[#171916]">Community Code</h3>
                </div>
                <ul className="mt-3 space-y-2 text-xs text-[#525A55]">
                  {community.guidelines.slice(0, 3).map((g, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <span className="font-bold text-[#123D30]">{idx + 1}.</span>
                      <span>{g}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Team Builder CTA */}
              <div className="peer-card-glass peer-card-glow-mint p-5">
                <div className="flex items-center gap-2 text-xs font-bold text-[#123D30]">
                  <Sparkles className="h-4 w-4 text-[#08C58A]" />
                  Looking for Teammates?
                </div>
                <p className="mt-1.5 text-xs text-[#525A55] leading-relaxed">
                  Form a team for a hackathon or college project using our AI Team Builder.
                </p>
                <Link
                  to="/team-finder/builder"
                  className="mt-3 inline-block rounded-full bg-[#123D30] px-4 py-2 text-xs font-bold text-white transition-opacity hover:opacity-90"
                >
                  Try AI Team Builder
                </Link>
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: Members Directory */}
        {activeTab === 'members' && (
          <div className="mt-6">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-base font-bold text-[#171916]">
                Member Directory ({members.length})
              </h3>
              <span className="text-xs text-[#777A72]">Showing sample student members</span>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {members.map((member) => (
                <div
                  key={member.id}
                  className="peer-card-glass flex flex-col justify-between p-4 transition-all duration-200 hover:-translate-y-1"
                >
                  <div className="flex items-start gap-3">
                    <img
                      src={member.avatarUrl}
                      alt={member.name}
                      className="h-12 w-12 rounded-full object-cover border border-[#E7E8E1]"
                    />
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="text-sm font-bold text-[#171916]">{member.name}</h4>
                        {member.role !== 'member' && (
                          <Badge
                            variant={member.role === 'admin' ? 'peach' : 'blue'}
                            size="sm"
                            className="capitalize text-[10px]"
                          >
                            <Award className="h-2.5 w-2.5" />
                            {member.role}
                          </Badge>
                        )}
                      </div>
                      <p className="text-xs text-[#525A55] line-clamp-1">{member.college}</p>
                      <p className="mt-0.5 text-[10px] text-[#777A72]">Joined {member.joinedAt}</p>
                    </div>
                  </div>

                  <div className="mt-3 border-t border-[#F2F1EA] pt-2.5">
                    <div className="flex flex-wrap gap-1">
                      {member.skills.map((skill) => (
                        <span
                          key={skill}
                          className="rounded-md bg-[#F7F6F0] px-2 py-0.5 text-[10px] font-medium text-[#525A55]"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab 3: About & Guidelines */}
        {activeTab === 'about' && (
          <div className="mt-6 max-w-4xl space-y-6">
            <div className="peer-card-glass p-6 space-y-4">
              <h3 className="text-lg font-bold text-[#171916]">About {community.name}</h3>
              <p className="text-sm leading-relaxed text-[#525A55]">{community.description}</p>
            </div>

            <div className="peer-card-glass p-6 space-y-4">
              <div className="flex items-center gap-2">
                <BookOpen className="h-5 w-5 text-[#08C58A]" />
                <h3 className="text-lg font-bold text-[#171916]">Community Guidelines</h3>
              </div>
              <p className="text-xs text-[#777A72]">
                All members are expected to uphold these principles to foster an inclusive and productive environment.
              </p>
              <div className="space-y-3 pt-2">
                {community.guidelines.map((g, idx) => (
                  <div key={idx} className="flex items-start gap-3 rounded-xl bg-[#F7F6F0] p-3.5 text-xs text-[#171916]">
                    <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#123D30] text-[10px] font-bold text-[#08C58A]">
                      {idx + 1}
                    </span>
                    <span className="leading-relaxed">{g}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
      </div>
    </div>
  )
}
