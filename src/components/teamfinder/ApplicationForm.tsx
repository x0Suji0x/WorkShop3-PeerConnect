import { useState } from 'react'
import { Send, CheckCircle2, UserCheck } from 'lucide-react'
import type { TeamPost } from '../../types/community'
import { Button } from '../common/Button'

export interface ApplicationFormProps {
  post: TeamPost
  onSubmitApplication: (roleId: string, message: string) => void
}

export function ApplicationForm({ post, onSubmitApplication }: ApplicationFormProps) {
  const openRoles = post.roles.filter((r) => !r.filled)
  const [selectedRole, setSelectedRole] = useState(openRoles[0]?.id || '')
  const [message, setMessage] = useState('')
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedRole || !message.trim()) return

    onSubmitApplication(selectedRole, message.trim())
    setSubmitted(true)
  }

  if (submitted) {
    return (
      <div className="rounded-2xl border border-[#08C58A]/40 bg-[#E3F4EB]/30 p-6 text-center">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-[#08C58A] text-white">
          <CheckCircle2 className="h-6 w-6" />
        </div>
        <h4 className="mt-3 text-base font-bold text-[#123D30]">Application Submitted!</h4>
        <p className="mt-1 text-xs text-[#525A55] max-w-sm mx-auto">
          {post.authorName} has been notified. You can track your team applications in your dashboard.
        </p>
        <button
          type="button"
          onClick={() => {
            setSubmitted(false)
            setMessage('')
          }}
          className="mt-4 text-xs font-semibold text-[#08A876] hover:underline"
        >
          Send another application
        </button>
      </div>
    )
  }

  if (openRoles.length === 0) {
    return (
      <div className="rounded-2xl border border-[#E7E8E1] bg-[#F7F6F0] p-6 text-center text-xs text-[#777A72]">
        All roles for this project have been filled. You can bookmark this project or explore other open opportunities.
      </div>
    )
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-2xl border border-[#E7E8E1] bg-white p-5 shadow-[0_4px_18px_rgba(23,25,22,0.04)]"
    >
      <div className="flex items-center gap-2 pb-3 border-b border-[#F2F1EA]">
        <UserCheck className="h-4 w-4 text-[#08C58A]" />
        <h3 className="text-sm font-bold text-[#171916]">Apply to Join this Project</h3>
      </div>

      <div className="mt-4 space-y-3.5">
        <div>
          <label htmlFor="select-role" className="block text-xs font-semibold text-[#171916]">
            Select the role you're applying for:
          </label>
          <select
            id="select-role"
            value={selectedRole}
            onChange={(e) => setSelectedRole(e.target.value)}
            className="mt-1.5 w-full rounded-xl border border-[#E7E8E1] bg-white px-3.5 py-2.5 text-xs text-[#171916] outline-none transition focus:border-[#08C58A] focus:ring-2 focus:ring-[#08C58A]/20"
          >
            {openRoles.map((role) => (
              <option key={role.id} value={role.id}>
                {role.title} — skills: {role.skills.join(', ')}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="app-message" className="block text-xs font-semibold text-[#171916]">
            Introduction & why you're a good fit:
          </label>
          <textarea
            id="app-message"
            required
            rows={4}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Tell the team lead about your relevant projects, tech stack experience, and how many hours/week you can commit..."
            className="mt-1.5 w-full rounded-xl border border-[#E7E8E1] bg-white px-3.5 py-2.5 text-xs text-[#171916] outline-none transition focus:border-[#08C58A] focus:ring-2 focus:ring-[#08C58A]/20"
          />
        </div>
      </div>

      <div className="mt-5 pt-3 border-t border-[#F2F1EA] flex justify-end">
        <Button type="submit" variant="primary" size="sm" disabled={!selectedRole || !message.trim()}>
          <Send className="h-3.5 w-3.5 mr-1" />
          Submit Application
        </Button>
      </div>
    </form>
  )
}
