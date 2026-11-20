import { useState, useRef, useEffect } from 'react'
import {
  GraduationCap,
  Building2,
  Mail,
  AlertCircle,
  CheckCircle2,
  Clock,
  UploadCloud,
  FileText,
  Check,
  ChevronDown,
  Plus,
} from 'lucide-react'
import type { OnboardingCollegeIdentity, FormValidationErrors } from '../../types/onboarding'
import { mockColleges, type College } from '../../data/collegeData'
import { Badge } from '../common/Badge'

interface Step2CollegeIdentityProps {
  data: OnboardingCollegeIdentity
  errors: FormValidationErrors
  onChange: (field: keyof OnboardingCollegeIdentity, value: any) => void
}

const DEGREE_OPTIONS = [
  'Bachelor of Technology (B.Tech)',
  'Bachelor of Engineering (B.E.)',
  'Bachelor of Computer Applications (BCA)',
  'Bachelor of Science (B.Sc)',
  'Bachelor of Business Administration (BBA)',
  'Bachelor of Commerce (B.Com)',
  'Bachelor of Arts (BA)',
  'Bachelor of Design (B.Des)',
  'Bachelor of Architecture (B.Arch)',
  'Bachelor of Fine Arts (BFA)',
  'Master of Computer Applications (MCA)',
  'Master of Technology (M.Tech)',
  'Master of Science (M.Sc)',
  'Master of Business Administration (MBA)',
  'Master of Design (M.Des)',
  'Doctor of Philosophy (PhD)',
  'Diploma / Polytechnic',
  'Other',
]

const BRANCH_OPTIONS = [
  'Computer Science Engineering',
  'Information Technology',
  'Artificial Intelligence & Machine Learning',
  'Data Science & Analytics',
  'Electronics & Communication Engineering',
  'Mechanical Engineering',
  'Electrical Engineering',
  'Civil Engineering',
  'Chemical Engineering',
  'Biotechnology & Bioinformatics',
  'Architecture & Design',
  'Business Administration & Finance',
  'UI/UX & Interaction Design',
  'Other',
]

const ACADEMIC_YEAR_OPTIONS = [
  '1st Year (Freshman)',
  '2nd Year (Sophomore)',
  '3rd Year (Junior)',
  '4th Year (Senior)',
  '5th Year / Dual Degree',
  'Postgraduate / Research Scholar',
]

const GRADUATION_YEARS = ['2024', '2025', '2026', '2027', '2028', '2029', '2030']

const PERSONAL_EMAIL_DOMAINS = [
  'gmail.com',
  'yahoo.com',
  'yahoo.co.in',
  'outlook.com',
  'hotmail.com',
  'icloud.com',
  'rediffmail.com',
  'protonmail.com',
  'aol.com',
  'zoho.com',
]

