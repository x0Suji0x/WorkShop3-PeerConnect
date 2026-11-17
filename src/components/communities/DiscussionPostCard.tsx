import { useState } from 'react'
import { Heart, MessageSquare, Pin, Megaphone, Send } from 'lucide-react'
import type { CommunityPost } from '../../types/community'
import { Badge } from '../common/Badge'

export interface DiscussionPostCardProps {
  post: CommunityPost
  onLike?: (postId: string) => void
  onAddComment?: (postId: string, commentText: string) => void
}

export function DiscussionPostCard({ post, onLike, onAddComment }: DiscussionPostCardProps) {
  const [likes, setLikes] = useState(post.likes)
  const [hasLiked, setHasLiked] = useState(false)
  const [showComments, setShowComments] = useState(false)
  const [commentInput, setCommentInput] = useState('')
  const [commentsList, setCommentsList] = useState(post.comments || [])

  const handleLike = () => {
    if (hasLiked) {
      setLikes((prev) => prev - 1)
      setHasLiked(false)
    } else {
      setLikes((prev) => prev + 1)
      setHasLiked(true)
    }
    if (onLike) {
      onLike(post.id)
    }
  }

  const handleCommentSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!commentInput.trim()) return

    const newComment = {
      id: `comment-${Date.now()}`,
      postId: post.id,
      authorId: 'sofia-rodriguez',
      authorName: 'Sofia Rodriguez (You)',
      authorAvatar:
        'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
      content: commentInput.trim(),
      likes: 0,
      createdAt: 'Just now',
    }

    setCommentsList((prev) => [...prev, newComment])
    if (onAddComment) {
      onAddComment(post.id, commentInput.trim())
    }
    setCommentInput('')
  }

  return (
    <article
      className={`rounded-2xl border bg-white p-5 shadow-[0_2px_12px_rgba(23,25,22,0.03)] transition-all ${
        post.isAnnouncement
          ? 'border-amber-300 bg-amber-50/20 shadow-amber-100/50'
          : 'border-[#E7E8E1] hover:border-[#D1D2C9]'
      }`}
    >
      {/* Announcement or Pinned badges */}
      {(post.isAnnouncement || post.isPinned) && (
        <div className="mb-3 flex flex-wrap items-center gap-2">
          {post.isAnnouncement && (
            <Badge variant="peach" size="sm" className="font-semibold">
              <Megaphone className="h-3 w-3" />
              Community Announcement
            </Badge>
          )}
          {post.isPinned && (
            <Badge variant="neutral" size="sm" className="font-semibold">
              <Pin className="h-3 w-3 text-[#123D30]" />
              Pinned
            </Badge>
          )}
        </div>
      )}

      {/* Author info */}
      <div className="flex items-center gap-3">
        <img
          src={post.authorAvatar}
          alt={post.authorName}
          className="h-10 w-10 rounded-full object-cover border border-[#E7E8E1]"
        />
        <div>
          <div className="flex items-center gap-2">
            <h4 className="text-sm font-bold text-[#171916]">{post.authorName}</h4>
            <span className="text-xs text-[#777A72]">•</span>
            <span className="text-xs text-[#777A72]">{post.createdAt}</span>
          </div>
          <p className="text-xs text-[#525A55]">{post.authorCollege}</p>
        </div>
      </div>

      {/* Post content */}
      <div className="mt-3.5 space-y-2">
        <h3 className="text-base font-bold text-[#171916] tracking-tight">{post.title}</h3>
        <p className="text-sm leading-relaxed text-[#4A504C] whitespace-pre-line">{post.content}</p>
      </div>

      {/* Tags */}
      {post.tags.length > 0 && (
        <div className="mt-3 flex flex-wrap gap-1.5">
          {post.tags.map((tag) => (
            <span
              key={tag}
              className="rounded-md bg-[#F7F6F0] px-2 py-0.5 text-xs font-medium text-[#525A55]"
            >
              #{tag}
            </span>
          ))}
        </div>
      )}

      {/* Reactions and Comments count */}
      <div className="mt-4 flex items-center justify-between border-t border-[#F2F1EA] pt-3 text-xs">
        <div className="flex items-center gap-4">
          <button
            type="button"
            onClick={handleLike}
            className={`flex items-center gap-1.5 font-medium transition-colors ${
              hasLiked ? 'text-rose-600 font-bold' : 'text-[#777A72] hover:text-rose-600'
            }`}
          >
            <Heart className={`h-4 w-4 ${hasLiked ? 'fill-rose-600' : ''}`} />
            <span>{likes}</span>
          </button>

          <button
            type="button"
            onClick={() => setShowComments(!showComments)}
            className="flex items-center gap-1.5 text-[#777A72] font-medium transition-colors hover:text-[#171916]"
          >
            <MessageSquare className="h-4 w-4" />
            <span>{commentsList.length} comments</span>
          </button>
        </div>
      </div>

      {/* Comments section */}
      {showComments && (
        <div className="mt-4 space-y-3 border-t border-[#F2F1EA] pt-4">
          {commentsList.length > 0 ? (
            <div className="space-y-2.5">
              {commentsList.map((c) => (
                <div key={c.id} className="flex gap-2.5 rounded-xl bg-[#F7F6F0] p-3 text-xs">
                  <img
                    src={c.authorAvatar}
                    alt={c.authorName}
                    className="h-7 w-7 rounded-full object-cover shrink-0"
                  />
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-[#171916]">{c.authorName}</span>
                      <span className="text-[10px] text-[#777A72]">{c.createdAt}</span>
                    </div>
                    <p className="mt-1 text-[#333735] leading-relaxed">{c.content}</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-xs text-[#777A72] italic">No comments yet. Be the first to share your thoughts!</p>
          )}

          {/* Add comment form */}
          <form onSubmit={handleCommentSubmit} className="mt-2 flex items-center gap-2">
            <input
              type="text"
              placeholder="Write a reply..."
              value={commentInput}
              onChange={(e) => setCommentInput(e.target.value)}
              className="flex-1 rounded-xl border border-[#E7E8E1] bg-white px-3 py-2 text-xs text-[#171916] outline-none transition focus:border-[#08C58A] focus:ring-1 focus:ring-[#08C58A]"
            />
            <button
              type="submit"
              disabled={!commentInput.trim()}
              className="inline-flex items-center justify-center rounded-xl bg-[#171916] p-2 text-white transition-opacity hover:bg-[#2A2E28] disabled:opacity-40"
              aria-label="Send reply"
            >
              <Send className="h-3.5 w-3.5" />
            </button>
          </form>
        </div>
      )}
    </article>
  )
}
