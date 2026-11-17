import { ArrowRight, BriefcaseBusiness, CheckCircle2, Eye, FileText, ShieldCheck, Sparkles, UserRoundCheck } from 'lucide-react'
import { Link } from 'react-router-dom'
import { profileRoute, routes } from '../../app/routes'
import { Badge } from '../../components/common/Badge'
import { Button } from '../../components/common/Button'
import { Card } from '../../components/common/Card'
import { PageHeading } from '../../components/common/PageHeading'
import { dashboardNotifications, demoStudent, recommendedProjects } from '../../data/studentMockData'

const stats = [
  { label: 'Projects completed', value: demoStudent.projectsCompleted, icon: CheckCircle2, detail: 'Across paid and campus work' },
  { label: 'Active projects', value: demoStudent.activeProjects, icon: BriefcaseBusiness, detail: 'In progress right now' },
  { label: 'Applications sent', value: demoStudent.applicationsSent, icon: FileText, detail: '2 awaiting a response' },
  { label: 'Profile views', value: demoStudent.profileViews, icon: Eye, detail: 'In the last 30 days' },
]

export function StudentDashboardPage() {
  const firstName = demoStudent.name.split(' ')[0]

  return (
    <div className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 sm:py-10 lg:px-8">
      <PageHeading
        eyebrow="Student dashboard"
        title={`Good to see you, ${firstName}.`}
        description="A focused view of your profile, opportunities, and collaboration activity."
        actions={
          <Link to={profileRoute(demoStudent.id)}>
            <Button size="sm">View profile <ArrowRight className="h-3.5 w-3.5" /></Button>
          </Link>
        }
      />

      <section className="mt-7 grid grid-cols-1 gap-5 lg:grid-cols-12">
        <Card className="overflow-hidden lg:col-span-7" padding="none">
          <div className="border-b border-[#E7E8E1] bg-[#F7F6F0] px-5 py-5 sm:px-6">
            <div className="flex items-start justify-between gap-4">
              <div>
                <div className="flex items-center gap-2">
                  <Sparkles className="h-4 w-4 text-[#08C58A]" />
                  <p className="text-xs font-bold uppercase tracking-[0.14em] text-[#123D30]">Profile momentum</p>
                </div>
                <h2 className="mt-2 text-xl font-black text-[#171916]">Your profile is {demoStudent.profileCompletion}% complete</h2>
                <p className="mt-1 text-sm leading-relaxed text-[#777A72]">Add a little more context to help project owners understand your strengths faster.</p>
              </div>
              <span className="font-mono text-2xl font-black text-[#08A876]">{demoStudent.profileCompletion}%</span>
            </div>
            <div className="mt-5 h-2 overflow-hidden rounded-full bg-[#E7E8E1]">
              <div className="h-full rounded-full bg-[#08C58A]" style={{ width: `${demoStudent.profileCompletion}%` }} />
            </div>
          </div>
          <div className="grid grid-cols-1 gap-4 p-5 sm:grid-cols-3 sm:p-6">
            <div className="rounded-xl border border-[#E7E8E1] p-3.5">
              <ShieldCheck className="h-4 w-4 text-[#08A876]" />
              <p className="mt-3 text-sm font-bold text-[#171916]">Verification</p>
              <p className="mt-1 text-xs leading-relaxed text-[#777A72]">2 demo checks pending</p>
            </div>
            <div className="rounded-xl border border-[#E7E8E1] p-3.5">
              <UserRoundCheck className="h-4 w-4 text-[#08A876]" />
              <p className="mt-3 text-sm font-bold text-[#171916]">Availability</p>
              <p className="mt-1 text-xs leading-relaxed text-[#777A72]">Open to paid projects</p>
            </div>
            <Link to={routes.verification} className="rounded-xl bg-[#123D30] p-3.5 text-white transition hover:bg-[#0E3127]">
              <p className="text-sm font-bold">Strengthen trust</p>
              <p className="mt-1 text-xs leading-relaxed text-emerald-100/75">Review demo verification states <ArrowRight className="inline h-3 w-3" /></p>
            </Link>
          </div>
        </Card>

        <Card className="lg:col-span-5" padding="lg">
          <p className="text-xs font-bold uppercase tracking-[0.14em] text-[#08A876]">Student Plus</p>
          <h2 className="mt-2 text-xl font-black text-[#171916]">Be easier to discover.</h2>
          <p className="mt-2 text-sm leading-relaxed text-[#777A72]">A proposed ₹99/month plan for a more visible profile and practical insight into opportunity interest.</p>
          <ul className="mt-5 space-y-2.5 text-sm text-[#171916]">
            {['Featured profile placement', 'Plus profile badge', 'Profile-view analytics', 'Project-interest analytics'].map((benefit) => (
              <li key={benefit} className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-[#08C58A]" />{benefit}</li>
            ))}
          </ul>
          <Button variant="dark" className="mt-6 w-full">Explore Student Plus · ₹99/month</Button>
          <p className="mt-2 text-center text-[11px] text-[#777A72]">Demo interface only — no payment is collected.</p>
        </Card>
      </section>

      <section className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-4 sm:gap-5">
        {stats.map(({ label, value, icon: Icon, detail }) => (
          <Card key={label} padding="sm" className="sm:p-5">
            <Icon className="h-4 w-4 text-[#08A876]" />
            <p className="mt-4 font-mono text-2xl font-black text-[#171916]">{value}</p>
            <p className="mt-1 text-sm font-bold text-[#171916]">{label}</p>
            <p className="mt-1 hidden text-xs leading-relaxed text-[#777A72] sm:block">{detail}</p>
          </Card>
        ))}
      </section>

      <section className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-12">
        <div className="lg:col-span-7">
          <div className="mb-4 flex items-center justify-between"><div><p className="text-lg font-black text-[#171916]">Recommended for you</p><p className="mt-0.5 text-sm text-[#777A72]">Based on your demo skills and interests</p></div><Link to={routes.projects} className="text-sm font-bold text-[#123D30] hover:text-[#08A876]">Browse all</Link></div>
          <div className="space-y-3">
            {recommendedProjects.map((project) => (
              <Card key={project.id} className="group" padding="md">
                <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-start">
                  <div><p className="text-xs font-semibold text-[#777A72]">{project.organization}</p><h3 className="mt-1 text-base font-black text-[#171916] group-hover:text-[#08A876]">{project.title}</h3><div className="mt-3 flex flex-wrap gap-1.5">{project.skills.map((skill) => <Badge key={skill} size="sm" variant="neutral">{skill}</Badge>)}</div></div>
                  <div className="flex items-center justify-between gap-4 sm:block sm:text-right"><p className="font-mono text-base font-black text-[#171916]">{project.budget}</p><Link to={routes.projects} className="mt-2 inline-flex text-xs font-bold text-[#123D30] hover:text-[#08A876]">See opportunity <ArrowRight className="ml-1 h-3 w-3" /></Link></div>
                </div>
              </Card>
            ))}
          </div>
        </div>
        <div className="lg:col-span-5">
          <div className="mb-4"><p className="text-lg font-black text-[#171916]">Recent notifications</p><p className="mt-0.5 text-sm text-[#777A72]">Updates around your PeerConnect activity</p></div>
          <Card padding="none"><div className="divide-y divide-[#E7E8E1]">{dashboardNotifications.map((notification) => <div key={notification.id} className="flex gap-3 p-5"><span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-[#08C58A]" /><div><p className="text-sm font-semibold leading-relaxed text-[#171916]">{notification.title}</p><p className="mt-1 text-xs text-[#777A72]">{notification.time}</p></div></div>)}</div></Card>
        </div>
      </section>
    </div>
  )
}
