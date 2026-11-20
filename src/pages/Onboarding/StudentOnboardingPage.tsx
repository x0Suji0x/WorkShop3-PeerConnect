import { useEffect, useState, useMemo, type FormEvent } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { ArrowLeft, ArrowRight, CheckCircle2 } from 'lucide-react'
import type {
  OnboardingStep,
  OnboardingFormData,
  FormValidationErrors,
} from '../../types/onboarding'
import {
  validateStep1,
  validateStep2,
  validateStep3,
  validateStep4,
  validateStep5,
} from '../../lib/onboardingValidation'
import { calculateProfileCompletion } from '../../lib/profileCompletion'
import { useStudentProfile } from '../../hooks/useStudentProfile'
import { OnboardingProgress } from '../../components/onboarding/OnboardingProgress'
import { Step1BasicInfo } from '../../components/onboarding/Step1BasicInfo'
import { Step2CollegeIdentity } from '../../components/onboarding/Step2CollegeIdentity'
import { Step3SkillsInterests } from '../../components/onboarding/Step3SkillsInterests'
import { Step4GoalsAvailability } from '../../components/onboarding/Step4GoalsAvailability'
import { Step5PortfolioExperience } from '../../components/onboarding/Step5PortfolioExperience'
import { Step6ReviewSubmit } from '../../components/onboarding/Step6ReviewSubmit'
import { Button } from '../../components/common/Button'
import { LoadingState } from '../../components/common/LoadingState'
import { useAuth } from '../../lib/auth/AuthProvider'
import type { Student } from '../../types'
import { buildOnboardingStudentUpdate } from '../../lib/onboardingStudentUpdate'

