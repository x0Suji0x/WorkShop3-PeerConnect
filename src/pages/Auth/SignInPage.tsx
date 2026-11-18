import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Mail, Lock, Eye, EyeOff, Sparkles, CheckCircle2, Check, ArrowRight, ShieldCheck } from 'lucide-react'
import { routes } from '../../app/routes'
import { Button } from '../../components/common/Button'
import { Badge } from '../../components/common/Badge'

export function SignInPage() {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [rememberMe, setRememberMe] = useState(true)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')

  // Check if sign-in email is an institutional educational email (.edu / .ac.in)
  const isEduEmail =
    email.toLowerCase().endsWith('.edu') ||
    email.toLowerCase().endsWith('.ac.in') ||
    email.toLowerCase().endsWith('.edu.in') ||
    email.toLowerCase().endsWith('.ac.uk') ||
    email.toLowerCase().includes('.edu.')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!email.trim() || !password) {
      setError('Please enter both your email address and password.')
      return
    }

    setIsLoading(true)
    setError('')

    setTimeout(() => {
      setIsLoading(false)
      navigate(routes.dashboard)
    }, 600)
  }

  const handleQuickDemoSignIn = () => {
    setEmail('sofia.rodriguez@nid.edu')
    setPassword('PeerConnect2026!')
    setIsLoading(true)
    setTimeout(() => {
      setIsLoading(false)
      navigate(routes.dashboard)
    }, 400)
  }

  return (
    <div className="min-h-[calc(100vh-80px)] bg-[#FAF8F5] flex items-center justify-center px-4 py-12 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-6">
        {/* Header */}
        <div className="text-center">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-[#123D30] text-[#08C58A] shadow-xs">
            <Sparkles className="h-6 w-6" />
          </div>
          <h1 className="mt-4 text-2xl font-black text-[#171916] sm:text-3xl">
            Welcome back to PeerConnect
          </h1>
          <p className="mt-1 text-xs text-[#525A55] sm:text-sm">
            Sign in to access your dashboard, squad messages, and project briefs.
          </p>
        </div>

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
            onClick={handleQuickDemoSignIn}
            className="mt-2.5 w-full rounded-xl bg-[#123D30] py-2 text-xs font-bold text-white shadow-2xs hover:bg-[#0E3127] transition-all"
          >
            One-Click Demo Sign In →
          </button>
        </div>

        {/* Form Card */}
        <form
          onSubmit={handleSubmit}
          className="rounded-2xl border border-[#E7E8E1] bg-white p-6 shadow-sm space-y-4"
        >
          {error && (
            <div className="rounded-xl bg-red-50 p-3 text-xs text-red-600 font-medium border border-red-200">
              {error}
            </div>
          )}

          <div>
            <div className="flex items-center justify-between">
              <label htmlFor="login-email" className="block text-xs font-bold text-[#171916]">
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
                id="login-email"
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
              <label htmlFor="login-pass" className="block text-xs font-bold text-[#171916]">
                Password
              </label>
              <button
                type="button"
                onClick={() => alert('Demo notice: In this prototype, you can enter any password or use the Quick Demo Sign In above.')}
                className="text-xs text-[#08A876] hover:underline"
              >
                Forgot password?
              </button>
            </div>
            <div className="relative mt-1.5">
              <Lock className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-[#777A72]" />
              <input
                id="login-pass"
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

          <Button type="submit" variant="primary" size="md" disabled={isLoading} className="w-full">
            {isLoading ? 'Signing in...' : 'Sign In'}
            <ArrowRight className="h-4 w-4 ml-1.5" />
          </Button>

          <div className="flex items-center justify-center gap-1.5 pt-2 text-center text-xs text-[#777A72]">
            <ShieldCheck className="h-3.5 w-3.5 text-[#08A876]" />
            <span>Secure student workspace</span>
          </div>
        </form>

        <p className="text-center text-xs text-[#525A55]">
          Don't have an account yet?{' '}
          <Link to="/signup" className="font-bold text-[#08A876] hover:underline">
            Register as a student
          </Link>
        </p>
      </div>
    </div>
  )
}
