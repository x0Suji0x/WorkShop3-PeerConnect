import { useState } from 'react'
import { X, Send, Megaphone, Tag } from 'lucide-react'
import type { CommunityPost } from '../types'
import { Button } from '../../../components/common/Button'

export interface CreatePostModalProps {
  communityId: string
  communityName: string
  isOpen: boolean
  authorName?: string
  authorAvatar?: string
  authorCollege?: string
  onClose: () => void
  onSubmitPost: (newPostData: Omit<CommunityPost, 'id' | 'createdAt' | 'likes' | 'comments'>) => void
}

export function CreatePostModal({
  communityId,
  communityName,
  isOpen,
  authorName = 'Sofia Rodriguez',
  authorAvatar = 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
  authorCollege = 'National Institute of Design, Bengaluru',
  onClose,
  onSubmitPost,
}: CreatePostModalProps) {
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [tagInput, setTagInput] = useState('')
  const [tags, setTags] = useState<string[]>([])
  const [isAnnouncement, setIsAnnouncement] = useState(false)

  if (!isOpen) return null

  const handleAddTag = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault()
      const clean = tagInput.trim().replace(/^#/, '').replace(/,$/, '')
      if (clean && !tags.includes(clean)) {
        setTags([...tags, clean])
      }
      setTagInput('')
    }
  }

  const removeTag = (t: string) => {
    setTags(tags.filter((item) => item !== t))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!title.trim() || !content.trim()) return

    onSubmitPost({
      communityId,
      authorId: 'sofia-rodriguez',
      authorName,
      authorAvatar,
      authorCollege,
      title: title.trim(),
      content: content.trim(),
      tags,
      isPinned: isAnnouncement,
      isAnnouncement,
    })

    setTitle('')
    setContent('')
    setTags([])
    setIsAnnouncement(false)
    onClose()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="relative w-full max-w-xl rounded-2xl border border-[#E7E8E1] bg-white p-6 shadow-2xl">
        <div className="flex items-center justify-between border-b border-[#F2F1EA] pb-3">
          <div>
            <h3 className="text-base font-bold text-[#171916]">Start a Discussion</h3>
            <p className="text-xs text-[#777A72]">Posting into {communityName}</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-1 text-[#777A72] hover:bg-[#F7F6F0] hover:text-[#171916]"
            aria-label="Close dialog"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="mt-4 space-y-4">
          <div>
            <label htmlFor="post-title" className="block text-xs font-bold text-[#171916]">
              Discussion Title *
            </label>
            <input
              id="post-title"
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="What question, concept, or project do you want to explore?"
              className="mt-1 w-full rounded-xl border border-[#E7E8E1] bg-white px-3.5 py-2.5 text-xs text-[#171916] outline-none transition focus:border-[#08C58A] focus:ring-1 focus:ring-[#08C58A]"
            />
          </div>

          <div>
            <label htmlFor="post-content" className="block text-xs font-bold text-[#171916]">
              Details & Context *
            </label>
            <textarea
              id="post-content"
              required
              rows={5}
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Provide background context, code snippets, or benchmark observations..."
              className="mt-1 w-full rounded-xl border border-[#E7E8E1] bg-white px-3.5 py-2.5 text-xs text-[#171916] outline-none transition focus:border-[#08C58A] focus:ring-1 focus:ring-[#08C58A]"
            />
          </div>

          <div>
            <label htmlFor="post-tags" className="block text-xs font-bold text-[#171916]">
              Topics / Tags (Press Enter or comma)
            </label>
            <div className="mt-1 flex flex-wrap items-center gap-1.5 rounded-xl border border-[#E7E8E1] bg-white p-2 focus-within:border-[#08C58A] focus-within:ring-1 focus-within:ring-[#08C58A]">
              <Tag className="h-3.5 w-3.5 text-[#777A72] ml-1" />
              {tags.map((t) => (
                <span
                  key={t}
                  className="inline-flex items-center gap-1 rounded-md bg-[#F7F6F0] px-2 py-0.5 text-xs font-medium text-[#171916]"
                >
                  #{t}
                  <button
                    type="button"
                    onClick={() => removeTag(t)}
                    className="text-[#777A72] hover:text-rose-600"
                  >
                    ×
                  </button>
                </span>
              ))}
              <input
                id="post-tags"
                type="text"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyDown={handleAddTag}
                placeholder={tags.length === 0 ? 'e.g. Nextjs, PyTorch' : ''}
                className="flex-1 min-w-24 text-xs outline-none bg-transparent"
              />
            </div>
          </div>

          <div className="flex items-center gap-2 rounded-xl bg-[#F7F6F0] p-3 text-xs text-[#525A55]">
            <input
              id="is-announcement"
              type="checkbox"
              checked={isAnnouncement}
              onChange={(e) => setIsAnnouncement(e.target.checked)}
              className="h-4 w-4 rounded border-[#CBD5E1] text-[#08C58A] focus:ring-[#08C58A]"
            />
            <label htmlFor="is-announcement" className="flex items-center gap-1.5 font-medium cursor-pointer">
              <Megaphone className="h-3.5 w-3.5 text-amber-600" />
              Mark as Community Announcement (pins to top of discussions)
            </label>
          </div>

          <div className="flex items-center justify-end gap-2 pt-3 border-t border-[#F2F1EA]">
            <Button type="button" variant="secondary" size="sm" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" size="sm" disabled={!title.trim() || !content.trim()}>
              <Send className="h-3.5 w-3.5 mr-1" />
              Publish Post
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}

