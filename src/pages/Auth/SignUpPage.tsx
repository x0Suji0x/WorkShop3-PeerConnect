import { Link, useSearchParams } from 'react-router-dom'
import {
  ArrowRight,
  Users,
  Compass,
  Trophy,
  Briefcase,
  ShieldCheck,
  CheckCircle2,
} from 'lucide-react'
import { Button } from '../../components/common/Button'
import { Badge } from '../../components/common/Badge'
import { parseSignupRole } from '../../lib/signupRole'

export function SignUpPage() {
  const [searchParams] = useSearchParams()
  const selectedRole = parseSignupRole(searchParams.get('role'))

  return (
    <div className="peer-page-surface min-h-[calc(100vh-80px)] relative overflow-hidden">
      {/* Ambient lighting glows identical to home page */}
      <div className="peer-ambient-glow peer-glow-gold -top-24 -left-24 h-96 w-96" />
      <div className="peer-ambient-glow peer-glow-rose top-1/4 -right-24 h-96 w-96" />
      <div className="peer-ambient-glow peer-glow-mint -bottom-24 left-1/3 h-96 w-96" />
      <div className="pointer-events-none absolute inset-0 bg-grid-pattern opacity-30 -z-0" />

      <div className="relative z-10 mx-auto flex min-h-[calc(100vh-80px)] max-w-7xl flex-col justify-center px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-12">
          {/* Left Column: Sign-up Cards & Entry */}
          <div className="space-y-8 lg:col-span-6">
            <div>
              <div className="peer-eyebrow-pill mb-4">
                <span className="dot" aria-hidden="true" />
                JOIN PEERCONNECT
              </div>
              <h1 className="text-3xl font-black tracking-tight text-[#171916] sm:text-4xl lg:text-5xl leading-[1.12]">
                Your journey starts here, with <em className="font-serif italic font-normal text-[#16845f]">meaningful work.</em>
              </h1>
              <p className="mt-4 text-sm leading-relaxed text-[#525A55] sm:text-base">
                Build your verified professional identity, showcase proven skills, and discover campus opportunities, hackathon squads, and client projects.
              </p>
            </div>

            {/* Path Selection Cards */}
            <div className="space-y-4">
              {/* Student Onboarding Option (Primary) */}
              <Link
                to="/signup/student"
                className="peer-card-glass peer-card-glow-mint group relative block rounded-3xl border-2 border-[#08C58A]/50 bg-gradient-to-br from-white/95 to-[#FFFDF9]/90 p-6 sm:p-7 shadow-sm transition-all duration-200 hover:-translate-y-1 hover:border-[#08C58A] hover:shadow-xl"
              >
                <div className="flex items-start justify-between gap-4 relative z-10">
                  <div className="flex items-start gap-4">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-[#123D30] text-[#08C58A] shadow-xs transition-transform group-hover:scale-105">
                      <Users className="h-6 w-6" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h2 className="text-lg font-bold text-[#171916]">
                          I am a Student / Creator
                        </h2>
                        <Badge variant="green" size="sm">
                          {selectedRole === 'student' ? 'Selected' : 'Recommended'}
                        </Badge>
                      </div>
                      <p className="mt-1 text-xs leading-relaxed text-[#525A55] sm:text-sm">
                        Create your verified student profile, discover interest communities, join hackathon teams, and apply for paid work.
                      </p>
                      <div className="mt-3 flex flex-wrap gap-2 text-[11px] font-semibold text-[#123D30]">
                        <span className="rounded-md bg-[#E3F4EB] px-2 py-0.5">• Free verified student account</span>
                        <span className="rounded-md bg-[#E3F4EB] px-2 py-0.5">• AI Squad Matchmaking</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#E3F4EB] text-[#123D30] group-hover:bg-[#08C58A] group-hover:text-[#0A261D] transition-colors shadow-2xs">
                    <ArrowRight className="h-4 w-4" />
                  </div>
                </div>
              </Link>

              {/* Client / Business Option */}
              <div className={`peer-card-glass peer-card-glow-gold rounded-2xl border p-5 sm:p-6 transition-all hover:-translate-y-0.5 ${selectedRole === 'employer' ? 'border-[#9A6A24]/60 ring-2 ring-[#9A6A24]/15' : 'border-[rgba(91,112,96,0.18)]'}`}>
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between relative z-10">
                  <div className="flex items-center gap-3">
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#FBF0DC] text-[#9A6A24] border border-[#9A6A24]/15">
                      <Briefcase className="h-5 w-5" />
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-[#171916]">
                        Looking to hire students or post project briefs?
                      </h3>
                      {selectedRole === 'employer' && <Badge variant="peach" size="sm">Selected</Badge>}
                      <p className="text-xs text-[#525A55]">
                        Discover pre-vetted campus talent across design, engineering, and AI.
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 self-end sm:self-auto shrink-0">
                    <Link
                      to="/signin?role=client"
                      className="rounded-full border border-[#CBD5E1] bg-white px-3.5 py-1.5 text-xs font-semibold text-[#171916] hover:bg-gray-50 transition-colors shadow-2xs"
                    >
                      Client Sign In
                    </Link>
                    <Link
                      to="/signin?role=client&mode=register"
                      className="rounded-full bg-[#123D30] px-3.5 py-1.5 text-xs font-semibold text-white hover:bg-[#0E3127] transition-colors shadow-2xs"
                    >
                      Register Company
                    </Link>
                  </div>
                </div>
              </div>
            </div>

            {/* Existing User & Legal Links */}
            <div className="peer-divider-fade-t pt-6 space-y-3">
              <p className="text-sm text-[#525A55]">
                Already have a PeerConnect account?{' '}
                <Link
                  to="/signin"
                  className="font-bold text-[#08A876] transition-colors hover:text-[#06805a]"
                >
                  Sign in here
                </Link>
              </p>
              <p className="text-xs text-[#777A72] leading-relaxed">
                By registering, you agree to PeerConnect's{' '}
                <a href="#terms" className="underline hover:text-[#171916]">
                  Terms of Service
                </a>{' '}
                and{' '}
                <a href="#privacy" className="underline hover:text-[#171916]">
                  Privacy Policy
                </a>
                . Personal contact info is strictly confidential.
              </p>
            </div>
          </div>

          {/* Right Column: Visual Narrative Showcase matching How It Works / Dark CTA */}
          <div className="lg:col-span-6">
            <div className="relative overflow-hidden rounded-3xl border border-white/15 bg-gradient-to-br from-[#123D30] via-[#0E362A] to-[#0A261D] p-8 text-white shadow-2xl sm:p-10">
              {/* Internal glow orb and grid */}
              <div className="pointer-events-none absolute -top-20 -right-20 h-64 w-64 rounded-full bg-[#08C58A]/20 blur-[80px]" />
              <div className="pointer-events-none absolute inset-0 bg-grid-pattern-dark opacity-20 -z-0" />

              <div className="relative z-10 space-y-6">
                <div className="inline-flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3.5 py-1 text-xs font-semibold text-[#08C58A] backdrop-blur-xs">
                  <ShieldCheck className="h-3.5 w-3.5" />
                  India's Dedicated Student Talent Network
                </div>

                <h2 className="text-2xl font-black sm:text-3xl leading-snug">
                  More than just a profile. An ecosystem built for ambition.
                </h2>

                <p className="text-sm leading-relaxed text-emerald-100/80">
                  Connect your campus presence with genuine work, collaborative hackathon squads, and industry projects.
                </p>

                {/* Feature highlights with glassmorphic cards */}
                <div className="space-y-3 pt-2">
                  <div className="flex items-start gap-3 rounded-2xl bg-white/5 p-3.5 backdrop-blur-sm border border-white/10 hover:bg-white/10 transition-colors">
                    <Compass className="h-5 w-5 shrink-0 text-[#08C58A]" />
                    <div>
                      <h4 className="text-xs font-bold text-white">12 Interest Communities</h4>
                      <p className="mt-0.5 text-xs text-white/70">
                        Join active student circles in AI/ML, Web Dev, UI/UX, Robotics, Space Tech, and Cybersecurity.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 rounded-2xl bg-white/5 p-3.5 backdrop-blur-sm border border-white/10 hover:bg-white/10 transition-colors">
                    <Trophy className="h-5 w-5 shrink-0 text-[#08C58A]" />
                    <div>
                      <h4 className="text-xs font-bold text-white">AI Team Finder & Matchmaker</h4>
                      <p className="mt-0.5 text-xs text-white/70">
                        Get matched with student collaborators whose skillsets directly complement your project requirements.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 rounded-2xl bg-white/5 p-3.5 backdrop-blur-sm border border-white/10 hover:bg-white/10 transition-colors">
                    <CheckCircle2 className="h-5 w-5 shrink-0 text-[#08C58A]" />
                    <div>
                      <h4 className="text-xs font-bold text-white">Campus-Verified Credibility</h4>
                      <p className="mt-0.5 text-xs text-white/70">
                        Institutional email verification and portfolio ownership that signals trust to employers.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="pt-2">
                  <Link to="/signup/student">
                    <Button variant="primary" size="lg" className="w-full shadow-md">
                      Start Student Registration
                      <ArrowRight className="h-4 w-4 ml-2" />
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