export function StudentOnboardingPage() {
  const navigate = useNavigate()
  const auth = useAuth()
  const { student, updateStudent, isLoadingProfile, profileError: studentProfileError, refreshStudentProfile } = useStudentProfile()

  const [currentStep, setCurrentStep] = useState<OnboardingStep>(1)
  const [highestStepVisited, setHighestStepVisited] = useState<number>(1)
  const [errors, setErrors] = useState<FormValidationErrors>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [profileCreated, setProfileCreated] = useState(false)
  const [profileSaveError, setProfileSaveError] = useState('')

  // Central form state preserving all information across steps
  const [formData, setFormData] = useState<OnboardingFormData>({
    basicInfo: {
      fullName: '',
      email: '',
      phone: '',
      password: '',
      confirmPassword: '',
      avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
      headline: '',
    },
    college: {
      collegeName: '',
      degree: '',
      fieldOfStudy: '',
      academicYear: '2nd Year (Sophomore)',
      graduationYear: '2027',
      collegeEmail: '',
      verificationMethod: 'college_email',
      idCardFileName: null,
    },
    skillsInterests: {
      skills: [
        { name: 'React', category: 'dev' },
        { name: 'TypeScript', category: 'dev' },
        { name: 'UI/UX Design', category: 'design' },
      ],
      interests: ['Artificial Intelligence & Machine Learning', 'UI/UX & Product Design'],
    },
    goals: {
      lookingFor: {
        paidProjects: true,
        internships: true,
        collaborators: true,
        hackathons: true,
        startups: false,
        events: false,
        volunteering: false,
        clubs: false,
      },
      availability: 'Available now',
    },
    portfolio: {
      githubUrl: '',
      linkedinUrl: '',
      behanceUrl: '',
      portfolioUrl: '',
      aboutBio: '',
      featuredProjectName: '',
      featuredProjectDesc: '',
      featuredProjectUrl: '',
      organization: '',
      role: '',
      experienceType: 'internship',
      experienceDesc: '',
    },
    agreedToTerms: false,
  })

  useEffect(() => {
    if (auth.status !== 'signedIn' || !auth.profile?.full_name) return
    setFormData((current) => current.basicInfo.fullName
      ? current
      : { ...current, basicInfo: { ...current.basicInfo, fullName: auth.profile!.full_name! } })
  }, [auth.status, auth.profile?.full_name])

  // Calculate dynamic completion score based on current input
  const estimatedCompletion = useMemo(() => {
    const previewStudent: Partial<Student> = {
      name: formData.basicInfo.fullName,
      headline: formData.basicInfo.headline,
      avatarUrl: formData.basicInfo.avatarUrl,
      college: formData.college.collegeName,
      degree: formData.college.degree,
      fieldOfStudy: formData.college.fieldOfStudy,
      skills: formData.skillsInterests.skills,
      interests: formData.skillsInterests.interests,
      availability: formData.goals.availability,
      availabilityPreferences: {
        paidProjects: formData.goals.lookingFor.paidProjects,
        collaborators: formData.goals.lookingFor.collaborators,
        internships: formData.goals.lookingFor.internships,
        events: formData.goals.lookingFor.events,
      },
      socialLinks: {
        github: formData.portfolio.githubUrl,
        linkedin: formData.portfolio.linkedinUrl,
        portfolio: formData.portfolio.portfolioUrl,
      },
      portfolioProjects: formData.portfolio.featuredProjectName
        ? [
            {
              id: 'p-1',
              name: formData.portfolio.featuredProjectName,
              description: formData.portfolio.featuredProjectDesc || 'Featured project',
              skills: formData.skillsInterests.skills.map((s) => s.name).slice(0, 3),
              url: formData.portfolio.featuredProjectUrl,
            },
          ]
        : [],
      about: formData.portfolio.aboutBio,
    }
    return calculateProfileCompletion(previewStudent).percentage
  }, [formData])

  // Field change handlers
  const handleBasicInfoChange = (field: keyof OnboardingFormData['basicInfo'], value: any) => {
    setFormData((prev) => ({
      ...prev,
      basicInfo: { ...prev.basicInfo, [field]: value },
    }))
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }))
    }
  }

  const handleCollegeChange = (field: keyof OnboardingFormData['college'], value: any) => {
    setFormData((prev) => ({
      ...prev,
      college: { ...prev.college, [field]: value },
    }))
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }))
    }
  }

  const handleSkillsInterestsChange = (field: keyof OnboardingFormData['skillsInterests'], value: any) => {
    setFormData((prev) => ({
      ...prev,
      skillsInterests: { ...prev.skillsInterests, [field]: value },
    }))
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }))
    }
  }

  const handleGoalsChange = (field: keyof OnboardingFormData['goals'], value: any) => {
    setFormData((prev) => ({
      ...prev,
      goals: { ...prev.goals, [field]: value },
    }))
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }))
    }
  }

  const handlePortfolioChange = (field: keyof OnboardingFormData['portfolio'], value: string) => {
    setFormData((prev) => ({
      ...prev,
      portfolio: { ...prev.portfolio, [field]: value },
    }))
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }))
    }
  }

  // Step navigation & validation
  const validateCurrentStep = (): boolean => {
    let stepErrors: FormValidationErrors = {}
    if (currentStep === 1) {
      stepErrors = validateStep1(formData.basicInfo)
    } else if (currentStep === 2) {
      stepErrors = validateStep2(formData.college)
    } else if (currentStep === 3) {
      stepErrors = validateStep3(formData.skillsInterests)
    } else if (currentStep === 4) {
      stepErrors = validateStep4(formData.goals)
    } else if (currentStep === 5) {
      stepErrors = validateStep5(formData.portfolio)
    }

    setErrors(stepErrors)
    return Object.keys(stepErrors).length === 0
  }

  const handleNext = async () => {
    if (!validateCurrentStep()) {
      return
    }

    if (currentStep === 1) {
      // Step 1 completed: Immediately create the initial student profile in store!
      try {
        await updateStudent({
          name: formData.basicInfo.fullName || student.name,
          headline: formData.basicInfo.headline || student.headline,
          avatarUrl: formData.basicInfo.avatarUrl || student.avatarUrl,
          profileCompletion: formData.basicInfo.fullName ? 30 : 20,
        })
        if (formData.basicInfo.fullName.trim()) {
          await auth.updateProfileName(formData.basicInfo.fullName.trim())
        }
        setProfileSaveError('')
      } catch (caught) {
        setProfileSaveError(caught instanceof Error ? caught.message : 'Could not save your account name.')
        return
      }
      setProfileCreated(true)
    }

    const nextStep = (currentStep + 1) as OnboardingStep
    setCurrentStep(nextStep)
    setHighestStepVisited((prev) => Math.max(prev, nextStep))
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handleSkipToDashboard = async () => {
    try {
      await updateStudent(buildOnboardingStudentUpdate(formData, student, estimatedCompletion))
      if (formData.basicInfo.fullName.trim()) {
        await auth.updateProfileName(formData.basicInfo.fullName.trim())
      }
      setProfileSaveError('')
    } catch (caught) {
      setProfileSaveError(caught instanceof Error ? caught.message : 'Could not save your account name.')
      return
    }
    navigate('/dashboard?welcome=true', {
      state: {
        justRegistered: true,
        studentName: formData.basicInfo.fullName || student.name,
      },
    })
  }

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep((prev) => (prev - 1) as OnboardingStep)
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }

  const handleSkipPortfolio = () => {
    const nextStep = 6 as OnboardingStep
    setCurrentStep(nextStep)
    setHighestStepVisited((prev) => Math.max(prev, nextStep))
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handleFinalSubmit = async () => {
    if (!formData.agreedToTerms) {
      alert('Please accept the Terms of Service and Privacy Policy to create your profile.')
      return
    }

    setIsSubmitting(true)

    try {
      await updateStudent(buildOnboardingStudentUpdate(formData, student, estimatedCompletion))
      // Navigate to onboarding completion welcome screen with summary
      navigate('/signup/student/complete', {
        state: {
          studentName: formData.basicInfo.fullName,
          completion: estimatedCompletion,
          college: formData.college.collegeName,
          skillsCount: formData.skillsInterests.skills.length,
        },
      })
    } catch (caught) {
      setProfileSaveError(caught instanceof Error ? caught.message : 'Could not save your student profile.')
    } finally {
      setIsSubmitting(false)
    }
  }

  if (auth.status === 'loading' || isLoadingProfile) {
    return <LoadingState label="Checking your student account…" />
  }

  if (auth.status === 'signedIn' && studentProfileError) {
    return <main className="peer-page-surface flex min-h-[calc(100vh-80px)] items-center justify-center px-4 py-12"><section className="peer-card-glass w-full max-w-lg p-8 text-center"><h1 className="text-2xl font-bold">We couldn’t load your profile</h1><p role="alert" className="mt-3 text-sm text-[#525A55]">{studentProfileError}</p><button type="button" onClick={() => void refreshStudentProfile()} className="mt-5 rounded-full bg-[#123D30] px-5 py-2.5 font-semibold text-white">Retry</button></section></main>
  }

  if (auth.status === 'profileError') {
    return (
      <main className="peer-page-surface flex min-h-[calc(100vh-80px)] items-center justify-center px-4 py-12">
        <section className="peer-card-glass w-full max-w-lg p-8 text-center">
          <h1 className="text-2xl font-bold">We couldn’t load your profile</h1>
          <p role="alert" className="mt-3 text-sm text-[#525A55]">{auth.profileError}</p>
          <button type="button" onClick={() => void auth.refreshProfile().catch(() => {})} className="mt-5 rounded-full bg-[#123D30] px-5 py-2.5 font-semibold text-white">Retry</button>
        </section>
      </main>
    )
  }

  if (auth.status === 'unconfigured') {
    return (
      <main className="peer-page-surface flex min-h-[calc(100vh-80px)] items-center justify-center px-4 py-12">
        <section className="peer-card-glass w-full max-w-lg p-8 text-center">
          <h1 className="text-2xl font-bold">Sign-in isn’t configured</h1>
          <p className="mt-3 text-sm text-[#525A55]">Connect the Supabase project URL and publishable key before creating a student account.</p>
        </section>
      </main>
    )
  }

  if (auth.status === 'signedOut') return <StudentAccountStep />

  if (auth.profile?.role === 'client') {
    return (
      <main className="peer-page-surface flex min-h-[calc(100vh-80px)] items-center justify-center px-4 py-12">
        <section className="peer-card-glass w-full max-w-lg p-8 text-center">
          <h1 className="text-2xl font-bold">This setup is for student accounts</h1>
          <p className="mt-3 text-sm text-[#525A55]">You’re signed in with a client account.</p>
          <Link className="mt-5 inline-block font-semibold text-[#087a59]" to="/dashboard">Go to your dashboard</Link>
        </section>
      </main>
    )
  }

  if (!auth.profile?.role) {
    return (
      <main className="peer-page-surface flex min-h-[calc(100vh-80px)] items-center justify-center px-4 py-12">
        <section className="peer-card-glass w-full max-w-lg p-8 text-center">
          <h1 className="text-2xl font-bold">Choose your account type first</h1>
          <Link className="mt-5 inline-block font-semibold text-[#087a59]" to="/auth/choose-role">Choose student</Link>
        </section>
      </main>
    )
  }

  return (
    <div className="peer-page-surface min-h-[calc(100vh-80px)] relative overflow-hidden pb-16 pt-8">
      {/* Ambient lighting glows identical to home page */}
      <div className="peer-ambient-glow peer-glow-gold -top-24 -left-24 h-96 w-96" />
      <div className="peer-ambient-glow peer-glow-rose top-1/3 -right-24 h-96 w-96" />
      <div className="peer-ambient-glow peer-glow-mint -bottom-24 left-1/2 -translate-x-1/2 h-96 w-96" />
      <div className="pointer-events-none absolute inset-0 bg-grid-pattern opacity-30 -z-0" />

      <div className="relative z-10 mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        {/* Top return link & header */}
        <div className="flex items-center justify-between pb-6">
          <Link
            to="/signup"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#08A876] transition-colors hover:text-[#06805a]"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            Back to Sign Up
          </Link>
          <div className="peer-eyebrow-pill">
            <span className="dot" aria-hidden="true" />
            STUDENT ONBOARDING
          </div>
        </div>

        {/* Stepper Progress Bar */}
        <div className="mb-6 peer-card-glass p-5 shadow-sm">
          <OnboardingProgress
            currentStep={currentStep}
            onStepClick={(step) => setCurrentStep(step)}
            highestStepVisited={highestStepVisited}
          />
        </div>

        {profileSaveError && <p className="mb-5 rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700" role="alert">{profileSaveError}</p>}

        {/* Profile Created Status Banner */}
        {(profileCreated || currentStep > 1) && (
          <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 rounded-2xl border border-[#08C58A]/40 bg-[#E3F4EB] p-4 text-xs text-[#123D30] shadow-2xs">
            <div className="flex items-center gap-2.5">
              <CheckCircle2 className="h-5 w-5 text-[#08A876] shrink-0" />
              <div>
                <p className="font-bold">Student Profile Created!</p>
                <p className="text-[11px] text-[#525A55]">
                  Your student profile is saved to your PeerConnect account as you continue.
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={handleSkipToDashboard}
              className="rounded-xl bg-[#123D30] px-4 py-2 text-xs font-bold text-white hover:bg-[#0E3127] transition shrink-0"
            >
              Skip to Dashboard →
            </button>
          </div>
        )}

        {/* Wizard Form Container */}
        <div className="peer-card-glass peer-card-glow-mint p-6 shadow-xl sm:p-10">
          {currentStep === 1 && (
            <Step1BasicInfo
              data={formData.basicInfo}
              errors={errors}
              onChange={handleBasicInfoChange}
            />
          )}

          {currentStep === 2 && (
            <Step2CollegeIdentity
              data={formData.college}
              errors={errors}
              onChange={handleCollegeChange}
            />
          )}

          {currentStep === 3 && (
            <Step3SkillsInterests
              data={formData.skillsInterests}
              errors={errors}
              onChange={handleSkillsInterestsChange}
            />
          )}

          {currentStep === 4 && (
            <Step4GoalsAvailability
              data={formData.goals}
              errors={errors}
              onChange={handleGoalsChange}
            />
          )}

          {currentStep === 5 && (
            <Step5PortfolioExperience
              data={formData.portfolio}
              errors={errors}
              onChange={handlePortfolioChange}
            />
          )}

          {currentStep === 6 && (
            <Step6ReviewSubmit
              data={formData}
              onEditStep={(step) => setCurrentStep(step)}
              onToggleTerms={(agreed) =>
                setFormData((prev) => ({ ...prev, agreedToTerms: agreed }))
              }
              estimatedCompletion={estimatedCompletion}
            />
          )}

          {/* Form Actions (Back / Next / Skip / Submit) */}
          <div className="mt-10 flex flex-wrap items-center justify-between gap-3 peer-divider-fade-t pt-6">
            <div>
              {currentStep > 1 && (
                <button
                  type="button"
                  onClick={handleBack}
                  className="inline-flex items-center gap-1.5 rounded-full border border-[#E7E8E1] bg-white px-5 py-2.5 text-xs font-bold text-[#171916] hover:bg-[#F7F6F0] transition-colors"
                >
                  <ArrowLeft className="h-3.5 w-3.5" />
                  Previous Step
                </button>
              )}
            </div>

            <div className="flex items-center gap-3">
              {currentStep > 1 && (
                <button
                  type="button"
                  onClick={handleSkipToDashboard}
                  className="rounded-full border border-[#08C58A]/30 bg-[#E3F4EB] px-4 py-2 text-xs font-bold text-[#123D30] hover:bg-[#08C58A]/20 transition"
                >
                  Skip to Dashboard
                </button>
              )}

              {currentStep === 5 && (
                <button
                  type="button"
                  onClick={handleSkipPortfolio}
                  className="rounded-full px-4 py-2 text-xs font-semibold text-[#777A72] hover:text-[#171916]"
                >
                  Skip for now
                </button>
              )}

              {currentStep < 6 ? (
                <Button type="button" variant="primary" size="md" onClick={handleNext}>
                  Continue to Step {currentStep + 1}
                  <ArrowRight className="h-4 w-4 ml-1.5" />
                </Button>
              ) : (
                <Button
                  type="button"
                  variant="primary"
                  size="lg"
                  disabled={isSubmitting || !formData.agreedToTerms}
                  onClick={handleFinalSubmit}
                >
                  <CheckCircle2 className="h-4 w-4 mr-1.5" />
                  {isSubmitting ? 'Creating Profile...' : 'Complete Registration & Launch'}
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function StudentAccountStep() {
  const auth = useAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [busy, setBusy] = useState(false)
  const [pendingConfirmation, setPendingConfirmation] = useState(false)
  const [creatingProfile, setCreatingProfile] = useState(false)
  const [error, setError] = useState('')
  const [notice, setNotice] = useState('')

  const createAccount = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setError('')
    setNotice('')
    if (password.length < 8) {
      setError('Choose a password with at least 8 characters.')
      return
    }

    setBusy(true)
    try {
      const result = await auth.signUp(email.trim(), password, 'student', '')
      setPendingConfirmation(result.confirmationRequired)
      if (result.confirmationRequired) {
        setNotice('Check your email to confirm your account. This confirms email access only, not student status.')
      } else {
        setCreatingProfile(true)
      }
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : 'Unable to create your account.')
    } finally {
      setBusy(false)
    }
  }

  const continueWithGoogle = async () => {
    setError('')
    setBusy(true)
    try {
      await auth.signInWithGoogle('student')
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : 'Unable to continue with Google.')
      setBusy(false)
    }
  }

  const resendConfirmation = async () => {
    setError('')
    setBusy(true)
    try {
      await auth.resendSignupConfirmation(email.trim())
      setNotice('If this address has a pending account, a confirmation email is on its way.')
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : 'Unable to resend the confirmation email.')
    } finally {
      setBusy(false)
    }
  }

  if (creatingProfile && auth.status === 'loading') {
    return <LoadingState label="Preparing your student profile…" />
  }

  return (
    <main className="peer-page-surface relative flex min-h-[calc(100vh-80px)] items-center justify-center overflow-hidden px-4 py-12">
      <div className="peer-ambient-glow peer-glow-gold -left-24 -top-24 h-96 w-96" />
      <section className="peer-card-glass relative z-10 w-full max-w-lg space-y-5 p-7 shadow-xl sm:p-9">
        <header className="text-center">
          <div className="peer-eyebrow-pill mx-auto">STUDENT ACCOUNT</div>
          <h1 className="mt-4 text-3xl font-black text-[#171916]">Start with your account</h1>
          <p className="mt-2 text-sm leading-relaxed text-[#525A55]">
            Create an account or continue with Google, then add your student profile details.
          </p>
        </header>

        {error && <p role="alert" className="rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700">{error}</p>}
        {notice && <p role="status" className="rounded-xl border border-emerald-200 bg-emerald-50 p-3 text-sm text-[#123D30]">{notice}</p>}

        {!pendingConfirmation && (
          <>
            <button
              type="button"
              onClick={() => void continueWithGoogle()}
              disabled={busy}
              className="w-full rounded-xl border border-black/15 bg-white px-4 py-3 text-sm font-semibold text-[#171916] hover:bg-[#FAF8F5] disabled:opacity-60"
            >
              Continue with Google
            </button>
            <div className="flex items-center gap-3 text-xs text-[#777A72]"><span className="h-px flex-1 bg-black/10" />or use email<span className="h-px flex-1 bg-black/10" /></div>
            <form className="space-y-4" onSubmit={(event) => void createAccount(event)}>
              <label className="block text-sm font-semibold text-[#171916]" htmlFor="student-account-email">
                Email address
                <input
                  id="student-account-email"
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  className="mt-1.5 w-full rounded-xl border border-[#D8DDD7] bg-white px-3 py-2.5 font-normal"
                />
              </label>
              <label className="block text-sm font-semibold text-[#171916]" htmlFor="student-account-password">
                Password
                <input
                  id="student-account-password"
                  type="password"
                  autoComplete="new-password"
                  minLength={8}
                  required
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  className="mt-1.5 w-full rounded-xl border border-[#D8DDD7] bg-white px-3 py-2.5 font-normal"
                />
              </label>
              <button type="submit" disabled={busy} className="w-full rounded-xl bg-[#123D30] px-4 py-3 text-sm font-bold text-white disabled:opacity-60">
                {busy ? 'Creating account…' : 'Create student account'}
              </button>
            </form>
          </>
        )}

        {pendingConfirmation && (
          <button type="button" onClick={() => void resendConfirmation()} disabled={busy} className="w-full rounded-xl border border-[#123D30] px-4 py-3 text-sm font-semibold text-[#123D30] disabled:opacity-60">
            Resend confirmation email
          </button>
        )}

        <p className="text-center text-xs leading-relaxed text-[#777A72]">
          Finish onboarding to save your student profile to your account. Verification is a separate review process.
        </p>
        <p className="text-center text-sm text-[#525A55]">
          Already have an account? <Link to="/signin" className="font-bold text-[#087a59]">Sign in</Link>
        </p>
      </section>
    </main>
  )
}
