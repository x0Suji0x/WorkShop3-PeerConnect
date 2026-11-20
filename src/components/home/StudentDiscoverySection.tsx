import { useState, useEffect, useRef } from 'react'
import { ArrowRight, FolderGit2, Check, Sparkles, UserCheck } from 'lucide-react'
import { Link } from 'react-router-dom'
import { routes } from '../../app/routes'
import { mockStudents } from '../../data/mockData'
import { gsap, ScrollTrigger } from '../../lib/gsap'
import type { SkillCategory } from '../../types'

export function StudentDiscoverySection() {
  const [activeCategory, setActiveCategory] = useState<SkillCategory>('all')
  const [selectedStudent, setSelectedStudent] = useState<string | null>(null)
  const sectionRef = useRef<HTMLElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const filteredStudents = mockStudents.filter((student) => {
    if (activeCategory === 'all') return true
    if (activeCategory === 'design') {
      return student.skills.some((s) => s.category === 'design')
    }
    if (activeCategory === 'dev') {
      return student.skills.some((s) => s.category === 'dev')
    }
    if (activeCategory === 'ai') {
      return student.skills.some((s) => s.category === 'ai')
    }
    if (activeCategory === 'mobile') {
      return (
        student.headline.toLowerCase().includes('mobile') ||
        student.skills.some(
          (s) =>
            s.name.toLowerCase().includes('mobile') ||
            s.name.toLowerCase().includes('react native') ||
            s.name.toLowerCase().includes('swift'),
        )
      )
    }
    return true
  })

  const featuredStudent = filteredStudents[0]
  const rosterStudents = filteredStudents.slice(1)

  useEffect(() => {
    if (!containerRef.current) return

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      ScrollTrigger.refresh()
      return
    }

    const cards = containerRef.current.querySelectorAll('.talent-item')
    if (cards.length === 0) return

    const ctx = gsap.context(() => {
      gsap.fromTo(
        cards,
        { opacity: 0.72, y: 8 },
        {
          opacity: 1,
          y: 0,
          duration: 0.32,
          stagger: 0.045,
          ease: 'power2.out',
          clearProps: 'opacity,transform',
          scrollTrigger: {
            trigger: containerRef.current,
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
  }, [activeCategory])

  const categoryOptions = [
    { id: 'all', label: 'All Talent' },
    { id: 'dev', label: 'Development' },
    { id: 'design', label: 'Design' },
    { id: 'ai', label: 'AI & Data' },
    { id: 'mobile', label: 'Mobile' },
  ] as const

  return (
    <section
      id="talent"
      ref={sectionRef}
      className="py-18 sm:py-24 lg:py-28 bg-white text-[#171916] border-b border-[#E7E8E1] transition-colors relative"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* ============================================================== */}
        {/* SECTION HEADER: EDITORIAL MASTHEAD & CONTROLS                  */}
        {/* ============================================================== */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 pb-10 border-b border-[#E7E8E1]">
          <div className="max-w-2xl space-y-3">
            {/* Small Eyebrow */}
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#E3F4EB] border border-[#08C58A]/30 text-[#123D30] text-xs font-bold tracking-wider uppercase">
              <span className="w-2 h-2 rounded-full bg-[#08C58A] animate-pulse" />
              <span>CURATED TALENT DIRECTORY</span>
            </div>

            {/* Oversized Headline with Deliberate Line Breaks */}
            <h2 className="text-3xl sm:text-4xl lg:text-[46px] font-black text-[#171916] leading-[1.08] tracking-tight">
              Builders shaping{' '}
              <span className="text-[#08C58A] relative inline-block">
                what comes next.
                <span
                  aria-hidden="true"
                  className="absolute left-0 -bottom-1 w-full h-2.5 bg-[#E3F4EB] -rotate-1 -z-10 rounded-sm"
                />
              </span>
            </h2>

            {/* Supporting Text */}
            <p className="text-base sm:text-lg text-[#777A72] leading-relaxed pt-1">
              Meet ambitious university students turning technical craft and design precision into
              real-world products.
            </p>
          </div>

          {/* Directory Count Indicator */}
          <div className="self-start lg:self-auto flex items-center gap-2 px-4 py-2 rounded-full bg-[#F7F6F0] border border-[#E7E8E1] text-xs font-semibold text-[#171916]">
            <span className="w-2 h-2 rounded-full bg-[#08C58A]" />
            <span>
              Showing <strong className="text-[#171916] font-bold">{filteredStudents.length}</strong> of{' '}
              {mockStudents.length} student builders
            </span>
          </div>
        </div>

        {/* Integrated Filter Bar */}
        <div className="py-6 flex items-center justify-between gap-4 flex-wrap border-b border-[#E7E8E1]/80 mb-10">
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
                      : 'bg-[#F7F6F0] hover:bg-[#EAE8DF] text-[#777A72] hover:text-[#171916]'
                  }`}
                >
                  {tab.label}
                </button>
              )
            })}
          </div>

          <span className="text-xs text-[#777A72] hidden sm:inline-block font-mono">
            Demo Student Profiles • Connect to Collaborate
          </span>
        </div>

        {/* ============================================================== */}
        {/* ASYMMETRIC EDITORIAL LAYOUT: SPOTLIGHT + ROSTER               */}
        {/* ============================================================== */}
        {filteredStudents.length === 0 ? (
          <div className="p-16 text-center bg-[#F7F6F0] rounded-3xl border border-[#E7E8E1] space-y-3">
            <p className="text-lg font-bold text-[#171916]">No student builders found</p>
            <p className="text-sm text-[#777A72]">
              Try resetting your category filter to view all available talent.
            </p>
            <button
              type="button"
              onClick={() => setActiveCategory('all')}
              className="px-5 py-2.5 rounded-full text-xs font-semibold bg-[#171916] text-white hover:bg-[#242723] transition-colors cursor-pointer"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div ref={containerRef} className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* ---------------------------------------------------------- */}
            {/* LEFT / FEATURED TALENT SPOTLIGHT (7 Cols)                  */}
            {/* ---------------------------------------------------------- */}
            {featuredStudent && (
              <div className="talent-item lg:col-span-7 bg-[#F7F6F0] rounded-3xl p-6 sm:p-8 border border-[#E7E8E1] hover:border-[#08C58A]/50 transition-all duration-200 space-y-6">
                {/* Spotlight Header Badge */}
                <div className="flex items-center justify-between">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white text-[#123D30] text-xs font-bold border border-[#E7E8E1]">
                    <Sparkles className="w-3.5 h-3.5 text-[#08C58A]" />
                    Featured Spotlight
                  </span>
                  <span className="text-xs text-[#777A72] font-mono">
                    {featuredStudent.projectsCompleted} Projects Completed
                  </span>
                </div>

                {/* Profile Overview: Photo, Name, Rate */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-5 pt-2">
                  <div className="flex items-center gap-4">
                    <div className="relative shrink-0">
                      <img
                        src={featuredStudent.avatarUrl}
                        alt={featuredStudent.name}
                        className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl object-cover border-2 border-white shadow-sm"
                      />
                      <span
                        className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-white ${
                          featuredStudent.availability === 'Available now'
                            ? 'bg-[#08C58A]'
                            : 'bg-amber-400'
                        }`}
                        title={featuredStudent.availability}
                      />
                    </div>
                    <div className="space-y-1">
                      <h3 className="text-2xl sm:text-3xl font-black text-[#171916] leading-tight">
                        {featuredStudent.name}
                      </h3>
                      <p className="text-sm sm:text-base font-semibold text-[#08C58A]">
                        {featuredStudent.headline}
                      </p>
                      <p className="text-xs text-[#777A72]">
                        {featuredStudent.university}
                      </p>
                    </div>
                  </div>

                  {/* Hourly Rate Numeral */}
                  <div className="sm:text-right p-3 sm:p-0 rounded-2xl bg-white sm:bg-transparent border sm:border-0 border-[#E7E8E1]">
                    <span className="text-2xl sm:text-3xl font-black text-[#171916] font-mono leading-none block">
                      ${featuredStudent.hourlyRate}
                    </span>
                    <span className="text-xs text-[#777A72] block pt-1">
                      /hr (est. rate)
                    </span>
                  </div>
                </div>

                {/* Bio Statement */}
                {featuredStudent.bio && (
                  <p className="text-sm sm:text-base text-[#171916] leading-relaxed pt-1">
                    {featuredStudent.bio}
                  </p>
                )}

                {/* Featured Portfolio Showcase Box */}
                <div className="p-5 rounded-2xl bg-white border border-[#E7E8E1] space-y-2 shadow-2xs">
                  <div className="flex items-center justify-between text-xs text-[#777A72]">
                    <span className="flex items-center gap-1.5 font-bold text-[#171916] uppercase tracking-wider text-[11px]">
                      <FolderGit2 className="w-4 h-4 text-[#08C58A]" />
                      Featured Portfolio Project
                    </span>
                    <span className="text-[11px] font-mono text-[#08C58A] bg-[#E3F4EB] px-2 py-0.5 rounded-full font-bold">
                      Demo student work
                    </span>
                  </div>
                  <h4 className="text-base sm:text-lg font-bold text-[#171916] leading-snug">
                    {featuredStudent.featuredWork}
                  </h4>
                  <p className="text-xs text-[#777A72] leading-relaxed">
                    Designed and built with modern component architectures, fluid micro-interactions,
                    and clean modular code structure.
                  </p>
                </div>

                {/* Skills Row */}
                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-[#777A72] block pb-2">
                    Core Technical Skills
                  </span>
                  <div className="flex flex-wrap gap-2">
                    {featuredStudent.skills.map((skill, sIdx) => {
                      const isPrimary = sIdx === 0
                      return (
                        <span
                          key={skill.name}
                          className={`px-3 py-1 rounded-lg text-xs font-semibold ${
                            isPrimary
                              ? 'bg-[#E3F4EB] text-[#123D30] border border-[#08C58A]/30'
                              : 'bg-white text-[#171916] border border-[#E7E8E1]'
                          }`}
                        >
                          {skill.name}
                        </span>
                      )
                    })}
                  </div>
                </div>

                {/* Spotlight Footer Actions */}
                <div className="pt-4 border-t border-[#E7E8E1] flex flex-wrap items-center justify-between gap-4">
                  <div className="flex items-center gap-2 text-xs font-semibold text-[#171916]">
                    <span
                      className={`w-2.5 h-2.5 rounded-full ${
                        featuredStudent.availability === 'Available now'
                          ? 'bg-[#08C58A]'
                          : 'bg-amber-400'
                      }`}
                    />
                    <span>{featuredStudent.availability} for projects</span>
                  </div>

                  <button
                    type="button"
                    onClick={() =>
                      setSelectedStudent(
                        selectedStudent === featuredStudent.id ? null : featuredStudent.id,
                      )
                    }
                    className={`inline-flex items-center gap-2 px-6 py-3 rounded-full text-xs sm:text-sm font-bold transition-all duration-200 cursor-pointer ${
                      selectedStudent === featuredStudent.id
                        ? 'bg-[#123D30] text-white shadow-xs'
                        : 'bg-[#08C58A] hover:bg-[#07B27C] text-[#0A261D] shadow-[0_2px_12px_rgba(8,197,138,0.25)] hover:shadow-[0_4px_18px_rgba(8,197,138,0.35)]'
                    }`}
                  >
                    {selectedStudent === featuredStudent.id ? (
                      <>
                        <Check className="w-4 h-4 stroke-[2.5]" />
                        <span>Connected with {featuredStudent.name.split(' ')[0]}</span>
                      </>
                    ) : (
                      <>
                        <UserCheck className="w-4 h-4" />
                        <span>Connect with {featuredStudent.name.split(' ')[0]}</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            )}

            {/* ---------------------------------------------------------- */}
            {/* RIGHT / EDITORIAL ROSTER LIST (5 Cols)                     */}
            {/* ---------------------------------------------------------- */}
            <div className="lg:col-span-5 space-y-4">
              <div className="pb-1">
                <span className="text-xs font-bold uppercase tracking-wider text-[#777A72]">
                  Emerging Builders ({rosterStudents.length})
                </span>
              </div>

              {rosterStudents.map((student) => {
                const isRequested = selectedStudent === student.id

                return (
                  <div
                    key={student.id}
                    className="talent-item bg-white rounded-2xl p-5 border border-[#E7E8E1] hover:border-[#08C58A]/50 hover:shadow-[0_8px_24px_rgba(23,25,22,0.06)] transition-all duration-200 space-y-3"
                  >
                    {/* Header Row: Photo + Name + Rate */}
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <div className="relative shrink-0">
                          <img
                            src={student.avatarUrl}
                            alt={student.name}
                            className="w-12 h-12 rounded-xl object-cover border border-[#E7E8E1]"
                          />
                          <span
                            className={`absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2 border-white ${
                              student.availability === 'Available now'
                                ? 'bg-[#08C58A]'
                                : 'bg-amber-400'
                            }`}
                          />
                        </div>
                        <div>
                          <h4 className="font-bold text-[#171916] text-sm leading-snug">
                            {student.name}
                          </h4>
                          <p className="text-xs text-[#08C58A] font-medium">
                            {student.headline}
                          </p>
                          <p className="text-[11px] text-[#777A72]">
                            {student.university}
                          </p>
                        </div>
                      </div>

                      <div className="text-right shrink-0">
                        <span className="font-mono text-sm font-extrabold text-[#171916]">
                          ${student.hourlyRate}/hr
                        </span>
                      </div>
                    </div>

                    {/* Featured Work Snippet */}
                    <p className="text-xs text-[#777A72] line-clamp-2 leading-relaxed bg-[#F7F6F0] p-2.5 rounded-xl border border-[#E7E8E1]">
                      <strong className="text-[#171916] font-semibold">Featured Work: </strong>
                      {student.featuredWork}
                    </p>

                    {/* Skills & Action */}
                    <div className="flex items-center justify-between gap-2 pt-1">
                      <div className="flex flex-wrap gap-1">
                        {student.skills.slice(0, 3).map((skill) => (
                          <span
                            key={skill.name}
                            className="px-2 py-0.5 rounded text-[10px] font-medium bg-[#F7F6F0] text-[#171916] border border-[#E7E8E1]"
                          >
                            {skill.name}
                          </span>
                        ))}
                      </div>

                      <button
                        type="button"
                        onClick={() =>
                          setSelectedStudent(isRequested ? null : student.id)
                        }
                        className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold transition-all duration-200 cursor-pointer shrink-0 ${
                          isRequested
                            ? 'bg-[#123D30] text-white'
                            : 'bg-[#F7F6F0] hover:bg-[#08C58A] text-[#171916] hover:text-[#0A261D] border border-[#E7E8E1]'
                        }`}
                      >
                        {isRequested ? (
                          <>
                            <Check className="w-3 h-3 stroke-[2.5]" />
                            <span>Connected</span>
                          </>
                        ) : (
                          <>
                            <span>Connect</span>
                            <ArrowRight className="w-3 h-3 ml-0.5" />
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        )}

        {/* Section Bottom Transition Strip */}
        <div className="mt-14 pt-8 border-t border-[#E7E8E1] flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#777A72]">
          <p>Have an open project brief or looking for collaborative student builders?</p>
          <Link
            to={routes.projects}
            className="text-[#08C58A] font-bold hover:underline inline-flex items-center gap-1.5 cursor-pointer text-sm"
          >
            <span>Explore Open Project Opportunities</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </section>
  )
}
