import { useState } from 'react'
import { Award, BriefcaseBusiness, Check, Code2, ExternalLink, GraduationCap, Landmark, Link2, Pencil, Plus, ShieldAlert, Sparkles, Trash2, UsersRound } from 'lucide-react'
import { Link, useParams } from 'react-router-dom'
import { routes } from '../../app/routes'
import { Badge } from '../../components/common/Badge'
import { Button } from '../../components/common/Button'
import { Card } from '../../components/common/Card'
import { Input } from '../../components/common/Input'
import { demoStudent } from '../../data/studentMockData'
import type { AvailabilityPreferences, Experience, Student } from '../../types'

const availabilityLabels: { key: keyof AvailabilityPreferences; label: string; description: string }[] = [
  { key: 'paidProjects', label: 'Paid projects', description: 'Show me paid collaboration opportunities' },
  { key: 'collaborators', label: 'Collaborators', description: 'Connect me with student builders' },
  { key: 'internships', label: 'Internships', description: 'Surface relevant internship roles' },
  { key: 'events', label: 'Events', description: 'Let organisers know I am available' },
]

export function StudentProfilePage() {
  const { profileId } = useParams()
  const [student, setStudent] = useState<Student>(demoStudent)
  const [isEditing, setIsEditing] = useState(false)
  const [newSkill, setNewSkill] = useState('')
  const [newExperience, setNewExperience] = useState({ role: '', organization: '' })

  const updateAvailability = (key: keyof AvailabilityPreferences) => {
    setStudent((current) => ({ ...current, availabilityPreferences: { ...current.availabilityPreferences, [key]: !current.availabilityPreferences[key] } }))
  }

  const addSkill = () => {
    const skill = newSkill.trim()
    if (!skill || student.skills.some((item) => item.name.toLowerCase() === skill.toLowerCase())) return
    setStudent((current) => ({ ...current, skills: [...current.skills, { name: skill, category: 'other' }] }))
    setNewSkill('')
  }

  const removeSkill = (skillName: string) => setStudent((current) => ({ ...current, skills: current.skills.filter((skill) => skill.name !== skillName) }))

  const addExperience = () => {
    if (!newExperience.role.trim() || !newExperience.organization.trim()) return
    const experience: Experience = { id: `exp-${Date.now()}`, role: newExperience.role.trim(), organization: newExperience.organization.trim(), type: 'work', startDate: 'Present', description: 'New experience — add more detail when your profile service is connected.' }
    setStudent((current) => ({ ...current, experiences: [experience, ...current.experiences] }))
    setNewExperience({ role: '', organization: '' })
  }

  const pendingCount = student.verifications.filter((verification) => verification.status !== 'verified').length

  return (
    <div className="bg-[#FAF8F5]">
      <div className="h-40 bg-cover bg-center sm:h-56" style={{ backgroundImage: `linear-gradient(90deg, rgba(18,61,48,.62), rgba(18,61,48,.14)), url(${student.coverImageUrl})` }} />
      <div className="mx-auto w-full max-w-7xl px-4 pb-10 sm:px-6 lg:px-8">
        <div className="relative -mt-16 border-b border-[#E7E8E1] pb-6 sm:-mt-20 sm:flex sm:items-end sm:justify-between sm:gap-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end">
            <img src={student.avatarUrl} alt={student.name} className="h-32 w-32 rounded-3xl border-4 border-[#FAF8F5] object-cover shadow-lg sm:h-36 sm:w-36" />
            <div className="pt-1 sm:pb-1"><div className="flex flex-wrap items-center gap-2"><h1 className="text-3xl font-black tracking-tight text-[#171916] sm:text-4xl">{student.name}</h1>{student.isPlusMember && <Badge>Plus</Badge>}</div><p className="mt-1 text-base font-semibold text-[#08A876]">{student.headline}</p><p className="mt-1 text-sm text-[#777A72]">{student.college} · {student.degree}, {student.graduationYear}</p></div>
          </div>
          <div className="mt-5 flex flex-wrap gap-2 sm:mt-0"><Link to={routes.dashboard}><Button variant="secondary" size="sm">Dashboard</Button></Link><Button size="sm" onClick={() => setIsEditing((value) => !value)}>{isEditing ? <><Check className="h-3.5 w-3.5" />Done editing</> : <><Pencil className="h-3.5 w-3.5" />Edit profile</>}</Button></div>
        </div>

        {profileId !== demoStudent.id && <p className="mt-4 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-xs leading-relaxed text-amber-900">Showing a local demo profile while profile data is not connected. Requested profile: {profileId}</p>}

        <div className="mt-7 grid grid-cols-1 gap-6 lg:grid-cols-12">
          <main className="space-y-6 lg:col-span-8">
            <Card><SectionTitle title="About" icon={Sparkles} /><p className="mt-4 text-sm leading-7 text-[#525A55]">{student.about}</p></Card>
            <Card>
              <SectionTitle title="Skills & interests" icon={Sparkles} />
              <div className="mt-4 flex flex-wrap gap-2">{student.skills.map((skill) => <span key={skill.name} className="inline-flex items-center gap-1 rounded-lg border border-[#E7E8E1] bg-[#F7F6F0] px-3 py-1.5 text-xs font-semibold text-[#171916]">{skill.name}{isEditing && <button type="button" onClick={() => removeSkill(skill.name)} className="ml-1 rounded text-[#777A72] hover:text-red-600" aria-label={`Remove ${skill.name}`}><Trash2 className="h-3 w-3" /></button>}</span>)}</div>
              <div className="mt-4 flex flex-wrap gap-2">{student.interests.map((interest) => <Badge key={interest} variant="green">{interest}</Badge>)}</div>
              {isEditing && <div className="mt-5 flex gap-2 border-t border-[#E7E8E1] pt-4"><Input value={newSkill} onChange={(event) => setNewSkill(event.target.value)} onKeyDown={(event) => { if (event.key === 'Enter') { event.preventDefault(); addSkill() } }} placeholder="Add a skill" aria-label="New skill" /><Button type="button" size="sm" onClick={addSkill}><Plus className="h-3.5 w-3.5" />Add</Button></div>}
            </Card>
            <Card>
              <SectionTitle title="Experience" icon={BriefcaseBusiness} />
              <div className="mt-5 space-y-5">{student.experiences.map((experience) => <article key={experience.id} className="border-l-2 border-[#08C58A]/40 pl-4"><div className="flex flex-wrap items-start justify-between gap-2"><div><h3 className="font-bold text-[#171916]">{experience.role}</h3><p className="mt-0.5 text-sm text-[#08A876]">{experience.organization}</p></div><Badge variant="neutral" size="sm">{experience.type}</Badge></div><p className="mt-1 text-xs text-[#777A72]">{experience.startDate}{experience.endDate ? ` – ${experience.endDate}` : ''}</p><p className="mt-2 text-sm leading-relaxed text-[#525A55]">{experience.description}</p></article>)}</div>
              {isEditing && <div className="mt-6 grid grid-cols-1 gap-3 border-t border-[#E7E8E1] pt-5 sm:grid-cols-[1fr_1fr_auto]"><Input value={newExperience.role} onChange={(event) => setNewExperience((current) => ({ ...current, role: event.target.value }))} placeholder="Role" aria-label="Experience role" /><Input value={newExperience.organization} onChange={(event) => setNewExperience((current) => ({ ...current, organization: event.target.value }))} placeholder="Organisation" aria-label="Experience organisation" /><Button type="button" size="sm" className="self-end" onClick={addExperience}><Plus className="h-3.5 w-3.5" />Add</Button></div>}
            </Card>
            <Card><SectionTitle title="Education" icon={GraduationCap} /><div className="mt-5 space-y-4">{student.education.map((education) => <div key={education.id}><h3 className="font-bold text-[#171916]">{education.institution}</h3><p className="mt-1 text-sm text-[#525A55]">{education.degree} · {education.fieldOfStudy}</p><p className="mt-1 text-xs text-[#777A72]">Class of {education.graduationYear}</p></div>)}</div></Card>
            <Card><SectionTitle title="Projects & portfolio" icon={Landmark} /><div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2">{student.portfolioProjects.map((project) => <div key={project.id} className="rounded-xl border border-[#E7E8E1] bg-[#F7F6F0] p-4"><h3 className="font-bold text-[#171916]">{project.name}</h3><p className="mt-2 text-xs leading-relaxed text-[#525A55]">{project.description}</p><div className="mt-3 flex flex-wrap gap-1.5">{project.skills.map((skill) => <Badge key={skill} variant="neutral" size="sm">{skill}</Badge>)}</div>{project.url && <a className="mt-4 inline-flex items-center gap-1 text-xs font-bold text-[#123D30] hover:text-[#08A876]" href={project.url} target="_blank" rel="noreferrer">View project <ExternalLink className="h-3 w-3" /></a>}</div>)}</div></Card>
            <Card><SectionTitle title="Certifications & achievements" icon={Award} /><div className="mt-5 space-y-3">{student.certifications.map((certification) => <div key={certification.id} className="flex items-center justify-between gap-4 rounded-xl bg-[#F7F6F0] p-3.5"><div><p className="text-sm font-bold text-[#171916]">{certification.name}</p><p className="mt-0.5 text-xs text-[#777A72]">{certification.issuer}</p></div><span className="text-xs font-mono text-[#777A72]">{certification.issuedOn}</span></div>)}</div></Card>
          </main>

          <aside className="space-y-6 lg:col-span-4">
            <Card><p className="text-xs font-bold uppercase tracking-[0.14em] text-[#08A876]">Availability</p><h2 className="mt-2 text-lg font-black text-[#171916]">How you want to participate</h2><div className="mt-4 space-y-3">{availabilityLabels.map((item) => <button type="button" key={item.key} onClick={() => updateAvailability(item.key)} className="flex w-full items-center justify-between gap-3 rounded-xl border border-[#E7E8E1] p-3 text-left transition hover:border-[#08C58A]/50"><span><span className="block text-sm font-bold text-[#171916]">{item.label}</span><span className="mt-0.5 block text-xs leading-relaxed text-[#777A72]">{item.description}</span></span><span className={`flex h-6 w-11 shrink-0 items-center rounded-full p-0.5 transition ${student.availabilityPreferences[item.key] ? 'bg-[#08C58A] justify-end' : 'bg-[#D8D6CE] justify-start'}`}><span className="h-5 w-5 rounded-full bg-white shadow-sm" /></span></button>)}</div></Card>
            <Card><div className="flex items-start justify-between gap-3"><div><p className="text-xs font-bold uppercase tracking-[0.14em] text-[#08A876]">Trust signals</p><h2 className="mt-2 text-lg font-black text-[#171916]">Verification</h2></div><ShieldAlert className="h-5 w-5 text-amber-500" /></div><p className="mt-2 text-sm leading-relaxed text-[#777A72]">{pendingCount} of {student.verifications.length} verification areas are demo states or awaiting review.</p><Link to={routes.verification} className="mt-4 inline-flex text-sm font-bold text-[#123D30] hover:text-[#08A876]">Review verification <ExternalLink className="ml-1 h-3.5 w-3.5" /></Link></Card>
            <Card><p className="text-xs font-bold uppercase tracking-[0.14em] text-[#08A876]">Links</p><div className="mt-4 space-y-3"><ProfileLink icon={Code2} label="GitHub" href={student.socialLinks.github} /><ProfileLink icon={Link2} label="LinkedIn" href={student.socialLinks.linkedin} /><ProfileLink icon={UsersRound} label="Behance" href={student.socialLinks.behance} /><ProfileLink icon={ExternalLink} label="Portfolio" href={student.socialLinks.portfolio} /></div></Card>
          </aside>
        </div>
      </div>
    </div>
  )
}

function SectionTitle({ title, icon: Icon }: { title: string; icon: typeof Sparkles }) {
  return <div className="flex items-center gap-2"><Icon className="h-4 w-4 text-[#08A876]" /><h2 className="text-lg font-black text-[#171916]">{title}</h2></div>
}

function ProfileLink({ icon: Icon, label, href }: { icon: typeof Code2; label: string; href?: string }) {
  if (!href) return null
  return <a href={href} target="_blank" rel="noreferrer" className="flex items-center justify-between text-sm font-semibold text-[#171916] transition hover:text-[#08A876]"><span className="flex items-center gap-2"><Icon className="h-4 w-4 text-[#777A72]" />{label}</span><ExternalLink className="h-3.5 w-3.5" /></a>
}
