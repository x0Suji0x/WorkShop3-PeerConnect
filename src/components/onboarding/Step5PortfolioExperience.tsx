import {
  Code2,
  Link2,
  Globe,
  Palette,
  FolderGit2,
  Briefcase,
  FileText,
} from 'lucide-react'
import type { OnboardingPortfolioExperience, FormValidationErrors } from '../../types/onboarding'

interface Step5PortfolioExperienceProps {
  data: OnboardingPortfolioExperience
  errors: FormValidationErrors
  onChange: (field: keyof OnboardingPortfolioExperience, value: string) => void
}

export function Step5PortfolioExperience({
  data,
  errors,
  onChange,
}: Step5PortfolioExperienceProps) {
  return (
    <div className="space-y-6">
      {/* Step Header */}
      <div>
        <p className="text-xs font-bold uppercase tracking-wider text-[#08A876]">
          Step 5 of 6 · Portfolio & Experience (Optional)
        </p>
        <h2 className="mt-1 text-2xl font-black text-[#171916]">
          Show your craft and background.
        </h2>
        <p className="mt-1 text-xs text-[#525A55] sm:text-sm">
          You can provide links now or skip this step and fill it from your student profile anytime.
        </p>
      </div>

      {/* Social & Portfolio Links */}
      <div className="rounded-2xl border border-[#E7E8E1] bg-white p-5 shadow-2xs space-y-4">
        <h3 className="text-sm font-bold text-[#171916]">Professional Profile Links</h3>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {/* GitHub */}
          <div>
            <label htmlFor="pf-github" className="block text-xs font-bold text-[#171916]">
              GitHub URL
            </label>
            <div className="relative mt-1.5">
              <Code2 className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-[#777A72]" />
              <input
                id="pf-github"
                type="url"
                placeholder="https://github.com/yourhandle"
                value={data.githubUrl}
                onChange={(e) => onChange('githubUrl', e.target.value)}
                className="w-full rounded-xl border border-[#E7E8E1] bg-white py-2 pl-10 pr-3.5 text-xs text-[#171916] outline-none focus:border-[#08C58A]"
              />
            </div>
            {errors.githubUrl && <p className="mt-1 text-xs text-red-600">{errors.githubUrl}</p>}
          </div>

          {/* LinkedIn */}
          <div>
            <label htmlFor="pf-linkedin" className="block text-xs font-bold text-[#171916]">
              LinkedIn URL
            </label>
            <div className="relative mt-1.5">
              <Link2 className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-[#777A72]" />
              <input
                id="pf-linkedin"
                type="url"
                placeholder="https://linkedin.com/in/yourhandle"
                value={data.linkedinUrl}
                onChange={(e) => onChange('linkedinUrl', e.target.value)}
                className="w-full rounded-xl border border-[#E7E8E1] bg-white py-2 pl-10 pr-3.5 text-xs text-[#171916] outline-none focus:border-[#08C58A]"
              />
            </div>
            {errors.linkedinUrl && <p className="mt-1 text-xs text-red-600">{errors.linkedinUrl}</p>}
          </div>

          {/* Behance / Dribbble */}
          <div>
            <label htmlFor="pf-behance" className="block text-xs font-bold text-[#171916]">
              Behance or Design Portfolio
            </label>
            <div className="relative mt-1.5">
              <Palette className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-[#777A72]" />
              <input
                id="pf-behance"
                type="url"
                placeholder="https://behance.net/yourhandle"
                value={data.behanceUrl}
                onChange={(e) => onChange('behanceUrl', e.target.value)}
                className="w-full rounded-xl border border-[#E7E8E1] bg-white py-2 pl-10 pr-3.5 text-xs text-[#171916] outline-none focus:border-[#08C58A]"
              />
            </div>
          </div>

          {/* Personal Website */}
          <div>
            <label htmlFor="pf-site" className="block text-xs font-bold text-[#171916]">
              Personal Website / Portfolio
            </label>
            <div className="relative mt-1.5">
              <Globe className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-[#777A72]" />
              <input
                id="pf-site"
                type="url"
                placeholder="https://yourportfolio.dev"
                value={data.portfolioUrl}
                onChange={(e) => onChange('portfolioUrl', e.target.value)}
                className="w-full rounded-xl border border-[#E7E8E1] bg-white py-2 pl-10 pr-3.5 text-xs text-[#171916] outline-none focus:border-[#08C58A]"
              />
            </div>
            {errors.portfolioUrl && <p className="mt-1 text-xs text-red-600">{errors.portfolioUrl}</p>}
          </div>
        </div>
      </div>

      {/* About statement */}
      <div className="rounded-2xl border border-[#E7E8E1] bg-white p-5 shadow-2xs space-y-3">
        <div className="flex items-center gap-2">
          <FileText className="h-4 w-4 text-[#08C58A]" />
          <h3 className="text-sm font-bold text-[#171916]">Short Bio / About Statement</h3>
        </div>
        <textarea
          rows={3}
          placeholder="I am an interaction designer and front-end developer passionate about accessible user experiences and creative technology..."
          value={data.aboutBio}
          onChange={(e) => onChange('aboutBio', e.target.value)}
          className="w-full rounded-xl border border-[#E7E8E1] bg-white p-3 text-xs text-[#171916] outline-none focus:border-[#08C58A] focus:ring-2 focus:ring-[#08C58A]/20"
        />
        <span className="text-[11px] text-[#777A72]">
          Introduce yourself to clients, project leads, and hackathon teammates.
        </span>
      </div>

      {/* Featured Project */}
      <div className="rounded-2xl border border-[#E7E8E1] bg-white p-5 shadow-2xs space-y-3">
        <div className="flex items-center gap-2">
          <FolderGit2 className="h-4 w-4 text-[#08C58A]" />
          <h3 className="text-sm font-bold text-[#171916]">Featured Project (Optional)</h3>
        </div>

        <div className="space-y-3">
          <input
            type="text"
            placeholder="Project name (e.g. Peer Studio or MedAssist AI)"
            value={data.featuredProjectName}
            onChange={(e) => onChange('featuredProjectName', e.target.value)}
            className="w-full rounded-xl border border-[#E7E8E1] bg-white px-3.5 py-2 text-xs text-[#171916] outline-none focus:border-[#08C58A]"
          />
          <input
            type="text"
            placeholder="One-line summary (e.g. Collaborative critique platform with live annotations)"
            value={data.featuredProjectDesc}
            onChange={(e) => onChange('featuredProjectDesc', e.target.value)}
            className="w-full rounded-xl border border-[#E7E8E1] bg-white px-3.5 py-2 text-xs text-[#171916] outline-none focus:border-[#08C58A]"
          />
          <input
            type="url"
            placeholder="Live Demo / GitHub repository URL"
            value={data.featuredProjectUrl}
            onChange={(e) => onChange('featuredProjectUrl', e.target.value)}
            className="w-full rounded-xl border border-[#E7E8E1] bg-white px-3.5 py-2 text-xs text-[#171916] outline-none focus:border-[#08C58A]"
          />
        </div>
      </div>

      {/* Experience or Leadership */}
      <div className="rounded-2xl border border-[#E7E8E1] bg-white p-5 shadow-2xs space-y-3">
        <div className="flex items-center gap-2">
          <Briefcase className="h-4 w-4 text-[#08C58A]" />
          <h3 className="text-sm font-bold text-[#171916]">Internship or Club Leadership (Optional)</h3>
        </div>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <input
            type="text"
            placeholder="Organization (e.g. Mosaic Studio or Design Club)"
            value={data.organization}
            onChange={(e) => onChange('organization', e.target.value)}
            className="w-full rounded-xl border border-[#E7E8E1] bg-white px-3.5 py-2 text-xs text-[#171916] outline-none focus:border-[#08C58A]"
          />
          <input
            type="text"
            placeholder="Your Role (e.g. Product Design Intern or Tech Lead)"
            value={data.role}
            onChange={(e) => onChange('role', e.target.value)}
            className="w-full rounded-xl border border-[#E7E8E1] bg-white px-3.5 py-2 text-xs text-[#171916] outline-none focus:border-[#08C58A]"
          />
        </div>
      </div>
    </div>
  )
}
