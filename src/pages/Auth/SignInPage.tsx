import { useState } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  Sparkles,
  CheckCircle2,
  Check,
  ArrowRight,
  ShieldCheck,
  Building2,
  GraduationCap,
  Briefcase,
  Globe,
  User,
  Layers,
} from 'lucide-react'
import { routes } from '../../app/routes'
import { Button } from '../../components/common/Button'
import { Badge } from '../../components/common/Badge'

const FREEMAIL_DOMAINS = [
  'gmail.com',
  'yahoo.com',
  'yahoo.co.in',
  'outlook.com',
  'hotmail.com',
  'live.com',
  'icloud.com',
  'rediffmail.com',
  'mail.com',
  'protonmail.com',
  'proton.me',
  'zoho.com',
  'aol.com',
  'yandex.com',
]

const TALENT_CATEGORIES = [
  'Frontend / React',
  'Full-Stack Web',
  'AI / Machine Learning',
  'UI/UX Design',
  'Mobile Apps / Flutter',
  'Video & Creative Content',
]

export function SignInPage() {
  const navigate = useNavigate()
  const [searchParams, setSearchParams] = useSearchParams()

  // Role: student or client
  const roleParam = searchParams.get('role')
  const modeParam = searchParams.get('mode')
  const [internalRole, setInternalRole] = useState<'student' | 'client' | null>(null)
  const role: 'student' | 'client' = internalRole ?? (roleParam === 'client' ? 'client' : 'student')

  // Client mode: 'signin' or 'register'
  const [internalClientMode, setInternalClientMode] = useState<'signin' | 'register' | null>(null)
  const clientMode: 'signin' | 'register' =
    internalClientMode ?? (modeParam === 'register' ? 'register' : 'signin')

  // Shared / Student state
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [rememberMe, setRememberMe] = useState(true)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')

  // Client registration state
  const [companyName, setCompanyName] = useState('')
  const [contactName, setContactName] = useState('')
  const [designation, setDesignation] = useState('')
  const [website, setWebsite] = useState('')
  const [orgType, setOrgType] = useState('Seed / Early-stage Startup')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [selectedNeeds, setSelectedNeeds] = useState<string[]>([
    'Frontend / React',
    'UI/UX Design',
  ])

  const handleRoleChange = (newRole: 'student' | 'client') => {
    setInternalRole(newRole)
    setError('')
    setSearchParams({ role: newRole })
  }

  const handleClientModeChange = (newMode: 'signin' | 'register') => {
    setInternalClientMode(newMode)
    setError('')
    setSearchParams({ role: 'client', mode: newMode })
  }

  // Student email domain verification (.edu / .ac.in)
  const isEduEmail =
    email.toLowerCase().endsWith('.edu') ||
    email.toLowerCase().endsWith('.ac.in') ||
    email.toLowerCase().endsWith('.edu.in') ||
    email.toLowerCase().endsWith('.ac.uk') ||
    email.toLowerCase().includes('.edu.')

  // Client email business domain verification
  const emailDomain = email.split('@')[1]?.toLowerCase().trim() || ''
  const isBusinessEmail =
    emailDomain.length > 3 &&
    emailDomain.includes('.') &&
    !FREEMAIL_DOMAINS.includes(emailDomain)

  const isFreemail =
    emailDomain.length > 0 && FREEMAIL_DOMAINS.includes(emailDomain)

  const toggleTalentNeed = (cat: string) => {
    setSelectedNeeds((prev) =>
      prev.includes(cat) ? prev.filter((c) => c !== cat) : [...prev, cat]
    )
  }

  // Student Sign-In Submission
  const handleStudentSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!email.trim() || !password) {
      setError('Please enter both your email address and password.')
      return
    }

    setIsLoading(true)
    setError('')

    try {
      localStorage.setItem('peerconnect_active_role', 'student')
    } catch {
      // Ignore localStorage availability issues
    }

    setTimeout(() => {
      setIsLoading(false)
      navigate(`${routes.dashboard}?role=student`)
    }, 600)
  }

  // Student Quick Demo
  const handleStudentQuickDemo = () => {
    setEmail('sofia.rodriguez@nid.edu')
    setPassword('PeerConnect2026!')
    setIsLoading(true)
    setError('')

    try {
      localStorage.setItem('peerconnect_active_role', 'student')
    } catch {
      // ignore
    }

    setTimeout(() => {
      setIsLoading(false)
      navigate(`${routes.dashboard}?role=student`)
    }, 400)
  }

  // Client Sign-In Submission
  const handleClientSignIn = (e: React.FormEvent) => {
    e.preventDefault()
    if (!email.trim() || !password) {
      setError('Please enter both your work email and password.')
      return
    }

    setIsLoading(true)
    setError('')

    const resolvedCompany = companyName.trim() || 'Apex Studio & Labs'
    const clientData = {
      name: 'Vikram Sen',
      company: resolvedCompany,
      email: email.trim(),
      role: 'client',
      isVerifiedEmployer: isBusinessEmail,
    }

    try {
      localStorage.setItem('peerconnect_active_role', 'client')
      localStorage.setItem('peerconnect_client_auth', JSON.stringify(clientData))
    } catch {
      // ignore
    }

    setTimeout(() => {
      setIsLoading(false)
      navigate(`${routes.dashboard}?role=client`)
    }, 500)
  }

  // Client Quick Demo
  const handleClientQuickDemo = () => {
    setEmail('vikram.sen@apexstudio.co')
    setPassword('PeerConnectClient2026!')
    setCompanyName('Apex Studio & Labs')
    setIsLoading(true)
    setError('')

    const clientData = {
      name: 'Vikram Sen',
      company: 'Apex Studio & Labs',
      email: 'vikram.sen@apexstudio.co',
      role: 'client',
      isVerifiedEmployer: true,
    }

    try {
      localStorage.setItem('peerconnect_active_role', 'client')
      localStorage.setItem('peerconnect_client_auth', JSON.stringify(clientData))
    } catch {
      // ignore
    }

    setTimeout(() => {
      setIsLoading(false)
      navigate(`${routes.dashboard}?role=client`)
    }, 400)
  }

  // Client Registration Submission
  const handleClientRegister = (e: React.FormEvent) => {
    e.preventDefault()
    if (!companyName.trim() || !email.trim() || !password) {
      setError('Please provide company name, work email, and password.')
      return
    }
    if (password !== confirmPassword) {
      setError('Passwords do not match. Please verify both password fields.')
      return
    }

    setIsLoading(true)
    setError('')

    const newClientData = {
      name: contactName.trim() || 'Hiring Lead',
      company: companyName.trim(),
      email: email.trim(),
      designation: designation.trim() || 'Campus Talent Lead',
      website: website.trim(),
      orgType,
      selectedNeeds,
      role: 'client',
      isVerifiedEmployer: isBusinessEmail,
    }

    try {
      localStorage.setItem('peerconnect_active_role', 'client')
      localStorage.setItem('peerconnect_client_auth', JSON.stringify(newClientData))
    } catch {
      // ignore
    }

    setTimeout(() => {
      setIsLoading(false)
      navigate(`${routes.dashboard}?role=client`)
    }, 600)
  }

  return (
    <div className="min-h-[calc(100vh-80px)] bg-[#FAF8F5] flex items-center justify-center px-4 py-12 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-6">
        {/* Role Selector Tabs */}
        <div className="grid grid-cols-2 rounded-2xl bg-[#E7E8E1]/60 p-1.5 shadow-2xs">
          <button
            type="button"
            onClick={() => handleRoleChange('student')}
            className={`flex items-center justify-center gap-2 rounded-xl py-2.5 text-xs font-bold transition-all ${
              role === 'student'
                ? 'bg-white text-[#123D30] shadow-xs'
                : 'text-[#525A55] hover:text-[#171916]'
            }`}
          >
            <GraduationCap className="h-4 w-4" />
            <span>Student / Talent</span>
          </button>
          <button
            type="button"
            onClick={() => handleRoleChange('client')}
            className={`flex items-center justify-center gap-2 rounded-xl py-2.5 text-xs font-bold transition-all ${
              role === 'client'
                ? 'bg-[#123D30] text-[#08C58A] shadow-xs'
                : 'text-[#525A55] hover:text-[#171916]'
            }`}
          >
            <Briefcase className="h-4 w-4" />
            <span>Client / Employer</span>
          </button>
        </div>

        {/* Header */}
        <div className="text-center">
          <div
            className={`mx-auto flex h-12 w-12 items-center justify-center rounded-2xl shadow-xs transition-colors ${
              role === 'client'
                ? 'bg-[#123D30] text-[#08C58A]'
                : 'bg-[#123D30] text-[#08C58A]'
            }`}
          >
            {role === 'client' ? (
              <Building2 className="h-6 w-6" />
            ) : (
              <Sparkles className="h-6 w-6" />
            )}
          </div>

          <h1 className="mt-4 text-2xl font-black text-[#171916] sm:text-3xl">
            {role === 'client'
              ? clientMode === 'register'
                ? 'Register Your Company'
                : 'Client & Recruiter Sign In'
              : 'Welcome back to PeerConnect'}
          </h1>
          <p className="mt-1 text-xs text-[#525A55] sm:text-sm">
            {role === 'client'
              ? clientMode === 'register'
                ? 'Create a verified client account to post briefs and hire top campus talent.'
                : 'Sign in to access your company portal, manage project briefs, and hire student talent.'
              : 'Sign in to access your dashboard, squad messages, and project briefs.'}
          </p>
        </div>

        {/* -------------------- STUDENT SIGN IN -------------------- */}
        {role === 'student' && (
          <>
            {/* Demo Fast Login Banner */}
            <div className="rounded-2xl border border-[#08C58A]/30 bg-[#E3F4EB]/40 p-4 text-xs">
              <div className="flex items-center justify-between">
                <span className="font-bold text-[#123D30]">Quick Demo Access:</span>
                <span className="text-[10px] text-[#08A876] font-semibold">Ready-to-test</span>
              </div>
              <p className="mt-1 text-[#525A55]">
                One-click sign-in as verified student Sofia Rodriguez (National Institute of Design).
              </p>
              <button
                type="button"
                onClick={handleStudentQuickDemo}
                className="mt-2.5 w-full rounded-xl bg-[#123D30] py-2 text-xs font-bold text-white shadow-2xs hover:bg-[#0E3127] transition-all"
              >
                One-Click Demo Sign In →
              </button>
            </div>

            {/* Student Form Card */}
            <form
              onSubmit={handleStudentSubmit}
              className="rounded-2xl border border-[#E7E8E1] bg-white p-6 shadow-sm space-y-4"
            >
              {error && (
                <div className="rounded-xl bg-red-50 p-3 text-xs text-red-600 font-medium border border-red-200">
                  {error}
                </div>
              )}

              <div>
                <div className="flex items-center justify-between">
                  <label htmlFor="student-email" className="block text-xs font-bold text-[#171916]">
                    Email Address
                  </label>
                  {isEduEmail ? (
                    <span className="flex items-center gap-1 text-[11px] font-bold text-[#08A876]">
                      <CheckCircle2 className="h-3.5 w-3.5" />
                      ✓ Verified Institutional Email
                    </span>
                  ) : email.length > 5 ? (
                    <span className="text-[11px] text-[#777A72]">
                      Standard Email (No verified tick)
                    </span>
                  ) : null}
                </div>

                <div className="relative mt-1.5">
                  <Mail className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-[#777A72]" />
                  <input
                    id="student-email"
                    type="email"
                    required
                    placeholder="you@college.edu or personal email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className={`w-full rounded-xl border bg-white py-2.5 pl-10 pr-24 text-xs text-[#171916] outline-none transition focus:ring-2 sm:text-sm ${
                      isEduEmail
                        ? 'border-[#08C58A] focus:border-[#08C58A] focus:ring-[#08C58A]/20'
                        : 'border-[#E7E8E1] focus:border-[#08C58A] focus:ring-[#08C58A]/20'
                    }`}
                  />
                  <div className="absolute right-3 top-1/2 -translate-y-1/2">
                    {isEduEmail ? (
                      <Badge variant="green" size="sm" className="font-bold flex items-center gap-1">
                        <Check className="h-3 w-3 text-[#08A876]" /> Verified
                      </Badge>
                    ) : null}
                  </div>
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between">
                  <label htmlFor="student-pass" className="block text-xs font-bold text-[#171916]">
                    Password
                  </label>
                  <button
                    type="button"
                    onClick={() =>
                      alert(
                        'Demo notice: In this prototype, you can enter any password or use the Quick Demo Sign In above.'
                      )
                    }
                    className="text-xs text-[#08A876] hover:underline"
                  >
                    Forgot password?
                  </button>
                </div>
                <div className="relative mt-1.5">
                  <Lock className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-[#777A72]" />
                  <input
                    id="student-pass"
                    type={showPassword ? 'text' : 'password'}
                    required
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full rounded-xl border border-[#E7E8E1] bg-white py-2.5 pl-10 pr-10 text-xs text-[#171916] outline-none focus:border-[#08C58A] focus:ring-2 focus:ring-[#08C58A]/20 sm:text-sm"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-[#777A72] hover:text-[#171916]"
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between pt-1 text-xs">
                <label className="flex items-center gap-2 cursor-pointer text-[#525A55]">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="h-4 w-4 rounded border-[#CBD5E1] text-[#08C58A] focus:ring-[#08C58A]"
                  />
                  <span>Remember this session</span>
                </label>
              </div>

              <Button
                type="submit"
                variant="primary"
                size="md"
                disabled={isLoading}
                className="w-full"
              >
                {isLoading ? 'Signing in...' : 'Sign In as Student'}
                <ArrowRight className="h-4 w-4 ml-1.5" />
              </Button>

              <div className="flex items-center justify-center gap-1.5 pt-2 text-center text-xs text-[#777A72]">
                <ShieldCheck className="h-3.5 w-3.5 text-[#08A876]" />
                <span>Secure student workspace</span>
              </div>
            </form>

            <div className="space-y-2 text-center text-xs text-[#525A55]">
              <p>
                Don't have a student account yet?{' '}
                <Link to="/signup/student" className="font-bold text-[#08A876] hover:underline">
                  Register as a student
                </Link>
              </p>
              <p>
                Looking to hire students instead?{' '}
                <button
                  type="button"
                  onClick={() => handleRoleChange('client')}
                  className="font-bold text-[#123D30] hover:underline inline-flex items-center gap-1"
                >
                  <Briefcase className="h-3 w-3" /> Switch to Client Sign In
                </button>
              </p>
            </div>
          </>
        )}

        {/* -------------------- CLIENT / RECRUITER -------------------- */}
        {role === 'client' && (
          <>
            {/* Client Mode Switcher (Sign In vs Register) */}
            <div className="flex border-b border-[#E7E8E1] pb-1 text-xs">
              <button
                type="button"
                onClick={() => handleClientModeChange('signin')}
                className={`flex-1 pb-2 font-bold transition-all text-center border-b-2 ${
                  clientMode === 'signin'
                    ? 'border-[#08C58A] text-[#123D30]'
                    : 'border-transparent text-[#777A72] hover:text-[#171916]'
                }`}
              >
                Client Sign In
              </button>
              <button
                type="button"
                onClick={() => handleClientModeChange('register')}
                className={`flex-1 pb-2 font-bold transition-all text-center border-b-2 ${
                  clientMode === 'register'
                    ? 'border-[#08C58A] text-[#123D30]'
                    : 'border-transparent text-[#777A72] hover:text-[#171916]'
                }`}
              >
                Register Company
              </button>
            </div>

            {/* Quick Demo Access for Client */}
            {clientMode === 'signin' && (
              <div className="rounded-2xl border border-[#08C58A]/30 bg-[#E3F4EB]/40 p-4 text-xs">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-[#123D30]">Quick Demo Client Access:</span>
                  <span className="text-[10px] text-[#08A876] font-semibold">Ready-to-test</span>
                </div>
                <p className="mt-1 text-[#525A55]">
                  One-click sign-in as verified client <strong>Vikram Sen</strong> (Head of Campus Talent at <em>Apex Studio & Labs</em>).
                </p>
                <button
                  type="button"
                  onClick={handleClientQuickDemo}
                  className="mt-2.5 w-full rounded-xl bg-[#123D30] py-2 text-xs font-bold text-white shadow-2xs hover:bg-[#0E3127] transition-all"
                >
                  One-Click Demo Client Sign In →
                </button>
              </div>
            )}

            {/* Client Sign-In Form */}
            {clientMode === 'signin' && (
              <form
                onSubmit={handleClientSignIn}
                className="rounded-2xl border border-[#E7E8E1] bg-white p-6 shadow-sm space-y-4"
              >
                {error && (
                  <div className="rounded-xl bg-red-50 p-3 text-xs text-red-600 font-medium border border-red-200">
                    {error}
                  </div>
                )}

                {/* Company / Work Email */}
                <div>
                  <div className="flex items-center justify-between">
                    <label htmlFor="client-email" className="block text-xs font-bold text-[#171916]">
                      Company / Work Email
                    </label>
                    {isBusinessEmail ? (
                      <span className="flex items-center gap-1 text-[11px] font-bold text-[#08A876]">
                        <CheckCircle2 className="h-3.5 w-3.5" />
                        ✓ Verified Business Domain
                      </span>
                    ) : isFreemail ? (
                      <span className="text-[11px] text-amber-700 font-medium">
                        Work email recommended
                      </span>
                    ) : null}
                  </div>

                  <div className="relative mt-1.5">
                    <Mail className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-[#777A72]" />
                    <input
                      id="client-email"
                      type="email"
                      required
                      placeholder="e.g. vikram@apexstudio.co or name@company.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className={`w-full rounded-xl border bg-white py-2.5 pl-10 pr-24 text-xs text-[#171916] outline-none transition focus:ring-2 sm:text-sm ${
                        isBusinessEmail
                          ? 'border-[#08C58A] focus:border-[#08C58A] focus:ring-[#08C58A]/20'
                          : 'border-[#E7E8E1] focus:border-[#08C58A] focus:ring-[#08C58A]/20'
                      }`}
                    />
                    <div className="absolute right-3 top-1/2 -translate-y-1/2">
                      {isBusinessEmail ? (
                        <Badge variant="green" size="sm" className="font-bold flex items-center gap-1">
                          <Check className="h-3 w-3 text-[#08A876]" /> Employer
                        </Badge>
                      ) : null}
                    </div>
                  </div>
                  {isFreemail && (
                    <p className="mt-1 text-[11px] text-[#777A72]">
                      Using a corporate domain awards an instant verified employer badge.
                    </p>
                  )}
                </div>

                {/* Company Name (Optional / Quick Identifier) */}
                <div>
                  <label htmlFor="client-company" className="block text-xs font-bold text-[#171916]">
                    Company / Organization Name <span className="text-[#777A72] font-normal">(Optional)</span>
                  </label>
                  <div className="relative mt-1.5">
                    <Building2 className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-[#777A72]" />
                    <input
                      id="client-company"
                      type="text"
                      placeholder="e.g. Apex Studio & Labs or HyperScale AI"
                      value={companyName}
                      onChange={(e) => setCompanyName(e.target.value)}
                      className="w-full rounded-xl border border-[#E7E8E1] bg-white py-2.5 pl-10 pr-3 text-xs text-[#171916] outline-none focus:border-[#08C58A] focus:ring-2 focus:ring-[#08C58A]/20 sm:text-sm"
                    />
                  </div>
                </div>

                {/* Password */}
                <div>
                  <div className="flex items-center justify-between">
                    <label htmlFor="client-pass" className="block text-xs font-bold text-[#171916]">
                      Password
                    </label>
                    <button
                      type="button"
                      onClick={() =>
                        alert(
                          'Demo notice: In this prototype, you can enter any password or use the Quick Demo Client Sign In above.'
                        )
                      }
                      className="text-xs text-[#08A876] hover:underline"
                    >
                      Forgot password?
                    </button>
                  </div>
                  <div className="relative mt-1.5">
                    <Lock className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-[#777A72]" />
                    <input
                      id="client-pass"
                      type={showPassword ? 'text' : 'password'}
                      required
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full rounded-xl border border-[#E7E8E1] bg-white py-2.5 pl-10 pr-10 text-xs text-[#171916] outline-none focus:border-[#08C58A] focus:ring-2 focus:ring-[#08C58A]/20 sm:text-sm"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-[#777A72] hover:text-[#171916]"
                      aria-label={showPassword ? 'Hide password' : 'Show password'}
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-1 text-xs">
                  <label className="flex items-center gap-2 cursor-pointer text-[#525A55]">
                    <input
                      type="checkbox"
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                      className="h-4 w-4 rounded border-[#CBD5E1] text-[#08C58A] focus:ring-[#08C58A]"
                    />
                    <span>Remember company login</span>
                  </label>
                </div>

                <Button
                  type="submit"
                  variant="primary"
                  size="md"
                  disabled={isLoading}
                  className="w-full"
                >
                  {isLoading ? 'Accessing Client Portal...' : 'Sign In to Client Portal'}
                  <ArrowRight className="h-4 w-4 ml-1.5" />
                </Button>

                <div className="flex items-center justify-center gap-1.5 pt-2 text-center text-xs text-[#777A72]">
                  <ShieldCheck className="h-3.5 w-3.5 text-[#08A876]" />
                  <span>Verified employer workspace · Escrow protection</span>
                </div>
              </form>
            )}

            {/* Client Registration Form */}
            {clientMode === 'register' && (
              <form
                onSubmit={handleClientRegister}
                className="rounded-2xl border border-[#E7E8E1] bg-white p-6 shadow-sm space-y-4"
              >
                {error && (
                  <div className="rounded-xl bg-red-50 p-3 text-xs text-red-600 font-medium border border-red-200">
                    {error}
                  </div>
                )}

                {/* Company Name */}
                <div>
                  <label htmlFor="reg-company" className="block text-xs font-bold text-[#171916]">
                    Company / Organization Name <span className="text-red-500">*</span>
                  </label>
                  <div className="relative mt-1.5">
                    <Building2 className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-[#777A72]" />
                    <input
                      id="reg-company"
                      type="text"
                      required
                      placeholder="e.g. Apex Studio & Labs or HyperScale AI"
                      value={companyName}
                      onChange={(e) => setCompanyName(e.target.value)}
                      className="w-full rounded-xl border border-[#E7E8E1] bg-white py-2.5 pl-10 pr-3 text-xs text-[#171916] outline-none focus:border-[#08C58A] focus:ring-2 focus:ring-[#08C58A]/20 sm:text-sm"
                    />
                  </div>
                </div>

                {/* Work Email */}
                <div>
                  <div className="flex items-center justify-between">
                    <label htmlFor="reg-email" className="block text-xs font-bold text-[#171916]">
                      Work Email Address <span className="text-red-500">*</span>
                    </label>
                    {isBusinessEmail ? (
                      <span className="flex items-center gap-1 text-[11px] font-bold text-[#08A876]">
                        <CheckCircle2 className="h-3.5 w-3.5" />
                        ✓ Verified Business Domain
                      </span>
                    ) : null}
                  </div>
                  <div className="relative mt-1.5">
                    <Mail className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-[#777A72]" />
                    <input
                      id="reg-email"
                      type="email"
                      required
                      placeholder="e.g. vikram@apexstudio.co"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className={`w-full rounded-xl border bg-white py-2.5 pl-10 pr-20 text-xs text-[#171916] outline-none transition focus:ring-2 sm:text-sm ${
                        isBusinessEmail
                          ? 'border-[#08C58A] focus:border-[#08C58A] focus:ring-[#08C58A]/20'
                          : 'border-[#E7E8E1] focus:border-[#08C58A] focus:ring-[#08C58A]/20'
                      }`}
                    />
                    <div className="absolute right-3 top-1/2 -translate-y-1/2">
                      {isBusinessEmail ? (
                        <Badge variant="green" size="sm" className="font-bold">
                          Verified
                        </Badge>
                      ) : null}
                    </div>
                  </div>
                </div>

                {/* Contact Name & Role */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label htmlFor="reg-name" className="block text-xs font-bold text-[#171916]">
                      Your Name
                    </label>
                    <div className="relative mt-1.5">
                      <User className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-[#777A72]" />
                      <input
                        id="reg-name"
                        type="text"
                        placeholder="e.g. Vikram Sen"
                        value={contactName}
                        onChange={(e) => setContactName(e.target.value)}
                        className="w-full rounded-xl border border-[#E7E8E1] bg-white py-2.5 pl-10 pr-3 text-xs text-[#171916] outline-none focus:border-[#08C58A] focus:ring-2 focus:ring-[#08C58A]/20 sm:text-sm"
                      />
                    </div>
                  </div>
                  <div>
                    <label htmlFor="reg-designation" className="block text-xs font-bold text-[#171916]">
                      Your Role / Title
                    </label>
                    <div className="relative mt-1.5">
                      <Briefcase className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-[#777A72]" />
                      <input
                        id="reg-designation"
                        type="text"
                        placeholder="e.g. Founder / Talent Lead"
                        value={designation}
                        onChange={(e) => setDesignation(e.target.value)}
                        className="w-full rounded-xl border border-[#E7E8E1] bg-white py-2.5 pl-10 pr-3 text-xs text-[#171916] outline-none focus:border-[#08C58A] focus:ring-2 focus:ring-[#08C58A]/20 sm:text-sm"
                      />
                    </div>
                  </div>
                </div>

                {/* Website / LinkedIn */}
                <div>
                  <label htmlFor="reg-web" className="block text-xs font-bold text-[#171916]">
                    Company Website or LinkedIn
                  </label>
                  <div className="relative mt-1.5">
                    <Globe className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-[#777A72]" />
                    <input
                      id="reg-web"
                      type="url"
                      placeholder="https://apexstudio.co"
                      value={website}
                      onChange={(e) => setWebsite(e.target.value)}
                      className="w-full rounded-xl border border-[#E7E8E1] bg-white py-2.5 pl-10 pr-3 text-xs text-[#171916] outline-none focus:border-[#08C58A] focus:ring-2 focus:ring-[#08C58A]/20 sm:text-sm"
                    />
                  </div>
                </div>

                {/* Organization Type */}
                <div>
                  <label htmlFor="reg-org" className="block text-xs font-bold text-[#171916]">
                    Organization Category
                  </label>
                  <div className="relative mt-1.5">
                    <Layers className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-[#777A72]" />
                    <select
                      id="reg-org"
                      value={orgType}
                      onChange={(e) => setOrgType(e.target.value)}
                      className="w-full rounded-xl border border-[#E7E8E1] bg-white py-2.5 pl-10 pr-3 text-xs text-[#171916] outline-none focus:border-[#08C58A] focus:ring-2 focus:ring-[#08C58A]/20 sm:text-sm"
                    >
                      <option value="Seed / Early-stage Startup">Seed / Early-stage Startup</option>
                      <option value="Growth Scale-up (10-100)">Growth Scale-up (10-100)</option>
                      <option value="Design & Software Agency">Design & Software Agency</option>
                      <option value="Enterprise / Corporate">Enterprise / Corporate</option>
                      <option value="Campus Tech Club / Hackathon Sponsor">Campus Tech Club / Hackathon Sponsor</option>
                      <option value="Independent Founder">Independent Founder</option>
                    </select>
                  </div>
                </div>

                {/* Talent Needed */}
                <div>
                  <label className="block text-xs font-bold text-[#171916]">
                    Talent Categories You Hire For
                  </label>
                  <div className="mt-2 flex flex-wrap gap-1.5">
                    {TALENT_CATEGORIES.map((cat) => {
                      const isSelected = selectedNeeds.includes(cat)
                      return (
                        <button
                          key={cat}
                          type="button"
                          onClick={() => toggleTalentNeed(cat)}
                          className={`rounded-lg px-2.5 py-1 text-xs font-medium transition-all ${
                            isSelected
                              ? 'bg-[#123D30] text-[#08C58A] shadow-2xs'
                              : 'bg-[#F7F6F0] text-[#525A55] hover:bg-[#E7E8E1]'
                          }`}
                        >
                          {isSelected ? '✓ ' : '+ '}
                          {cat}
                        </button>
                      )
                    })}
                  </div>
                </div>

                {/* Passwords */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label htmlFor="reg-pass" className="block text-xs font-bold text-[#171916]">
                      Password
                    </label>
                    <input
                      id="reg-pass"
                      type="password"
                      required
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="mt-1.5 w-full rounded-xl border border-[#E7E8E1] bg-white py-2.5 px-3 text-xs text-[#171916] outline-none focus:border-[#08C58A] focus:ring-2 focus:ring-[#08C58A]/20 sm:text-sm"
                    />
                  </div>
                  <div>
                    <label htmlFor="reg-confirm" className="block text-xs font-bold text-[#171916]">
                      Confirm Password
                    </label>
                    <input
                      id="reg-confirm"
                      type="password"
                      required
                      placeholder="••••••••"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="mt-1.5 w-full rounded-xl border border-[#E7E8E1] bg-white py-2.5 px-3 text-xs text-[#171916] outline-none focus:border-[#08C58A] focus:ring-2 focus:ring-[#08C58A]/20 sm:text-sm"
                    />
                  </div>
                </div>

                <Button
                  type="submit"
                  variant="primary"
                  size="md"
                  disabled={isLoading}
                  className="w-full mt-2"
                >
                  {isLoading ? 'Creating Company Account...' : 'Create Employer Account & Start Hiring'}
                  <ArrowRight className="h-4 w-4 ml-1.5" />
                </Button>
              </form>
            )}

            {/* Client Links */}
            <div className="space-y-2 text-center text-xs text-[#525A55]">
              {clientMode === 'signin' ? (
                <p>
                  Need to post project briefs?{' '}
                  <button
                    type="button"
                    onClick={() => handleClientModeChange('register')}
                    className="font-bold text-[#08A876] hover:underline"
                  >
                    Register your company account
                  </button>
                </p>
              ) : (
                <p>
                  Already have a company account?{' '}
                  <button
                    type="button"
                    onClick={() => handleClientModeChange('signin')}
                    className="font-bold text-[#08A876] hover:underline"
                  >
                    Sign in to client portal
                  </button>
                </p>
              )}

              <p>
                Are you a student looking for teams or projects?{' '}
                <button
                  type="button"
                  onClick={() => handleRoleChange('student')}
                  className="font-bold text-[#123D30] hover:underline inline-flex items-center gap-1"
                >
                  <GraduationCap className="h-3 w-3" /> Switch to Student Sign In
                </button>
              </p>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
