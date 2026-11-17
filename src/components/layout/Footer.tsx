import { Code2, ArrowUpRight } from 'lucide-react'
import { useSmoothScroll } from '../../hooks/useSmoothScroll'

export function Footer() {
  const { scrollTo } = useSmoothScroll()

  return (
    <footer className="w-full bg-[#F7F6F0] border-t border-[#E7E8E1] text-[#777A72] text-sm transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 sm:py-16">
        {/* Main Footer Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-8 lg:gap-12 mb-12">
          {/* Brand Info (Span 2 columns on desktop) */}
          <div className="sm:col-span-2 space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-[#171916] flex items-center justify-center text-[#08C58A] shadow-xs">
                <Code2 className="w-4 h-4" />
              </div>
              <span className="text-xl font-bold tracking-tight text-[#171916]">
                PeerConnect
              </span>
            </div>

            <p className="text-xs sm:text-sm text-[#777A72] max-w-sm leading-relaxed">
              The student talent and project network connecting ambitious university builders with
              startups, local businesses and creators.
            </p>

            <div className="flex items-center gap-2 text-xs text-[#171916] bg-white border border-[#E7E8E1] w-fit px-3 py-1.5 rounded-full shadow-2xs">
              <span className="w-2 h-2 rounded-full bg-[#08C58A]" />
              <span className="font-medium">Open-source student marketplace prototype</span>
            </div>
          </div>

          {/* Column 1: For Students */}
          <div className="space-y-3">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-[#171916]">
              For Students
            </h4>
            <ul className="space-y-2.5 text-xs sm:text-sm">
              <li>
                <button
                  type="button"
                  onClick={() => scrollTo('#talent')}
                  className="hover:text-[#08C58A] transition-colors cursor-pointer text-left"
                >
                  Discover Talent
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => scrollTo('#projects')}
                  className="hover:text-[#08C58A] transition-colors cursor-pointer text-left"
                >
                  Browse Projects
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => scrollTo('#how-it-works')}
                  className="hover:text-[#08C58A] transition-colors cursor-pointer text-left"
                >
                  How It Works
                </button>
              </li>
            </ul>
          </div>

          {/* Column 2: For Project Owners */}
          <div className="space-y-3">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-[#171916]">
              For Project Owners
            </h4>
            <ul className="space-y-2.5 text-xs sm:text-sm">
              <li>
                <button
                  type="button"
                  onClick={() => scrollTo('#projects')}
                  className="hover:text-[#08C58A] transition-colors cursor-pointer text-left"
                >
                  Post a Project
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => scrollTo('#talent')}
                  className="hover:text-[#08C58A] transition-colors cursor-pointer text-left"
                >
                  Discover Talent
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => scrollTo('#how-it-works')}
                  className="hover:text-[#08C58A] transition-colors cursor-pointer text-left"
                >
                  How It Works
                </button>
              </li>
            </ul>
          </div>

          {/* Column 3: Project Information */}
          <div className="space-y-3">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-[#171916]">
              Project Information
            </h4>
            <ul className="space-y-2.5 text-xs sm:text-sm">
              <li>
                <a
                  href="https://github.com/kritagyagour19/PeerConnect_workshop3"
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1.5 font-medium text-[#171916] hover:text-[#08C58A] transition-colors"
                >
                  <span>GitHub Repository</span>
                  <ArrowUpRight className="w-3.5 h-3.5 text-[#08C58A]" />
                </a>
              </li>
              <li className="text-xs text-[#777A72]">
                React 19 &amp; TypeScript
              </li>
              <li className="text-xs text-[#777A72]">
                Tailwind CSS v4 &amp; GSAP
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-[#E7E8E1] flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#777A72]">
          <p>© 2026 PeerConnect. Educational open-source prototype.</p>
          <div className="flex items-center gap-6">
            <button
              type="button"
              onClick={() => scrollTo('#hero')}
              className="hover:text-[#08C58A] transition-colors cursor-pointer"
            >
              Back to Top
            </button>
            <button
              type="button"
              onClick={() => scrollTo('#talent')}
              className="hover:text-[#08C58A] transition-colors cursor-pointer"
            >
              Talent Directory
            </button>
            <button
              type="button"
              onClick={() => scrollTo('#projects')}
              className="hover:text-[#08C58A] transition-colors cursor-pointer"
            >
              Project Board
            </button>
          </div>
        </div>
      </div>
    </footer>
  )
}
