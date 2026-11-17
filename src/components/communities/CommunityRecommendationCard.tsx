import { Link } from 'react-router-dom'
import { Sparkles, Users, ArrowRight, Check, Plus } from 'lucide-react'
import type { CommunityRecommendation } from '../../types/community'
import { communityDetailRoute } from '../../app/routes'
import { Badge } from '../common/Badge'

export interface CommunityRecommendationCardProps {
  recommendation: CommunityRecommendation
  isJoined?: boolean
  onJoinToggle?: (communityId: string) => void
}

export function CommunityRecommendationCard({
  recommendation,
  isJoined = false,
  onJoinToggle,
}: CommunityRecommendationCardProps) {
  const { community, reason, matchScore, matchedSkills } = recommendation

  return (
    <div className="relative flex flex-col justify-between overflow-hidden rounded-2xl border border-[#08C58A]/30 bg-gradient-to-b from-[#E3F4EB]/40 to-white p-5 shadow-[0_4px_18px_rgba(8,197,138,0.06)] transition-all hover:border-[#08C58A] hover:shadow-[0_8px_24px_rgba(8,197,138,0.12)]">
      <div>
        {/* Top bar with logo and match score */}
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-white text-2xl shadow-xs border border-[#E7E8E1]">
              {community.logoEmoji}
            </div>
            <div>
              <Link
                to={communityDetailRoute(community.slug)}
                className="font-bold text-[#171916] transition-colors hover:text-[#08C58A] line-clamp-1"
              >
                {community.name}
              </Link>
              <div className="flex items-center gap-2 text-xs text-[#525A55]">
                <span className="flex items-center gap-1">
                  <Users className="h-3 w-3" />
                  {community.memberCount.toLocaleString()} members
                </span>
              </div>
            </div>
          </div>

          <Badge variant="green" size="sm" className="font-bold">
            <Sparkles className="h-3 w-3" />
            {matchScore}% Match
          </Badge>
        </div>

        {/* AI Explanation */}
        <div className="mt-3 rounded-xl bg-white/80 p-3 border border-[#E7E8E1]/80 text-xs leading-relaxed text-[#171916]">
          <span className="font-semibold text-[#123D30]">Why for you: </span>
          <span className="text-[#525A55]">{reason}</span>
        </div>

        {/* Matched skills */}
        {matchedSkills.length > 0 && (
          <div className="mt-3 flex flex-wrap items-center gap-1.5">
            <span className="text-[11px] font-semibold text-[#777A72]">Matches:</span>
            {matchedSkills.map((skill) => (
              <span
                key={skill}
                className="rounded-full bg-[#E3F4EB] px-2 py-0.5 text-[11px] font-medium text-[#123D30]"
              >
                {skill}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Action buttons */}
      <div className="mt-4 flex items-center justify-between border-t border-[#E7E8E1]/60 pt-3">
        <Link
          to={communityDetailRoute(community.slug)}
          className="inline-flex items-center gap-1 text-xs font-semibold text-[#08A876] transition-colors hover:text-[#06805a]"
        >
          Explore community
          <ArrowRight className="h-3 w-3" />
        </Link>

        {onJoinToggle && (
          <button
            type="button"
            onClick={() => onJoinToggle(community.id)}
            className={`inline-flex items-center gap-1 rounded-full px-3 py-1.5 text-xs font-semibold transition-all ${
              isJoined
                ? 'bg-[#E3F4EB] text-[#123D30] hover:bg-[#d4ede0]'
                : 'bg-[#08C58A] text-[#0A261D] hover:bg-[#07b27c]'
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
      </div>
    </div>
  )
}
