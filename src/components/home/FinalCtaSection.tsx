import { ArrowRight, ArrowUpRight, FolderGit2, Briefcase, Terminal, Sparkles } from 'lucide-react'
import { Button } from '../common/Button'
import { useSmoothScroll } from '../../hooks/useSmoothScroll'

export function FinalCtaSection() {
  const { scrollTo } = useSmoothScroll()

  return (
    <section
      id="cta"
      className="snap-section min-h-screen w-full relative flex flex-col justify-between pt-20 pb-10 sm:pt-24 sm:pb-12 bg-[#090A0F] text-white overflow-hidden border-t border-white/10"
    >
      {/* Background Subtle Line Grid & Electric Accent Glow */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-line-grid opacity-60 -z-0"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[750px] h-[380px] bg-[#D4FF00]/12 rounded-full blur-[160px] -z-0"
      />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full space-y-12 my-auto">
        {/* Main CTA Editorial Masthead */}
        <div className="max-w-3xl space-y-4">
          <div className="inline-flex items-center gap-2 font-mono text-[11px] tracking-widest uppercase text-[#D4FF00]">
            <Sparkles className="w-3.5 h-3.5 text-[#D4FF00]" />
            <span>07 // INVITATION TO BUILD</span>
          </div>

          <h2 className="text-3xl sm:text-5xl lg:text-[62px] font-black tracking-tight leading-[1.0] text-white">
            Your next opportunity{' '}
            <span className="text-[#D4FF00] block mt-1">starts with a connection.</span>
          </h2>

          <p className="text-sm sm:text-base lg:text-lg text-[#8E95A5] max-w-2xl leading-relaxed">
            Whether you&apos;re looking to showcase your skills or find talented students for your next
            project, there&apos;s a place for you here.
          </p>
        </div>

        {/* Dual Split Pathways */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
          {/* Pathway 1: For Students */}
          <div className="rounded-2xl border border-white/15 bg-[#10131B] p-6 sm:p-8 flex flex-col justify-between space-y-6 hover:border-[#D4FF00]/40 transition-all">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono uppercase tracking-wider text-[#D4FF00] flex items-center gap-2">
                  <FolderGit2 className="w-4 h-4" />
                  Pathway 01 · University Builders
                </span>
                <span className="text-[10px] font-mono text-white/70 bg-white/10 px-2 py-0.5 rounded">
                  Portfolio-First
                </span>
              </div>

              <h3 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
                Put your real repositories in front of founders.
              </h3>

              <p className="text-xs sm:text-sm text-[#8E95A5] leading-relaxed">
                Connect directly with project creators, work on paid milestone briefs, and build an authenticated track record that launches your career.
              </p>
            </div>

            <Button
              variant="primary"
              size="md"
              onClick={() => scrollTo('#marketplace')}
              className="w-full justify-between font-mono text-xs uppercase tracking-wider"
            >
              <span>Join as Student Talent</span>
              <ArrowRight className="w-4 h-4" />
            </Button>
          </div>

          {/* Pathway 2: For Creators */}
          <div className="rounded-2xl border border-white/15 bg-[#10131B] p-6 sm:p-8 flex flex-col justify-between space-y-6 hover:border-[#6366F1]/50 transition-all">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono uppercase tracking-wider text-[#A5B4FC] flex items-center gap-2">
                  <Briefcase className="w-4 h-4 text-[#6366F1]" />
                  Pathway 02 · Creators &amp; Teams
                </span>
                <span className="text-[10px] font-mono text-white/70 bg-white/10 px-2 py-0.5 rounded">
                  Milestone-Scoped
                </span>
              </div>

              <h3 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
                Post an opportunity and find ambitious talent.
              </h3>

              <p className="text-xs sm:text-sm text-[#8E95A5] leading-relaxed">
                Define your deliverables, set a transparent budget, and review student applications with demonstrated GitHub code and Figma prototypes.
              </p>
            </div>

            <Button
              variant="secondary"
              size="md"
              onClick={() => scrollTo('#marketplace')}
              className="w-full justify-between font-mono text-xs uppercase tracking-wider"
            >
              <span>Post a Project Brief</span>
              <ArrowRight className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Integrated Editorial Footer */}
      <footer className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full pt-12 border-t border-white/10 text-xs text-[#8E95A5]">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 mb-8">
          {/* Brand Info */}
          <div className="space-y-3">
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-lg bg-[#D4FF00] flex items-center justify-center text-[#090A0F]">
                <Terminal className="w-3.5 h-3.5 stroke-[2.5]" />
              </div>
              <span className="text-base font-black tracking-tight text-white">PeerConnect</span>
            </div>
            <p className="text-[11px] leading-relaxed text-[#8E95A5]">
              The university builder network connecting student engineers and designers with startups and creators.
            </p>
          </div>

          {/* Column: For Students */}
          <div className="space-y-2.5 font-mono text-[11px]">
            <span className="text-white uppercase tracking-wider block font-bold">For Students</span>
            <ul className="space-y-1.5">
              <li>
                <button
                  type="button"
                  onClick={() => scrollTo('#marketplace')}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  Discover Talent
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => scrollTo('#marketplace')}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  Browse Projects
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => scrollTo('#process')}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  How It Works
                </button>
              </li>
            </ul>
          </div>

          {/* Column: For Creators */}
          <div className="space-y-2.5 font-mono text-[11px]">
            <span className="text-white uppercase tracking-wider block font-bold">For Creators</span>
            <ul className="space-y-1.5">
              <li>
                <button
                  type="button"
                  onClick={() => scrollTo('#marketplace')}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  Post a Project
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => scrollTo('#students')}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  Student Roster
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => scrollTo('#problem')}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  The Campus Problem
                </button>
              </li>
            </ul>
          </div>

          {/* Column: Project Info & GitHub */}
          <div className="space-y-2.5 font-mono text-[11px]">
            <span className="text-white uppercase tracking-wider block font-bold">Repository &amp; Stack</span>
            <ul className="space-y-1.5">
              <li>
                <a
                  href="https://github.com/x0Suji0x/WorkShop3-PeerConnect"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-[#D4FF00] hover:underline"
                >
                  <span>GitHub Repository</span>
                  <ArrowUpRight className="w-3 h-3" />
                </a>
              </li>
              <li className="text-[#8E95A5]">React 19 &amp; TypeScript</li>
              <li className="text-[#8E95A5]">Tailwind CSS v4</li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-4 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px] font-mono">
          <p>© 2026 PeerConnect. Educational open-source prototype.</p>
          <button
            type="button"
            onClick={() => scrollTo('#intro')}
            className="text-[#D4FF00] hover:underline cursor-pointer"
          >
            Back to Top ↑
          </button>
        </div>
      </footer>
    </section>
  )
}
