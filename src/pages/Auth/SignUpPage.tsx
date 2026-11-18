import { Link } from 'react-router-dom'
import {
  ArrowRight,
  Sparkles,
  Users,
  Compass,
  Trophy,
  Briefcase,
  ShieldCheck,
  CheckCircle2,
} from 'lucide-react'
import { routes } from '../../app/routes'
import { Button } from '../../components/common/Button'
import { Badge } from '../../components/common/Badge'

export function SignUpPage() {
  return (
    <div className="min-h-[calc(100vh-80px)] bg-[#FAF8F5]">
      <div className="mx-auto flex min-h-[calc(100vh-80px)] max-w-7xl flex-col justify-center px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-12">
          {/* Left Column: Sign-up Cards & Entry */}
          <div className="space-y-8 lg:col-span-6">
            <div>
              <div className="flex items-center gap-2">
                <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#E3F4EB] text-[#08C58A]">
                  <Sparkles className="h-4 w-4" />
                </span>
                <p className="text-xs font-bold uppercase tracking-[0.14em] text-[#08A876]">
                  Join PeerConnect
                </p>
              </div>
              <h1 className="mt-3 text-3xl font-black tracking-tight text-[#171916] sm:text-4xl lg:text-5xl">
                Your journey starts here.
              </h1>
              <p className="mt-3 text-sm leading-relaxed text-[#525A55] sm:text-base">
                Build your professional identity, showcase your skills, and discover campus opportunities, hackathon squads, and client projects.
              </p>
            </div>

            {/* Path Selection Cards */}
            <div className="space-y-4">
              {/* Student Onboarding Option (Primary) */}
              <Link
                to="/signup/student"
                className="group relative block rounded-2xl border-2 border-[#08C58A] bg-white p-6 shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md"
              >
                <div className="flex items-start justify-between gap-4">
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
                          Recommended
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
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#E3F4EB] text-[#123D30] group-hover:bg-[#08C58A] group-hover:text-[#0A261D] transition-colors">
                    <ArrowRight className="h-4 w-4" />
                  </div>
                </div>
              </Link>

              {/* Client / Business Option */}
              <div className="rounded-2xl border border-[#E7E8E1] bg-[#F7F6F0] p-5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white text-[#525A55] border border-[#E7E8E1]">
                      <Briefcase className="h-5 w-5" />
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-[#171916]">
                        Looking to hire students or post project briefs?
                      </h3>
                      <p className="text-xs text-[#525A55]">
                        Discover pre-vetted campus talent across design, engineering, and AI.
                      </p>
                    </div>
                  </div>
                  <Link
                    to={routes.dashboard}
                    className="shrink-0 rounded-full border border-[#E7E8E1] bg-white px-3.5 py-1.5 text-xs font-semibold text-[#171916] hover:bg-gray-50"
                  >
                    Client Hub
                  </Link>
                </div>
              </div>
            </div>

            {/* Existing User & Legal Links */}
            <div className="border-t border-[#E7E8E1] pt-6 space-y-3">
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

          {/* Right Column: Visual Narrative Showcase */}
          <div className="lg:col-span-6">
            <div className="relative overflow-hidden rounded-3xl border border-[#E7E8E1] bg-gradient-to-br from-[#123D30] to-[#0A261D] p-8 text-white shadow-xl sm:p-10">
              <div className="space-y-6">
                <div className="inline-flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3.5 py-1 text-xs font-semibold text-[#08C58A]">
                  <ShieldCheck className="h-3.5 w-3.5" />
                  India's Dedicated Student Talent Network
                </div>

                <h2 className="text-2xl font-black sm:text-3xl">
                  More than just a profile. An ecosystem built for ambition.
                </h2>

                <p className="text-sm leading-relaxed text-emerald-100/80">
                  Connect your campus presence with genuine work, collaborative hackathon squads, and industry projects.
                </p>

                {/* Feature highlights */}
                <div className="space-y-3 pt-2">
                  <div className="flex items-start gap-3 rounded-2xl bg-white/5 p-3.5 backdrop-blur-xs border border-white/10">
                    <Compass className="h-5 w-5 shrink-0 text-[#08C58A]" />
                    <div>
                      <h4 className="text-xs font-bold text-white">12 Interest Communities</h4>
                      <p className="mt-0.5 text-xs text-white/70">
                        Join active student circles in AI/ML, Web Dev, UI/UX, Robotics, Space Tech, and Cybersecurity.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 rounded-2xl bg-white/5 p-3.5 backdrop-blur-xs border border-white/10">
                    <Trophy className="h-5 w-5 shrink-0 text-[#08C58A]" />
                    <div>
                      <h4 className="text-xs font-bold text-white">AI Team Finder & Matchmaker</h4>
                      <p className="mt-0.5 text-xs text-white/70">
                        Get matched with student collaborators whose skillsets directly complement your project requirements.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 rounded-2xl bg-white/5 p-3.5 backdrop-blur-xs border border-white/10">
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
                    <Button variant="primary" size="lg" className="w-full">
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
