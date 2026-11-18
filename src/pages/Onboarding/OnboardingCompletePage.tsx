import { Link } from 'react-router-dom'
import {
  CheckCircle2,
  Sparkles,
  ArrowRight,
  Users,
  LayoutDashboard,
} from 'lucide-react'
import { routes, communityRoutes, profileRoute } from '../../app/routes'
import { useStudentProfile } from '../../hooks/useStudentProfile'
import { calculateProfileCompletion } from '../../lib/profileCompletion'
import { Badge } from '../../components/common/Badge'

export function OnboardingCompletePage() {
  const { student } = useStudentProfile()

  const report = calculateProfileCompletion(student)
  const firstName = student.name.split(' ')[0] || 'Student'

  return (
    <div className="min-h-[calc(100vh-80px)] bg-[#FAF8F5] flex items-center justify-center px-4 py-12 sm:px-6 lg:px-8">
      <div className="w-full max-w-2xl space-y-8 text-center">
        {/* Celebration Emblem */}
        <div className="relative mx-auto flex h-20 w-20 items-center justify-center rounded-3xl bg-[#123D30] text-[#08C58A] shadow-lg">
          <CheckCircle2 className="h-10 w-10 stroke-[2.5]" />
          <span className="absolute -top-1 -right-1 flex h-6 w-6 items-center justify-center rounded-full bg-[#08C58A] text-[#0A261D] text-xs font-bold animate-bounce">
            ✨
          </span>
        </div>

        {/* Headings */}
        <div className="space-y-2">
          <Badge variant="green" size="md" className="font-bold">
            Registration Completed Successfully
          </Badge>
          <h1 className="text-3xl font-black text-[#171916] sm:text-4xl">
            Welcome to PeerConnect, {firstName}!
          </h1>
          <p className="text-base text-[#525A55] max-w-lg mx-auto font-medium">
            "Welcome to PeerConnect! Let's build something meaningful."
          </p>
        </div>

        {/* Profile Completion Analysis Card */}
        <div className="rounded-3xl border border-[#E7E8E1] bg-white p-6 sm:p-8 text-left shadow-sm space-y-5">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between border-b border-[#F2F1EA] pb-5">
            <div>
              <div className="flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-[#08C58A]" />
                <h3 className="text-sm font-bold uppercase tracking-wider text-[#123D30]">
                  Live Profile Completion
                </h3>
              </div>
              <p className="mt-1 text-xs text-[#525A55]">
                Calculated strictly from your completed profile data.
              </p>
            </div>
            <div className="flex items-baseline gap-1">
              <span className="text-3xl font-mono font-black text-[#08A876]">
                {report.percentage}%
              </span>
              <span className="text-xs text-[#777A72]">readiness</span>
            </div>
          </div>

          {/* Progress bar */}
          <div>
            <div className="h-2.5 w-full overflow-hidden rounded-full bg-[#E7E8E1]">
              <div
                className="h-full rounded-full bg-[#08C58A] transition-all duration-700"
                style={{ width: `${report.percentage}%` }}
              />
            </div>
          </div>

          {/* Intelligent Recommendation */}
          <div className="rounded-2xl border border-emerald-200 bg-emerald-50/60 p-4 text-xs text-[#123D30]">
            <span className="font-bold">Suggested Next Step: </span>
            <span className="text-[#333735]">{report.nextStepRecommendation}</span>
          </div>

          {/* Missing fields breakdown (if any) */}
          {report.missingItems.length > 0 && (
            <div className="space-y-2 pt-1">
              <span className="text-xs font-bold text-[#171916]">
                Remaining items to reach 100%:
              </span>
              <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                {report.missingItems.slice(0, 4).map((item) => (
                  <div
                    key={item.key}
                    className="flex items-center justify-between rounded-xl bg-[#FAF8F5] border border-[#E7E8E1] px-3 py-2 text-xs"
                  >
                    <span className="text-[#525A55] font-medium">{item.label}</span>
                    <span className="font-mono text-[11px] font-bold text-[#08A876]">
                      +{item.impact}%
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Next Step Action Cards */}
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <Link
            to={routes.dashboard}
            className="flex items-center justify-between rounded-2xl bg-[#123D30] p-4 text-left text-white shadow-sm hover:bg-[#0E3127] transition-all group"
          >
            <div className="flex items-center gap-3">
              <LayoutDashboard className="h-5 w-5 text-[#08C58A]" />
              <div>
                <h4 className="text-sm font-bold">Open Student Dashboard</h4>
                <p className="text-[11px] text-emerald-100/75">Monitor projects and notifications</p>
              </div>
            </div>
            <ArrowRight className="h-4 w-4 text-[#08C58A] group-hover:translate-x-1 transition-transform" />
          </Link>

          <Link
            to={profileRoute(student.id)}
            className="flex items-center justify-between rounded-2xl border border-[#E7E8E1] bg-white p-4 text-left shadow-2xs hover:border-[#171916] transition-all group"
          >
            <div className="flex items-center gap-3">
              <Users className="h-5 w-5 text-[#08C58A]" />
              <div>
                <h4 className="text-sm font-bold text-[#171916]">View Public Profile</h4>
                <p className="text-[11px] text-[#525A55]">See how peers and clients view you</p>
              </div>
            </div>
            <ArrowRight className="h-4 w-4 text-[#525A55] group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {/* Quick discovery links */}
        <div className="flex flex-wrap items-center justify-center gap-4 text-xs font-semibold text-[#525A55]">
          <Link to={communityRoutes.communities} className="hover:text-[#08C58A] transition-colors">
            Explore 12 Communities →
          </Link>
          <span>•</span>
          <Link to={communityRoutes.teamFinder} className="hover:text-[#08C58A] transition-colors">
            Find Teammates →
          </Link>
          <span>•</span>
          <Link to={routes.verification} className="hover:text-[#08C58A] transition-colors">
            Verification Centre →
          </Link>
        </div>
      </div>
    </div>
  )
}
