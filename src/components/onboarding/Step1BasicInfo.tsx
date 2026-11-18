import { useState } from 'react'
import { Eye, EyeOff, Lock, Shield, User, Mail, Phone, Sparkles } from 'lucide-react'
import type { OnboardingBasicInfo, FormValidationErrors } from '../../types/onboarding'
import { evaluatePasswordStrength } from '../../lib/onboardingValidation'

interface Step1BasicInfoProps {
  data: OnboardingBasicInfo
  errors: FormValidationErrors
  onChange: (field: keyof OnboardingBasicInfo, value: string) => void
}

const avatarPresets = [
  { id: 'av-1', url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80', label: 'Sofia' },
  { id: 'av-2', url: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=400&q=80', label: 'Marcus' },
  { id: 'av-3', url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80', label: 'Liam' },
  { id: 'av-4', url: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=400&q=80', label: 'Ananya' },
  { id: 'av-5', url: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=400&q=80', label: 'Devon' },
]

export function Step1BasicInfo({ data, errors, onChange }: Step1BasicInfoProps) {
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  const passwordStrength = evaluatePasswordStrength(data.password)

  return (
    <div className="space-y-6">
      {/* Step Header */}
      <div>
        <p className="text-xs font-bold uppercase tracking-wider text-[#08A876]">
          Step 1 of 6 · Account Credentials
        </p>
        <h2 className="mt-1 text-2xl font-black text-[#171916]">
          Let's establish your student credentials.
        </h2>
        <p className="mt-1 text-xs text-[#525A55] sm:text-sm">
          Your credentials secure your account. Your personal phone and email remain private by default.
        </p>
      </div>

      {/* Avatar Selection */}
      <div className="rounded-2xl border border-[#E7E8E1] bg-[#FAF8F5] p-4.5">
        <label className="block text-xs font-bold text-[#171916]">
          Profile Avatar (Optional)
        </label>
        <div className="mt-3 flex flex-wrap items-center gap-3">
          <img
            src={data.avatarUrl || avatarPresets[0].url}
            alt="Current avatar preview"
            className="h-16 w-16 rounded-2xl border-2 border-white object-cover shadow-sm ring-2 ring-[#08C58A]/30"
          />
          <div className="flex-1 space-y-1">
            <span className="text-xs font-medium text-[#525A55]">
              Choose a preset or enter an image URL:
            </span>
            <div className="flex flex-wrap gap-2 pt-1">
              {avatarPresets.map((preset) => (
                <button
                  key={preset.id}
                  type="button"
                  onClick={() => onChange('avatarUrl', preset.url)}
                  className={`h-9 w-9 rounded-xl overflow-hidden border-2 transition-all ${
                    data.avatarUrl === preset.url
                      ? 'border-[#08C58A] scale-105 shadow-xs'
                      : 'border-transparent opacity-70 hover:opacity-100'
                  }`}
                >
                  <img src={preset.url} alt={preset.label} className="h-full w-full object-cover" />
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Basic Inputs Grid */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        {/* Full Name */}
        <div>
          <label htmlFor="reg-name" className="block text-xs font-bold text-[#171916]">
            Full Name *
          </label>
          <div className="relative mt-1.5">
            <User className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-[#777A72]" />
            <input
              id="reg-name"
              type="text"
              required
              placeholder="e.g. Sofia Rodriguez"
              value={data.fullName}
              onChange={(e) => onChange('fullName', e.target.value)}
              className={`w-full rounded-xl border bg-white py-2.5 pl-10 pr-3.5 text-xs text-[#171916] outline-none transition focus:ring-2 sm:text-sm ${
                errors.fullName
                  ? 'border-red-400 focus:border-red-500 focus:ring-red-100'
                  : 'border-[#E7E8E1] focus:border-[#08C58A] focus:ring-[#08C58A]/20'
              }`}
            />
          </div>
          {errors.fullName && (
            <p className="mt-1 text-xs text-red-600 font-medium">{errors.fullName}</p>
          )}
        </div>

        {/* Professional Headline */}
        <div>
          <label htmlFor="reg-headline" className="block text-xs font-bold text-[#171916]">
            Professional Headline
          </label>
          <div className="relative mt-1.5">
            <Sparkles className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-[#777A72]" />
            <input
              id="reg-headline"
              type="text"
              placeholder="e.g. Design Engineer & Frontend Architect"
              value={data.headline}
              onChange={(e) => onChange('headline', e.target.value)}
              className="w-full rounded-xl border border-[#E7E8E1] bg-white py-2.5 pl-10 pr-3.5 text-xs text-[#171916] outline-none transition focus:border-[#08C58A] focus:ring-2 focus:ring-[#08C58A]/20 sm:text-sm"
            />
          </div>
          <span className="mt-1 block text-[11px] text-[#777A72]">
            A short phrase describing your focus (shown on your talent card)
          </span>
        </div>

        {/* Email Address */}
        <div>
          <label htmlFor="reg-email" className="block text-xs font-bold text-[#171916]">
            Personal Email Address *
          </label>
          <div className="relative mt-1.5">
            <Mail className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-[#777A72]" />
            <input
              id="reg-email"
              type="email"
              required
              placeholder="you@gmail.com"
              value={data.email}
              onChange={(e) => onChange('email', e.target.value)}
              className={`w-full rounded-xl border bg-white py-2.5 pl-10 pr-3.5 text-xs text-[#171916] outline-none transition focus:ring-2 sm:text-sm ${
                errors.email
                  ? 'border-red-400 focus:border-red-500 focus:ring-red-100'
                  : 'border-[#E7E8E1] focus:border-[#08C58A] focus:ring-[#08C58A]/20'
              }`}
            />
          </div>
          {errors.email && (
            <p className="mt-1 text-xs text-red-600 font-medium">{errors.email}</p>
          )}
        </div>

        {/* Phone Number */}
        <div>
          <label htmlFor="reg-phone" className="block text-xs font-bold text-[#171916]">
            Mobile Number *
          </label>
          <div className="relative mt-1.5">
            <Phone className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-[#777A72]" />
            <input
              id="reg-phone"
              type="tel"
              required
              placeholder="98765 43210"
              value={data.phone}
              onChange={(e) => onChange('phone', e.target.value)}
              className={`w-full rounded-xl border bg-white py-2.5 pl-10 pr-3.5 text-xs text-[#171916] outline-none transition focus:ring-2 sm:text-sm ${
                errors.phone
                  ? 'border-red-400 focus:border-red-500 focus:ring-red-100'
                  : 'border-[#E7E8E1] focus:border-[#08C58A] focus:ring-[#08C58A]/20'
              }`}
            />
          </div>
          {errors.phone ? (
            <p className="mt-1 text-xs text-red-600 font-medium">{errors.phone}</p>
          ) : (
            <span className="mt-1 flex items-center gap-1 text-[11px] text-[#777A72]">
              <Shield className="h-3 w-3 text-[#08A876]" />
              Kept private. Used only for urgent collaboration updates.
            </span>
          )}
        </div>
      </div>

      {/* Password & Confirm Password */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        {/* Password */}
        <div>
          <label htmlFor="reg-password" className="block text-xs font-bold text-[#171916]">
            Password *
          </label>
          <div className="relative mt-1.5">
            <Lock className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-[#777A72]" />
            <input
              id="reg-password"
              type={showPassword ? 'text' : 'password'}
              required
              placeholder="Min. 8 characters"
              value={data.password}
              onChange={(e) => onChange('password', e.target.value)}
              className={`w-full rounded-xl border bg-white py-2.5 pl-10 pr-10 text-xs text-[#171916] outline-none transition focus:ring-2 sm:text-sm ${
                errors.password
                  ? 'border-red-400 focus:border-red-500 focus:ring-red-100'
                  : 'border-[#E7E8E1] focus:border-[#08C58A] focus:ring-[#08C58A]/20'
              }`}
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
          {errors.password && (
            <p className="mt-1 text-xs text-red-600 font-medium">{errors.password}</p>
          )}

          {/* Password strength meter */}
          {data.password && (
            <div className="mt-2.5 space-y-1.5">
              <div className="flex items-center justify-between text-[11px]">
                <span className="font-semibold text-[#525A55]">Strength:</span>
                <span className="font-bold" style={{ color: passwordStrength.color }}>
                  {passwordStrength.label}
                </span>
              </div>
              <div className="h-1.5 w-full overflow-hidden rounded-full bg-[#E7E8E1]">
                <div
                  className="h-full rounded-full transition-all duration-300"
                  style={{
                    width: `${(passwordStrength.score / 4) * 100}%`,
                    backgroundColor: passwordStrength.color,
                  }}
                />
              </div>
              <div className="grid grid-cols-2 gap-1 pt-1 text-[10px] text-[#777A72]">
                {passwordStrength.requirements.map((req, i) => (
                  <span key={i} className={req.met ? 'text-[#08A876] font-semibold' : ''}>
                    {req.met ? '✓' : '•'} {req.label}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Confirm Password */}
        <div>
          <label htmlFor="reg-confirm-password" className="block text-xs font-bold text-[#171916]">
            Confirm Password *
          </label>
          <div className="relative mt-1.5">
            <Lock className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-[#777A72]" />
            <input
              id="reg-confirm-password"
              type={showConfirmPassword ? 'text' : 'password'}
              required
              placeholder="Re-enter password"
              value={data.confirmPassword}
              onChange={(e) => onChange('confirmPassword', e.target.value)}
              className={`w-full rounded-xl border bg-white py-2.5 pl-10 pr-10 text-xs text-[#171916] outline-none transition focus:ring-2 sm:text-sm ${
                errors.confirmPassword
                  ? 'border-red-400 focus:border-red-500 focus:ring-red-100'
                  : 'border-[#E7E8E1] focus:border-[#08C58A] focus:ring-[#08C58A]/20'
              }`}
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-[#777A72] hover:text-[#171916]"
              aria-label={showConfirmPassword ? 'Hide password' : 'Show password'}
            >
              {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>
          {errors.confirmPassword && (
            <p className="mt-1 text-xs text-red-600 font-medium">{errors.confirmPassword}</p>
          )}
        </div>
      </div>
    </div>
  )
}
