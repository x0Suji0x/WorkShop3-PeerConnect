import { Link } from 'react-router-dom'
import { Calendar, Globe, MapPin, Zap, ArrowRight } from 'lucide-react'
import type { TeamPost } from '../types'
import { Badge } from '../../../components/common/Badge'

export interface TeamPostCardProps {
  post: TeamPost
}

export function TeamPostCard({ post }: TeamPostCardProps) {
  const openRolesCount = post.roles.filter((r) => !r.filled).length

  const collabTypeIcons = {
    remote: <Globe className="h-3 w-3" />,
    'on-campus': <MapPin className="h-3 w-3" />,
    hybrid: <Zap className="h-3 w-3" />,
  }

  const collabTypeLabels = {
    remote: 'Remote',
    'on-campus': 'On-Campus',
    hybrid: 'Hybrid',
  }

  const categoryLabels: Record<string, string> = {
    hackathon: 'Hackathon',
    startup: 'Startup Idea',
    'college-project': 'College Capstone',
    research: 'Research',
    'open-source': 'Open Source',
    'personal-project': 'Personal Project',
  }

  return (
    <article className="group flex flex-col justify-between rounded-2xl border border-[#E7E8E1] bg-white p-5 shadow-[0_2px_12px_rgba(23,25,22,0.03)] transition-all duration-200 hover:-translate-y-1 hover:border-[#08C58A]/50 hover:shadow-[0_12px_28px_rgba(23,25,22,0.07)]">
      <div>
        {/* Top meta badges */}
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <Badge variant="peach" size="sm" className="font-bold">
              {categoryLabels[post.category] || post.category}
            </Badge>
            <span className="inline-flex items-center gap-1 rounded-full border border-[#E7E8E1] bg-[#F7F6F0] px-2 py-0.5 text-[11px] font-medium text-[#525A55]">
              {collabTypeIcons[post.collabType]}
              {collabTypeLabels[post.collabType]}
            </span>
          </div>

          <Badge variant={post.status === 'open' ? 'green' : 'neutral'} size="sm" className="font-semibold">
            {post.status === 'open' ? `${openRolesCount} roles open` : 'Squad Full'}
          </Badge>
        </div>

        {/* Project Title */}
        <h3 className="mt-3 text-base font-bold text-[#171916] group-hover:text-[#08A876] transition-colors leading-snug">
          <Link to={`/team-finder/${post.id}`}>
            {post.title}
          </Link>
        </h3>

        {/* Description brief */}
        <p className="mt-2 text-xs leading-relaxed text-[#525A55] line-clamp-2">
          {post.description}
        </p>

        {/* Available Roles Preview */}
        <div className="mt-4 rounded-xl bg-[#F7F6F0] p-3">
          <p className="text-[11px] font-bold text-[#123D30] uppercase tracking-wider mb-2">
            Roles Needed:
          </p>
          <div className="space-y-1.5">
            {post.roles.map((role) => (
              <div key={role.id} className="flex items-center justify-between text-xs">
                <span className={`font-medium ${role.filled ? 'line-through text-[#777A72]' : 'text-[#171916]'}`}>
                  {role.title}
                </span>
                <span
                  className={`text-[10px] font-bold px-1.5 py-0.2 rounded ${role.filled
                      ? 'bg-gray-200 text-gray-600'
                      : 'bg-[#E3F4EB] text-[#123D30]'
                    }`}
                >
                  {role.filled ? 'Filled' : 'Recruiting'}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Tech Stack Chips */}
        <div className="mt-3.5 flex flex-wrap gap-1">
          {post.skills.slice(0, 4).map((skill) => (
            <span
              key={skill}
              className="rounded-md border border-[#E7E8E1] bg-white px-2 py-0.5 text-[10px] font-medium text-[#525A55]"
            >
              {skill}
            </span>
          ))}
          {post.skills.length > 4 && (
            <span className="text-[10px] text-[#777A72] self-center">
              +{post.skills.length - 4} more
            </span>
          )}
        </div>
      </div>

      {/* Card Footer */}
      <div className="mt-5 pt-3.5 border-t border-[#F2F1EA] flex items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2">
          <img
            src={post.authorAvatar}
            alt={post.authorName}
            className="h-7 w-7 rounded-full object-cover border border-[#E7E8E1]"
          />
          <div>
            <p className="font-bold text-[#171916] text-[11px] line-clamp-1">{post.authorName}</p>
            <p className="text-[10px] text-[#777A72] line-clamp-1">{post.authorCollege}</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1 text-[11px] text-[#525A55]">
            <Calendar className="h-3.5 w-3.5 text-[#08C58A]" />
            <span>{post.deadline}</span>
          </div>

          <Link
            to={`/team-finder/${post.id}`}
            className="inline-flex items-center gap-1 rounded-full bg-[#171916] px-3 py-1.5 text-xs font-bold text-white hover:bg-[#2A2E28] transition-colors"
          >
            <span>Squad</span>
            <ArrowRight className="h-3 w-3" />
          </Link>
        </div>
      </div>
    </article>
  )
}