export function Step2CollegeIdentity({ data, errors, onChange }: Step2CollegeIdentityProps) {
  // College Search & Autocomplete state
  const [searchTerm, setSearchTerm] = useState(data.collegeName || '')
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const [isManualCollege, setIsManualCollege] = useState(false)
  const [customCollegeInput, setCustomCollegeInput] = useState('')

  // Custom Degree & Branch State
  const [isCustomDegree, setIsCustomDegree] = useState(
    Boolean(data.degree && !DEGREE_OPTIONS.includes(data.degree))
  )
  const [customDegreeText, setCustomDegreeText] = useState(
    data.degree && !DEGREE_OPTIONS.includes(data.degree) ? data.degree : ''
  )

  const [isCustomBranch, setIsCustomBranch] = useState(
    Boolean(data.fieldOfStudy && !BRANCH_OPTIONS.includes(data.fieldOfStudy))
  )
  const [customBranchText, setCustomBranchText] = useState(
    data.fieldOfStudy && !BRANCH_OPTIONS.includes(data.fieldOfStudy) ? data.fieldOfStudy : ''
  )

  const dropdownRef = useRef<HTMLDivElement>(null)

  // Filter colleges from mockColleges (from collegeData.ts)
  const filteredColleges = mockColleges.filter((c) => {
    const term = searchTerm.toLowerCase().trim()
    if (!term) return true
    return (
      c.name.toLowerCase().includes(term) ||
      c.shortName.toLowerCase().includes(term) ||
      c.city.toLowerCase().includes(term) ||
      c.state.toLowerCase().includes(term)
    )
  })

  // Match check
  const matchedCollege = mockColleges.find(
    (c) =>
      c.name.toLowerCase() === data.collegeName.toLowerCase() ||
      c.shortName.toLowerCase() === data.collegeName.toLowerCase()
  )

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  // Email format validation (.edu or .ac.in requirement)
  const validateCollegeEmail = (email: string): { valid: boolean; reason?: string } => {
    const trimmed = email.trim().toLowerCase()
    if (!trimmed) return { valid: false, reason: 'College email is required for this demo step.' }
    const parts = trimmed.split('@')
    if (parts.length !== 2 || !parts[0] || !parts[1]) {
      return { valid: false, reason: 'Please enter a valid email address' }
    }
    const domain = parts[1]
    if (PERSONAL_EMAIL_DOMAINS.includes(domain)) {
      return {
        valid: false,
        reason: `Personal email (@${domain}) is not a college-style address. Use an institutional address for this demo form.`,
      }
    }
    const isEdu =
      domain.endsWith('.edu') ||
      domain.endsWith('.ac.in') ||
      domain.endsWith('.edu.in') ||
      domain.endsWith('.ac.uk') ||
      domain.includes('.edu.') ||
      domain.includes('university') ||
      domain.includes('college')

    if (!isEdu) {
      return {
        valid: false,
        reason: 'Institutional email must end with .edu, .ac.in, or official university domain.',
      }
    }
    return { valid: true }
  }

  const emailValidation = validateCollegeEmail(data.collegeEmail)
  const isEduDomain = emailValidation.valid

  const handleCollegeEmailInput = (val: string) => {
    onChange('collegeEmail', val)
  }

  const handleSelectCollege = (college: College) => {
    setSearchTerm(college.name)
    onChange('collegeName', college.name)
    setIsDropdownOpen(false)
    setIsManualCollege(false)
  }

  const handleSelectManual = () => {
    setIsManualCollege(true)
    setIsDropdownOpen(false)
    setCustomCollegeInput(searchTerm)
    onChange('collegeName', searchTerm)
  }

  const handleDegreeChange = (selected: string) => {
    if (selected === 'Other') {
      setIsCustomDegree(true)
      onChange('degree', customDegreeText || 'Other')
    } else {
      setIsCustomDegree(false)
      onChange('degree', selected)
    }
  }

  const handleBranchChange = (selected: string) => {
    if (selected === 'Other') {
      setIsCustomBranch(true)
      onChange('fieldOfStudy', customBranchText || 'Other')
    } else {
      setIsCustomBranch(false)
      onChange('fieldOfStudy', selected)
    }
  }

  const handleSimulateIdUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      onChange('idCardFileName', file.name)
    }
  }

  return (
    <div className="space-y-6">
      {/* Step Header */}
      <div>
        <p className="text-xs font-bold uppercase tracking-wider text-[#08A876]">
          Step 2 of 6 · College Identity & Academics
        </p>
        <h2 className="mt-1 text-2xl font-black text-[#171916]">
          Establish your university presence.
        </h2>
        <p className="mt-1 text-xs text-[#525A55] sm:text-sm">
          Select from PeerConnect's network of tech schools and colleges, or add your institution manually.
        </p>
      </div>

      {/* College Info Form */}
      <div className="space-y-5 rounded-3xl border border-[#E7E8E1] bg-white p-6 shadow-2xs">
        {/* College Name Autocomplete from collegeData.ts */}
        <div className="relative" ref={dropdownRef}>
          <div className="flex items-center justify-between">
            <label htmlFor="col-search-input" className="block text-xs font-bold text-[#171916]">
              College / University Name *
            </label>
            <span className="text-[11px] text-[#777A72]">
              {mockColleges.length}+ tech schools in directory
            </span>
          </div>

          {!isManualCollege ? (
            <div className="relative mt-1.5">
              <Building2 className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-[#777A72]" />
              <input
                id="col-search-input"
                type="text"
                required
                autoComplete="off"
                placeholder="Search tech school (e.g. IIT Bombay, BITS Pilani, NIT Trichy...)"
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value)
                  onChange('collegeName', e.target.value)
                  setIsDropdownOpen(true)
                }}
                onFocus={() => setIsDropdownOpen(true)}
                className={`w-full rounded-xl border bg-white py-2.5 pl-10 pr-10 text-xs text-[#171916] outline-none transition focus:ring-2 sm:text-sm ${
                  errors.collegeName
                    ? 'border-red-400 focus:border-red-500'
                    : 'border-[#E7E8E1] focus:border-[#08C58A] focus:ring-[#08C58A]/20'
                }`}
              />
              <button
                type="button"
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[#777A72] hover:text-[#171916]"
              >
                <ChevronDown className={`h-4 w-4 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} />
              </button>
            </div>
          ) : (
            /* Manual College Entry Field */
            <div className="mt-1.5 space-y-2">
              <div className="flex gap-2">
                <input
                  type="text"
                  required
                  placeholder="Enter full college name (e.g. St. Xavier's College, Mumbai)"
                  value={customCollegeInput}
                  onChange={(e) => {
                    setCustomCollegeInput(e.target.value)
                    onChange('collegeName', e.target.value)
                  }}
                  className="flex-1 rounded-xl border border-[#08C58A] bg-white px-3.5 py-2.5 text-xs text-[#171916] outline-none focus:ring-2 focus:ring-[#08C58A]/20 sm:text-sm"
                />
                <button
                  type="button"
                  onClick={() => {
                    setIsManualCollege(false)
                    setSearchTerm('')
                    onChange('collegeName', '')
                  }}
                  className="rounded-xl border border-[#E7E8E1] bg-white px-3.5 py-2 text-xs font-semibold text-[#525A55] hover:bg-[#F7F6F0]"
                >
                  Search List
                </button>
              </div>

              <div className="flex items-center gap-2 rounded-xl bg-amber-50 p-2.5 text-xs text-amber-900 border border-amber-200">
                <AlertCircle className="h-4 w-4 shrink-0 text-amber-600" />
                <span>
                  <strong>Unlisted Institution:</strong> We'll manually verify your campus credentials during registration review.
                </span>
              </div>
            </div>
          )}

          {errors.collegeName && (
            <p className="mt-1 text-xs text-red-600 font-medium">{errors.collegeName}</p>
          )}

          {/* Listed college directory entry (not a verification badge). */}
          {matchedCollege && !isManualCollege && (
            <div className="mt-2 flex items-center justify-between rounded-xl bg-[#E3F4EB]/60 p-2.5 text-xs text-[#123D30] border border-[#08C58A]/30">
              <div className="flex items-center gap-2">
                <Check className="h-3.5 w-3.5 text-[#08C58A]" />
                <span className="font-semibold">
                  {matchedCollege.shortName} · {matchedCollege.city}, {matchedCollege.state}
                </span>
              </div>
              <Badge variant="green" size="sm">
                  Listed in demo directory
              </Badge>
            </div>
          )}

          {/* Autocomplete Dropdown */}
          {isDropdownOpen && !isManualCollege && (
            <div className="absolute z-50 mt-1 max-h-72 w-full overflow-y-auto rounded-2xl border border-[#E7E8E1] bg-white py-1.5 shadow-xl">
              {filteredColleges.length > 0 ? (
                <div className="divide-y divide-[#F2F1EA]">
                  {filteredColleges.slice(0, 10).map((college) => {
                    const isSelected = college.name.toLowerCase() === data.collegeName.toLowerCase()
                    return (
                      <button
                        key={college.id}
                        type="button"
                        onClick={() => handleSelectCollege(college)}
                        className={`flex w-full items-start justify-between p-3 text-left transition ${
                          isSelected ? 'bg-[#E3F4EB]/50' : 'hover:bg-[#FAF8F5]'
                        }`}
                      >
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-bold text-[#171916]">{college.name}</span>
                            {college.shortName && (
                              <span className="text-[11px] font-mono text-[#08A876]">
                                ({college.shortName})
                              </span>
                            )}
                          </div>
                          <p className="mt-0.5 text-[11px] text-[#525A55]">
                            {college.city}, {college.state} • Est. {college.established}
                          </p>
                        </div>
                        <Badge variant="neutral" size="sm" className="shrink-0 text-[10px]">
                          {college.type}
                        </Badge>
                      </button>
                    )
                  })}
                </div>
              ) : (
                <div className="p-4 text-center text-xs text-[#777A72]">
                  No matching college found for "{searchTerm}".
                </div>
              )}

              {/* Manual Add / Other option */}
              <div className="border-t border-[#E7E8E1] bg-[#FAF8F5] p-2">
                <button
                  type="button"
                  onClick={handleSelectManual}
                  className="flex w-full items-center justify-between rounded-xl p-2.5 text-xs font-bold text-[#123D30] hover:bg-white transition"
                >
                  <div className="flex items-center gap-2">
                    <Plus className="h-4 w-4 text-[#08C58A]" />
                    <span>My college isn't listed – Add manually / Other</span>
                  </div>
                  <span className="text-[11px] font-normal text-[#777A72]">(Manual review)</span>
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Degree / Program Selection */}
        <div>
          <label className="block text-xs font-bold text-[#171916]">
            Degree / Program *
          </label>
          <div className="mt-1.5 grid grid-cols-2 gap-2 sm:grid-cols-3 md:grid-cols-4">
            {DEGREE_OPTIONS.map((deg) => {
              const isSelected = isCustomDegree
                ? deg === 'Other'
                : data.degree === deg || data.degree.includes(deg)
              return (
                <button
                  key={deg}
                  type="button"
                  onClick={() => handleDegreeChange(deg)}
                  className={`rounded-xl border p-2 text-left text-xs transition ${
                    isSelected
                      ? 'border-[#08C58A] bg-[#E3F4EB] text-[#123D30] font-bold ring-1 ring-[#08C58A]'
                      : 'border-[#E7E8E1] bg-white text-[#525A55] hover:bg-[#FAF8F5]'
                  }`}
                >
                  {deg}
                </button>
              )
            })}
          </div>

          {/* Custom Degree Input */}
          {isCustomDegree && (
            <div className="mt-2.5">
              <input
                type="text"
                autoFocus
                placeholder="Enter your custom degree (e.g. BS-MS Dual, PGP, etc.)"
                value={customDegreeText}
                onChange={(e) => {
                  setCustomDegreeText(e.target.value)
                  onChange('degree', e.target.value)
                }}
                className="w-full rounded-xl border border-[#08C58A] bg-white px-3.5 py-2 text-xs text-[#171916] outline-none focus:ring-2 focus:ring-[#08C58A]/20 sm:text-sm"
              />
            </div>
          )}
          {errors.degree && <p className="mt-1 text-xs text-red-600 font-medium">{errors.degree}</p>}
        </div>

        {/* Branch / Specialization */}
        <div>
          <label className="block text-xs font-bold text-[#171916]">
            Branch or Specialisation *
          </label>
          <div className="mt-1.5 grid grid-cols-1 gap-2 sm:grid-cols-2 md:grid-cols-3">
            {BRANCH_OPTIONS.map((b) => {
              const isSelected = isCustomBranch
                ? b === 'Other'
                : data.fieldOfStudy === b || data.fieldOfStudy.includes(b)
              return (
                <button
                  key={b}
                  type="button"
                  onClick={() => handleBranchChange(b)}
                  className={`rounded-xl border p-2 text-left text-xs transition ${
                    isSelected
                      ? 'border-[#08C58A] bg-[#E3F4EB] text-[#123D30] font-bold ring-1 ring-[#08C58A]'
                      : 'border-[#E7E8E1] bg-white text-[#525A55] hover:bg-[#FAF8F5]'
                  }`}
                >
                  {b}
                </button>
              )
            })}
          </div>

          {/* Custom Branch Input */}
          {isCustomBranch && (
            <div className="mt-2.5">
              <input
                type="text"
                autoFocus
                placeholder="Enter your custom branch (e.g. Aerospace Engineering, Cognitive Science...)"
                value={customBranchText}
                onChange={(e) => {
                  setCustomBranchText(e.target.value)
                  onChange('fieldOfStudy', e.target.value)
                }}
                className="w-full rounded-xl border border-[#08C58A] bg-white px-3.5 py-2 text-xs text-[#171916] outline-none focus:ring-2 focus:ring-[#08C58A]/20 sm:text-sm"
              />
            </div>
          )}
          {errors.fieldOfStudy && (
            <p className="mt-1 text-xs text-red-600 font-medium">{errors.fieldOfStudy}</p>
          )}
        </div>

        {/* Academic Year & Graduation Year */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label htmlFor="col-year" className="block text-xs font-bold text-[#171916]">
              Current Academic Year *
            </label>
            <div className="relative mt-1.5">
              <GraduationCap className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-[#777A72]" />
              <select
                id="col-year"
                value={data.academicYear}
                onChange={(e) => onChange('academicYear', e.target.value)}
                className="w-full appearance-none rounded-xl border border-[#E7E8E1] bg-white py-2.5 pl-10 pr-9 text-xs text-[#171916] outline-none focus:border-[#08C58A] sm:text-sm"
              >
                {ACADEMIC_YEAR_OPTIONS.map((y) => (
                  <option key={y} value={y}>
                    {y}
                  </option>
                ))}
              </select>
              <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#777A72]" />
            </div>
          </div>

          <div>
            <label htmlFor="col-grad" className="block text-xs font-bold text-[#171916]">
              Expected Graduation Year *
            </label>
            <div className="relative mt-1.5">
              <select
                id="col-grad"
                value={data.graduationYear}
                onChange={(e) => onChange('graduationYear', e.target.value)}
                className="w-full appearance-none rounded-xl border border-[#E7E8E1] bg-white py-2.5 px-3.5 text-xs text-[#171916] outline-none focus:border-[#08C58A] sm:text-sm"
              >
                {GRADUATION_YEARS.map((yr) => (
                  <option key={yr} value={yr}>
                    Class of {yr}
                  </option>
                ))}
              </select>
              <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#777A72]" />
            </div>
          </div>
        </div>
      </div>

      {/* College Identity Verification Card */}
      <div className="rounded-3xl border border-[#E7E8E1] bg-white p-6 shadow-2xs space-y-4">
        <div>
          <h3 className="text-sm font-bold text-[#171916]">Campus details</h3>
          <p className="text-xs text-[#777A72]">
            This step saves your self-reported details only. It does not check email or upload an ID; request a manual review from Verification Centre after setup.
          </p>
        </div>

        {/* Verification Method Tabs */}
        <div className="grid grid-cols-2 gap-3">
          <button
            type="button"
            onClick={() => onChange('verificationMethod', 'college_email')}
            className={`rounded-2xl border p-3.5 text-left transition ${
              data.verificationMethod === 'college_email'
                ? 'border-[#08C58A] bg-[#E3F4EB]/40 shadow-xs ring-1 ring-[#08C58A]'
                : 'border-[#E7E8E1] bg-white hover:bg-[#FAF8F5]'
            }`}
          >
            <div className="flex items-center gap-2">
              <Mail className="h-4 w-4 text-[#08C58A]" />
              <span className="text-xs font-bold text-[#171916]">Option A: College Email</span>
            </div>
            <p className="mt-1 text-[11px] text-[#777A72]">
              Simulated code only; no email is sent or checked
            </p>
          </button>

          <button
            type="button"
            onClick={() => onChange('verificationMethod', 'college_id')}
            className={`rounded-2xl border p-3.5 text-left transition ${
              data.verificationMethod === 'college_id'
                ? 'border-[#08C58A] bg-[#E3F4EB]/40 shadow-xs ring-1 ring-[#08C58A]'
                : 'border-[#E7E8E1] bg-white hover:bg-[#FAF8F5]'
            }`}
          >
            <div className="flex items-center gap-2">
              <FileText className="h-4 w-4 text-[#08C58A]" />
              <span className="text-xs font-bold text-[#171916]">Option B: College ID Card</span>
            </div>
            <p className="mt-1 text-[11px] text-[#777A72]">
              Example file selection only; no ID is uploaded here
            </p>
          </button>
        </div>

        {/* Method A: College Email */}
        {data.verificationMethod === 'college_email' ? (
          <div className="rounded-2xl border border-[#E7E8E1] bg-[#FAF8F5] p-4 space-y-3">
            <div className="flex items-center justify-between">
              <label htmlFor="col-email" className="block text-xs font-bold text-[#171916]">
                Institutional Email Address (.edu / .ac.in)
              </label>
              {isEduDomain ? (
                <span className="flex items-center gap-1 text-xs font-bold text-[#08A876]">
                  <CheckCircle2 className="h-4 w-4" />
                  <span>College-style format</span>
                </span>
              ) : (
                <span className="text-[11px] text-amber-700 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                  Format not recognized
                </span>
              )}
            </div>

            <div className="relative">
              <Mail className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-[#777A72]" />
              <input
                id="col-email"
                type="email"
                placeholder="e.g. yourname@iitb.ac.in or student@university.edu"
                value={data.collegeEmail}
                onChange={(e) => handleCollegeEmailInput(e.target.value)}
                className={`w-full rounded-xl border bg-white py-2 pl-10 pr-28 text-xs text-[#171916] outline-none transition focus:ring-2 sm:text-sm ${
                  isEduDomain
                    ? 'border-[#08C58A] focus:border-[#08C58A] focus:ring-[#08C58A]/20'
                    : 'border-[#E7E8E1] focus:border-[#08C58A] focus:ring-[#08C58A]/20'
                }`}
              />
              <div className="absolute right-2 top-1/2 -translate-y-1/2">
                {isEduDomain ? (
                  <span className="rounded-md bg-[#E3F4EB] px-2 py-1 text-[10px] font-bold text-[#176B4C]">Format match</span>
                ) : (
                  <span className="rounded-md bg-white px-2 py-1 text-[10px] font-semibold text-[#777A72]">Optional</span>
                )}
              </div>
            </div>

            {data.collegeEmail.length > 4 && !emailValidation.valid && (
              <p className="text-xs text-red-600 font-medium">{emailValidation.reason}</p>
            )}
            <p className="text-[11px] leading-relaxed text-[#777A72]">
              The address format is only a hint. No email is sent and no student identity or enrollment is checked.
            </p>
          </div>
        ) : (
          /* Method B: College ID Card Upload */
          <div className="rounded-2xl border border-dashed border-[#E7E8E1] bg-[#FAF8F5] p-5 text-center space-y-3">
            <UploadCloud className="mx-auto h-8 w-8 text-[#08C58A]" />
            <div>
              <p className="text-xs font-bold text-[#171916]">Choose a student ID file (optional)</p>
              <p className="mt-0.5 text-[11px] text-[#777A72]">
                Supports JPG, PNG, or PDF. The file stays in this form and is not uploaded or reviewed.
              </p>
            </div>
            <label className="inline-flex cursor-pointer items-center gap-1.5 rounded-xl bg-[#123D30] px-4 py-2 text-xs font-bold text-white hover:bg-[#0E3127]">
              <span>Choose File</span>
              <input
                type="file"
                accept="image/*,.pdf"
                onChange={handleSimulateIdUpload}
                className="hidden"
              />
            </label>

            {data.idCardFileName && (
              <div className="flex items-center justify-center gap-2 rounded-xl bg-amber-50 p-2 text-xs text-amber-900 border border-amber-200">
                <Clock className="h-3.5 w-3.5 text-amber-600" />
                <span><strong>Selected:</strong> {data.idCardFileName} (demo only; no review occurs)</span>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
