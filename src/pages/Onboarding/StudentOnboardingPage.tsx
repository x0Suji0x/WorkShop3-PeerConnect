import { useState, useMemo } from 'react'
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
import type { Student, Verification } from '../../types'

export function StudentOnboardingPage() {
  const navigate = useNavigate()
  const { student, updateStudent } = useStudentProfile()

  const [currentStep, setCurrentStep] = useState<OnboardingStep>(1)
  const [highestStepVisited, setHighestStepVisited] = useState<number>(1)
  const [errors, setErrors] = useState<FormValidationErrors>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [profileCreated, setProfileCreated] = useState(false)

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
      otpCode: '',
      isEmailVerified: false,
      idCardFileName: null,
      idVerificationStatus: 'unverified',
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
      const initialVerifications: Verification[] = [
        {
          id: 'ver-college',
          type: 'college_identity',
          status: 'pending',
          label: 'Institutional enrollment',
          description: formData.basicInfo.email
            ? 'Email format provided; no identity or enrollment checks happen in this demo.'
            : 'No college identity checks happen in this demo.',
        },
        {
          id: 'ver-phone',
          type: 'phone_number',
          status: 'unverified',
          label: 'Mobile phone',
          description: 'Phone number provided; no phone verification happens in this demo.',
        },
      ]

      await updateStudent({
        name: formData.basicInfo.fullName || student.name,
        headline: formData.basicInfo.headline || student.headline,
        avatarUrl: formData.basicInfo.avatarUrl || student.avatarUrl,
        verifications: initialVerifications,
        profileCompletion: formData.basicInfo.email ? 40 : 30,
      })
      setProfileCreated(true)
    }

    const nextStep = (currentStep + 1) as OnboardingStep
    setCurrentStep(nextStep)
    setHighestStepVisited((prev) => Math.max(prev, nextStep))
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handleSkipToDashboard = async () => {
    // Save any progress entered so far and go directly to dashboard
    await updateStudent({
      name: formData.basicInfo.fullName || student.name,
      headline: formData.basicInfo.headline || student.headline,
      avatarUrl: formData.basicInfo.avatarUrl || student.avatarUrl,
      college: formData.college.collegeName || student.college,
      university: formData.college.collegeName || student.university,
      degree: formData.college.degree || student.degree,
      fieldOfStudy: formData.college.fieldOfStudy || student.fieldOfStudy,
      graduationYear: formData.college.graduationYear || student.graduationYear,
      skills: formData.skillsInterests.skills.length > 0 ? formData.skillsInterests.skills : student.skills,
      interests: formData.skillsInterests.interests.length > 0 ? formData.skillsInterests.interests : student.interests,
      profileCompletion: estimatedCompletion,
    })
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

    // Build the updated verifications list
    const updatedVerifications: Verification[] = [
      {
        id: 'ver-college',
        type: 'college_identity',
        status: formData.college.isEmailVerified || formData.college.idCardFileName
          ? 'pending'
          : 'unverified',
        label: 'College enrollment',
        description: formData.college.isEmailVerified
          ? 'Demo code accepted; no email or enrollment verification was performed.'
          : formData.college.idCardFileName
          ? `College ID file selected (${formData.college.idCardFileName}); it is not uploaded or reviewed in this demo.`
          : 'Provide a college email or ID document to verify student status.',
      },
      {
        id: 'ver-phone',
        type: 'phone_number',
        status: 'unverified',
        label: 'Phone number',
        description: 'Phone number provided; no phone verification happens in this demo.',
      },
      {
        id: 'ver-exp',
        type: 'experience',
        status: formData.portfolio.organization ? 'pending' : 'unverified',
        label: 'Experience & roles',
        description: formData.portfolio.organization
          ? `Self-reported role at ${formData.portfolio.organization}. This demo does not verify it.`
          : 'Experience review is not available in this demo.',
      },
      {
        id: 'ver-skills',
        type: 'skills',
        status: 'unverified',
        label: 'Skill assessments',
        description: 'Skill checks are not available in this demo.',
      },
      {
        id: 'ver-portfolio',
        type: 'portfolio_ownership',
        status: formData.portfolio.githubUrl ? 'pending' : 'unverified',
        label: 'Portfolio ownership',
        description: formData.portfolio.githubUrl
          ? 'GitHub profile link provided; repository ownership is not checked in this demo.'
          : 'Link your public GitHub or Behance to verify authorship.',
      },
    ]

    // Construct the updated student profile object
    const updatedStudentData: Partial<Student> = {
      name: formData.basicInfo.fullName || student.name,
      headline: formData.basicInfo.headline || `${formData.college.degree} Student`,
      avatarUrl: formData.basicInfo.avatarUrl || student.avatarUrl,
      college: formData.college.collegeName || student.college,
      university: formData.college.collegeName || student.university,
      degree: formData.college.degree || student.degree,
      fieldOfStudy: formData.college.fieldOfStudy || student.fieldOfStudy,
      graduationYear: formData.college.graduationYear || student.graduationYear,
      skills: formData.skillsInterests.skills,
      interests: formData.skillsInterests.interests,
      availability: formData.goals.availability,
      availabilityPreferences: {
        paidProjects: formData.goals.lookingFor.paidProjects,
        collaborators: formData.goals.lookingFor.collaborators,
        internships: formData.goals.lookingFor.internships,
        events: formData.goals.lookingFor.events,
      },
      about: formData.portfolio.aboutBio || student.about,
      bio: formData.portfolio.aboutBio || student.bio,
      socialLinks: {
        github: formData.portfolio.githubUrl || student.socialLinks.github,
        linkedin: formData.portfolio.linkedinUrl || student.socialLinks.linkedin,
        behance: formData.portfolio.behanceUrl || student.socialLinks.behance,
        portfolio: formData.portfolio.portfolioUrl || student.socialLinks.portfolio,
      },
      portfolioProjects: [
        ...(formData.portfolio.projects || []),
        ...(formData.portfolio.featuredProjectName
          ? [
              {
                id: `proj-${Date.now()}`,
                name: formData.portfolio.featuredProjectName,
                description: formData.portfolio.featuredProjectDesc || 'Student showcase project',
                skills: formData.skillsInterests.skills.map((s) => s.name).slice(0, 3),
                url: formData.portfolio.featuredProjectUrl,
              },
            ]
          : []),
        ...student.portfolioProjects,
      ],
      experiences: [
        ...(formData.portfolio.experiences || []),
        ...(formData.portfolio.organization
          ? [
              {
                id: `exp-${Date.now()}`,
                organization: formData.portfolio.organization,
                role: formData.portfolio.role || 'Contributor',
                type: formData.portfolio.experienceType,
                startDate: 'Recent',
                description: formData.portfolio.experienceDesc || 'Added during onboarding',
              },
            ]
          : []),
        ...student.experiences,
      ],
      certifications: [
        ...(formData.portfolio.certifications || []),
        ...student.certifications,
      ],
      verifications: updatedVerifications,
      profileCompletion: estimatedCompletion,
    }

    try {
      await updateStudent(updatedStudentData)
      // Navigate to onboarding completion welcome screen with summary
      navigate('/signup/student/complete', {
        state: {
          studentName: formData.basicInfo.fullName,
          completion: estimatedCompletion,
          college: formData.college.collegeName,
          skillsCount: formData.skillsInterests.skills.length,
        },
      })
    } finally {
      setIsSubmitting(false)
    }
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

        {/* Profile Created Status Banner */}
        {(profileCreated || currentStep > 1) && (
          <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 rounded-2xl border border-[#08C58A]/40 bg-[#E3F4EB] p-4 text-xs text-[#123D30] shadow-2xs">
            <div className="flex items-center gap-2.5">
              <CheckCircle2 className="h-5 w-5 text-[#08A876] shrink-0" />
              <div>
                <p className="font-bold">Student Profile Created!</p>
                <p className="text-[11px] text-[#525A55]">
                  Step 1 details are held for this session. Continue filling in your university and portfolio details or skip to your dashboard.
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
