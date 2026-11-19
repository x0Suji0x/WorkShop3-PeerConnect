import { useState, useMemo } from 'react'
import { useParams, Link } from 'react-router-dom'
import {
  ArrowLeft,
  Calendar,
  Globe,
  MapPin,
  Zap,
  Users,
  Sparkles,
  CheckCircle2,
  XCircle,
  Briefcase,
} from 'lucide-react'
import { teamPosts } from '../data/teamFinderData'
import { matchTeammates } from '../engine/recommendationEngine'
import { StudentMatchCard } from '../components/StudentMatchCard'
import { ApplicationForm } from '../components/ApplicationForm'
import { Badge } from '../../../components/common/Badge'
import { EmptyState } from '../../../components/common/EmptyState'
import type { TeamMember, TeamApplication } from '../types'

export function TeamDetailPage() {
  const { teamId } = useParams<{ teamId: string }>()
  const originalPost = teamPosts.find((p) => p.id === teamId)

  // Local post state allowing dynamic updates (adding members, accepting applications)
  const [post, setPost] = useState(originalPost)
  const [invitedStudentIds, setInvitedStudentIds] = useState<string[]>([])

  // Applications list
  const [applications, setApplications] = useState<TeamApplication[]>([
    {
      id: 'app-applied-1',
      teamPostId: teamId || '',
      roleTitle: 'Frontend Developer',
      applicantId: 's-kavita',
      applicantName: 'Kavita Sundaram',
      applicantAvatar:
        'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
      applicantCollege: 'IIT Madras',
      message:
        '[Commitment: 15 hrs/week] Hi team! I built two Next.js and PyTorch projects. Excited to jump in and build the field worker dashboard!',
      appliedAt: '2 hours ago',
      status: 'pending',
    },
  ])

  // Intelligent teammate matching calculation
  const matchedStudents = useMemo(() => {
    if (!post) return []
    return matchTeammates(post.skills, post.category, post.collabType)
  }, [post])

  if (!post) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-16 text-center">
        <EmptyState
          title="Collaboration project not found"
          description="This collaboration opportunity may have expired, reached capacity, or been removed."
          action={
            <Link
              to="/team-finder"
              className="rounded-full bg-[#171916] px-5 py-2 text-xs font-semibold text-white"
            >
              Browse Open Teams
            </Link>
          }
        />
      </div>
    )
  }

  const handleApply = (roleId: string, message: string) => {
    const role = post.roles.find((r) => r.id === roleId)
    const newApp: TeamApplication = {
      id: `app-${Date.now()}`,
      teamPostId: post.id,
      roleId,
      roleTitle: role?.title,
      applicantId: 'sofia-rodriguez',
      applicantName: 'Sofia Rodriguez (You)',
      applicantAvatar:
        'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
      applicantCollege: 'National Institute of Design, Bengaluru',
      message: `[Role: ${role?.title || 'Open Squad Role'}] ${message}`,
      appliedAt: 'Just now',
      status: 'pending',
    }
    setApplications([newApp, ...applications])
    setPost({
      ...post,
      applicantsCount: post.applicantsCount + 1,
    })
  }

  const handleAcceptApplication = (appId: string) => {
    const targetApp = applications.find((a) => a.id === appId)
    if (!targetApp) return

    setApplications((prev) =>
      prev.map((a) => (a.id === appId ? { ...a, status: 'accepted' as const } : a)),
    )

    const newMember: TeamMember = {
      id: targetApp.applicantId,
      name: targetApp.applicantName,
      avatarUrl: targetApp.applicantAvatar,
      role: targetApp.roleTitle || 'Squad Member',
      college: targetApp.applicantCollege,
    }

    // Mark matched role as filled
    const updatedRoles = post.roles.map((r) => {
      if (r.title.toLowerCase() === (targetApp.roleTitle || '').toLowerCase() && !r.filled) {
        return { ...r, filled: true }
      }
      return r
    })

    const newMembersList = [...post.currentMembers, newMember]
    const isNowFull = newMembersList.length >= post.teamSize

    setPost({
      ...post,
      roles: updatedRoles,
      currentMembers: newMembersList,
      status: isNowFull ? 'filled' : 'open',
    })
  }

  const handleRejectApplication = (appId: string) => {
    setApplications((prev) =>
      prev.map((a) => (a.id === appId ? { ...a, status: 'rejected' as const } : a)),
    )
  }

  const handleInviteStudent = (studentId: string) => {
    if (!invitedStudentIds.includes(studentId)) {
      setInvitedStudentIds([...invitedStudentIds, studentId])
    }
  }

  const collabTypeLabels = {
    remote: 'Remote Collaboration',
    'on-campus': 'On-Campus Collaboration',
    hybrid: 'Hybrid (On-Campus + Remote)',
  }

  const collabTypeIcons = {
    remote: <Globe className="h-4 w-4" />,
    'on-campus': <MapPin className="h-4 w-4" />,
    hybrid: <Zap className="h-4 w-4" />,
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      {/* Back button */}
      <Link
        to="/team-finder"
        className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#08A876] transition-colors hover:text-[#06805a]"
      >
        <ArrowLeft className="h-3.5 w-3.5" />
        Back to Team Opportunities
      </Link>

      {/* Main Grid */}
      <div className="mt-6 grid grid-cols-1 gap-8 lg:grid-cols-3">
        {/* Left 2 Columns: Project Details, Roles, Collaboration Management, Application Form */}
        <div className="space-y-6 lg:col-span-2">
          {/* Main Project Overview Card */}
          <div className="rounded-2xl border border-[#E7E8E1] bg-white p-6 shadow-2xs">
            {/* Top Badges */}
            <div className="flex flex-wrap items-center gap-2">
              <Badge variant="peach" size="sm" className="capitalize font-bold">
                {post.category.replace('-', ' ')}
              </Badge>
              <span className="inline-flex items-center gap-1 rounded-full border border-[#E7E8E1] bg-[#F7F6F0] px-2.5 py-0.5 text-xs font-medium text-[#525A55]">
                {collabTypeIcons[post.collabType]}
                {collabTypeLabels[post.collabType]}
              </span>
              <Badge
                variant={post.status === 'open' ? 'green' : 'neutral'}
                size="sm"
                className="font-bold ml-auto"
              >
                {post.status === 'open' ? 'Recruiting Teammates' : 'Squad Complete'}
              </Badge>
            </div>

            {/* Title */}
            <h1 className="mt-4 text-2xl font-black text-[#171916] sm:text-3xl">
              {post.title}
            </h1>

            {/* Author Attribution */}
            <div className="mt-3 flex items-center gap-3 border-b border-[#F2F1EA] pb-4 text-xs text-[#525A55]">
              <Link to={`/profiles/${post.authorId}`} className="shrink-0">
                <img
                  src={post.authorAvatar}
                  alt={post.authorName}
                  className="h-8 w-8 rounded-full object-cover border border-[#E7E8E1] hover:opacity-85"
                />
              </Link>
              <div>
                <p className="font-bold text-[#171916]">
                  Led by <Link to={`/profiles/${post.authorId}`} className="hover:text-[#08A876]">{post.authorName}</Link>
                </p>
                <p>{post.authorCollege} • Posted {new Date(post.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}</p>
              </div>
            </div>

            {/* Project Scope */}
            <div className="mt-5 space-y-2">
              <h3 className="text-sm font-bold text-[#171916]">Project Brief & Scope</h3>
              <p className="text-sm leading-relaxed text-[#4A504C] whitespace-pre-line">
                {post.description}
              </p>
            </div>

            {/* Required Technologies */}
            <div className="mt-6">
              <h3 className="text-xs font-bold text-[#171916] uppercase tracking-wider">
                Target Tech Stack & Skills
              </h3>
              <div className="mt-2 flex flex-wrap gap-1.5">
                {post.skills.map((skill) => (
                  <span
                    key={skill}
                    className="rounded-lg border border-[#E7E8E1] bg-[#F7F6F0] px-2.5 py-1 text-xs font-semibold text-[#171916]"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>

            {/* Deadline & Team Size Meta */}
            <div className="mt-6 flex flex-wrap items-center gap-6 rounded-xl bg-[#F7F6F0] p-4 text-xs text-[#525A55]">
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-[#08A876]" />
                <span>
                  <strong className="text-[#171916]">Application Deadline:</strong> {post.deadline}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Users className="h-4 w-4 text-[#08A876]" />
                <span>
                  <strong className="text-[#171916]">Squad Roster:</strong>{' '}
                  {post.currentMembers.length} / {post.teamSize} members
                </span>
              </div>
            </div>
          </div>

          {/* Open Roles Needed */}
          <div className="rounded-2xl border border-[#E7E8E1] bg-white p-6 shadow-2xs space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-[#171916]">Available Squad Roles</h3>
              <span className="text-xs text-[#08A876] font-semibold">
                {post.roles.filter((r) => !r.filled).length} open
              </span>
            </div>

            <div className="space-y-3">
              {post.roles.map((role) => (
                <div
                  key={role.id}
                  className={`rounded-xl border p-4 transition-all ${
                    role.filled
                      ? 'border-[#E7E8E1] bg-[#F7F6F0]/60 opacity-60'
                      : 'border-dashed border-[#08C58A]/50 bg-[#E3F4EB]/20'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Briefcase className="h-4 w-4 text-[#123D30]" />
                      <h4 className="text-sm font-bold text-[#171916]">{role.title}</h4>
                    </div>
                    <Badge variant={role.filled ? 'neutral' : 'green'} size="sm">
                      {role.filled ? 'Filled' : 'Recruiting'}
                    </Badge>
                  </div>
                  <p className="mt-1 text-xs text-[#525A55] leading-relaxed">{role.description}</p>
                  <div className="mt-2.5 flex flex-wrap gap-1">
                    {role.skills.map((s) => (
                      <span
                        key={s}
                        className="rounded-md bg-white border border-[#E7E8E1] px-2 py-0.5 text-[10px] font-medium text-[#171916]"
                      >
                        {s}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Current Squad Roster */}
          <div className="rounded-2xl border border-[#E7E8E1] bg-white p-6 shadow-2xs space-y-4">
            <h3 className="text-base font-bold text-[#171916]">
              Current Team Members ({post.currentMembers.length})
            </h3>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              {post.currentMembers.map((member) => (
                <div
                  key={member.id}
                  className="flex items-center gap-3 rounded-xl border border-[#E7E8E1] p-3"
                >
                  <Link to={`/profiles/${member.id}`} className="shrink-0">
                    <img
                      src={member.avatarUrl}
                      alt={member.name}
                      className="h-10 w-10 rounded-full object-cover border border-[#E7E8E1] hover:opacity-85"
                    />
                  </Link>
                  <div>
                    <Link
                      to={`/profiles/${member.id}`}
                      className="text-xs font-bold text-[#171916] hover:text-[#08A876]"
                    >
                      {member.name}
                    </Link>
                    <p className="text-[11px] font-medium text-[#08A876]">{member.role}</p>
                    <p className="text-[10px] text-[#777A72] line-clamp-1">{member.college}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Collaboration Management: Received Applications (Project Lead Review) */}
          <div className="rounded-2xl border border-[#E7E8E1] bg-white p-6 shadow-2xs space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-[#171916]">
                  Collaboration Applications ({applications.length})
                </h3>
                <p className="text-xs text-[#777A72]">Project Lead Review & Roster Approval</p>
              </div>
              <span className="text-xs font-bold text-[#123D30] bg-[#E3F4EB] px-2.5 py-1 rounded-full">
                Lead Controls Active
              </span>
            </div>

            <div className="space-y-3">
              {applications.map((app) => (
                <div
                  key={app.id}
                  className="rounded-xl border border-[#E7E8E1] bg-[#F7F6F0] p-4 text-xs space-y-2.5"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-2.5">
                      <Link to={`/profiles/${app.applicantId}`} className="shrink-0">
                        <img
                          src={app.applicantAvatar}
                          alt={app.applicantName}
                          className="h-9 w-9 rounded-full object-cover hover:opacity-85"
                        />
                      </Link>
                      <div>
                        <div className="flex items-center gap-2">
                          <Link
                            to={`/profiles/${app.applicantId}`}
                            className="font-bold text-[#171916] hover:text-[#08A876]"
                          >
                            {app.applicantName}
                          </Link>
                          <span className="text-[10px] text-[#777A72]">{app.appliedAt}</span>
                        </div>
                        <span className="text-[11px] text-[#525A55]">{app.applicantCollege}</span>
                      </div>
                    </div>

                    <Badge
                      variant={
                        app.status === 'accepted'
                          ? 'green'
                          : app.status === 'rejected'
                          ? 'peach'
                          : 'blue'
                      }
                      size="sm"
                      className="capitalize font-bold"
                    >
                      {app.status}
                    </Badge>
                  </div>

                  <p className="text-xs text-[#333735] leading-relaxed bg-white p-2.5 rounded-lg border border-[#E7E8E1]">
                    {app.message}
                  </p>

                  {app.status === 'pending' && (
                    <div className="flex items-center justify-end gap-2 pt-1">
                      <button
                        type="button"
                        onClick={() => handleRejectApplication(app.id)}
                        className="inline-flex items-center gap-1 rounded-lg border border-[#E7E8E1] bg-white px-3 py-1.5 text-xs font-semibold text-rose-700 hover:bg-rose-50"
                      >
                        <XCircle className="h-3.5 w-3.5" />
                        Decline
                      </button>
                      <button
                        type="button"
                        onClick={() => handleAcceptApplication(app.id)}
                        className="inline-flex items-center gap-1 rounded-lg bg-[#08C58A] px-3.5 py-1.5 text-xs font-bold text-[#0A261D] hover:bg-[#07B27C]"
                      >
                        <CheckCircle2 className="h-3.5 w-3.5" />
                        Accept & Add to Squad
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Apply Form Component */}
          <ApplicationForm post={post} onSubmitApplication={handleApply} />
        </div>

        {/* Right Column: AI Teammate Matching Shelf */}
        <div className="space-y-5">
          <div className="rounded-2xl border border-[#08C58A]/30 bg-gradient-to-b from-[#E3F4EB]/30 to-white p-5 shadow-[0_4px_20px_rgba(8,197,138,0.06)]">
            <div className="flex items-center gap-2">
              <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-emerald-100 text-[#08A876]">
                <Sparkles className="h-4 w-4" />
              </span>
              <div>
                <h3 className="text-sm font-bold text-[#171916]">AI Teammate Suggestions</h3>
                <p className="text-[11px] text-[#525A55]">
                  Ranked by required skill overlap, format, and availability
                </p>
              </div>
            </div>

            <div className="mt-4 space-y-4">
              {matchedStudents.slice(0, 4).map((studentProfile) => (
                <StudentMatchCard
                  key={studentProfile.id}
                  profile={studentProfile}
                  onInvite={handleInviteStudent}
                  invited={invitedStudentIds.includes(studentProfile.id)}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

