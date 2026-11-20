import { useEffect, useState } from 'react'
import { Award, BriefcaseBusiness, Check, ExternalLink, GraduationCap, Landmark, Pencil, Plus, ShieldAlert, Sparkles, Trash2 } from 'lucide-react'
import { Link, useParams } from 'react-router-dom'
import { routes } from '../../app/routes'
import { Badge } from '../../components/common/Badge'
import { Button } from '../../components/common/Button'
import { Card } from '../../components/common/Card'
import { Input } from '../../components/common/Input'
import { LoadingState } from '../../components/common/LoadingState'
import { StudentProfilePublishToggle } from '../../components/profile/StudentProfilePublishToggle'
import { demoStudent } from '../../data/studentMockData'
import { getTalentSampleAsStudent } from '../../data/talentDirectoryMockData'
import { useStudentProfile } from '../../hooks/useStudentProfile'
import { supabaseStudentRepository } from '../../repositories/supabaseStudentRepository'
import type { AvailabilityPreferences, Experience, Student } from '../../types'

const availabilityLabels: { key: keyof AvailabilityPreferences; label: string; description: string }[] = [
  { key: 'paidProjects', label: 'Paid projects', description: 'Show me paid collaboration opportunities' },
  { key: 'collaborators', label: 'Collaborators', description: 'Connect me with student builders' },
  { key: 'internships', label: 'Internships', description: 'Surface relevant internship roles' },
  { key: 'events', label: 'Events', description: 'Let organisers know I am available' },
]

