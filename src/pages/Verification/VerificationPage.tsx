import { Building2, CheckCircle2, Clock3, FileCheck2, GraduationCap, Phone, ShieldCheck, UserRoundCheck } from 'lucide-react'
import { Badge } from '../../components/common/Badge'
import { Button } from '../../components/common/Button'
import { Card } from '../../components/common/Card'
import { PageHeading } from '../../components/common/PageHeading'
import { useStudentProfile } from '../../hooks/useStudentProfile'
import type { Verification, VerificationStatus, VerificationType } from '../../types'

const verificationVisuals: Record<VerificationType, typeof ShieldCheck> = {
  college_identity: GraduationCap,
  phone_number: Phone,
  experience: Building2,
  skills: UserRoundCheck,
  portfolio_ownership: FileCheck2,
}

const statusDetails: Record<VerificationStatus, { label: string; badge: 'green' | 'peach' | 'neutral'; icon: typeof CheckCircle2 }> = {
  verified: { label: 'Verified', badge: 'green', icon: CheckCircle2 },
  pending: { label: 'Pending demo review', badge: 'peach', icon: Clock3 },
  unverified: { label: 'Not verified', badge: 'neutral', icon: ShieldCheck },
}

export function VerificationPage() {
  const { student } = useStudentProfile()

  return (
    <div className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 sm:py-10 lg:px-8">
      <PageHeading eyebrow="Student profile" title="Verification centre" description="Verification signals will help collaborators make informed decisions. Until a backend service is connected, every status below is explicitly a demo state." />
      <div className="mt-7 rounded-2xl border border-amber-200 bg-amber-50 p-5 text-amber-950"><div className="flex gap-3"><ShieldCheck className="mt-0.5 h-5 w-5 shrink-0" /><div><p className="font-bold">No genuine verification is represented here.</p><p className="mt-1 text-sm leading-relaxed">Actions are disabled placeholders. They do not upload documents, send an OTP, or confirm identity, experience, skills, or portfolio ownership.</p></div></div></div>
      <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">{student.verifications.map((verification) => <VerificationCard key={verification.id} verification={verification} />)}</div>
      <Card className="mt-6 bg-[#123D30] text-white" padding="lg"><div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-center"><div><p className="text-xs font-bold uppercase tracking-[0.14em] text-[#08C58A]">Future integration</p><h2 className="mt-2 text-xl font-black">What a real verification flow needs</h2><p className="mt-2 max-w-2xl text-sm leading-relaxed text-emerald-100/75">Consent, evidence storage, provider responses, review timestamps, and a visible audit trail. Keep status changes server-authoritative when authentication is introduced.</p></div><Button variant="secondary" className="shrink-0">Verification requirements</Button></div></Card>
    </div>
  )
}

function VerificationCard({ verification }: { verification: Verification }) {
  const Icon = verificationVisuals[verification.type]
  const status = statusDetails[verification.status]
  const StatusIcon = status.icon
  return <Card padding="md"><div className="flex items-start justify-between gap-3"><div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#E3F4EB] text-[#123D30]"><Icon className="h-5 w-5" /></div><Badge variant={status.badge} size="sm"><StatusIcon className="h-3 w-3" />{status.label}</Badge></div><h2 className="mt-5 text-base font-black text-[#171916]">{verification.label}</h2><p className="mt-2 min-h-12 text-sm leading-relaxed text-[#777A72]">{verification.description}</p><Button disabled variant="outline" size="sm" className="mt-5 w-full">Verification unavailable in demo</Button></Card>
}
