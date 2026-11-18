import type {
  OnboardingFormData,
  FormValidationErrors,
} from '../types/onboarding'

export interface PasswordStrength {
  score: number // 0 to 4
  label: 'Too weak' | 'Weak' | 'Fair' | 'Strong' | 'Very Strong'
  color: string
  requirements: { label: string; met: boolean }[]
}

export function evaluatePasswordStrength(password: string): PasswordStrength {
  const requirements = [
    { label: 'At least 8 characters', met: password.length >= 8 },
    { label: 'Contains uppercase letter', met: /[A-Z]/.test(password) },
    { label: 'Contains a number', met: /[0-9]/.test(password) },
    { label: 'Contains special character (!@#$%^&*)', met: /[^A-Za-z0-9]/.test(password) },
  ]

  const metCount = requirements.filter((r) => r.met).length

  if (password.length === 0) {
    return {
      score: 0,
      label: 'Too weak',
      color: '#CBD5E1',
      requirements,
    }
  }

  if (metCount <= 1) {
    return {
      score: 1,
      label: 'Weak',
      color: '#EF4444',
      requirements,
    }
  }

  if (metCount === 2) {
    return {
      score: 2,
      label: 'Fair',
      color: '#F59E0B',
      requirements,
    }
  }

  if (metCount === 3) {
    return {
      score: 3,
      label: 'Strong',
      color: '#10B981',
      requirements,
    }
  }

  return {
    score: 4,
    label: 'Very Strong',
    color: '#08C58A',
    requirements,
  }
}

export function validateStep1(data: OnboardingFormData['basicInfo']): FormValidationErrors {
  const errors: FormValidationErrors = {}

  if (!data.fullName.trim()) {
    errors.fullName = 'Full name is required.'
  } else if (data.fullName.trim().length < 3) {
    errors.fullName = 'Name must be at least 3 characters.'
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!data.email.trim()) {
    errors.email = 'Email address is required.'
  } else if (!emailRegex.test(data.email.trim())) {
    errors.email = 'Please enter a valid email address.'
  }

  const phoneDigits = data.phone.replace(/\D/g, '')
  if (!data.phone.trim()) {
    errors.phone = 'Phone number is required.'
  } else if (phoneDigits.length !== 10) {
    errors.phone = 'Mobile number must be exactly 10 digits.'
  }

  if (!data.password) {
    errors.password = 'Password is required.'
  } else if (data.password.length < 8) {
    errors.password = 'Password must be at least 8 characters long.'
  }

  if (!data.confirmPassword) {
    errors.confirmPassword = 'Please confirm your password.'
  } else if (data.password !== data.confirmPassword) {
    errors.confirmPassword = 'Passwords do not match.'
  }

  return errors
}

export function validateStep2(data: OnboardingFormData['college']): FormValidationErrors {
  const errors: FormValidationErrors = {}

  if (!data.collegeName.trim()) {
    errors.collegeName = 'Please enter or select your college/university.'
  }

  if (!data.degree.trim()) {
    errors.degree = 'Please specify your degree or academic program.'
  }

  if (!data.fieldOfStudy.trim()) {
    errors.fieldOfStudy = 'Please enter your branch or specialisation.'
  }

  if (!data.graduationYear.trim()) {
    errors.graduationYear = 'Graduation year is required.'
  }

  if (data.verificationMethod === 'college_email') {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!data.collegeEmail.trim()) {
      errors.collegeEmail = 'College email is required for instant institutional verification.'
    } else if (!emailRegex.test(data.collegeEmail.trim())) {
      errors.collegeEmail = 'Please enter a valid institutional email.'
    }
  } else if (data.verificationMethod === 'college_id') {
    if (!data.idCardFileName) {
      errors.idCardFile = 'Please upload a photo of your student ID card or admission letter.'
    }
  }

  return errors
}

export function validateStep3(data: OnboardingFormData['skillsInterests']): FormValidationErrors {
  const errors: FormValidationErrors = {}

  if (!data.skills || data.skills.length < 2) {
    errors.skills = 'Please add at least 2 skills to help teams find you.'
  }

  if (!data.interests || data.interests.length < 1) {
    errors.interests = 'Please select at least 1 area of interest.'
  }

  return errors
}

export function validateStep4(data: OnboardingFormData['goals']): FormValidationErrors {
  const errors: FormValidationErrors = {}

  const hasSelectedGoal = Object.values(data.lookingFor).some(Boolean)
  if (!hasSelectedGoal) {
    errors.lookingFor = 'Please select at least one opportunity type you are looking for.'
  }

  if (!data.availability) {
    errors.availability = 'Please select your current availability.'
  }

  return errors
}

export function validateStep5(data: OnboardingFormData['portfolio']): FormValidationErrors {
  const errors: FormValidationErrors = {}

  const urlRegex = /^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([/\w .-]*)*\/?$/i

  if (data.githubUrl && !urlRegex.test(data.githubUrl)) {
    errors.githubUrl = 'Please enter a valid GitHub profile URL.'
  }

  if (data.linkedinUrl && !urlRegex.test(data.linkedinUrl)) {
    errors.linkedinUrl = 'Please enter a valid LinkedIn URL.'
  }

  if (data.portfolioUrl && !urlRegex.test(data.portfolioUrl)) {
    errors.portfolioUrl = 'Please enter a valid portfolio URL.'
  }

  return errors
}
