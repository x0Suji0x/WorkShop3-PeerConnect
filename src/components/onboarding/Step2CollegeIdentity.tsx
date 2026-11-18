import { useState } from 'react'
import {
  GraduationCap,
  Building2,
  Mail,
  FileCheck2,
  AlertCircle,
  CheckCircle2,
  Clock,
  UploadCloud,
  FileText,
} from 'lucide-react'
import type { OnboardingCollegeIdentity, FormValidationErrors } from '../../types/onboarding'
import { Badge } from '../common/Badge'

interface Step2CollegeIdentityProps {
  data: OnboardingCollegeIdentity
  errors: FormValidationErrors
  onChange: (field: keyof OnboardingCollegeIdentity, value: any) => void
}

const popularColleges = [
  'National Institute of Design, Bengaluru',
  'IIT Bombay',
  'IIT Delhi',
  'IIT Madras',
  'BITS Pilani',
  'IIIT Hyderabad',
  'Delhi Technological University',
  'NIT Tiruchirappalli',
  'SRM Institute of Science and Technology',
  'Manipal Institute of Technology',
  'RV College of Engineering',
]

const degreeOptions = [
  'Bachelor of Technology (B.Tech)',
  'Bachelor of Design (B.Des)',
  'Bachelor of Science (B.Sc)',
  'Bachelor of Computer Applications (BCA)',
  'Master of Technology (M.Tech)',
  'Master of Design (M.Des)',
  'Master of Science (M.Sc)',
  'Master of Computer Applications (MCA)',
  'Dual Degree / Integrated M.Tech',
]

const academicYearOptions = [
  '1st Year (Freshman)',
  '2nd Year (Sophomore)',
  '3rd Year (Junior)',
  '4th Year (Senior)',
  '5th Year / Dual Degree',
  'Postgraduate / Research Scholar',
]

