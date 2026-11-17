import { Link } from 'react-router-dom'
import { Users, MessageSquare, Check, Plus } from 'lucide-react'
import type { Community } from '../../types/community'
import { communityDetailRoute } from '../../app/routes'
import { Badge } from '../common/Badge'

export interface CommunityCardProps {
  community: Community
  isJoined?: boolean
  onJoinToggle?: (communityId: string) => void
}

export function CommunityCard({ community, isJoined = false, onJoinToggle }: CommunityCardProps) {
  const activityBadgeVariants: Record<string, 'green' | 'blue' | 'neutral' | 'peach'> = {
    'very-active': 'green',
    active: 'blue',
    moderate: 'neutral',
    quiet: 'peach',
  }

  const activityLabels: Record<string, string> = {
    'very-active': 'High activity',
    active: 'Active daily',
    moderate: 'Moderate activity',
    quiet: 'Weekly updates',
  }

  return (
    <div className="group relative flex flex-col justify-between overflow-hidden rounded-2xl border border-[#E7E8E1] bg-white p-5 shadow-[0_4px_18px_rgba(23,25,22,0.04)] transition-all duration-200 hover:-translate-y-0.5 hover:border-[#08C58A]/50 hover:shadow-[0_8px_24px_rgba(23,25,22,0.08)]">
      <div>
        {/* Header with emoji logo and activity badge */}
        <div className="flex items-start justify-between gap-3">
          <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-[#F7F6F0] text-3xl shadow-inner border border-[#E7E8E1] transition-transform group-hover:scale-105">
            {community.logoEmoji}
          </div>
          <Badge
            variant={activityBadgeVariants[community.activityLevel] || 'neutral'}
            size="sm"
          >
            {activityLabels[community.activityLevel] || community.activityLevel}
          </Badge>
        </div>

        {/* Name and Tagline */}
        <div className="mt-4">
          <Link
            to={communityDetailRoute(community.slug)}
            className="text-lg font-bold tracking-tight text-[#171916] transition-colors hover:text-[#08C58A] line-clamp-1"
          >
            {community.name}
          </Link>
          <p className="mt-1 text-sm font-medium text-[#525A55] line-clamp-2 leading-relaxed">
            {community.tagline}
          </p>
        </div>

        {/* Tags */}
        <div className="mt-4 flex flex-wrap gap-1.5">
          {community.tags.slice(0, 3).map((tag) => (
            <span
              key={tag}
              className="inline-block rounded-md bg-[#F7F6F0] px-2 py-0.5 text-xs font-medium text-[#525A55]"
            >
              #{tag}
            </span>
          ))}
          {community.tags.length > 3 && (
            <span className="inline-block rounded-md bg-[#F7F6F0] px-1.5 py-0.5 text-xs text-[#777A72]">
              +{community.tags.length - 3}
            </span>
          )}
        </div>
      </div>

      {/* Footer with stats and Join toggle */}
      <div className="mt-5 flex items-center justify-between border-t border-[#F2F1EA] pt-4">
        <div className="flex items-center gap-3 text-xs font-medium text-[#777A72]">
          <span className="flex items-center gap-1">
            <Users className="h-3.5 w-3.5 text-[#525A55]" />
            {community.memberCount.toLocaleString()}
          </span>
          <span className="flex items-center gap-1">
            <MessageSquare className="h-3.5 w-3.5 text-[#525A55]" />
            {community.postCount}
          </span>
        </div>

        <div className="flex items-center gap-2">
          {onJoinToggle && (
            <button
              type="button"
              onClick={(e) => {
                e.preventDefault()
                e.stopPropagation()
                onJoinToggle(community.id)
              }}
              className={`inline-flex items-center gap-1 rounded-full px-3 py-1.5 text-xs font-semibold transition-all ${
                isJoined
                  ? 'bg-[#E3F4EB] text-[#123D30] hover:bg-[#d4ede0]'
                  : 'bg-[#171916] text-white hover:bg-[#242723]'
              }`}
            >
              {isJoined ? (
                <>
                  <Check className="h-3 w-3 stroke-[2.5]" />
                  Joined
                </>
              ) : (
                <>
                  <Plus className="h-3 w-3" />
                  Join
                </>
              )}
            </button>
          )}

          <Link
            to={communityDetailRoute(community.slug)}
            className="rounded-full border border-[#E7E8E1] px-3 py-1.5 text-xs font-medium text-[#171916] transition-colors hover:border-[#171916] hover:bg-white"
          >
            View
          </Link>
        </div>
      </div>
    </div>
  )
}
