import { useState, useMemo } from 'react'
import { useParams, Link } from 'react-router-dom'
import {
  ArrowLeft,
  Users,
  MessageSquare,
  Check,
  Plus,
  ShieldCheck,
  Megaphone,
  BookOpen,
} from 'lucide-react'
import { communities, communityMembers } from '../data/communitiesData'
import { communityDiscussions } from '../data/discussionsData'
import { DiscussionPostCard } from '../components/DiscussionPostCard'
import { CreatePostModal } from '../components/CreatePostModal'
import { useStudentProfile } from '../../../hooks/useStudentProfile'
import { Badge } from '../../../components/common/Badge'
import { EmptyState } from '../../../components/common/EmptyState'
import type { CommunityPost } from '../types'

export function CommunityDetailPage() {
  const { slug } = useParams<{ slug: string }>()
  const { student } = useStudentProfile()
  const community = communities.find((c) => c.slug === slug)

  // Local state for joined status & member count
  const [isJoined, setIsJoined] = useState(community?.isJoined ?? false)
  const [memberCount, setMemberCount] = useState(community?.memberCount ?? 0)

  // Active tab: 'discussions' | 'members' | 'about'
  const [activeTab, setActiveTab] = useState<'discussions' | 'members' | 'about'>('discussions')
  const [discussionSort, setDiscussionSort] = useState<'latest' | 'popular'>('latest')
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)

  // Community posts state
  const initialPosts = useMemo(() => {
    if (!community) return []
    return communityDiscussions[community.id] || []
  }, [community])

  const [posts, setPosts] = useState<CommunityPost[]>(initialPosts)

  if (!community) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-16 text-center">
        <EmptyState
          title="Community circle not found"
          description="The community circle you are trying to visit does not exist or has been relocated."
          action={
            <Link
              to="/communities"
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
  }

  // Sorted posts
  const sortedPosts = [...posts].sort((a, b) => {
    if (a.isPinned && !b.isPinned) return -1
    if (!a.isPinned && b.isPinned) return 1
    if (discussionSort === 'popular') {
      return (b.likes + b.comments.length) - (a.likes + a.comments.length)
    }
    return 0 // keep order (latest first)
  })

  const announcements = posts.filter((p) => p.isAnnouncement)
  const members = communityMembers[community.id] || []

  return (
    <div className="min-h-screen bg-[#FAF8F5] pb-16">
      {/* Cover Image Banner */}
      <div className="relative h-48 w-full bg-[#123D30] sm:h-64 lg:h-72">
        <img
          src={community.coverImageUrl}
          alt={community.name}
          className="h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-black/30" />

        <div className="absolute top-4 left-4 z-10 sm:left-8">
          <Link
            to="/communities"
            className="inline-flex items-center gap-1.5 rounded-full bg-white/90 px-3.5 py-1.5 text-xs font-bold text-[#171916] backdrop-blur-xs transition hover:bg-white"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            Back to Communities
          </Link>
        </div>
      </div>

      {/* Community Profile Header Card */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="relative -mt-16 rounded-2xl border border-[#E7E8E1] bg-white p-6 shadow-sm sm:-mt-20 sm:p-8">
          <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
              <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-2xl border-4 border-white bg-[#FAF8F5] text-4xl shadow-md sm:h-24 sm:w-24 sm:text-5xl">
                {community.logoEmoji}
              </div>
              <div className="space-y-1">
                <div className="flex flex-wrap items-center gap-2">
                  <h1 className="text-2xl font-black text-[#171916] sm:text-3xl">
                    {community.name}
                  </h1>
                  <Badge variant="neutral" size="sm" className="capitalize">
                    {community.category}
                  </Badge>
                </div>
                <p className="text-sm font-semibold text-[#08A876]">{community.tagline}</p>
                <div className="flex flex-wrap items-center gap-4 text-xs text-[#777A72] pt-1">
                  <span className="flex items-center gap-1 font-bold text-[#171916]">
                    <Users className="h-3.5 w-3.5 text-[#08C58A]" />
                    {memberCount.toLocaleString()} members
                  </span>
                  <span>•</span>
                  <span className="flex items-center gap-1">
                    <MessageSquare className="h-3.5 w-3.5" />
                    {posts.length} discussions
                  </span>
                  <span>•</span>
                  <span>Est. {new Date(community.createdAt).toLocaleDateString(undefined, { year: 'numeric', month: 'short' })}</span>
                </div>
              </div>
            </div>

            {/* Join toggle button & Action */}
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={handleJoinToggle}
                className={`inline-flex items-center gap-1.5 rounded-full px-5 py-2 text-xs font-bold transition-all shadow-2xs ${isJoined
                    ? 'border border-[#08C58A] bg-[#E3F4EB] text-[#123D30] hover:bg-rose-50 hover:border-rose-300 hover:text-rose-700'
                    : 'bg-[#171916] text-white hover:bg-[#2A2E28]'
                  }`}
              >
                {isJoined ? (
                  <>
                    <Check className="h-3.5 w-3.5 text-[#08C58A]" />
                    Joined Community
                  </>
                ) : (
                  <>
                    <Plus className="h-3.5 w-3.5" />
                    Join Circle
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Description & Tags */}
          <div className="mt-5 border-t border-[#F2F1EA] pt-4">
            <p className="text-xs leading-relaxed text-[#525A55] sm:text-sm">
              {community.description}
            </p>
            <div className="mt-3 flex flex-wrap gap-1.5">
              {community.tags.map((t) => (
                <span
                  key={t}
                  className="rounded-lg border border-[#E7E8E1] bg-[#F7F6F0] px-2.5 py-1 text-xs font-medium text-[#171916]"
                >
                  #{t}
                </span>
              ))}
            </div>
          </div>

          {/* Navigation Tabs */}
          <div className="mt-6 flex border-b border-[#E7E8E1] text-xs font-bold sm:text-sm">
            <button
              type="button"
              onClick={() => setActiveTab('discussions')}
              className={`flex items-center gap-2 border-b-2 px-4 py-3 transition-colors ${activeTab === 'discussions'
                  ? 'border-[#08C58A] text-[#123D30]'
                  : 'border-transparent text-[#777A72] hover:text-[#171916]'
                }`}
            >
              <MessageSquare className="h-4 w-4" />
              Discussions ({posts.length})
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('members')}
              className={`flex items-center gap-2 border-b-2 px-4 py-3 transition-colors ${activeTab === 'members'
                  ? 'border-[#08C58A] text-[#123D30]'
                  : 'border-transparent text-[#777A72] hover:text-[#171916]'
                }`}
            >
              <Users className="h-4 w-4" />
              Members Directory ({members.length})
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('about')}
              className={`flex items-center gap-2 border-b-2 px-4 py-3 transition-colors ${activeTab === 'about'
                  ? 'border-[#08C58A] text-[#123D30]'
                  : 'border-transparent text-[#777A72] hover:text-[#171916]'
                }`}
            >
              <BookOpen className="h-4 w-4" />
              Guidelines & Charter
            </button>
          </div>
        </div>

        {/* Tab 1: Discussions Stream */}
        {activeTab === 'discussions' && (
          <div className="mt-8 grid grid-cols-1 gap-8 lg:grid-cols-3">
            <div className="space-y-4 lg:col-span-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setDiscussionSort('latest')}
                    className={`rounded-full px-3 py-1 text-xs font-bold transition ${discussionSort === 'latest'
                        ? 'bg-[#171916] text-white'
                        : 'bg-white text-[#777A72] border border-[#E7E8E1]'
                      }`}
                  >
                    Latest
                  </button>
                  <button
                    type="button"
                    onClick={() => setDiscussionSort('popular')}
                    className={`rounded-full px-3 py-1 text-xs font-bold transition ${discussionSort === 'popular'
                        ? 'bg-[#171916] text-white'
                        : 'bg-white text-[#777A72] border border-[#E7E8E1]'
                      }`}
                  >
                    Popular
                  </button>
                </div>

                <button
                  type="button"
                  onClick={() => setIsCreateModalOpen(true)}
                  className="inline-flex items-center gap-1.5 rounded-full bg-[#08C58A] px-4 py-1.5 text-xs font-bold text-[#0A261D] shadow-2xs hover:bg-[#07B27C] transition-colors"
                >
                  <Plus className="h-3.5 w-3.5" />
                  New Discussion
                </button>
              </div>

              {sortedPosts.length > 0 ? (
                <div className="space-y-4">
                  {sortedPosts.map((post) => (
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
                  title="No discussions yet"
                  description="Be the first student to initiate a question or share a technical benchmark!"
                  action={
                    <button
                      type="button"
                      onClick={() => setIsCreateModalOpen(true)}
                      className="rounded-full bg-[#171916] px-4 py-2 text-xs font-bold text-white"
                    >
                      Start Discussion
                    </button>
                  }
                />
              )}
            </div>

            {/* Sidebar Announcements & Quick Guidelines */}
            <div className="space-y-6">
              {announcements.length > 0 && (
                <div className="rounded-2xl border border-amber-300 bg-amber-50/30 p-5 shadow-2xs">
                  <div className="flex items-center gap-2 text-amber-900 font-bold text-xs uppercase tracking-wider">
                    <Megaphone className="h-4 w-4 text-amber-600" />
                    Pinned Announcements
                  </div>
                  <div className="mt-3 space-y-3">
                    {announcements.map((a) => (
                      <div key={a.id} className="border-t border-amber-200/60 pt-2 text-xs">
                        <p className="font-bold text-[#171916]">{a.title}</p>
                        <p className="mt-1 text-[#525A55] line-clamp-2">{a.content}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="rounded-2xl border border-[#E7E8E1] bg-white p-5 shadow-2xs">
                <div className="flex items-center gap-2 text-[#123D30] font-bold text-xs uppercase tracking-wider">
                  <ShieldCheck className="h-4 w-4 text-[#08C58A]" />
                  Circle Guidelines
                </div>
                <ul className="mt-3 space-y-2 text-xs text-[#525A55]">
                  {community.guidelines.slice(0, 4).map((g) => (
                    <li key={g} className="flex items-start gap-2">
                      <span className="text-[#08C58A] font-bold">•</span>
                      <span>{g}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: Members Directory */}
        {activeTab === 'members' && (
          <div className="mt-8">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base font-bold text-[#171916]">
                Active Peer Roster in {community.name}
              </h3>
              <span className="text-xs text-[#777A72]">
                {members.length} highlighted contributors
              </span>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {members.map((member) => (
                <div
                  key={member.id}
                  className="flex items-start gap-3 rounded-2xl border border-[#E7E8E1] bg-white p-4 shadow-2xs"
                >
                  <Link to={`/profiles/${member.id}`} className="shrink-0">
                    <img
                      src={member.avatarUrl}
                      alt={member.name}
                      className="h-12 w-12 rounded-full object-cover border border-[#E7E8E1]"
                    />
                  </Link>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-1">
                      <Link
                        to={`/profiles/${member.id}`}
                        className="font-bold text-sm text-[#171916] truncate hover:text-[#08A876]"
                      >
                        {member.name}
                      </Link>
                      <Badge
                        variant={
                          member.role === 'admin'
                            ? 'dark'
                            : member.role === 'moderator'
                              ? 'green'
                              : 'neutral'
                        }
                        size="sm"
                        className="capitalize text-[10px]"
                      >
                        {member.role}
                      </Badge>
                    </div>
                    <p className="text-xs text-[#525A55] truncate">{member.college}</p>
                    <div className="mt-2 flex flex-wrap gap-1">
                      {member.skills.map((s) => (
                        <span
                          key={s}
                          className="rounded-md bg-[#F7F6F0] px-1.5 py-0.5 text-[10px] font-medium text-[#777A72]"
                        >
                          {s}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab 3: Guidelines & Charter */}
        {activeTab === 'about' && (
          <div className="mt-8 max-w-3xl rounded-2xl border border-[#E7E8E1] bg-white p-6 shadow-2xs space-y-6">
            <div>
              <h3 className="text-lg font-bold text-[#171916]">Community Charter & Principles</h3>
              <p className="mt-1 text-xs text-[#525A55] leading-relaxed">
                PeerConnect interest circles are safe, high-signal spaces for ambitious students. By participating in this circle, you agree to uphold our collaborative guidelines.
              </p>
            </div>

            <div className="space-y-3">
              {community.guidelines.map((rule, idx) => (
                <div key={rule} className="flex items-start gap-3 rounded-xl bg-[#F7F6F0] p-3 text-xs text-[#171916]">
                  <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#123D30] text-[10px] font-bold text-white">
                    {idx + 1}
                  </span>
                  <span className="leading-relaxed font-medium">{rule}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Create Discussion Modal */}
      <CreatePostModal
        communityId={community.id}
        communityName={community.name}
        isOpen={isCreateModalOpen}
        authorName={student?.name}
        authorAvatar={student?.avatarUrl}
        authorCollege={student?.college}
        onClose={() => setIsCreateModalOpen(false)}
        onSubmitPost={handleCreatePost}
      />
    </div>
  )
}

