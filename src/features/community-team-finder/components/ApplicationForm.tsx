import { useState } from 'react'
import { Send, CheckCircle2, UserCheck, Clock } from 'lucide-react'
import type { TeamPost } from '../types'
import { Button } from '../../../components/common/Button'

export interface ApplicationFormProps {
  post: TeamPost
  onSubmitApplication: (roleId: string, message: string) => void
}

export function ApplicationForm({ post, onSubmitApplication }: ApplicationFormProps) {
  const openRoles = post.roles.filter((r) => !r.filled)
  const [selectedRole, setSelectedRole] = useState(openRoles[0]?.id || '')
  const [hoursCommitment, setHoursCommitment] = useState('10-15 hrs/week')
  const [message, setMessage] = useState('')
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedRole || !message.trim()) return

    const fullMessage = `[Commitment: ${hoursCommitment}] ${message.trim()}`
    onSubmitApplication(selectedRole, fullMessage)
    setSubmitted(true)
  }

  if (submitted) {
    return (
      <div className="rounded-2xl border border-[#08C58A]/40 bg-[#E3F4EB]/30 p-6 text-center animate-in fade-in">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-[#08C58A] text-white shadow-md">
          <CheckCircle2 className="h-6 w-6" />
        </div>
        <h4 className="mt-3 text-base font-bold text-[#123D30]">Application Transmitted!</h4>
        <p className="mt-1 text-xs text-[#525A55] max-w-sm mx-auto leading-relaxed">
          <strong>{post.authorName}</strong> (Project Lead) has received your pitch and portfolio summary. You can review and track responses in your applications log.
        </p>
        <button
          type="button"
          onClick={() => {
            setSubmitted(false)
            setMessage('')
          }}
          className="mt-4 text-xs font-bold text-[#08A876] hover:underline"
        >
          Submit another application
        </button>
      </div>
    )
  }

  if (openRoles.length === 0) {
    return (
      <div className="rounded-2xl border border-[#E7E8E1] bg-[#F7F6F0] p-6 text-center text-xs text-[#777A72]">
        All roles for this project have currently been filled. You can browse other open hackathons or capstones in Team Finder.
      </div>
    )
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-2xl border border-[#E7E8E1] bg-white p-5 shadow-[0_4px_18px_rgba(23,25,22,0.04)]"
    >
      <div className="flex items-center gap-2 pb-3 border-b border-[#F2F1EA]">
        <span className="flex h-6 w-6 items-center justify-center rounded-lg bg-[#E3F4EB] text-[#08C58A]">
          <UserCheck className="h-3.5 w-3.5" />
        </span>
        <h3 className="text-sm font-bold text-[#171916]">Apply to Join this Squad</h3>
      </div>

      <div className="mt-4 space-y-3.5">
        <div>
          <label htmlFor="select-role" className="block text-xs font-bold text-[#171916]">
            Select Target Role *
          </label>
          <select
            id="select-role"
            value={selectedRole}
            onChange={(e) => setSelectedRole(e.target.value)}
            className="mt-1.5 w-full rounded-xl border border-[#E7E8E1] bg-white px-3.5 py-2.5 text-xs text-[#171916] outline-none transition focus:border-[#08C58A] focus:ring-1 focus:ring-[#08C58A]"
          >
            {openRoles.map((role) => (
              <option key={role.id} value={role.id}>
                {role.title} — skills: {role.skills.join(', ')}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="commitment" className="block text-xs font-bold text-[#171916] flex items-center gap-1">
            <Clock className="h-3 w-3 text-[#08A876]" />
            Your Weekly Availability:
          </label>
          <select
            id="commitment"
            value={hoursCommitment}
            onChange={(e) => setHoursCommitment(e.target.value)}
            className="mt-1.5 w-full rounded-xl border border-[#E7E8E1] bg-white px-3.5 py-2 text-xs text-[#171916] outline-none transition focus:border-[#08C58A] focus:ring-1 focus:ring-[#08C58A]"
          >
            <option value="5-10 hrs/week">5-10 hrs/week (Light assistance)</option>
            <option value="10-15 hrs/week">10-15 hrs/week (Standard contribution)</option>
            <option value="15-25 hrs/week">15-25 hrs/week (Core teammate)</option>
            <option value="Full-time Sprint">Full-time Hackathon Sprint</option>
          </select>
        </div>

        <div>
          <label htmlFor="app-message" className="block text-xs font-bold text-[#171916]">
            Introduction & Pitch *
          </label>
          <textarea
            id="app-message"
            required
            rows={4}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Introduce yourself, cite 1-2 relevant projects/repos, and explain why you are thrilled to collaborate on this initiative..."
            className="mt-1.5 w-full rounded-xl border border-[#E7E8E1] bg-white px-3.5 py-2.5 text-xs text-[#171916] outline-none transition focus:border-[#08C58A] focus:ring-1 focus:ring-[#08C58A]"
          />
        </div>
      </div>

      <div className="mt-5 pt-3.5 border-t border-[#F2F1EA] flex justify-end">
        <Button type="submit" size="sm" disabled={!selectedRole || !message.trim()}>
          <Send className="h-3.5 w-3.5 mr-1" />
          Transmit Application
        </Button>
      </div>
    </form>
  )
}