export function StudentProfilePage() {
  const { profileId } = useParams()
  const {
    student: accountStudent,
    isSaving,
    updateStudent,
    profileMode,
    needsProfileCompletion,
    isLoadingProfile,
    profileError,
    refreshStudentProfile,
  } = useStudentProfile()
  const isOwnAccountProfile = profileMode === 'account' && profileId === accountStudent.id
  const [requestedStudent, setRequestedStudent] = useState<Student | null>(null)
  const [isLoadingRequestedProfile, setIsLoadingRequestedProfile] = useState(false)
  const [requestedProfileError, setRequestedProfileError] = useState('')
  const [hasResolvedRequestedProfile, setHasResolvedRequestedProfile] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const [draftStudent, setDraftStudent] = useState<Student | null>(null)
  const [newSkill, setNewSkill] = useState('')
  const [newExperience, setNewExperience] = useState({ role: '', organization: '' })
  const sampleRouteStudent = profileId ? getTalentSampleAsStudent(profileId) : null
  const sourceStudent = isOwnAccountProfile
    ? accountStudent
    : requestedStudent ?? sampleRouteStudent ?? demoStudent
  const student = isEditing && draftStudent ? draftStudent : sourceStudent
  const canEditProfile = isOwnAccountProfile

  useEffect(() => {
    if (!profileId || isOwnAccountProfile) {
      setRequestedStudent(null)
      setRequestedProfileError('')
      setIsLoadingRequestedProfile(false)
      setHasResolvedRequestedProfile(true)
      return
    }

    if (profileId === demoStudent.id) {
      setRequestedStudent(demoStudent)
      setRequestedProfileError('')
      setIsLoadingRequestedProfile(false)
      setHasResolvedRequestedProfile(true)
      return
    }

    const sample = getTalentSampleAsStudent(profileId)
    if (sample) {
      setRequestedStudent(sample)
      setRequestedProfileError('')
      setIsLoadingRequestedProfile(false)
      setHasResolvedRequestedProfile(true)
      return
    }

    let active = true
    setIsLoadingRequestedProfile(true)
    setRequestedProfileError('')
    setHasResolvedRequestedProfile(false)
    void supabaseStudentRepository.getById(profileId)
      .then((profile) => {
        if (!active) return
        if (profile?.isPublic) setRequestedStudent(profile)
        else setRequestedStudent(null)
        setHasResolvedRequestedProfile(true)
      })
      .catch(() => {
        if (active) {
          setRequestedProfileError('This public student profile could not be loaded.')
          setHasResolvedRequestedProfile(true)
        }
      })
      .finally(() => {
        if (active) setIsLoadingRequestedProfile(false)
      })
    return () => { active = false }
  }, [profileId, isOwnAccountProfile])

  const updateDraft = (changes: Partial<Student>) => {
    setDraftStudent((current) => ({ ...(current ?? sourceStudent), ...changes }))
  }

  const saveProfileEdits = async () => {
    if (!draftStudent) return
    try {
      await updateStudent({
        headline: draftStudent.headline,
        bio: draftStudent.bio,
        about: draftStudent.about,
        skills: draftStudent.skills,
        experiences: draftStudent.experiences,
        availabilityPreferences: draftStudent.availabilityPreferences,
      })
      setDraftStudent(null)
      setIsEditing(false)
    } catch {
      // updateStudent exposes the save error in the profile UI.
    }
  }

  const updateAvailability = (key: keyof AvailabilityPreferences) => {
    updateDraft({ availabilityPreferences: { ...student.availabilityPreferences, [key]: !student.availabilityPreferences[key] } })
  }

  const addSkill = () => {
    const skill = newSkill.trim()
    if (!skill || student.skills.some((item) => item.name.toLowerCase() === skill.toLowerCase())) return
    updateDraft({ skills: [...student.skills, { name: skill, category: 'other' }] })
    setNewSkill('')
  }

  const removeSkill = (skillName: string) => updateDraft({ skills: student.skills.filter((skill) => skill.name !== skillName) })

  const addExperience = () => {
    if (!newExperience.role.trim() || !newExperience.organization.trim()) return
    const experience: Experience = { id: `exp-${Date.now()}`, role: newExperience.role.trim(), organization: newExperience.organization.trim(), type: 'work', startDate: 'Present', description: 'Added to your profile.' }
    updateDraft({ experiences: [experience, ...student.experiences] })
    setNewExperience({ role: '', organization: '' })
  }

  const removeExperience = (experienceId: string) => updateDraft({ experiences: student.experiences.filter((experience) => experience.id !== experienceId) })

  if (isOwnAccountProfile && isLoadingProfile) return <LoadingState label="Loading your student profile…" />

  if (isOwnAccountProfile && profileError) {
    return <main className="peer-page-surface flex min-h-[calc(100vh-80px)] items-center justify-center px-4 py-12"><section className="peer-card-glass w-full max-w-lg p-8 text-center"><h1 className="text-2xl font-bold">We couldn’t load your profile</h1><p role="alert" className="mt-3 text-sm text-[#525A55]">{profileError}</p><button type="button" onClick={() => void refreshStudentProfile()} className="mt-5 rounded-full bg-[#123D30] px-5 py-2.5 font-semibold text-white">Retry</button></section></main>
  }

  if (isLoadingRequestedProfile) return <LoadingState label="Loading student profile…" />

  if (profileId && requestedStudent === null && !isOwnAccountProfile && requestedProfileError) {
    return <main className="peer-page-surface flex min-h-[calc(100vh-80px)] items-center justify-center px-4 py-12"><section className="peer-card-glass w-full max-w-lg p-8 text-center"><h1 className="text-2xl font-bold">Profile unavailable</h1><p role="alert" className="mt-3 text-sm text-[#525A55]">{requestedProfileError}</p><Link to={routes.profiles} className="mt-5 inline-block font-semibold text-[#087a59]">Back to student profiles</Link></section></main>
  }

  if (profileId && hasResolvedRequestedProfile && requestedStudent === null && !isOwnAccountProfile && profileId !== demoStudent.id && !sampleRouteStudent) {
    return <main className="peer-page-surface flex min-h-[calc(100vh-80px)] items-center justify-center px-4 py-12"><section className="peer-card-glass w-full max-w-lg p-8 text-center"><h1 className="text-2xl font-bold">This profile is private or unavailable</h1><p className="mt-3 text-sm text-[#525A55]">Only students who publish their profile appear in the directory.</p><Link to={routes.profiles} className="mt-5 inline-block font-semibold text-[#087a59]">Back to student profiles</Link></section></main>
  }

  if (isOwnAccountProfile && needsProfileCompletion) {
    return (
      <main className="peer-page-surface flex min-h-[calc(100vh-80px)] items-center justify-center px-4 py-12">
        <section className="peer-card-glass w-full max-w-2xl p-8 text-center sm:p-12">
          <h1 className="text-3xl font-black text-[#171916]">Complete your profile, {student.name}.</h1>
          <p className="mx-auto mt-3 max-w-xl text-sm leading-relaxed text-[#525A55]">
            Add your education, skills, and portfolio details to introduce yourself to project owners.
          </p>
          <Link to="/signup/student" className="mt-6 inline-flex rounded-full bg-[#123D30] px-6 py-3 text-sm font-bold text-white">
            Continue profile setup
          </Link>
        </section>
      </main>
    )
  }

  return (
    <div className="peer-page-surface min-h-screen pb-12 relative overflow-hidden">
      <div className="peer-ambient-glow peer-glow-gold -top-24 -left-24 h-96 w-96 pointer-events-none" />
      <div className="peer-ambient-glow peer-glow-rose top-1/3 -right-24 h-96 w-96 pointer-events-none" />
      <div className="peer-ambient-glow peer-glow-mint -bottom-24 left-1/3 h-96 w-96 pointer-events-none" />
      <div className="pointer-events-none absolute inset-0 bg-grid-pattern opacity-30 -z-0" />

      <div className="relative z-10">
        <div className="h-40 bg-cover bg-center sm:h-56" style={{ backgroundImage: `linear-gradient(90deg, rgba(18,61,48,.62), rgba(18,61,48,.14)), url(${student.coverImageUrl})` }} />
        <div className="mx-auto w-full max-w-7xl px-4 pb-10 sm:px-6 lg:px-8">
        <div className="relative peer-divider-fade pb-6 sm:flex sm:items-start sm:justify-between sm:gap-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:gap-6">
            {/* Avatar with negative top margin so only the photo floats into banner */}
            <div className="-mt-16 sm:-mt-20 shrink-0">
              <img
                src={student.avatarUrl}
                alt={student.name}
                className="h-28 w-28 sm:h-36 sm:w-36 rounded-3xl border-4 border-[#FAF8F5] object-cover shadow-lg bg-white"
              />
            </div>

            {/* Profile identity details cleanly positioned below banner */}
            <div className="pt-1 sm:pt-4 sm:pb-1">
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight text-[#171916]">
                  {student.name}
                </h1>
                {student.isVerified && <Badge variant="green" size="sm"><Check className="mr-1 h-3 w-3" />Verified student</Badge>}
                {student.isPlusMember && <Badge>Plus</Badge>}
                <Badge variant="green" size="sm">{student.availability}</Badge>
              </div>

              {isEditing ? (
                <Input
                  value={student.headline}
                  onChange={(event) => updateDraft({ headline: event.target.value })}
                  aria-label="Professional headline"
                  className="mt-2 max-w-xl"
                />
              ) : (
                <p className="mt-1 text-base font-semibold text-[#08A876]">{student.headline}</p>
              )}

              <p className="mt-1 text-sm text-[#777A72]">
                {student.college} · {student.degree}, {student.graduationYear}
              </p>
            </div>
          </div>

          <div className="mt-5 flex flex-wrap gap-2 sm:mt-0 sm:pt-4 shrink-0">
            {isOwnAccountProfile && <StudentProfilePublishToggle />}
            {isOwnAccountProfile && <Link to={routes.dashboard}>
              <Button variant="secondary" size="sm">Dashboard</Button>
            </Link>}
            {canEditProfile && (isEditing ? (
              <>
                <Button variant="secondary" size="sm" disabled={isSaving} onClick={() => { setDraftStudent(null); setIsEditing(false) }}>Cancel</Button>
                <Button size="sm" disabled={isSaving} onClick={() => void saveProfileEdits()}>
                  <Check className="h-3.5 w-3.5" />
                  {isSaving ? 'Saving…' : 'Save profile'}
                </Button>
              </>
            ) : (
              <Button size="sm" onClick={() => { setDraftStudent(sourceStudent); setIsEditing(true) }}>
                <Pencil className="h-3.5 w-3.5" />
                Edit profile
              </Button>
            ))}
          </div>
        </div>

        {profileError && canEditProfile && <p role="alert" className="mt-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-xs text-red-800">{profileError}</p>}

        <div className="mt-7 grid grid-cols-1 gap-6 lg:grid-cols-12">
          <main className="space-y-6 lg:col-span-8">
            <Card><SectionTitle title="About" icon={Sparkles} />{isEditing ? <textarea value={student.about} onChange={(event) => updateDraft({ about: event.target.value, bio: event.target.value })} className="mt-4 min-h-32 w-full resize-y rounded-xl border border-[#E7E8E1] bg-white px-3.5 py-3 text-sm leading-7 text-[#525A55] outline-none transition focus:border-[#08C58A] focus:ring-2 focus:ring-[#08C58A]/20" aria-label="About you" /> : <p className="mt-4 text-sm leading-7 text-[#525A55]">{student.about}</p>}</Card>
            <Card>
              <SectionTitle title="Skills & interests" icon={Sparkles} />
              <div className="mt-4 flex flex-wrap gap-2">{student.skills.map((skill) => <span key={skill.name} className="inline-flex items-center gap-1 rounded-lg border border-[#E7E8E1] bg-[#F7F6F0] px-3 py-1.5 text-xs font-semibold text-[#171916]">{skill.name}{isEditing && <button type="button" onClick={() => removeSkill(skill.name)} className="ml-1 rounded text-[#777A72] hover:text-red-600" aria-label={`Remove ${skill.name}`}><Trash2 className="h-3 w-3" /></button>}</span>)}</div>
              <div className="mt-4 flex flex-wrap gap-2">{student.interests.map((interest) => <Badge key={interest} variant="green">{interest}</Badge>)}</div>
              {isEditing && <div className="mt-5 flex gap-2 peer-divider-fade-t pt-4"><Input value={newSkill} onChange={(event) => setNewSkill(event.target.value)} onKeyDown={(event) => { if (event.key === 'Enter') { event.preventDefault(); addSkill() } }} placeholder="Add a skill" aria-label="New skill" /><Button type="button" size="sm" onClick={addSkill}><Plus className="h-3.5 w-3.5" />Add</Button></div>}
            </Card>
            <Card>
              <SectionTitle title="Experience" icon={BriefcaseBusiness} />
              <div className="mt-5 space-y-5">{student.experiences.map((experience) => <article key={experience.id} className="border-l-2 border-[#08C58A]/40 pl-4"><div className="flex flex-wrap items-start justify-between gap-2"><div><h3 className="font-bold text-[#171916]">{experience.role}</h3><p className="mt-0.5 text-sm text-[#08A876]">{experience.organization}</p></div><div className="flex items-center gap-2"><Badge variant="neutral" size="sm">{experience.type}</Badge>{isEditing && <button type="button" onClick={() => removeExperience(experience.id)} className="rounded-md p-1 text-[#777A72] transition hover:bg-red-50 hover:text-red-600" aria-label={`Remove ${experience.role} at ${experience.organization}`}><Trash2 className="h-3.5 w-3.5" /></button>}</div></div><p className="mt-1 text-xs text-[#777A72]">{experience.startDate}{experience.endDate ? ` – ${experience.endDate}` : ''}</p><p className="mt-2 text-sm leading-relaxed text-[#525A55]">{experience.description}</p></article>)}</div>
              {isEditing && <div className="mt-6 grid grid-cols-1 gap-3 peer-divider-fade-t pt-5 sm:grid-cols-[1fr_1fr_auto]"><Input value={newExperience.role} onChange={(event) => setNewExperience((current) => ({ ...current, role: event.target.value }))} placeholder="Role" aria-label="Experience role" /><Input value={newExperience.organization} onChange={(event) => setNewExperience((current) => ({ ...current, organization: event.target.value }))} placeholder="Organisation" aria-label="Experience organisation" /><Button type="button" size="sm" className="self-end" onClick={addExperience}><Plus className="h-3.5 w-3.5" />Add</Button></div>}
            </Card>
            <Card><SectionTitle title="Education" icon={GraduationCap} /><div className="mt-5 space-y-4">{student.education.map((education) => <div key={education.id}><h3 className="font-bold text-[#171916]">{education.institution}</h3><p className="mt-1 text-sm text-[#525A55]">{education.degree} · {education.fieldOfStudy}</p><p className="mt-1 text-xs text-[#777A72]">Class of {education.graduationYear}</p></div>)}</div></Card>
            <Card><SectionTitle title="Projects & portfolio" icon={Landmark} /><div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2">{student.portfolioProjects.map((project) => <div key={project.id} className="rounded-xl border border-[#E7E8E1] bg-[#F7F6F0] p-4"><h3 className="font-bold text-[#171916]">{project.name}</h3><p className="mt-2 text-xs leading-relaxed text-[#525A55]">{project.description}</p><div className="mt-3 flex flex-wrap gap-1.5">{project.skills.map((skill) => <Badge key={skill} variant="neutral" size="sm">{skill}</Badge>)}</div>{project.url && <a className="mt-4 inline-flex items-center gap-1 text-xs font-bold text-[#123D30] hover:text-[#08A876]" href={project.url} target="_blank" rel="noreferrer">View project <ExternalLink className="h-3 w-3" /></a>}</div>)}</div></Card>
            <Card><SectionTitle title="Certifications & achievements" icon={Award} /><div className="mt-5 space-y-3">{student.certifications.map((certification) => <div key={certification.id} className="flex items-center justify-between gap-4 rounded-xl bg-[#F7F6F0] p-3.5"><div><p className="text-sm font-bold text-[#171916]">{certification.name}</p><p className="mt-0.5 text-xs text-[#777A72]">{certification.issuer}</p></div><span className="text-xs font-mono text-[#777A72]">{certification.issuedOn}</span></div>)}</div></Card>
          </main>

          <aside className="space-y-6 lg:col-span-4">
            <Card><p className="text-xs font-bold uppercase tracking-[0.14em] text-[#08A876]">Availability</p><h2 className="mt-2 text-lg font-black text-[#171916]">How you want to participate</h2><div className="mt-4 space-y-3">{availabilityLabels.map((item) => <button type="button" key={item.key} onClick={() => updateAvailability(item.key)} disabled={!canEditProfile || !isEditing || isSaving} aria-pressed={student.availabilityPreferences[item.key]} className="flex w-full items-center justify-between gap-3 rounded-xl border border-[#E7E8E1] p-3 text-left transition hover:border-[#08C58A]/50 disabled:cursor-default disabled:hover:border-[#E7E8E1]"><span><span className="block text-sm font-bold text-[#171916]">{item.label}</span><span className="mt-0.5 block text-xs leading-relaxed text-[#777A72]">{item.description}</span></span><span aria-hidden="true" className={`flex h-6 w-11 shrink-0 items-center rounded-full p-0.5 transition ${student.availabilityPreferences[item.key] ? 'bg-[#08C58A] justify-end' : 'bg-[#D8D6CE] justify-start'}`}><span className="h-5 w-5 rounded-full bg-white shadow-sm" /></span></button>)}</div></Card>
            <Card><div className="flex items-start justify-between gap-3"><div><p className="text-xs font-bold uppercase tracking-[0.14em] text-[#08A876]">Trust signals</p><h2 className="mt-2 text-lg font-black text-[#171916]">Verification</h2></div><ShieldAlert className="h-5 w-5 text-amber-500" /></div><p className="mt-2 text-sm leading-relaxed text-[#777A72]">{student.isVerified ? 'A reviewer approved this student profile.' : 'Profile details are self-reported until a reviewer approves a verification request.'}</p><Link to={routes.verification} className="mt-4 inline-flex text-sm font-bold text-[#123D30] hover:text-[#08A876]">{student.isVerified ? 'View verification status' : 'Request manual review'} <ExternalLink className="ml-1 h-3.5 w-3.5" /></Link></Card>
          </aside>
        </div>
      </div>
      </div>
    </div>
  )
}

function SectionTitle({ title, icon: Icon }: { title: string; icon: typeof Sparkles }) {
  return (
    <div className="flex items-center gap-2">
      <Icon className="h-4 w-4 text-[#08C58A]" />
      <h2 className="text-base font-bold text-[#171916]">{title}</h2>
    </div>
  )
}
