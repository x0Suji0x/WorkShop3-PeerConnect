import { Sparkles, CheckCircle2, Clock, FolderGit2 } from 'lucide-react'
import type { StudentMatchProfile } from '../../types/community'
import { Badge } from '../common/Badge'

export interface StudentMatchCardProps {
  profile: StudentMatchProfile
  onInvite?: (studentId: string) => void
  invited?: boolean
}

export function StudentMatchCard({ profile, onInvite, invited = false }: StudentMatchCardProps) {
  const getScoreBadgeVariant = (score: number): 'green' | 'blue' | 'neutral' => {
    if (score >= 80) return 'green'
    if (score >= 60) return 'blue'
    return 'neutral'
  }

  return (
    <div className="relative flex flex-col justify-between rounded-2xl border border-[#E7E8E1] bg-white p-4 shadow-[0_2px_12px_rgba(23,25,22,0.03)] transition-all hover:border-[#08C58A]/50 hover:shadow-[0_6px_20px_rgba(23,25,22,0.06)]">
      <div>
        {/* Header: Student avatar, details, match score */}
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3">
            <img
              src={profile.avatarUrl}
              alt={profile.name}
              className="h-12 w-12 rounded-full object-cover border border-[#E7E8E1] shadow-2xs"
            />
            <div>
              <h4 className="font-bold text-[#171916] text-sm">{profile.name}</h4>
              <p className="text-xs text-[#525A55] line-clamp-1">{profile.college}</p>
              <div className="mt-1 flex items-center gap-1.5 text-[11px] text-[#777A72]">
                <Clock className="h-3 w-3 text-[#08A876]" />
                <span>{profile.availability}</span>
              </div>
            </div>
          </div>

          <Badge variant={getScoreBadgeVariant(profile.matchScore)} size="sm" className="font-bold shrink-0">
            <Sparkles className="h-3 w-3" />
            {profile.matchScore}% Match
          </Badge>
        </div>

        {/* AI Match Explanation */}
        <div className="mt-3 rounded-xl bg-[#F7F6F0] p-2.5 text-xs text-[#171916] border border-[#E7E8E1]/70 leading-relaxed">
          <span className="font-semibold text-[#123D30]">Why recommended: </span>
          <span className="text-[#525A55]">{profile.matchReason}</span>
        </div>

        {/* Matched skills highlight */}
        {profile.matchedSkills.length > 0 && (
          <div className="mt-3">
            <span className="text-[11px] font-semibold text-[#123D30]">Direct skill matches:</span>
            <div className="mt-1 flex flex-wrap gap-1">
              {profile.matchedSkills.map((skill) => (
                <span
                  key={skill}
                  className="inline-flex items-center gap-1 rounded-md bg-[#E3F4EB] px-2 py-0.5 text-[11px] font-semibold text-[#123D30]"
                >
                  <CheckCircle2 className="h-2.5 w-2.5 text-[#08C58A]" />
                  {skill}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* All skills */}
        <div className="mt-2.5 flex flex-wrap gap-1">
          {profile.skills.map((skill) => (
            <span
              key={skill}
              className={`rounded-md border px-1.5 py-0.5 text-[10px] font-medium ${
                profile.matchedSkills.includes(skill)
                  ? 'border-transparent bg-transparent text-[#777A72] hidden'
                  : 'border-[#E7E8E1] bg-white text-[#777A72]'
              }`}
            >
              {skill}
            </span>
          ))}
        </div>

        {/* Portfolio projects preview */}
        {profile.portfolioProjects.length > 0 && (
          <div className="mt-3 flex items-center gap-1 text-[11px] text-[#777A72]">
            <FolderGit2 className="h-3 w-3 text-[#525A55]" />
            <span className="line-clamp-1">Projects: {profile.portfolioProjects.join(', ')}</span>
          </div>
        )}
      </div>

      {/* Action button */}
      <div className="mt-4 border-t border-[#F2F1EA] pt-3">
        {onInvite && (
          <button
            type="button"
            onClick={() => onInvite(profile.id)}
            disabled={invited}
            className={`w-full rounded-full py-1.5 text-xs font-semibold transition-all ${
              invited
                ? 'bg-[#E3F4EB] text-[#123D30] cursor-default'
                : 'bg-[#171916] text-white hover:bg-[#2A2E28]'
            }`}
          >
            {invited ? 'Invitation Sent ✓' : 'Invite to Team'}
          </button>
        )}
      </div>
    </div>
  )
}