export function Step2CollegeIdentity({ data, errors, onChange }: Step2CollegeIdentityProps) {
  const [isSendingOtp, setIsSendingOtp] = useState(false)
  const [otpSent, setOtpSent] = useState(false)
  const [otpValue, setOtpValue] = useState(data.otpCode || '')
  const [otpError, setOtpError] = useState('')

  const handleSendOtp = () => {
    if (!data.collegeEmail || !data.collegeEmail.includes('@')) {
      return
    }
    setIsSendingOtp(true)
    setTimeout(() => {
      setIsSendingOtp(false)
      setOtpSent(true)
      setOtpValue('482910') // Demo code
      onChange('otpCode', '482910')
    }, 700)
  }

  const handleVerifyOtp = () => {
    if (otpValue === '482910' || otpValue.length === 6) {
      onChange('isEmailVerified', true)
      onChange('idVerificationStatus', 'verified')
      setOtpError('')
    } else {
      setOtpError('Invalid demo OTP. Use 482910.')
    }
  }

  const handleSimulateIdUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      onChange('idCardFileName', file.name)
      onChange('idVerificationStatus', 'pending')
    } else {
      // Demo fallback
      onChange('idCardFileName', 'student_id_card_front.jpg')
      onChange('idVerificationStatus', 'pending')
    }
  }

  return (
    <div className="space-y-6">
      {/* Step Header */}
      <div>
        <p className="text-xs font-bold uppercase tracking-wider text-[#08A876]">
          Step 2 of 6 · College Identity
        </p>
        <h2 className="mt-1 text-2xl font-black text-[#171916]">
          Establish your university presence.
        </h2>
        <p className="mt-1 text-xs text-[#525A55] sm:text-sm">
          PeerConnect connects students across engineering, design, and research programs.
        </p>
      </div>

      {/* College Info Form */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        {/* College Name with suggestion list */}
        <div className="sm:col-span-2">
          <label htmlFor="col-name" className="block text-xs font-bold text-[#171916]">
            College / University Name *
          </label>
          <div className="relative mt-1.5">
            <Building2 className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-[#777A72]" />
            <input
              id="col-name"
              list="college-suggestions"
              type="text"
              required
              placeholder="e.g. National Institute of Design, Bengaluru"
              value={data.collegeName}
              onChange={(e) => onChange('collegeName', e.target.value)}
              className={`w-full rounded-xl border bg-white py-2.5 pl-10 pr-3.5 text-xs text-[#171916] outline-none transition focus:ring-2 sm:text-sm ${
                errors.collegeName
                  ? 'border-red-400 focus:border-red-500'
                  : 'border-[#E7E8E1] focus:border-[#08C58A] focus:ring-[#08C58A]/20'
              }`}
            />
            <datalist id="college-suggestions">
              {popularColleges.map((c) => (
                <option key={c} value={c} />
              ))}
            </datalist>
          </div>
          {errors.collegeName && (
            <p className="mt-1 text-xs text-red-600 font-medium">{errors.collegeName}</p>
          )}
        </div>

        {/* Degree / Program */}
        <div>
          <label htmlFor="col-degree" className="block text-xs font-bold text-[#171916]">
            Degree / Program *
          </label>
          <div className="relative mt-1.5">
            <GraduationCap className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-[#777A72]" />
            <input
              id="col-degree"
              list="degree-suggestions"
              type="text"
              required
              placeholder="e.g. Bachelor of Design (B.Des)"
              value={data.degree}
              onChange={(e) => onChange('degree', e.target.value)}
              className="w-full rounded-xl border border-[#E7E8E1] bg-white py-2.5 pl-10 pr-3.5 text-xs text-[#171916] outline-none transition focus:border-[#08C58A] focus:ring-2 focus:ring-[#08C58A]/20 sm:text-sm"
            />
            <datalist id="degree-suggestions">
              {degreeOptions.map((d) => (
                <option key={d} value={d} />
              ))}
            </datalist>
          </div>
          {errors.degree && (
            <p className="mt-1 text-xs text-red-600 font-medium">{errors.degree}</p>
          )}
        </div>

        {/* Branch / Specialization */}
        <div>
          <label htmlFor="col-field" className="block text-xs font-bold text-[#171916]">
            Branch or Specialisation *
          </label>
          <input
            id="col-field"
            type="text"
            required
            placeholder="e.g. Interaction Design or Computer Science"
            value={data.fieldOfStudy}
            onChange={(e) => onChange('fieldOfStudy', e.target.value)}
            className="mt-1.5 w-full rounded-xl border border-[#E7E8E1] bg-white px-3.5 py-2.5 text-xs text-[#171916] outline-none transition focus:border-[#08C58A] focus:ring-2 focus:ring-[#08C58A]/20 sm:text-sm"
          />
          {errors.fieldOfStudy && (
            <p className="mt-1 text-xs text-red-600 font-medium">{errors.fieldOfStudy}</p>
          )}
        </div>

        {/* Academic Year */}
        <div>
          <label htmlFor="col-year" className="block text-xs font-bold text-[#171916]">
            Current Academic Year *
          </label>
          <select
            id="col-year"
            value={data.academicYear}
            onChange={(e) => onChange('academicYear', e.target.value)}
            className="mt-1.5 w-full rounded-xl border border-[#E7E8E1] bg-white px-3.5 py-2.5 text-xs text-[#171916] outline-none transition focus:border-[#08C58A] focus:ring-2 focus:ring-[#08C58A]/20 sm:text-sm"
          >
            {academicYearOptions.map((yr) => (
              <option key={yr} value={yr}>
                {yr}
              </option>
            ))}
          </select>
        </div>

        {/* Graduation Year */}
        <div>
          <label htmlFor="col-grad" className="block text-xs font-bold text-[#171916]">
            Expected Graduation Year *
          </label>
          <select
            id="col-grad"
            value={data.graduationYear}
            onChange={(e) => onChange('graduationYear', e.target.value)}
            className="mt-1.5 w-full rounded-xl border border-[#E7E8E1] bg-white px-3.5 py-2.5 text-xs text-[#171916] outline-none transition focus:border-[#08C58A] focus:ring-2 focus:ring-[#08C58A]/20 sm:text-sm"
          >
            {['2025', '2026', '2027', '2028', '2029', '2030'].map((yr) => (
              <option key={yr} value={yr}>
                Class of {yr}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* College Verification Section */}
      <div className="rounded-2xl border border-[#E7E8E1] bg-white p-5 shadow-2xs space-y-4">
        <div>
          <div className="flex items-center gap-2">
            <FileCheck2 className="h-4 w-4 text-[#08A876]" />
            <h3 className="text-sm font-bold text-[#171916]">
              Institutional Verification (Demo Verification)
            </h3>
          </div>
          <p className="mt-1 text-xs text-[#525A55]">
            Choose how you'd like to verify your college student status.
          </p>
        </div>

        {/* Verification method radio toggle */}
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <button
            type="button"
            onClick={() => onChange('verificationMethod', 'college_email')}
            className={`rounded-xl border p-3.5 text-left transition-all ${
              data.verificationMethod === 'college_email'
                ? 'border-[#08C58A] bg-[#E3F4EB]/30 ring-1 ring-[#08C58A]'
                : 'border-[#E7E8E1] hover:border-[#CBD5E1]'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-[#171916]">Option A: College Email</span>
              <Badge variant={data.isEmailVerified ? 'green' : 'blue'} size="sm">
                {data.isEmailVerified ? 'Verified' : 'Instant'}
              </Badge>
            </div>
            <p className="mt-1 text-[11px] text-[#525A55]">
              Verify instantly using your campus email (.edu, .ac.in).
            </p>
          </button>

          <button
            type="button"
            onClick={() => onChange('verificationMethod', 'college_id')}
            className={`rounded-xl border p-3.5 text-left transition-all ${
              data.verificationMethod === 'college_id'
                ? 'border-[#08C58A] bg-[#E3F4EB]/30 ring-1 ring-[#08C58A]'
                : 'border-[#E7E8E1] hover:border-[#CBD5E1]'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-[#171916]">Option B: Student ID Card</span>
              <Badge variant={data.idCardFileName ? 'peach' : 'neutral'} size="sm">
                {data.idCardFileName ? 'Pending Review' : 'Manual Review'}
              </Badge>
            </div>
            <p className="mt-1 text-[11px] text-[#525A55]">
              If no college email, upload your student ID photo for manual review.
            </p>
          </button>
        </div>

        {/* Option A View: Email OTP */}
        {data.verificationMethod === 'college_email' && (
          <div className="rounded-xl border border-[#E7E8E1] bg-[#FAF8F5] p-4 space-y-3">
            <div>
              <label htmlFor="col-email" className="block text-xs font-bold text-[#171916]">
                Institutional Email Address
              </label>
              <div className="mt-1.5 flex gap-2">
                <div className="relative flex-1">
                  <Mail className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-[#777A72]" />
                  <input
                    id="col-email"
                    type="email"
                    placeholder="student@nid.edu or rollno@iitb.ac.in"
                    value={data.collegeEmail}
                    onChange={(e) => onChange('collegeEmail', e.target.value)}
                    className="w-full rounded-xl border border-[#E7E8E1] bg-white py-2 pl-10 pr-3 text-xs text-[#171916] outline-none focus:border-[#08C58A]"
                  />
                </div>
                <button
                  type="button"
                  onClick={handleSendOtp}
                  disabled={isSendingOtp || data.isEmailVerified}
                  className="rounded-xl bg-[#171916] px-3.5 py-2 text-xs font-bold text-white hover:bg-[#2A2E28] disabled:opacity-50"
                >
                  {isSendingOtp ? 'Sending...' : otpSent ? 'Resend Demo OTP' : 'Send OTP'}
                </button>
              </div>
            </div>

            {/* OTP Entry Simulation */}
            {otpSent && !data.isEmailVerified && (
              <div className="rounded-lg border border-emerald-200 bg-emerald-50/60 p-3 space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-[#123D30]">
                    Demo OTP generated for testing: <code className="font-mono font-bold bg-white px-1.5 py-0.5 rounded border border-emerald-200">482910</code>
                  </span>
                  <span className="text-[11px] text-[#777A72]">Simulation</span>
                </div>
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    maxLength={6}
                    value={otpValue}
                    onChange={(e) => setOtpValue(e.target.value)}
                    placeholder="Enter 6-digit OTP"
                    className="w-36 rounded-lg border border-[#CBD5E1] bg-white px-3 py-1.5 font-mono text-xs tracking-widest text-center text-[#171916] outline-none focus:border-[#08C58A]"
                  />
                  <button
                    type="button"
                    onClick={handleVerifyOtp}
                    className="rounded-lg bg-[#08C58A] px-3 py-1.5 text-xs font-bold text-[#0A261D] hover:bg-[#07B27C]"
                  >
                    Confirm Verification
                  </button>
                </div>
                {otpError && <p className="text-xs text-red-600">{otpError}</p>}
              </div>
            )}

            {data.isEmailVerified && (
              <div className="flex items-center gap-2 rounded-lg bg-[#E3F4EB] p-2.5 text-xs text-[#123D30]">
                <CheckCircle2 className="h-4 w-4 text-[#08C58A]" />
                <span className="font-bold">Institutional Email Verified (Demo status)</span>
              </div>
            )}
          </div>
        )}

        {/* Option B View: ID Card Upload */}
        {data.verificationMethod === 'college_id' && (
          <div className="rounded-xl border border-[#E7E8E1] bg-[#FAF8F5] p-4 space-y-3">
            <div className="rounded-xl border-2 border-dashed border-[#CBD5E1] p-5 text-center bg-white hover:border-[#08C58A] transition-colors">
              <UploadCloud className="mx-auto h-8 w-8 text-[#777A72]" />
              <p className="mt-2 text-xs font-bold text-[#171916]">
                Upload College ID Card or Admission Letter
              </p>
              <p className="mt-0.5 text-[11px] text-[#777A72]">
                Supports JPG, PNG or PDF (Max 5MB). Stored securely and never shown publicly.
              </p>
              <label className="mt-3 inline-block cursor-pointer rounded-full bg-[#171916] px-4 py-1.5 text-xs font-bold text-white hover:bg-[#2A2E28]">
                Select File
                <input
                  type="file"
                  accept="image/*,.pdf"
                  className="hidden"
                  onChange={handleSimulateIdUpload}
                />
              </label>
            </div>

            {data.idCardFileName && (
              <div className="flex items-center justify-between rounded-lg border border-[#E7E8E1] bg-white p-3 text-xs">
                <div className="flex items-center gap-2">
                  <FileText className="h-4 w-4 text-[#08C58A]" />
                  <span className="font-bold text-[#171916]">{data.idCardFileName}</span>
                </div>
                <Badge variant="peach" size="sm">
                  <Clock className="h-3 w-3" />
                  Pending manual review
                </Badge>
              </div>
            )}

            <div className="flex items-start gap-2 rounded-lg bg-amber-50 p-2.5 text-[11px] text-amber-900 border border-amber-200">
              <AlertCircle className="h-3.5 w-3.5 shrink-0 text-amber-600 mt-0.5" />
              <span>
                <strong>Notice:</strong> Document verification is in demo mode. Verification is not complete until reviewed by our campus ambassadors or administration team.
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
