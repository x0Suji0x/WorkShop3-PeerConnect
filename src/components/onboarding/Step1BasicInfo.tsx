import { useState, useRef } from 'react'
import {
  Eye,
  EyeOff,
  Lock,
  User,
  Mail,
  Phone,
  Sparkles,
  Upload,
  CheckCircle2,
  Trash2,
  ZoomIn,
  RefreshCw,
  Check,
  ShieldCheck,
  AlertCircle,
  Camera,
  Image as ImageIcon,
} from 'lucide-react'
import type { OnboardingBasicInfo, FormValidationErrors } from '../../types/onboarding'
import { evaluatePasswordStrength } from '../../lib/onboardingValidation'
import { Badge } from '../common/Badge'

interface Step1BasicInfoProps {
  data: OnboardingBasicInfo
  errors: FormValidationErrors
  onChange: (field: keyof OnboardingBasicInfo, value: string | boolean) => void
}

const AVATAR_PRESETS = [
  { id: 'av-1', url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80', label: 'Sofia' },
  { id: 'av-2', url: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=400&q=80', label: 'Marcus' },
  { id: 'av-3', url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80', label: 'Liam' },
  { id: 'av-4', url: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=400&q=80', label: 'Ananya' },
  { id: 'av-5', url: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=400&q=80', label: 'Devon' },
  { id: 'av-6', url: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=400&q=80', label: 'Elena' },
]

// Avatar Builder options
const SKIN_TONES = [
  { label: 'Fair Light', color: '#FDDFCC' },
  { label: 'Warm Beige', color: '#F3C7A5' },
  { label: 'Honey Gold', color: '#D99B77' },
  { label: 'Olive Bronze', color: '#BA7854' },
  { label: 'Caramel', color: '#8C5338' },
  { label: 'Deep Espresso', color: '#543224' },
]

const HAIR_STYLES = [
  { id: 'short', label: 'Crew Cut' },
  { id: 'curly', label: 'Curly Volume' },
  { id: 'waves', label: 'Long Waves' },
  { id: 'bob', label: 'Classic Bob' },
  { id: 'bun', label: 'Top Bun' },
  { id: 'afro', label: 'Afro Taper' },
]

const HAIR_COLORS = [
  { label: 'Jet Black', color: '#18181B' },
  { label: 'Deep Brown', color: '#451A03' },
  { label: 'Honey Brown', color: '#B45309' },
  { label: 'Auburn', color: '#991B1B' },
  { label: 'Silver Gray', color: '#64748B' },
]

const OUTFIT_COLORS = [
  { label: 'Forest Green', color: '#123D30' },
  { label: 'Peer Mint', color: '#08C58A' },
  { label: 'Navy Blue', color: '#1E3A8A' },
  { label: 'Warm Amber', color: '#D97706' },
  { label: 'Burgundy', color: '#881337' },
  { label: 'Charcoal', color: '#334155' },
]

const BG_COLORS = [
  { label: 'Warm Ivory', color: '#FAF8F5' },
  { label: 'Mint Soft', color: '#E3F4EB' },
  { label: 'Sky Tint', color: '#E0F2FE' },
  { label: 'Lavender', color: '#EDE9FE' },
  { label: 'Peach Tint', color: '#FFEDD5' },
  { label: 'Sage Tint', color: '#ECFDF5' },
]

const ACCESSORIES = [
  { id: 'none', label: 'None' },
  { id: 'glasses', label: 'Eyeglasses' },
  { id: 'sunglasses', label: 'Sunglasses' },
  { id: 'headphones', label: 'Headphones' },
]

// Professional Headline Suggestions Pool
const HEADLINE_SUGGESTIONS = [
  {
    category: 'Software & Web',
    headline: 'Aspiring Software Developer | React & TypeScript Enthusiast',
  },
  {
    category: 'AI & Data Science',
    headline: 'Computer Science Student | AI/ML & LLM Explorer',
  },
  {
    category: 'UI/UX & Design',
    headline: 'UI/UX Designer | Building User-Centred Digital Experiences',
  },
  {
    category: 'Full-Stack',
    headline: 'Full-Stack Developer | Open to Freelance & Startup Projects',
  },
  {
    category: 'Hardware & IoT',
    headline: 'Engineering Student | Interested in Robotics & Innovation',
  },
  {
    category: 'Creative Media',
    headline: 'Video Editor & Motion Designer | Creative Content Specialist',
  },
  {
    category: 'Cloud & Systems',
    headline: 'Backend Developer | Node.js, Python & Cloud Architecture',
  },
  {
    category: 'Data Analytics',
    headline: 'Data Science Scholar | Predictive Modeling & Business Insights',
  },
  {
    category: 'Product & Tech',
    headline: 'Student Product Builder | Passionate About Campus Innovation',
  },
]

// Personal domain blacklist for institutional email
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

// Detect a common academic email format only; this does not verify a student.
function hasAcademicEmailFormat(emailStr: string): boolean {
  const trimmed = emailStr.trim().toLowerCase()
  if (!trimmed.includes('@')) return false
  const parts = trimmed.split('@')
  if (parts.length !== 2 || !parts[1]) return false
  const domain = parts[1]

  // Exclude common personal email domains from the format hint.
  if (PERSONAL_EMAIL_DOMAINS.some((d) => domain === d || domain.endsWith('.' + d))) {
    return false
  }

  // Must end in .edu or .ac.in or .edu.in or .ac.uk
  return (
    domain.endsWith('.edu') ||
    domain.endsWith('.ac.in') ||
    domain.endsWith('.edu.in') ||
    domain.endsWith('.ac.uk') ||
    domain.includes('.edu.') ||
    domain.includes('.ac.')
  )
}

export function Step1BasicInfo({ data, errors, onChange }: Step1BasicInfoProps) {
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [avatarTab, setAvatarTab] = useState<'upload' | 'builder'>('upload')
  const [zoomLevel, setZoomLevel] = useState(1)
  const [isDragOver, setIsDragOver] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const refFileInputRef = useRef<HTMLInputElement>(null)

  // Suggestion rotation index
  const [suggestionBatch, setSuggestionBatch] = useState(0)

  // Avatar Builder state
  const [avatarConfig, setAvatarConfig] = useState({
    skinTone: SKIN_TONES[1].color,
    hairStyle: HAIR_STYLES[0].id,
    hairColor: HAIR_COLORS[0].color,
    outfitColor: OUTFIT_COLORS[0].color,
    bgColor: BG_COLORS[1].color,
    accessory: ACCESSORIES[0].id,
  })

  const passwordStrength = evaluatePasswordStrength(data.password)

  // This is only a format hint, not an identity or enrollment check.
  const hasAcademicFormat = hasAcademicEmailFormat(data.email)

  // Email text alone never marks a profile as verified.
  const handleEmailChange = (val: string) => {
    onChange('email', val)
  }

  // Phone number handler: limit strictly to 10 digits
  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawVal = e.target.value
    // Strip non-digits and cap at exactly 10 digits
    const digitsOnly = rawVal.replace(/\D/g, '').slice(0, 10)
    onChange('phone', digitsOnly)
  }

  // Handle device file upload with instant preview
  const handleFileChosen = (file: File) => {
    const validTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/jpg']
    if (!validTypes.includes(file.type)) {
      alert('Please select a valid image file (JPG, PNG, or WebP).')
      return
    }

    const reader = new FileReader()
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        onChange('avatarUrl', reader.result)
        setZoomLevel(1)
      }
    }
    reader.readAsDataURL(file)
  }

  const handleDeviceUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) handleFileChosen(file)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(false)
    const file = e.dataTransfer.files?.[0]
    if (file) handleFileChosen(file)
  }

  // Generate SVG avatar Data URL
  const generateSvgAvatarUrl = () => {
    const { skinTone, hairStyle, hairColor, outfitColor, bgColor, accessory } = avatarConfig

    let hairSvg = ''
    if (hairStyle === 'short') {
      hairSvg = `<path d="M 30 50 C 30 20, 70 20, 70 50 C 70 42, 65 32, 50 32 C 35 32, 30 42, 30 50 Z" fill="${hairColor}" />`
    } else if (hairStyle === 'curly') {
      hairSvg = `
        <circle cx="36" cy="36" r="14" fill="${hairColor}" />
        <circle cx="50" cy="30" r="16" fill="${hairColor}" />
        <circle cx="64" cy="36" r="14" fill="${hairColor}" />
        <circle cx="28" cy="46" r="10" fill="${hairColor}" />
        <circle cx="72" cy="46" r="10" fill="${hairColor}" />
      `
    } else if (hairStyle === 'waves') {
      hairSvg = `
        <path d="M 28 50 C 26 22, 74 22, 72 50 C 72 75, 78 80, 78 85 C 72 85, 70 70, 70 55 C 65 34, 35 34, 30 55 C 30 70, 28 85, 22 85 C 22 80, 28 75, 28 50 Z" fill="${hairColor}" />
      `
    } else if (hairStyle === 'bob') {
      hairSvg = `
        <path d="M 28 55 C 26 24, 74 24, 72 55 L 74 68 C 70 68, 68 55, 68 50 C 65 34, 35 34, 32 50 C 32 55, 30 68, 26 68 Z" fill="${hairColor}" />
      `
    } else if (hairStyle === 'bun') {
      hairSvg = `
        <circle cx="50" cy="22" r="12" fill="${hairColor}" />
        <path d="M 30 50 C 30 28, 70 28, 70 50 C 70 42, 65 34, 50 34 C 35 34, 30 42, 30 50 Z" fill="${hairColor}" />
      `
    } else {
      hairSvg = `<circle cx="50" cy="45" r="28" fill="${hairColor}" />`
    }

    let accessorySvg = ''
    if (accessory === 'glasses') {
      accessorySvg = `
        <circle cx="42" cy="52" r="6" fill="none" stroke="#1E293B" stroke-width="2" />
        <circle cx="58" cy="52" r="6" fill="none" stroke="#1E293B" stroke-width="2" />
        <line x1="48" y1="52" x2="52" y2="52" stroke="#1E293B" stroke-width="2" />
      `
    } else if (accessory === 'sunglasses') {
      accessorySvg = `
        <rect x="35" y="47" width="13" height="9" rx="3" fill="#0F172A" />
        <rect x="52" y="47" width="13" height="9" rx="3" fill="#0F172A" />
        <line x1="48" y1="51" x2="52" y2="51" stroke="#0F172A" stroke-width="2" />
      `
    } else if (accessory === 'headphones') {
      accessorySvg = `
        <path d="M 24 55 A 26 26 0 0 1 76 55" fill="none" stroke="#334155" stroke-width="4" stroke-linecap="round" />
        <rect x="22" y="50" width="6" height="14" rx="3" fill="#08C58A" />
        <rect x="72" y="50" width="6" height="14" rx="3" fill="#08C58A" />
      `
    }

    const svg = `
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="200" height="200">
        <circle cx="50" cy="50" r="50" fill="${bgColor}" />
        <path d="M 18 100 C 18 78, 34 74, 50 74 C 66 74, 82 78, 82 100 Z" fill="${outfitColor}" />
        <path d="M 42 74 L 50 84 L 58 74 Z" fill="${skinTone}" />
        <rect x="44" y="65" width="12" height="14" rx="2" fill="${skinTone}" />
        <circle cx="50" cy="52" r="18" fill="${skinTone}" />
        ${hairSvg}
        <circle cx="43" cy="52" r="2.2" fill="#171916" />
        <circle cx="57" cy="52" r="2.2" fill="#171916" />
        <path d="M 45 61 Q 50 65 55 61" fill="none" stroke="#171916" stroke-width="1.8" stroke-linecap="round" />
        ${accessorySvg}
      </svg>
    `.trim()

    return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`
  }

  const handleApplyCustomAvatar = () => {
    const url = generateSvgAvatarUrl()
    onChange('avatarUrl', url)
  }

  // Display 3 headlines at a time
  const displayedHeadlines = [
    HEADLINE_SUGGESTIONS[(suggestionBatch * 3) % HEADLINE_SUGGESTIONS.length],
    HEADLINE_SUGGESTIONS[(suggestionBatch * 3 + 1) % HEADLINE_SUGGESTIONS.length],
    HEADLINE_SUGGESTIONS[(suggestionBatch * 3 + 2) % HEADLINE_SUGGESTIONS.length],
  ]

  const maxLength = 100
  const currentHeadlineLength = data.headline?.length || 0

  return (
    <div className="space-y-6">
      {/* Step Header */}
      <div>
        <p className="text-xs font-bold uppercase tracking-wider text-[#08A876]">
          Step 1 of 6 · Essential Student Identity
        </p>
        <h2 className="mt-1 text-2xl font-black text-[#171916]">
          Let's establish your student profile.
        </h2>
        <p className="mt-1 text-xs text-[#525A55] sm:text-sm">
          Completing this step creates your PeerConnect profile. You can complete the remaining details now or skip to your dashboard anytime.
        </p>
      </div>

      {/* Profile Picture & Custom Avatar Card (Enhanced) */}
      <div className="rounded-3xl border border-[#E7E8E1] bg-white p-5 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-b border-[#F2F1EA] pb-3">
          <div>
            <div className="flex items-center gap-2">
              <Camera className="h-4 w-4 text-[#08A876]" />
              <h3 className="text-sm font-bold text-[#171916]">Profile Photo & Avatar</h3>
            </div>
            <p className="mt-0.5 text-xs text-[#777A72]">
              Upload a picture from your device or design a custom personal avatar
            </p>
          </div>

          <div className="flex rounded-xl bg-[#FAF8F5] p-1 border border-[#E7E8E1] shrink-0">
            <button
              type="button"
              onClick={() => setAvatarTab('upload')}
              className={`rounded-lg px-3 py-1.5 text-xs font-bold transition ${
                avatarTab === 'upload' ? 'bg-[#123D30] text-white shadow-xs' : 'text-[#777A72] hover:text-[#171916]'
              }`}
            >
              Upload Photo from Device
            </button>
            <button
              type="button"
              onClick={() => setAvatarTab('builder')}
              className={`rounded-lg px-3 py-1.5 text-xs font-bold transition ${
                avatarTab === 'builder' ? 'bg-[#123D30] text-white shadow-xs' : 'text-[#777A72] hover:text-[#171916]'
              }`}
            >
              Build Custom Avatar
            </button>
          </div>
        </div>

        {avatarTab === 'upload' ? (
          /* TAB 1: DEVICE UPLOAD DROPZONE & PRESETS */
          <div className="space-y-4">
            <div className="flex flex-col md:flex-row items-center gap-6">
              {/* Main Avatar Preview (Large & Clear) */}
              <div className="flex flex-col items-center shrink-0">
                <div className="relative group">
                  <div className="relative h-32 w-32 overflow-hidden rounded-full border-4 border-white bg-[#F7F6F0] shadow-lg ring-2 ring-[#08C58A]/40">
                    <img
                      src={data.avatarUrl || AVATAR_PRESETS[0].url}
                      alt="Profile preview"
                      className="h-full w-full object-cover transition-transform duration-150"
                      style={{ transform: `scale(${zoomLevel})` }}
                    />
                  </div>

                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="absolute bottom-1 right-1 flex h-8 w-8 items-center justify-center rounded-full bg-[#123D30] text-white shadow-md hover:bg-[#08C58A] transition"
                    title="Change picture"
                  >
                    <Camera className="h-4 w-4" />
                  </button>
                </div>

                <div className="mt-2 flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="text-xs font-bold text-[#123D30] hover:text-[#08C58A] transition underline"
                  >
                    Change Photo
                  </button>
                  <span className="text-[#777A72]">•</span>
                  <button
                    type="button"
                    onClick={() => onChange('avatarUrl', AVATAR_PRESETS[0].url)}
                    className="text-xs text-red-600 hover:underline flex items-center gap-0.5"
                  >
                    <Trash2 className="h-3 w-3" /> Reset
                  </button>
                </div>
              </div>

              {/* Upload Dropzone */}
              <div className="flex-1 w-full space-y-3">
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/jpeg,image/png,image/webp,image/jpg"
                  onChange={handleDeviceUpload}
                  className="hidden"
                />

                <div
                  onDragOver={(e) => {
                    e.preventDefault()
                    setIsDragOver(true)
                  }}
                  onDragLeave={() => setIsDragOver(false)}
                  onDrop={handleDrop}
                  onClick={() => fileInputRef.current?.click()}
                  className={`flex flex-col items-center justify-center rounded-2xl border-2 border-dashed p-5 text-center cursor-pointer transition ${
                    isDragOver
                      ? 'border-[#08C58A] bg-[#E3F4EB]/50'
                      : 'border-[#E7E8E1] bg-[#FAF8F5] hover:border-[#08C58A]/50 hover:bg-[#F2F1EA]/60'
                  }`}
                >
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white shadow-xs text-[#08A876]">
                    <Upload className="h-5 w-5" />
                  </div>
                  <p className="mt-2 text-xs font-bold text-[#171916]">
                    Click to browse or drag and drop your photo
                  </p>
                  <p className="mt-0.5 text-[11px] text-[#777A72]">
                    High quality JPG, PNG, or WebP (max 10MB)
                  </p>
                </div>

                {/* Live Zoom Slider */}
                <div className="flex items-center justify-between rounded-xl border border-[#E7E8E1] bg-[#FAF8F5] px-3.5 py-2">
                  <span className="flex items-center gap-1.5 text-xs font-bold text-[#171916]">
                    <ZoomIn className="h-3.5 w-3.5 text-[#08A876]" /> Adjust Zoom:
                  </span>
                  <div className="flex items-center gap-3 flex-1 max-w-xs ml-4">
                    <input
                      type="range"
                      min="1"
                      max="2.5"
                      step="0.05"
                      value={zoomLevel}
                      onChange={(e) => setZoomLevel(parseFloat(e.target.value))}
                      className="w-full accent-[#08C58A]"
                    />
                    <span className="font-mono text-xs text-[#525A55] min-w-8">
                      {zoomLevel.toFixed(1)}x
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Presets Gallery */}
            <div className="border-t border-[#F2F1EA] pt-3">
              <span className="block text-xs font-bold text-[#171916] mb-2">
                Or select from diverse student portraits:
              </span>
              <div className="flex flex-wrap gap-2.5">
                {AVATAR_PRESETS.map((preset) => (
                  <button
                    key={preset.id}
                    type="button"
                    onClick={() => {
                      onChange('avatarUrl', preset.url)
                      setZoomLevel(1)
                    }}
                    className={`h-11 w-11 rounded-full overflow-hidden border-2 transition ${
                      data.avatarUrl === preset.url
                        ? 'border-[#08C58A] scale-110 ring-2 ring-[#08C58A]/30 shadow-xs'
                        : 'border-transparent opacity-70 hover:opacity-100 hover:scale-105'
                    }`}
                  >
                    <img src={preset.url} alt={preset.label} className="h-full w-full object-cover" />
                  </button>
                ))}
              </div>
            </div>
          </div>
        ) : (
          /* TAB 2: CUSTOM SVG AVATAR BUILDER */
          <div className="space-y-4">
            <div className="flex flex-col md:flex-row items-center gap-6">
              {/* Live SVG Avatar Preview */}
              <div className="flex flex-col items-center shrink-0">
                <div
                  className="h-32 w-32 overflow-hidden rounded-full border-4 border-white shadow-lg ring-2 ring-[#08C58A]/40 flex items-center justify-center transition-all"
                  style={{ backgroundColor: avatarConfig.bgColor }}
                >
                  <img
                    src={generateSvgAvatarUrl()}
                    alt="Custom generated avatar"
                    className="h-full w-full"
                  />
                </div>

                <button
                  type="button"
                  onClick={handleApplyCustomAvatar}
                  className="mt-2.5 inline-flex items-center gap-1.5 rounded-xl bg-[#08C58A] px-4 py-1.5 text-xs font-bold text-[#123D30] hover:bg-[#07B07B] transition shadow-xs"
                >
                  <Check className="h-3.5 w-3.5" /> Apply This Avatar
                </button>
              </div>

              {/* Avatar Attributes */}
              <div className="flex-1 w-full space-y-3">
                {/* Skin Tone */}
                <div>
                  <span className="block text-[11px] font-bold text-[#171916] mb-1">
                    Skin Tone:
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {SKIN_TONES.map((t) => (
                      <button
                        key={t.color}
                        type="button"
                        onClick={() => setAvatarConfig((prev) => ({ ...prev, skinTone: t.color }))}
                        className={`h-6 w-6 rounded-full border-2 transition ${
                          avatarConfig.skinTone === t.color
                            ? 'border-[#08C58A] scale-110 shadow-xs ring-2 ring-[#08C58A]/30'
                            : 'border-white shadow-xs'
                        }`}
                        style={{ backgroundColor: t.color }}
                        title={t.label}
                      />
                    ))}
                  </div>
                </div>

                {/* Hairstyle */}
                <div>
                  <span className="block text-[11px] font-bold text-[#171916] mb-1">
                    Hairstyle:
                  </span>
                  <div className="grid grid-cols-3 gap-1.5">
                    {HAIR_STYLES.map((h) => (
                      <button
                        key={h.id}
                        type="button"
                        onClick={() => setAvatarConfig((prev) => ({ ...prev, hairStyle: h.id }))}
                        className={`rounded-lg border px-2 py-1 text-[11px] font-medium transition ${
                          avatarConfig.hairStyle === h.id
                            ? 'border-[#08C58A] bg-[#E3F4EB] text-[#123D30] font-bold'
                            : 'border-[#E7E8E1] bg-white text-[#525A55] hover:bg-[#FAF8F5]'
                        }`}
                      >
                        {h.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Hair Color & Outfit Color row */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <span className="block text-[11px] font-bold text-[#171916] mb-1">
                      Hair Color:
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {HAIR_COLORS.map((hc) => (
                        <button
                          key={hc.color}
                          type="button"
                          onClick={() => setAvatarConfig((prev) => ({ ...prev, hairColor: hc.color }))}
                          className={`h-6 w-6 rounded-full border-2 transition ${
                            avatarConfig.hairColor === hc.color
                              ? 'border-[#08C58A] scale-110 shadow-xs ring-2 ring-[#08C58A]/30'
                              : 'border-white shadow-xs'
                          }`}
                          style={{ backgroundColor: hc.color }}
                          title={hc.label}
                        />
                      ))}
                    </div>
                  </div>

                  <div>
                    <span className="block text-[11px] font-bold text-[#171916] mb-1">
                      Outfit Color:
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {OUTFIT_COLORS.map((oc) => (
                        <button
                          key={oc.color}
                          type="button"
                          onClick={() => setAvatarConfig((prev) => ({ ...prev, outfitColor: oc.color }))}
                          className={`h-6 w-6 rounded-full border-2 transition ${
                            avatarConfig.outfitColor === oc.color
                              ? 'border-[#08C58A] scale-110 shadow-xs ring-2 ring-[#08C58A]/30'
                              : 'border-white shadow-xs'
                          }`}
                          style={{ backgroundColor: oc.color }}
                          title={oc.label}
                        />
                      ))}
                    </div>
                  </div>
                </div>

                {/* Accessories */}
                <div>
                  <span className="block text-[11px] font-bold text-[#171916] mb-1">
                    Accessories:
                  </span>
                  <div className="grid grid-cols-4 gap-1.5">
                    {ACCESSORIES.map((acc) => (
                      <button
                        key={acc.id}
                        type="button"
                        onClick={() => setAvatarConfig((prev) => ({ ...prev, accessory: acc.id }))}
                        className={`rounded-lg border px-2 py-1 text-center text-[11px] font-medium transition ${
                          avatarConfig.accessory === acc.id
                            ? 'border-[#08C58A] bg-[#E3F4EB] text-[#123D30] font-bold'
                            : 'border-[#E7E8E1] bg-white text-[#525A55] hover:bg-[#FAF8F5]'
                        }`}
                      >
                        {acc.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Upload picture as reference button */}
                <div className="pt-1">
                  <input
                    ref={refFileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      const file = e.target.files?.[0]
                      if (file) handleFileChosen(file)
                    }}
                    className="hidden"
                  />
                  <button
                    type="button"
                    onClick={() => refFileInputRef.current?.click()}
                    className="inline-flex items-center gap-1.5 text-xs text-[#08A876] font-bold hover:underline"
                  >
                    <ImageIcon className="h-3.5 w-3.5" /> Or upload a photo reference from your device
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Main Inputs: Full Name & Mobile Phone */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        {/* Full Name */}
        <div>
          <label htmlFor="reg-name" className="block text-xs font-bold text-[#171916]">
            Full Legal / Preferred Name *
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

        {/* Mobile Phone Number (Strict 10-digit limit) */}
        <div>
          <div className="flex items-center justify-between">
            <label htmlFor="reg-phone" className="block text-xs font-bold text-[#171916]">
              Mobile Phone Number (10 Digits) *
            </label>
            <span
              className={`text-[11px] font-mono ${
                (data.phone?.length || 0) === 10
                  ? 'text-[#08A876] font-bold'
                  : 'text-[#777A72]'
              }`}
            >
              {data.phone?.length || 0}/10 digits
            </span>
          </div>

          <div className="relative mt-1.5 flex items-center">
            {/* Country code prefix */}
            <span className="absolute left-3 flex items-center gap-1 text-xs font-bold text-[#525A55] select-none border-r border-[#E7E8E1] pr-2">
              <Phone className="h-3.5 w-3.5 text-[#08A876]" />
              +91
            </span>

            <input
              id="reg-phone"
              type="tel"
              required
              maxLength={10}
              placeholder="9876543210"
              value={data.phone}
              onChange={handlePhoneChange}
              className={`w-full rounded-xl border bg-white py-2.5 pl-16 pr-10 text-xs text-[#171916] font-mono tracking-wider outline-none transition focus:ring-2 sm:text-sm ${
                errors.phone
                  ? 'border-red-400 focus:border-red-500 focus:ring-red-100'
                  : (data.phone?.length || 0) === 10
                  ? 'border-[#08C58A] focus:border-[#08C58A] focus:ring-[#08C58A]/20'
                  : 'border-[#E7E8E1] focus:border-[#08C58A] focus:ring-[#08C58A]/20'
              }`}
            />

            {(data.phone?.length || 0) === 10 && (
              <Check className="absolute right-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-[#08A876]" />
            )}
          </div>

          {errors.phone ? (
            <p className="mt-1 text-xs text-red-600 font-medium">{errors.phone}</p>
          ) : (
            <p className="mt-1 text-[11px] text-[#777A72]">
              Enter a 10-digit Indian mobile number. This demo has no connected privacy controls.
            </p>
          )}
        </div>
      </div>

      {/* Institutional email format hint; no verification is performed. */}
      <div className="rounded-2xl border border-[#E7E8E1] bg-white p-5 space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1">
          <div>
            <label htmlFor="reg-email" className="block text-xs font-bold text-[#171916]">
              College Email Address *
            </label>
            <p className="text-[11px] text-[#777A72]">
              A college-style domain can be recognized as a format hint. It does not verify enrollment.
            </p>
          </div>

          {hasAcademicFormat ? (
            <span className="flex items-center gap-1.5 rounded-full bg-[#E3F4EB] px-3 py-1 text-xs font-bold text-[#08A876] border border-[#08C58A]/40 shrink-0">
              <CheckCircle2 className="h-4 w-4 text-[#08C58A]" />
              College-style format
            </span>
          ) : (
            <span className="text-[11px] font-semibold text-amber-700 bg-amber-50 px-2.5 py-0.5 rounded-lg border border-amber-200 shrink-0">
              Format not recognized
            </span>
          )}
        </div>

        <div className="relative">
          <Mail className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-[#777A72]" />
          <input
            id="reg-email"
            type="email"
            required
            placeholder="student@university.edu or name@college.ac.in"
            value={data.email}
            onChange={(e) => handleEmailChange(e.target.value)}
            className={`w-full rounded-xl border bg-white py-2.5 pl-10 pr-24 text-xs text-[#171916] outline-none transition focus:ring-2 sm:text-sm ${
              hasAcademicFormat
                ? 'border-[#08C58A] bg-[#E3F4EB]/20 text-[#123D30] font-medium'
                : data.email.length > 5
                ? 'border-amber-300 focus:border-amber-500 focus:ring-amber-100'
                : 'border-[#E7E8E1] focus:border-[#08C58A] focus:ring-[#08C58A]/20'
            }`}
          />

          <div className="absolute right-3 top-1/2 -translate-y-1/2">
            {hasAcademicFormat ? (
              <Badge variant="green" size="sm" className="font-bold flex items-center gap-1">
                <Check className="h-3 w-3 text-[#08A876]" /> Format match
              </Badge>
            ) : (
              <span className="text-[11px] text-[#777A72] font-mono">
                No tick
              </span>
            )}
          </div>
        </div>

        {/* Dynamic status feedback */}
        {hasAcademicFormat ? (
          <div className="flex items-center gap-2 rounded-xl bg-[#E3F4EB] p-2.5 text-xs font-bold text-[#123D30] border border-[#08C58A]/30">
            <CheckCircle2 className="h-4 w-4 text-[#08A876] shrink-0" />
            <span>
              Academic-style email domain detected. No student identity or enrollment check happens in this demo.
            </span>
          </div>
        ) : data.email.length > 4 ? (
          <div className="flex items-start gap-1.5 pt-0.5 text-xs text-amber-700">
            <AlertCircle className="h-3.5 w-3.5 shrink-0 mt-0.5 text-amber-600" />
            <span>
              Use your college address for this demo form. Email domains are not checked against a school and do not verify enrollment.
            </span>
          </div>
        ) : null}

        <p className="text-[11px] text-[#777A72] flex items-center gap-1">
          <ShieldCheck className="h-3.5 w-3.5 text-[#08A876]" />
          Email privacy controls are not connected in this demo; do not enter sensitive personal details.
        </p>
      </div>

      {/* Professional Headline with Recommendation Cards */}
      <div className="rounded-3xl border border-[#E7E8E1] bg-white p-5 shadow-2xs space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <label htmlFor="reg-headline" className="block text-xs font-bold text-[#171916]">
              Professional Headline *
            </label>
            <p className="text-xs text-[#777A72]">
              A concise tagline showcasing your skills and focus to recruiters and peers
            </p>
          </div>
          <span
            className={`text-[11px] font-mono ${
              maxLength - currentHeadlineLength < 10
                ? 'text-red-500 font-bold'
                : 'text-[#777A72]'
            }`}
          >
            {currentHeadlineLength}/{maxLength}
          </span>
        </div>

        <div className="relative">
          <Sparkles className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-[#777A72]" />
          <input
            id="reg-headline"
            type="text"
            maxLength={maxLength}
            placeholder="e.g. Aspiring Software Developer | React & Python Enthusiast"
            value={data.headline}
            onChange={(e) => onChange('headline', e.target.value)}
            className="w-full rounded-xl border border-[#E7E8E1] bg-white py-2.5 pl-10 pr-3.5 text-xs text-[#171916] outline-none transition focus:border-[#08C58A] focus:ring-2 focus:ring-[#08C58A]/20 sm:text-sm"
          />
        </div>

        {/* Polished Recommendation Cards UI */}
        <div className="rounded-2xl border border-[#08C58A]/20 bg-[#FAF8F5] p-3.5">
          <div className="flex items-center justify-between pb-2">
            <span className="flex items-center gap-1.5 text-xs font-bold text-[#123D30]">
              <Sparkles className="h-3.5 w-3.5 text-[#08A876]" />
              Recommended Headlines (Tap to apply)
            </span>
            <button
              type="button"
              onClick={() => setSuggestionBatch((prev) => prev + 1)}
              className="inline-flex items-center gap-1 text-[11px] font-bold text-[#123D30] hover:text-[#08C58A] transition"
            >
              <RefreshCw className="h-3 w-3" />
              More suggestions
            </button>
          </div>

          <div className="grid grid-cols-1 gap-2 pt-1">
            {displayedHeadlines.map((item, idx) => {
              const isSelected = data.headline.trim() === item.headline.trim()
              return (
                <button
                  key={idx}
                  type="button"
                  onClick={() => onChange('headline', item.headline)}
                  className={`group flex w-full items-center justify-between rounded-xl border p-2.5 text-left transition ${
                    isSelected
                      ? 'border-[#08C58A] bg-white text-[#123D30] shadow-sm ring-1 ring-[#08C58A]'
                      : 'border-[#E7E8E1] bg-white text-[#525A55] hover:border-[#08C58A] hover:bg-white'
                  }`}
                >
                  <div className="min-w-0 pr-2">
                    <span className="block text-[10px] font-bold uppercase tracking-wider text-[#08A876]">
                      {item.category}
                    </span>
                    <span className="block text-xs font-medium text-[#171916] truncate">
                      {item.headline}
                    </span>
                  </div>

                  {isSelected ? (
                    <span className="flex items-center gap-1 text-[11px] font-bold text-[#08A876] shrink-0">
                      <Check className="h-3.5 w-3.5" /> Selected
                    </span>
                  ) : (
                    <span className="text-[10px] font-bold text-[#777A72] opacity-0 group-hover:opacity-100 transition shrink-0">
                      Apply
                    </span>
                  )}
                </button>
              )
            })}
          </div>
        </div>
      </div>

      {/* Password & Confirm Password */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        {/* Password */}
        <div>
          <div className="flex items-center justify-between">
            <label htmlFor="reg-password" className="block text-xs font-bold text-[#171916]">
              Account Password *
            </label>
            <span
              className={`text-[11px] font-bold ${
                passwordStrength.score >= 3
                  ? 'text-[#08A876]'
                  : passwordStrength.score === 2
                  ? 'text-amber-600'
                  : 'text-gray-400'
              }`}
            >
              {data.password ? passwordStrength.label : ''}
            </span>
          </div>

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
              aria-label="Toggle password visibility"
            >
              {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>

          {data.password && (
            <div className="mt-2 grid grid-cols-4 gap-1">
              {[1, 2, 3, 4].map((step) => (
                <div
                  key={step}
                  className={`h-1 rounded-full transition-colors ${
                    step <= passwordStrength.score ? passwordStrength.color : 'bg-[#E7E8E1]'
                  }`}
                />
              ))}
            </div>
          )}
          {errors.password && (
            <p className="mt-1 text-xs text-red-600 font-medium">{errors.password}</p>
          )}
        </div>

        {/* Confirm Password */}
        <div>
          <label htmlFor="reg-confirm" className="block text-xs font-bold text-[#171916]">
            Confirm Password *
          </label>
          <div className="relative mt-1.5">
            <Lock className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-[#777A72]" />
            <input
              id="reg-confirm"
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
              aria-label="Toggle confirm password visibility"
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
