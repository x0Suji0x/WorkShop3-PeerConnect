import { useEffect, useState, type FormEvent } from 'react'
import { CheckCircle2, Clock3, FileCheck2, GraduationCap, ShieldCheck, XCircle } from 'lucide-react'
import { Badge } from '../../components/common/Badge'
import { Button } from '../../components/common/Button'
import { PageHeading } from '../../components/common/PageHeading'
import { useAuth } from '../../lib/auth/AuthProvider'
import {
  verificationRepository,
  type VerificationKind,
  type VerificationRequest,
} from '../../repositories/verificationRepository'

const statusCopy = {
  pending: { label: 'Pending review', variant: 'peach' as const, icon: Clock3 },
  approved: { label: 'Approved', variant: 'green' as const, icon: CheckCircle2 },
  rejected: { label: 'Needs another look', variant: 'neutral' as const, icon: XCircle },
}

export function VerificationPage() {
  const { user, profile } = useAuth()
  const kind: VerificationKind | null = profile?.role === 'student'
    ? 'student'
    : profile?.role === 'client'
      ? 'business'
      : null
  const [request, setRequest] = useState<VerificationRequest | null>(null)
  const [institutionOrCompany, setInstitutionOrCompany] = useState('')
  const [officialEmail, setOfficialEmail] = useState('')
  const [evidenceNotes, setEvidenceNotes] = useState('')
  const [isLoading, setIsLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [retryKey, setRetryKey] = useState(0)

  useEffect(() => {
    if (!user?.id || !kind) {
      setRequest(null)
      setIsLoading(false)
      return
    }

    let active = true
    setIsLoading(true)
    setError(null)
    void verificationRepository.getMine(user.id)
      .then((current) => { if (active) setRequest(current) })
      .catch((loadError: unknown) => {
        if (active) setError(loadError instanceof Error ? loadError.message : 'Could not load your request.')
      })
      .finally(() => { if (active) setIsLoading(false) })
    return () => { active = false }
  }, [user?.id, kind, retryKey])

  const submitRequest = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (!user?.id || !kind) return

    setIsSubmitting(true)
    setError(null)
    try {
      const nextRequest = await verificationRepository.submit(user.id, kind, {
        institutionOrCompany,
        officialEmail,
        evidenceNotes,
      })
      setRequest(nextRequest)
      setInstitutionOrCompany('')
      setOfficialEmail('')
      setEvidenceNotes('')
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : 'Could not submit your request.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const requestApproved = request?.status === 'approved'
  const requestPending = request?.status === 'pending'
  const requestKind = request?.kind ?? kind
  const badgeLabel = requestKind === 'business' ? 'Verified business' : 'Verified student'

  return (
    <div className="peer-page-surface min-h-[calc(100vh-80px)] relative overflow-hidden pb-16">
      <div className="peer-ambient-glow peer-glow-gold -top-24 -left-24 h-96 w-96 pointer-events-none" />
      <div className="peer-ambient-glow peer-glow-rose top-1/4 -right-24 h-96 w-96 pointer-events-none" />
      <div className="peer-ambient-glow peer-glow-mint -bottom-24 left-1/3 h-96 w-96 pointer-events-none" />
      <div className="pointer-events-none absolute inset-0 bg-grid-pattern opacity-30 -z-0" />

      <main className="relative z-10 mx-auto w-full max-w-5xl px-4 py-8 sm:px-6 sm:py-10 lg:px-8">
        <PageHeading
          eyebrow="Account trust"
          title="Verification centre"
          description="Request a manual review of your student or business details. A person reviews each request; email text alone does not verify an account."
        />

        <section className="peer-card-glass mt-7 p-5 sm:p-7" aria-labelledby="review-process-title">
          <div className="flex items-start gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#E3F4EB] text-[#123D30]">
              <ShieldCheck className="h-5 w-5" />
            </div>
            <div>
              <h2 id="review-process-title" className="text-base font-black text-[#171916]">A person reviews each request</h2>
              <p className="mt-1 text-sm leading-relaxed text-[#525A55]">
                There are no automatic email checks or document uploads in this version. Share context for a reviewer. Your request details are visible to you and verification admins.
              </p>
            </div>
          </div>
        </section>

        {error && (
          <div role="alert" className="mt-5 flex flex-wrap items-center gap-3 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">
            <span>{error}</span>
            <button type="button" className="font-bold underline" onClick={() => setRetryKey((value) => value + 1)}>Retry</button>
          </div>
        )}

        {isLoading ? (
          <p role="status" className="mt-7 text-sm text-[#777A72]">Loading your verification status…</p>
        ) : request ? (
          <section className="peer-card-glass mt-7 p-5 sm:p-7" aria-labelledby="request-status-title">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.14em] text-[#08A876]">Your latest request</p>
                <h2 id="request-status-title" className="mt-1 text-xl font-black text-[#171916]">
                  {request.institutionOrCompany}
                </h2>
              </div>
              {requestApproved ? (
                <Badge variant="green"><CheckCircle2 className="mr-1 h-3.5 w-3.5" />{badgeLabel}</Badge>
              ) : (
                <Badge variant={statusCopy[request.status].variant}>
                  {(() => { const StatusIcon = statusCopy[request.status].icon; return <StatusIcon className="mr-1 h-3.5 w-3.5" /> })()}
                  {statusCopy[request.status].label}
                </Badge>
              )}
            </div>
            <p className="mt-3 text-sm text-[#525A55]">Submitted {new Date(request.createdAt).toLocaleDateString()}</p>
            <p className="mt-3 text-sm leading-relaxed text-[#525A55]">{request.evidenceNotes}</p>
            {request.reviewerNote && (
              <div className="mt-4 rounded-xl border border-[#E7E8E1] bg-white/70 p-4 text-sm text-[#525A55]">
                <strong className="text-[#171916]">Reviewer note: </strong>{request.reviewerNote}
              </div>
            )}
            <Button variant="secondary" size="sm" className="mt-5" onClick={() => setRetryKey((value) => value + 1)}>
              Check status
            </Button>
            {requestPending && <p className="mt-3 text-xs text-[#777A72]">This request is waiting for a manual review.</p>}
          </section>
        ) : null}

        {!isLoading && kind && !requestPending && !requestApproved && (
          <section className="peer-card-glass mt-7 p-5 sm:p-7" aria-labelledby="submit-request-title">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#E3F4EB] text-[#123D30]">
                {kind === 'student' ? <GraduationCap className="h-5 w-5" /> : <FileCheck2 className="h-5 w-5" />}
              </div>
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.14em] text-[#08A876]">Manual review request</p>
                <h2 id="submit-request-title" className="text-lg font-black text-[#171916]">
                  {kind === 'student' ? 'Student identity' : 'Business identity'}
                </h2>
              </div>
            </div>

            <form onSubmit={(event) => void submitRequest(event)} className="mt-6 space-y-4">
              <div>
                <label htmlFor="institution-company" className="block text-sm font-bold text-[#171916]">
                  {kind === 'student' ? 'College or university' : 'Company or organization'}
                </label>
                <input
                  id="institution-company"
                  required
                  minLength={2}
                  maxLength={200}
                  value={institutionOrCompany}
                  onChange={(event) => setInstitutionOrCompany(event.target.value)}
                  className="mt-1.5 w-full rounded-xl border border-[#E7E8E1] bg-white px-3.5 py-3 text-sm outline-none focus:border-[#08C58A] focus:ring-2 focus:ring-[#08C58A]/20"
                />
              </div>

              <div>
                <label htmlFor="official-email" className="block text-sm font-bold text-[#171916]">Official email you want reviewed</label>
                <input
                  id="official-email"
                  type="email"
                  required
                  maxLength={320}
                  value={officialEmail}
                  onChange={(event) => setOfficialEmail(event.target.value)}
                  className="mt-1.5 w-full rounded-xl border border-[#E7E8E1] bg-white px-3.5 py-3 text-sm outline-none focus:border-[#08C58A] focus:ring-2 focus:ring-[#08C58A]/20"
                />
                <p className="mt-1 text-xs text-[#777A72]">Entering an address does not prove ownership or grant a badge.</p>
              </div>

              <div>
                <label htmlFor="evidence-notes" className="block text-sm font-bold text-[#171916]">Context for the reviewer</label>
                <textarea
                  id="evidence-notes"
                  required
                  minLength={10}
                  maxLength={5000}
                  rows={5}
                  value={evidenceNotes}
                  onChange={(event) => setEvidenceNotes(event.target.value)}
                  placeholder="Explain your affiliation or business relationship and where a reviewer can confirm it. Do not paste passwords or sensitive identity numbers."
                  className="mt-1.5 w-full rounded-xl border border-[#E7E8E1] bg-white px-3.5 py-3 text-sm outline-none focus:border-[#08C58A] focus:ring-2 focus:ring-[#08C58A]/20"
                />
              </div>

              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? 'Submitting…' : 'Submit for manual review'}
              </Button>
            </form>
          </section>
        )}
      </main>
    </div>
  )
}
