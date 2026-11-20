import { useState, useEffect, useRef } from 'react'
import {
  Clock,
  Briefcase,
  Users,
  Building2,
  ArrowUpRight,
  Check,
  Search,
  X,
  Sparkles,
} from 'lucide-react'
import { mockProjects } from '../../data/mockData'
import { gsap, ScrollTrigger } from '../../lib/gsap'

const formatBudget = (amount: number) => new Intl.NumberFormat('en-IN', {
  style: 'currency',
  currency: 'INR',
  maximumFractionDigits: 0,
}).format(amount)

export function ProjectMarketplaceSection() {
  const [activeCategory, setActiveCategory] = useState<string>('all')
  const [searchQuery, setSearchQuery] = useState<string>('')
  const [appliedProjects, setAppliedProjects] = useState<Record<string, boolean>>({})
  const sectionRef = useRef<HTMLElement>(null)
  const rosterRef = useRef<HTMLDivElement>(null)

  const handleApply = (id: string) => {
    setAppliedProjects((prev) => ({
      ...prev,
      [id]: !prev[id],
    }))
  }

  const categoryOptions = [
    { id: 'all', label: 'All Projects' },
    { id: 'dev', label: 'Development' },
    { id: 'design', label: 'Design' },
    { id: 'ai', label: 'AI & Data' },
    { id: 'mobile', label: 'Mobile' },
  ] as const

  const filteredProjects = mockProjects.filter((project) => {
    // 1. Category Matching
    const matchesCategory = (() => {
      if (activeCategory === 'all') return true
      if (activeCategory === 'dev') {
        return (
          project.skillsRequired.some((s) =>
            ['react', 'typescript', 'postgresql', 'python', 'fastapi'].some((k) =>
              s.toLowerCase().includes(k),
            ),
          ) ||
          project.title.toLowerCase().includes('stack') ||
          project.title.toLowerCase().includes('pipeline')
        )
      }
      if (activeCategory === 'design') {
        return (
          project.skillsRequired.some((s) =>
            ['figma', 'three.js', 'gsap'].some((k) => s.toLowerCase().includes(k)),
          ) ||
          project.title.toLowerCase().includes('3d') ||
          project.title.toLowerCase().includes('design')
        )
      }
      if (activeCategory === 'ai') {
        return (
          project.skillsRequired.some((s) =>
            ['langchain', 'pgvector', 'python'].some((k) =>
              s.toLowerCase().includes(k),
            ),
          ) ||
          project.title.toLowerCase().includes('ai') ||
          project.title.toLowerCase().includes('intelligence')
        )
      }
      if (activeCategory === 'mobile') {
        return (
          project.skillsRequired.some((s) =>
            ['react native', 'expo'].some((k) => s.toLowerCase().includes(k)),
          ) ||
          project.title.toLowerCase().includes('mobile') ||
          project.title.toLowerCase().includes('app')
        )
      }
      return true
    })()

    // 2. Search Query Matching
    const query = searchQuery.trim().toLowerCase()
    const matchesSearch =
      query === '' ||
      project.title.toLowerCase().includes(query) ||
      project.description.toLowerCase().includes(query) ||
      project.clientName.toLowerCase().includes(query) ||
      project.skillsRequired.some((s) => s.toLowerCase().includes(query))

    return matchesCategory && matchesSearch
  })

  useEffect(() => {
    if (!rosterRef.current) return

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      ScrollTrigger.refresh()
      return
    }

    const rows = rosterRef.current.querySelectorAll('.opportunity-row')
    if (rows.length === 0) return

    const ctx = gsap.context(() => {
      gsap.fromTo(
        rows,
        { opacity: 0.72, y: 8 },
        {
          opacity: 1,
          y: 0,
          duration: 0.3,
          stagger: 0.045,
          ease: 'power2.out',
          clearProps: 'opacity,transform',
          scrollTrigger: {
            trigger: rosterRef.current,
            start: 'top 88%',
            once: true,
            fastScrollEnd: true,
          },
        },
      )
    }, sectionRef)

    return () => {
      ctx.revert()
    }
  }, [activeCategory, searchQuery])

  return (
    <section
      id="projects"
      ref={sectionRef}
      className="scroll-mt-24 pt-20 pb-18 sm:pt-24 sm:pb-24 lg:pt-24 lg:pb-28 bg-[#F7F6F0] text-[#171916] border-b border-[#E7E8E1] transition-colors relative"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* ============================================================== */}
        {/* SECTION HEADER: BOLD EDITORIAL HEADLINE & METRICS             */}
        {/* ============================================================== */}
        <div className="flex flex-col items-center gap-5 pb-8 text-center border-b border-[#E7E8E1]">
          <div className="max-w-3xl space-y-3">
            {/* Small Eyebrow */}
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/75 border border-[#176B4C]/15 text-[#315448] text-[11px] font-bold tracking-[0.14em] uppercase">
              <span className="w-2 h-2 rounded-full bg-[#08A875]" />
              <span>MARKETPLACE OPPORTUNITY BOARD</span>
            </div>

            {/* Headline */}
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-medium text-[#171916] leading-[1.08] tracking-[-0.04em]">
              Real projects.{' '}
              <span className="font-serif font-normal italic text-[#16845F]">
                Ambitious briefs.
              </span>
            </h2>

            {/* Supporting Text */}
            <p className="mx-auto max-w-2xl text-base sm:text-lg text-[#525A55] leading-relaxed pt-1">
              Explore scoped briefs from startups, local businesses, and creator studios looking to
              collaborate with student talent.
            </p>
          </div>

          {/* Directory Count Indicator */}
          <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/80 border border-[#E7E8E1] text-xs font-semibold text-[#171916]">
            <span className="w-2 h-2 rounded-full bg-[#08C58A]" />
            <span>
              Showing <strong className="text-[#171916] font-bold">{filteredProjects.length}</strong> of{' '}
              {mockProjects.length} opportunities
            </span>
          </div>
        </div>

        {/* ============================================================== */}
        {/* INTEGRATED OPPORTUNITY TOOLBAR: FILTERS & SEARCH               */}
        {/* ============================================================== */}
        <div className="py-6 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 border-b border-[#E7E8E1]/80 mb-8">
          {/* Category Filter Pills */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
            {categoryOptions.map((tab) => {
              const isSelected = activeCategory === tab.id
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveCategory(tab.id)}
                  className={`px-4 py-2 rounded-full text-xs sm:text-sm font-semibold transition-all duration-200 cursor-pointer shrink-0 ${
                    isSelected
                      ? 'bg-[#171916] text-white shadow-xs'
                      : 'bg-white hover:bg-[#EAE8DF] text-[#777A72] hover:text-[#171916] border border-[#E7E8E1]'
                  }`}
                >
                  {tab.label}
                </button>
              )
            })}
          </div>

          {/* Connected Search Field */}
          <div className="relative w-full sm:w-80 shrink-0">
            <Search className="w-4 h-4 text-[#777A72] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search projects, client, tech stack..."
              aria-label="Search projects or skills"
              className="w-full pl-9 pr-9 py-2.5 text-xs sm:text-sm bg-white border border-[#E7E8E1] rounded-full text-[#171916] placeholder:text-[#777A72] focus:outline-none focus:ring-2 focus:ring-[#08C58A]/50 focus:border-[#08C58A] transition-all shadow-2xs"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 p-0.5 text-[#777A72] hover:text-[#171916] cursor-pointer"
                title="Clear search"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>

        {/* ============================================================== */}
        {/* EDITORIAL OPPORTUNITY BOARD (Horizontal Rows / Panels)         */}
        {/* ============================================================== */}
        {filteredProjects.length === 0 ? (
          <div className="p-16 text-center bg-white rounded-3xl border border-[#E7E8E1] space-y-3">
            <p className="text-lg font-bold text-[#171916]">No matching project scopes found</p>
            <p className="text-sm text-[#777A72]">
              Try adjusting your category filter or search keywords.
            </p>
            <button
              type="button"
              onClick={() => {
                setActiveCategory('all')
                setSearchQuery('')
              }}
              className="px-5 py-2.5 rounded-full text-xs font-semibold bg-[#171916] text-white hover:bg-[#242723] transition-colors cursor-pointer"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div ref={rosterRef} className="space-y-4">
            {filteredProjects.map((project) => {
              const isApplied = appliedProjects[project.id]
              const displayBadge = project.badge

              return (
                <div
                  key={project.id}
                  className="opportunity-row group bg-white rounded-2xl p-6 sm:p-7 border border-[#E7E8E1] hover:border-[#08C58A]/60 shadow-[0_4px_20px_rgba(23,25,22,0.03)] hover:shadow-[0_12px_32px_rgba(23,25,22,0.08)] hover:-translate-y-0.5 transition-all duration-200"
                >
                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
                    {/* LEFT / META COLUMN (lg:col-span-8) */}
                    <div className="lg:col-span-8 space-y-3.5">
                      {/* Top Meta Line: Badge + Client + Time */}
                      <div className="flex flex-wrap items-center gap-2.5 text-xs">
                        {displayBadge && (
                          <span
                            className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold border ${
                              displayBadge === 'Featured'
                                ? 'bg-[#E3F4EB] text-[#123D30] border-[#08C58A]/30'
                                : displayBadge === 'High Urgency'
                                ? 'bg-orange-50 text-orange-800 border-orange-200'
                                : 'bg-[#F7F6F0] text-[#171916] border-[#E7E8E1]'
                            }`}
                          >
                            {displayBadge}
                          </span>
                        )}
                        <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold border bg-[#F7F6F0] text-[#777A72] border-[#E7E8E1]">
                          Sample
                        </span>

                        <div className="flex items-center gap-1.5 text-[#777A72]">
                          <Building2 className="w-3.5 h-3.5 text-[#08C58A] shrink-0" />
                          <span className="font-bold text-[#171916]">
                            {project.clientName}
                          </span>
                          <span>•</span>
                          <span>{project.clientType}</span>
                        </div>

                        <span className="text-[11px] text-[#777A72] font-mono">
                          {project.postedTimeAgo}
                        </span>
                      </div>

                      {/* Prominent Project Title */}
                      <h3 className="text-xl sm:text-2xl font-black text-[#171916] group-hover:text-[#08C58A] transition-colors leading-snug">
                        {project.title}
                      </h3>

                      {/* Project Scope Description */}
                      <p className="text-xs sm:text-sm text-[#777A72] leading-relaxed max-w-3xl">
                        {project.description}
                      </p>

                      {/* Inset Strip: Duration, Effort, Pitches & Skills */}
                      <div className="flex flex-wrap items-center gap-y-2 gap-x-4 pt-1 text-xs">
                        <div className="flex items-center gap-1 text-[#777A72]">
                          <Clock className="w-3.5 h-3.5 text-[#08C58A]" />
                          <span>
                            Duration: <strong className="text-[#171916] font-semibold">{project.duration}</strong>
                          </span>
                        </div>

                        <div className="flex items-center gap-1 text-[#777A72]">
                          <Briefcase className="w-3.5 h-3.5 text-[#08C58A]" />
                          <span>
                            Effort: <strong className="text-[#171916] font-semibold">{project.hoursPerWeek}</strong>
                          </span>
                        </div>

                        <div className="flex items-center gap-1 text-[#777A72]">
                          <Users className="w-3.5 h-3.5 text-[#08C58A]" />
                          <span>
                            <strong className="text-[#171916] font-semibold">{project.applicantsCount}</strong> example pitches
                          </span>
                        </div>

                        <div className="flex items-center gap-1.5 flex-wrap">
                          <span className="text-[11px] font-bold uppercase tracking-wider text-[#777A72]">
                            Tech:
                          </span>
                          {project.skillsRequired.map((skill) => (
                            <span
                              key={skill}
                              className="px-2 py-0.5 rounded text-[10px] font-semibold bg-[#F7F6F0] text-[#171916] border border-[#E7E8E1]"
                            >
                              {skill}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* RIGHT / COMPENSATION & ACTION COLUMN (lg:col-span-4) */}
                    <div className="lg:col-span-4 flex lg:flex-col items-center lg:items-end justify-between gap-4 pt-4 lg:pt-0 border-t lg:border-t-0 border-[#E7E8E1]">
                      {/* Budget Display */}
                      <div className="text-left lg:text-right space-y-0.5">
                        <span className="text-2xl sm:text-3xl font-black text-[#171916] font-mono leading-none block">
                          {formatBudget(project.budget)}
                        </span>
                        <span className="text-[11px] font-semibold text-[#123D30] bg-[#E3F4EB] px-2.5 py-0.5 rounded-full inline-block">
                          Project Budget
                        </span>
                      </div>

                      {/* Apply Action Button */}
                      <button
                        type="button"
                        onClick={() => handleApply(project.id)}
                        className={`inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full text-xs sm:text-sm font-bold transition-all duration-200 cursor-pointer ${
                          isApplied
                            ? 'bg-[#123D30] text-white shadow-xs'
                            : 'bg-[#171916] hover:bg-[#08C58A] text-white hover:text-[#0A261D] shadow-[0_2px_12px_rgba(23,25,22,0.1)] hover:shadow-[0_4px_18px_rgba(8,197,138,0.3)]'
                        }`}
                      >
                        {isApplied ? (
                          <>
                            <Check className="w-4 h-4 stroke-[2.5]" />
                            <span>Preview selected</span>
                          </>
                        ) : (
                          <>
                            <span>Preview application</span>
                            <ArrowUpRight className="w-4 h-4 ml-0.5" />
                          </>
                        )}
                      </button>

                      <span className="flex items-center gap-1 text-[11px] text-[#777A72]">
                        <Sparkles className="w-3 h-3 text-[#08C58A]" />
                        <span>Preview only • no application is saved</span>
                      </span>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </section>
  )
}
