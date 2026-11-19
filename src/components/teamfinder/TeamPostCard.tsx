import { Link } from 'react-router-dom'
import { Calendar, Globe, MapPin, Zap, ArrowRight } from 'lucide-react'
import type { TeamPost } from '../../types/community'
import { teamDetailRoute } from '../../app/routes'
import { Badge } from '../common/Badge'

export interface TeamPostCardProps {
  post: TeamPost
}

export function TeamPostCard({ post }: TeamPostCardProps) {
  const categoryBadgeVariants: Record<string, 'peach' | 'lavender' | 'blue' | 'green' | 'neutral' | 'dark'> = {
    hackathon: 'peach',
    startup: 'lavender',
    research: 'blue',
    'open-source': 'green',
    'college-project': 'neutral',
    'personal-project': 'dark',
  }

  const categoryLabels: Record<string, string> = {
    hackathon: 'Hackathon',
    startup: 'Startup Idea',
    research: 'Research Project',
    'open-source': 'Open Source',
    'college-project': 'College Project',
    'personal-project': 'Personal Project',
  }

  const collabTypeIcons = {
    remote: <Globe className="h-3 w-3" />,
    'on-campus': <MapPin className="h-3 w-3" />,
    hybrid: <Zap className="h-3 w-3" />,
  }

  const collabTypeLabels = {
    remote: 'Remote',
    'on-campus': 'On Campus',
    hybrid: 'Hybrid',
  }

  const openRolesCount = post.roles.filter((r) => !r.filled).length

  return (
    <div className="peer-card-glass p-5 transition-all duration-200 hover:-translate-y-1 hover:shadow-lg group relative flex flex-col justify-between overflow-hidden">
      <div>
        {/* Top badges: category, collab type, status */}
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex flex-wrap items-center gap-1.5">
            <Badge variant={categoryBadgeVariants[post.category] || 'neutral'} size="sm">
              {categoryLabels[post.category] || post.category}
            </Badge>

            <span className="inline-flex items-center gap-1 rounded-full border border-[#E7E8E1] bg-[#F7F6F0] px-2 py-0.5 text-[11px] font-medium text-[#525A55]">
              {collabTypeIcons[post.collabType]}
              {collabTypeLabels[post.collabType]}
            </span>
          </div>

          <Badge
            variant={post.status === 'open' ? 'green' : post.status === 'filled' ? 'neutral' : 'peach'}
            size="sm"
          >
            {post.status === 'open' ? 'Recruiting' : post.status === 'filled' ? 'Team Full' : 'Closed'}
          </Badge>
        </div>

        {/* Title and author */}
        <div className="mt-3.5">
          <Link
            to={teamDetailRoute(post.id)}
            className="text-lg font-bold tracking-tight text-[#171916] transition-colors hover:text-[#08C58A] line-clamp-1"
          >
            {post.title}
          </Link>
          <div className="mt-1 flex items-center gap-2 text-xs text-[#525A55]">
            <img
              src={post.authorAvatar}
              alt={post.authorName}
              className="h-4 w-4 rounded-full object-cover"
            />
            <span>by {post.authorName}</span>
            <span>•</span>
            <span className="line-clamp-1">{post.authorCollege}</span>
          </div>
        </div>

        {/* Description snippet */}
        <p className="mt-2.5 text-xs text-[#525A55] leading-relaxed line-clamp-2">
          {post.description}
        </p>

        {/* Roles needed alert */}
        <div className="mt-3.5 rounded-xl bg-[#F7F6F0] px-3 py-2 border border-[#E7E8E1] text-xs">
          <div className="flex items-center justify-between font-semibold text-[#171916]">
            <span>Roles needed:</span>
            <span className="text-[#08A876] font-bold">
              {openRolesCount} open of {post.roles.length}
            </span>
          </div>
          <div className="mt-1.5 flex flex-wrap gap-1">
            {post.roles.map((role) => (
              <span
                key={role.id}
                className={`rounded-md px-2 py-0.5 text-[11px] font-medium ${
                  role.filled
                    ? 'bg-[#E7E8E1] text-[#777A72] line-through'
                    : 'bg-[#E3F4EB] text-[#123D30]'
                }`}
              >
                {role.title}
              </span>
            ))}
          </div>
        </div>

        {/* Required Skills tags */}
        <div className="mt-3 flex flex-wrap gap-1">
          {post.skills.slice(0, 4).map((skill) => (
            <span
              key={skill}
              className="rounded-md border border-[#E7E8E1] bg-white px-2 py-0.5 text-[11px] font-medium text-[#171916]"
            >
              {skill}
            </span>
          ))}
          {post.skills.length > 4 && (
            <span className="rounded-md border border-[#E7E8E1] bg-[#F7F6F0] px-1.5 py-0.5 text-[11px] text-[#777A72]">
              +{post.skills.length - 4}
            </span>
          )}
        </div>
      </div>

      {/* Footer: team member avatars, deadline, CTA */}
      <div className="mt-5 flex items-center justify-between peer-divider-fade-t pt-3.5">
        <div className="flex items-center gap-3">
          {/* Stacked avatars of current members */}
          <div className="flex items-center -space-x-2">
            {post.currentMembers.map((member) => (
              <img
                key={member.id}
                src={member.avatarUrl}
                alt={member.name}
                title={`${member.name} (${member.role})`}
                className="h-6 w-6 rounded-full border-2 border-white object-cover shadow-2xs"
              />
            ))}
            <span className="flex h-6 w-6 items-center justify-center rounded-full border-2 border-white bg-[#F7F6F0] text-[10px] font-bold text-[#525A55]">
              {post.currentMembers.length}/{post.teamSize}
            </span>
          </div>

          <div className="flex items-center gap-1 text-[11px] text-[#777A72]">
            <Calendar className="h-3 w-3" />
            <span>Due {post.deadline}</span>
          </div>
        </div>

        <Link
          to={teamDetailRoute(post.id)}
          className="inline-flex items-center gap-1 rounded-full bg-[#171916] px-3.5 py-1.5 text-xs font-semibold text-white transition-all hover:bg-[#2A2E28]"
        >
          Details
          <ArrowRight className="h-3 w-3" />
        </Link>
      </div>
    </div>
  )
}
