import { useState, useEffect, useRef } from 'react'
import {
  Clock,
  Briefcase,
  Users,
  Building2,
  CheckCircle2,
  ArrowUpRight,
  Check,
  Search,
  X,
} from 'lucide-react'
import { mockProjects } from '../../data/mockData'
import { gsap, ScrollTrigger } from '../../lib/gsap'

export function ProjectMarketplaceSection() {
  const [activeCategory, setActiveCategory] = useState<string>('all')
  const [searchQuery, setSearchQuery] = useState<string>('')
  const [appliedProjects, setAppliedProjects] = useState<Record<string, boolean>>({})
  const sectionRef = useRef<HTMLElement>(null)
  const gridRef = useRef<HTMLDivElement>(null)

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
    if (!gridRef.current) return

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      ScrollTrigger.refresh()
      return
    }

    const cards = gridRef.current.querySelectorAll('.project-card')
    if (cards.length === 0) return

    const ctx = gsap.context(() => {
      gsap.fromTo(
        cards,
        { opacity: 0.3, y: 15 },
        {
          opacity: 1,
          y: 0,
          duration: 0.45,
          stagger: 0.08,
          ease: 'power2.out',
          clearProps: 'opacity,transform',
          scrollTrigger: {
            trigger: gridRef.current,
            start: 'top 95%',
            once: true,
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
      className="py-14 sm:py-20 lg:py-24 bg-[#F7F6F0] text-[#171916] border-b border-[#E7E8E1] transition-colors"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-10">
          <div className="max-w-2xl space-y-3">
            {/* Small Eyebrow */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#E3F4EB] border border-[#08C58A]/30 text-[#123D30] text-xs font-semibold tracking-wider uppercase">
              <span className="w-2 h-2 rounded-full bg-[#08C58A] animate-pulse" />
              <span>REAL WORK. REAL OPPORTUNITIES.</span>
            </div>

            {/* Headline */}
            <h2 className="text-3xl sm:text-4xl lg:text-[42px] font-extrabold text-[#171916] leading-tight tracking-tight">
              Find a project worth{' '}
              <span className="text-[#08C58A] relative inline-block">
                building.
                <span
                  aria-hidden="true"
                  className="absolute left-0 -bottom-1 w-full h-2 bg-[#E3F4EB] -rotate-1 -z-10 rounded-sm"
                />
              </span>
            </h2>

            {/* Supporting Text */}
            <p className="text-base sm:text-lg text-[#777A72] leading-relaxed">
              Explore meaningful projects from startups, local businesses and ambitious creators
              looking for student talent.
            </p>
          </div>

          {/* Directory Count Indicator */}
          <div className="self-start lg:self-auto">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white border border-[#E7E8E1] text-xs font-medium text-[#171916] shadow-2xs">
              <span className="w-1.5 h-1.5 rounded-full bg-[#08C58A]" />
              <span>
                Showing <strong className="text-[#171916] font-bold">{filteredProjects.length}</strong> of{' '}
                {mockProjects.length} sample opportunities
              </span>
            </div>
          </div>
        </div>

        {/* Discovery Controls: Filters & Search */}
        <div className="mb-8 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
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
                      ? 'bg-[#171916] text-white shadow-xs border border-[#171916]'
                      : 'bg-white hover:bg-[#F2F1EA] text-[#777A72] hover:text-[#171916] border border-[#E7E8E1]'
                  }`}
                >
                  {tab.label}
                </button>
              )
            })}
          </div>

          {/* Connected Search Field */}
          <div className="relative w-full sm:w-72 shrink-0">
            <Search className="w-4 h-4 text-[#777A72] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search projects or skills..."
              aria-label="Search projects or skills"
              className="w-full pl-9 pr-9 py-2 text-xs sm:text-sm bg-white border border-[#E7E8E1] rounded-full text-[#171916] placeholder:text-[#777A72] focus:outline-none focus:ring-2 focus:ring-[#08C58A]/50 focus:border-[#08C58A] transition-all shadow-2xs"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 p-0.5 text-[#777A72] hover:text-[#171916] cursor-pointer"
                title="Clear search"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>

        {/* Projects Grid */}
        {filteredProjects.length === 0 ? (
          <div className="p-12 text-center bg-white rounded-2xl border border-[#E7E8E1] space-y-3">
            <p className="text-base font-bold text-[#171916]">No matching project scopes found</p>
            <p className="text-xs sm:text-sm text-[#777A72]">
              Try adjusting your category filter or search keywords.
            </p>
            <button
              type="button"
              onClick={() => {
                setActiveCategory('all')
                setSearchQuery('')
              }}
              className="px-4 py-2 rounded-full text-xs font-semibold bg-[#171916] text-white hover:bg-[#252823] transition-colors cursor-pointer"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div ref={gridRef} className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {filteredProjects.map((project) => {
              const isApplied = appliedProjects[project.id]
              const isFeatured = project.badge === 'Featured'

              return (
                <div
                  key={project.id}
                  tabIndex={0}
                  className={`project-card group bg-white rounded-2xl p-6 sm:p-7 border transition-all duration-200 flex flex-col justify-between space-y-5 shadow-[0_4px_20px_rgba(23,25,22,0.04)] hover:shadow-[0_12px_32px_rgba(23,25,22,0.08)] hover:-translate-y-1 focus:outline-none focus:ring-2 focus:ring-[#08C58A]/50 focus:ring-offset-2 ${
                    isFeatured
                      ? 'border-[#08C58A]/40 ring-1 ring-[#08C58A]/20'
                      : 'border-[#E7E8E1] hover:border-[#08C58A]/50'
                  }`}
                >
                  <div className="space-y-4">
                    {/* Header Row: Status Badge & Prominent Compensation */}
                    <div className="flex items-start justify-between gap-4">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          {project.badge && (
                            <span
                              className={`px-2.5 py-0.5 rounded-full text-[11px] font-semibold border ${
                                project.badge === 'Featured'
                                  ? 'bg-[#E3F4EB] text-[#123D30] border-[#08C58A]/30'
                                  : project.badge === 'High Urgency'
                                  ? 'bg-orange-50 text-orange-800 border-orange-200'
                                  : 'bg-[#F7F6F0] text-[#171916] border-[#E7E8E1]'
                              }`}
                            >
                              {project.badge}
                            </span>
                          )}
                          <span className="text-[11px] text-[#777A72]">
                            {project.postedTimeAgo}
                          </span>
                        </div>

                        {/* Project Title */}
                        <h3 className="text-lg sm:text-xl font-bold text-[#171916] group-hover:text-[#08C58A] transition-colors leading-snug pt-1">
                          {project.title}
                        </h3>

                        {/* Client / Organization Label */}
                        <div className="flex items-center gap-1.5 text-xs text-[#777A72]">
                          <Building2 className="w-3.5 h-3.5 text-[#08C58A] shrink-0" />
                          <span className="font-semibold text-[#171916]">
                            {project.clientName}
                          </span>
                          <span>•</span>
                          <span>{project.clientType}</span>
                        </div>
                      </div>

                      {/* Prominent Compensation Callout */}
                      <div className="p-3 rounded-xl bg-[#F7F6F0] border border-[#E7E8E1] text-right shrink-0">
                        <span className="text-xl sm:text-2xl font-extrabold text-[#171916] block leading-none">
                          ${project.budget.toLocaleString()}
                        </span>
                        <span className="text-[10px] font-semibold text-[#123D30] bg-[#E3F4EB] px-2 py-0.5 rounded-md inline-block mt-1">
                          {project.budgetType}
                        </span>
                      </div>
                    </div>

                    {/* Short Project Description */}
                    <p className="text-xs sm:text-sm text-[#777A72] leading-relaxed line-clamp-3">
                      {project.description}
                    </p>

                    {/* Compact Scope & Commitment Inset Strip */}
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 p-3 rounded-xl bg-[#F7F6F0] border border-[#E7E8E1] text-xs text-[#777A72]">
                      <div className="flex items-center gap-1.5">
                        <Clock className="w-3.5 h-3.5 text-[#08C58A] shrink-0" />
                        <span>
                          Duration: <strong className="text-[#171916] font-semibold">{project.duration}</strong>
                        </span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Briefcase className="w-3.5 h-3.5 text-[#08C58A] shrink-0" />
                        <span>
                          Effort: <strong className="text-[#171916] font-semibold">{project.hoursPerWeek}</strong>
                        </span>
                      </div>
                      <div className="col-span-2 sm:col-span-1 flex items-center gap-1.5">
                        <Users className="w-3.5 h-3.5 text-[#08C58A] shrink-0" />
                        <span>
                          <strong className="text-[#171916] font-semibold">{project.applicantsCount}</strong> Pitches
                        </span>
                      </div>
                    </div>

                    {/* Required Skills Chips */}
                    <div className="flex flex-wrap items-center gap-1.5 pt-1">
                      <span className="text-[11px] font-semibold uppercase tracking-wider text-[#777A72] mr-1">
                        Stack:
                      </span>
                      {project.skillsRequired.map((skill, sIdx) => {
                        const isPrimary = sIdx === 0
                        return (
                          <span
                            key={skill}
                            className={`px-2.5 py-0.5 rounded-md text-[11px] font-medium ${
                              isPrimary
                                ? 'bg-[#E3F4EB] text-[#123D30] border border-[#08C58A]/30'
                                : 'bg-[#F7F6F0] text-[#171916] border border-[#E7E8E1]'
                            }`}
                          >
                            {skill}
                          </span>
                        )
                      })}
                    </div>
                  </div>

                  {/* Card Footer: Model Note & Apply Action */}
                  <div className="pt-4 border-t border-[#E7E8E1] flex items-center justify-between gap-3">
                    <div className="flex items-center gap-1.5 text-xs text-[#123D30] font-medium">
                      <CheckCircle2 className="w-3.5 h-3.5 text-[#08C58A] shrink-0" />
                      <span>Sample Brief • Milestone Allocation</span>
                    </div>

                    <button
                      type="button"
                      onClick={() => handleApply(project.id)}
                      className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-semibold transition-all duration-200 cursor-pointer ${
                        isApplied
                          ? 'bg-[#123D30] text-white border border-[#123D30] shadow-2xs'
                          : 'bg-white hover:bg-[#08C58A] text-[#171916] hover:text-[#0A261D] border border-[#E7E8E1] hover:border-[#08C58A] shadow-2xs'
                      }`}
                    >
                      {isApplied ? (
                        <>
                          <Check className="w-3 h-3 stroke-[2.5]" />
                          <span>Application Sent</span>
                        </>
                      ) : (
                        <>
                          <span>Apply with Profile</span>
                          <ArrowUpRight className="w-3 h-3 ml-0.5" />
                        </>
                      )}
                    </button>
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
