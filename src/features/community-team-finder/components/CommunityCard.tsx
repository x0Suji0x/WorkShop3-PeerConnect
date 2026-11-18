import { Link } from 'react-router-dom'
import { Users, MessageSquare, Check, Plus, ArrowUpRight } from 'lucide-react'
import type { Community } from '../types'
import { Badge } from '../../../components/common/Badge'

export interface CommunityCardProps {
  community: Community
  isJoined: boolean
  onToggleJoin: (communityId: string) => void
}

export function CommunityCard({ community, isJoined, onToggleJoin }: CommunityCardProps) {
  const activityConfig = {
    'very-active': { label: 'Very Active', dotColor: 'bg-emerald-500', textColor: 'text-emerald-700' },
    active: { label: 'Active', dotColor: 'bg-blue-500', textColor: 'text-blue-700' },
    moderate: { label: 'Moderate', dotColor: 'bg-amber-500', textColor: 'text-amber-700' },
    quiet: { label: 'Quiet', dotColor: 'bg-gray-400', textColor: 'text-gray-600' },
  }

  const activity = activityConfig[community.activityLevel] || activityConfig.active

  return (
    <article className="group relative flex flex-col justify-between overflow-hidden rounded-2xl border border-[#E7E8E1] bg-white shadow-[0_2px_12px_rgba(23,25,22,0.03)] transition-all duration-200 hover:-translate-y-1 hover:border-[#123D30]/30 hover:shadow-[0_12px_28px_rgba(23,25,22,0.07)]">
      <div>
        {/* Cover Image Banner */}
        <div className="relative h-28 w-full overflow-hidden bg-[#FAF8F5]">
          <img
            src={community.coverImageUrl}
            alt={community.name}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
            loading="lazy"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

          {/* Activity indicator tag */}
          <div className="absolute top-3 right-3 flex items-center gap-1.5 rounded-full bg-white/90 px-2.5 py-1 text-[11px] font-semibold backdrop-blur-xs shadow-2xs">
            <span className={`h-2 w-2 rounded-full ${activity.dotColor} animate-pulse`} />
            <span className={activity.textColor}>{activity.label}</span>
          </div>

          {/* Emoji avatar floating over banner */}
          <div className="absolute -bottom-3 left-4 flex h-12 w-12 items-center justify-center rounded-2xl border-2 border-white bg-white text-2xl shadow-md">
            {community.logoEmoji}
          </div>
        </div>

        {/* Content body */}
        <div className="px-5 pt-5 pb-2">
          <div className="flex items-center justify-between gap-2">
            <Badge variant="neutral" size="sm" className="capitalize text-[10px] font-bold">
              {community.category}
            </Badge>
            <div className="flex items-center gap-3 text-[11px] text-[#777A72]">
              <span className="flex items-center gap-1 font-semibold text-[#171916]">
                <Users className="h-3.5 w-3.5 text-[#08C58A]" />
                {community.memberCount.toLocaleString()}
              </span>
              <span className="flex items-center gap-1 font-medium">
                <MessageSquare className="h-3.5 w-3.5" />
                {community.postCount.toLocaleString()}
              </span>
            </div>
          </div>

          <h3 className="mt-2.5 text-base font-bold text-[#171916] group-hover:text-[#08A876] transition-colors">
            <Link to={`/communities/${community.slug}`} className="focus:outline-none">
              {community.name}
            </Link>
          </h3>

          <p className="mt-1 text-xs font-medium text-[#08A876] line-clamp-1">
            {community.tagline}
          </p>

          <p className="mt-2 text-xs leading-relaxed text-[#525A55] line-clamp-2">
            {community.description}
          </p>

          {/* Tags */}
          <div className="mt-3.5 flex flex-wrap gap-1">
            {community.tags.slice(0, 3).map((tag) => (
              <span
                key={tag}
                className="rounded-md border border-[#E7E8E1] bg-[#F7F6F0] px-2 py-0.5 text-[10px] font-medium text-[#525A55]"
              >
                #{tag}
              </span>
            ))}
            {community.tags.length > 3 && (
              <span className="rounded-md px-1.5 py-0.5 text-[10px] font-medium text-[#777A72]">
                +{community.tags.length - 3} more
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Card Footer Actions */}
      <div className="flex items-center justify-between gap-2 border-t border-[#F2F1EA] px-5 py-3.5 mt-2 bg-white">
        <button
          type="button"
          onClick={() => onToggleJoin(community.id)}
          className={`inline-flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-xs font-bold transition-all ${
            isJoined
              ? 'border border-[#08C58A] bg-[#E3F4EB] text-[#123D30] hover:bg-rose-50 hover:border-rose-300 hover:text-rose-700'
              : 'border border-[#171916] bg-[#171916] text-white hover:bg-[#2A2E28]'
          }`}
        >
          {isJoined ? (
            <>
              <Check className="h-3 w-3 text-[#08C58A]" />
              Joined
            </>
          ) : (
            <>
              <Plus className="h-3 w-3" />
              Join Circle
            </>
          )}
        </button>

        <Link
          to={`/communities/${community.slug}`}
          className="inline-flex items-center gap-1 text-xs font-bold text-[#171916] hover:text-[#08A876] transition-colors"
        >
          <span>Explore Hub</span>
          <ArrowUpRight className="h-3.5 w-3.5" />
        </Link>
      </div>
    </article>
  )
}

