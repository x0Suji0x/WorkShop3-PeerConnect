import { Building2, CheckCircle2, Clock3, FileCheck2, GraduationCap, Phone, ShieldCheck, UserRoundCheck } from 'lucide-react'
import { Badge } from '../../components/common/Badge'
import { Button } from '../../components/common/Button'
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
  pending: { label: 'Under Review', badge: 'peach', icon: Clock3 },
  unverified: { label: 'Not Verified', badge: 'neutral', icon: ShieldCheck },
}

export function VerificationPage() {
  const { student } = useStudentProfile()

  return (
    <div className="peer-page-surface min-h-[calc(100vh-80px)] relative overflow-hidden pb-16">
      <div className="peer-ambient-glow peer-glow-gold -top-24 -left-24 h-96 w-96 pointer-events-none" />
      <div className="peer-ambient-glow peer-glow-rose top-1/4 -right-24 h-96 w-96 pointer-events-none" />
      <div className="peer-ambient-glow peer-glow-mint -bottom-24 left-1/3 h-96 w-96 pointer-events-none" />
      <div className="pointer-events-none absolute inset-0 bg-grid-pattern opacity-30 -z-0" />

      <div className="relative z-10 mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 sm:py-10 lg:px-8">
        <PageHeading
          eyebrow="Student profile"
          title="Verification Centre"
          description="Verified trust signals help clients, startup founders, and teammates identify top performers with confidence."
        />

        <div className="mt-7 rounded-2xl border border-[#08C58A]/30 bg-[#E3F4EB]/80 p-5 text-[#123D30] shadow-xs">
          <div className="flex gap-3.5">
            <ShieldCheck className="mt-0.5 h-6 w-6 shrink-0 text-[#08A876]" />
            <div>
              <p className="font-bold text-sm">Identity & Credential Verification</p>
              <p className="mt-1 text-xs sm:text-sm leading-relaxed text-[#525A55]">
                PeerConnect cross-verifies institutional email addresses, student identity registries, and active GitHub/Figma portfolio ownership to give you verified status across all marketplace listings.
              </p>
            </div>
          </div>
        </div>

        <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
          {student.verifications.map((verification) => (
            <VerificationCard key={verification.id} verification={verification} />
          ))}
        </div>

        <div className="peer-card-glass mt-8 border-[rgba(8,197,138,0.3)] bg-gradient-to-r from-[#123D30] via-[#0D2D24] to-[#171916] p-6 text-white shadow-md sm:p-8 rounded-3xl">
          <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-center">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.14em] text-[#08C58A]">
                Trust & Security
              </p>
              <h2 className="mt-2 text-xl font-black">All verifications are authenticated</h2>
              <p className="mt-2 max-w-2xl text-sm leading-relaxed text-emerald-100/75">
                Institutional records and identity proofs are encrypted with end-to-end access controls. Verified profiles receive 3x more discovery views from project owners and hackathon squads.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function VerificationCard({ verification }: { verification: Verification }) {
  const Icon = verificationVisuals[verification.type]
  const status = statusDetails[verification.status]
  const StatusIcon = status.icon

  return (
    <div className="peer-card-glass p-5 hover:-translate-y-1 transition-all duration-200">
      <div className="flex items-start justify-between gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#E3F4EB] text-[#123D30]">
          <Icon className="h-5 w-5" />
        </div>
        <Badge variant={status.badge} size="sm">
          <StatusIcon className="h-3 w-3" />
          {status.label}
        </Badge>
      </div>
      <h2 className="mt-5 text-base font-black text-[#171916]">{verification.label}</h2>
      <p className="mt-2 min-h-12 text-sm leading-relaxed text-[#777A72]">{verification.description}</p>
      {verification.status === 'verified' ? (
        <div className="mt-5 flex items-center justify-center gap-1.5 rounded-xl bg-[#E3F4EB] py-2 text-xs font-bold text-[#08A876]">
          <CheckCircle2 className="h-4 w-4" />
          Verified Credential
        </div>
      ) : verification.status === 'pending' ? (
        <Button variant="outline" size="sm" className="mt-5 w-full text-amber-700 border-amber-300 bg-amber-50/50">
          Under Review
        </Button>
      ) : (
        <Button variant="outline" size="sm" className="mt-5 w-full">
          Start Verification
        </Button>
      )}
    </div>
  )
}
