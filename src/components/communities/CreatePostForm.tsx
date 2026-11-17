import { useState } from 'react'
import { Send, X, Tag } from 'lucide-react'
import type { CommunityPost } from '../../types/community'
import { Button } from '../common/Button'

export interface CreatePostFormProps {
  communityId: string
  onSubmit: (post: Omit<CommunityPost, 'id' | 'createdAt' | 'likes' | 'comments'>) => void
  onCancel?: () => void
}

export function CreatePostForm({ communityId, onSubmit, onCancel }: CreatePostFormProps) {
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [tagsInput, setTagsInput] = useState('')
  const [tags, setTags] = useState<string[]>([])
  const [isAnnouncement, setIsAnnouncement] = useState(false)

  const handleAddTag = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault()
      const clean = tagsInput.trim().replace(/^#/, '').toLowerCase()
      if (clean && !tags.includes(clean)) {
        setTags([...tags, clean])
      }
      setTagsInput('')
    }
  }

  const removeTag = (tagToRemove: string) => {
    setTags(tags.filter((t) => t !== tagToRemove))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!title.trim() || !content.trim()) return

    onSubmit({
      communityId,
      authorId: 'sofia-rodriguez',
      authorName: 'Sofia Rodriguez',
      authorAvatar:
        'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
      authorCollege: 'National Institute of Design, Bengaluru',
      title: title.trim(),
      content: content.trim(),
      tags,
      isPinned: false,
      isAnnouncement,
    })

    setTitle('')
    setContent('')
    setTags([])
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-2xl border border-[#08C58A]/30 bg-white p-5 shadow-[0_4px_20px_rgba(8,197,138,0.06)]"
    >
      <div className="flex items-center justify-between pb-3 border-b border-[#F2F1EA]">
        <h3 className="text-base font-bold text-[#171916]">Start a Discussion</h3>
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="rounded-lg p-1 text-[#777A72] hover:bg-[#F7F6F0] hover:text-[#171916]"
            aria-label="Cancel"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>

      <div className="mt-4 space-y-3.5">
        <div>
          <label htmlFor="post-title" className="block text-xs font-semibold text-[#171916]">
            Discussion Title
          </label>
          <input
            id="post-title"
            type="text"
            required
            placeholder="e.g. Best resources for learning PyTorch from scratch in 2026?"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="mt-1.5 w-full rounded-xl border border-[#E7E8E1] bg-white px-3.5 py-2.5 text-sm text-[#171916] outline-none transition focus:border-[#08C58A] focus:ring-2 focus:ring-[#08C58A]/20"
          />
        </div>

        <div>
          <label htmlFor="post-content" className="block text-xs font-semibold text-[#171916]">
            Content
          </label>
          <textarea
            id="post-content"
            required
            rows={4}
            placeholder="Share your perspective, question, or project update with the community..."
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="mt-1.5 w-full rounded-xl border border-[#E7E8E1] bg-white px-3.5 py-2.5 text-sm text-[#171916] outline-none transition focus:border-[#08C58A] focus:ring-2 focus:ring-[#08C58A]/20"
          />
        </div>

        <div>
          <label htmlFor="post-tags" className="block text-xs font-semibold text-[#171916]">
            Tags (Press Enter or comma to add)
          </label>
          <div className="mt-1.5 flex flex-wrap items-center gap-1.5 rounded-xl border border-[#E7E8E1] bg-white px-2.5 py-2 focus-within:border-[#08C58A] focus-within:ring-2 focus-within:ring-[#08C58A]/20">
            <Tag className="h-4 w-4 text-[#777A72]" />
            {tags.map((tag) => (
              <span
                key={tag}
                className="inline-flex items-center gap-1 rounded-md bg-[#E3F4EB] px-2 py-0.5 text-xs font-medium text-[#123D30]"
              >
                #{tag}
                <button
                  type="button"
                  onClick={() => removeTag(tag)}
                  className="hover:text-red-600"
                >
                  <X className="h-3 w-3" />
                </button>
              </span>
            ))}
            <input
              id="post-tags"
              type="text"
              placeholder={tags.length === 0 ? 'e.g. pytorch, machine-learning' : 'Add tag...'}
              value={tagsInput}
              onChange={(e) => setTagsInput(e.target.value)}
              onKeyDown={handleAddTag}
              className="flex-1 bg-transparent text-xs text-[#171916] outline-none min-w-[120px]"
            />
          </div>
        </div>

        <div className="flex items-center gap-2 pt-1">
          <input
            type="checkbox"
            id="is-announcement"
            checked={isAnnouncement}
            onChange={(e) => setIsAnnouncement(e.target.checked)}
            className="h-4 w-4 rounded border-[#CBD5E1] text-[#08C58A] focus:ring-[#08C58A]"
          />
          <label htmlFor="is-announcement" className="text-xs font-medium text-[#525A55] cursor-pointer">
            Mark as Community Announcement (highlighted banner)
          </label>
        </div>
      </div>

      <div className="mt-5 flex items-center justify-end gap-2 border-t border-[#F2F1EA] pt-3">
        {onCancel && (
          <Button type="button" variant="ghost" size="sm" onClick={onCancel}>
            Cancel
          </Button>
        )}
        <Button type="submit" variant="primary" size="sm" disabled={!title.trim() || !content.trim()}>
          <Send className="h-3.5 w-3.5 mr-1" />
          Publish Post
        </Button>
      </div>
    </form>
  )
}
