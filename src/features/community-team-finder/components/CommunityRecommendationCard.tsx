import { Link } from 'react-router-dom'
import { Sparkles, Users, Plus, Check } from 'lucide-react'
import type { CommunityRecommendation } from '../types'
import { Badge } from '../../../components/common/Badge'

export interface CommunityRecommendationCardProps {
  recommendation: CommunityRecommendation
  isJoined: boolean
  onToggleJoin: (communityId: string) => void
}

export function CommunityRecommendationCard({
  recommendation,
  isJoined,
  onToggleJoin,
}: CommunityRecommendationCardProps) {
  const { community, reason, matchScore, matchedSkills, matchedInterests, matchedAcademicField } =
    recommendation

  const getScoreVariant = (score: number): 'green' | 'blue' | 'peach' => {
    if (score >= 80) return 'green'
    if (score >= 60) return 'blue'
    return 'peach'
  }

  return (
    <article className="relative flex flex-col justify-between rounded-2xl border border-[#08C58A]/30 bg-gradient-to-b from-[#E3F4EB]/30 via-white to-white p-5 shadow-[0_4px_18px_rgba(8,197,138,0.06)] transition-all hover:border-[#08C58A] hover:shadow-[0_8px_24px_rgba(8,197,138,0.12)]">
      <div>
        {/* Top bar: Score badge and community emoji */}
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3">
            <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-white text-2xl shadow-2xs border border-[#E7E8E1]">
              {community.logoEmoji}
            </span>
            <div>
              <Link
                to={`/communities/${community.slug}`}
                className="text-base font-bold text-[#171916] hover:text-[#08A876] transition-colors"
              >
                {community.name}
              </Link>
              <div className="flex items-center gap-2 text-xs text-[#777A72]">
                <Users className="h-3 w-3 text-[#08C58A]" />
                <span>{community.memberCount.toLocaleString()} peers</span>
              </div>
            </div>
          </div>

          <Badge variant={getScoreVariant(matchScore)} size="sm" className="font-extrabold shrink-0">
            <Sparkles className="h-3 w-3" />
            {matchScore}% Match
          </Badge>
        </div>

        {/* AI Transparent Explanation */}
        <div className="mt-3.5 rounded-xl bg-[#F7F6F0] p-3 text-xs leading-relaxed text-[#171916] border border-[#E7E8E1]/70">
          <p className="font-bold text-[#123D30] flex items-center gap-1.5 mb-1">
            <Sparkles className="h-3 w-3 text-[#08A876]" />
            Why this circle fits you:
          </p>
          <p className="text-[#525A55]">{reason}</p>
        </div>

        {/* Matched Signals Chips */}
        <div className="mt-3 space-y-1.5">
          {matchedAcademicField && (
            <div className="flex items-center gap-1.5 text-[11px] text-[#123D30]">
              <span className="font-semibold text-[#08A876]">Academic Major:</span>
              <span className="rounded-md bg-[#E3F4EB] px-2 py-0.5 font-bold">{matchedAcademicField}</span>
            </div>
          )}

          {matchedSkills.length > 0 && (
            <div className="flex flex-wrap items-center gap-1 text-[11px]">
              <span className="font-semibold text-[#777A72] mr-1">Skills:</span>
              {matchedSkills.map((skill) => (
                <span
                  key={skill}
                  className="rounded-md border border-[#08C58A]/30 bg-emerald-50/60 px-2 py-0.5 font-semibold text-[#123D30]"
                >
                  {skill}
                </span>
              ))}
            </div>
          )}

          {matchedInterests.length > 0 && (
            <div className="flex flex-wrap items-center gap-1 text-[11px]">
              <span className="font-semibold text-[#777A72] mr-1">Interests:</span>
              {matchedInterests.map((interest) => (
                <span
                  key={interest}
                  className="rounded-md border border-[#E7E8E1] bg-white px-2 py-0.5 font-medium text-[#525A55]"
                >
                  {interest}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Card Action */}
      <div className="mt-5 pt-3.5 border-t border-[#F2F1EA] flex items-center justify-between gap-2">
        <button
          type="button"
          onClick={() => onToggleJoin(community.id)}
          className={`inline-flex items-center gap-1.5 rounded-full px-4 py-1.5 text-xs font-bold transition-all ${
            isJoined
              ? 'border border-[#08C58A] bg-[#E3F4EB] text-[#123D30]'
              : 'bg-[#171916] text-white hover:bg-[#2A2E28]'
          }`}
        >
          {isJoined ? (
            <>
              <Check className="h-3 w-3 text-[#08A876]" />
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
          className="text-xs font-bold text-[#08A876] hover:text-[#06805a] hover:underline"
        >
          View Community →
        </Link>
      </div>
    </article>
  )
}

