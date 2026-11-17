import { useState, useEffect, useRef } from 'react'
import { CheckCircle, ArrowRight, FolderGit2, Check } from 'lucide-react'
import { mockStudents } from '../../data/mockData'
import { gsap, ScrollTrigger } from '../../lib/gsap'
import type { SkillCategory } from '../../types'

export function StudentDiscoverySection() {
  const [activeCategory, setActiveCategory] = useState<SkillCategory>('all')
  const [selectedStudent, setSelectedStudent] = useState<string | null>(null)
  const sectionRef = useRef<HTMLElement>(null)
  const cardsContainerRef = useRef<HTMLDivElement>(null)

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

  useEffect(() => {
    if (!cardsContainerRef.current) return

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      ScrollTrigger.refresh()
      return
    }

    const cards = cardsContainerRef.current.querySelectorAll('.student-card')
    if (cards.length === 0) return

    const ctx = gsap.context(() => {
      gsap.fromTo(
        cards,
        { opacity: 0.3, y: 15 },
        {
          opacity: 1,
          y: 0,
          duration: 0.45,
          stagger: 0.06,
          ease: 'power2.out',
          clearProps: 'opacity,transform',
          scrollTrigger: {
            trigger: cardsContainerRef.current,
            start: 'top 95%',
            once: true,
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
      className="py-14 sm:py-20 lg:py-24 bg-[#F7F6F0] text-[#171916] border-b border-[#E7E8E1] transition-colors"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-10">
          <div className="max-w-2xl space-y-3">
            {/* Small Eyebrow */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#E3F4EB] border border-[#08C58A]/30 text-[#123D30] text-xs font-semibold tracking-wider uppercase">
              <span className="w-2 h-2 rounded-full bg-[#08C58A] animate-pulse" />
              <span>MEET THE BUILDERS</span>
            </div>

            {/* Headline */}
            <h2 className="text-3xl sm:text-4xl lg:text-[42px] font-extrabold text-[#171916] leading-tight tracking-tight">
              Talent worth{' '}
              <span className="text-[#08C58A] relative inline-block">
                discovering.
                <span
                  aria-hidden="true"
                  className="absolute left-0 -bottom-1 w-full h-2 bg-[#E3F4EB] -rotate-1 -z-10 rounded-sm"
                />
              </span>
            </h2>

            {/* Supporting Text */}
            <p className="text-base sm:text-lg text-[#777A72] leading-relaxed">
              Meet ambitious students turning their skills into real projects, products and ideas.
            </p>
          </div>

          {/* Directory Count Indicator */}
          <div className="self-start lg:self-auto">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white border border-[#E7E8E1] text-xs font-medium text-[#171916] shadow-2xs">
              <span className="w-1.5 h-1.5 rounded-full bg-[#08C58A]" />
              <span>
                Showing <strong className="text-[#171916] font-bold">{filteredStudents.length}</strong> of{' '}
                {mockStudents.length} builders
              </span>
            </div>
          </div>
        </div>

        {/* Filter Controls */}
        <div className="mb-8 flex items-center gap-2 overflow-x-auto pb-2 sm:pb-0 scrollbar-none">
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

        {/* Student Cards Grid */}
        <div
          ref={cardsContainerRef}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {filteredStudents.map((student, index) => {
            const isRequested = selectedStudent === student.id
            const isFeatured = index === 0

            return (
              <div
                key={student.id}
                tabIndex={0}
                className={`student-card group bg-white rounded-2xl p-6 border transition-all duration-200 flex flex-col justify-between shadow-[0_4px_20px_rgba(23,25,22,0.04)] hover:shadow-[0_12px_32px_rgba(23,25,22,0.08)] hover:-translate-y-1 focus:outline-none focus:ring-2 focus:ring-[#08C58A]/50 focus:ring-offset-2 ${
                  isFeatured
                    ? 'border-[#08C58A]/40 ring-1 ring-[#08C58A]/20'
                    : 'border-[#E7E8E1] hover:border-[#08C58A]/50'
                }`}
              >
                {/* Upper Details */}
                <div className="space-y-4">
                  {/* Header: Photo + Name + Status & Rate */}
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3.5">
                      <div className="relative shrink-0">
                        <img
                          src={student.avatarUrl}
                          alt={student.name}
                          className="w-13 h-13 rounded-2xl object-cover border border-[#E7E8E1] group-hover:scale-105 transition-transform duration-200"
                        />
                        <span
                          className={`absolute -bottom-1 -right-1 w-3.5 h-3.5 rounded-full border-2 border-white ${
                            student.availability === 'Available now'
                              ? 'bg-[#08C58A]'
                              : 'bg-amber-400'
                          }`}
                          title={student.availability}
                        />
                      </div>
                      <div>
                        <div className="flex items-center gap-1.5">
                          <h3 className="font-bold text-[#171916] text-base group-hover:text-[#08C58A] transition-colors leading-snug">
                            {student.name}
                          </h3>
                          <span
                            className="text-[#08C58A]"
                            title="Verified Demo Profile"
                          >
                            <CheckCircle className="w-3.5 h-3.5 fill-[#08C58A]/15 text-[#08C58A]" />
                          </span>
                        </div>
                        <p className="text-xs text-[#777A72] font-medium leading-tight">
                          {student.university}
                        </p>
                      </div>
                    </div>

                    <div className="text-right shrink-0">
                      <span className="text-base font-extrabold text-[#171916] block leading-none">
                        ${student.hourlyRate}
                      </span>
                      <span className="text-[10px] text-[#777A72] font-normal block pt-0.5">
                        /hr (est.)
                      </span>
                    </div>
                  </div>

                  {/* Role / Specialization */}
                  <div>
                    <h4 className="text-sm font-semibold text-[#171916] leading-snug">
                      {student.headline}
                    </h4>
                    {/* Short Professional Introduction */}
                    {student.bio && (
                      <p className="text-xs text-[#777A72] line-clamp-2 leading-relaxed pt-1">
                        {student.bio}
                      </p>
                    )}
                  </div>

                  {/* Featured Portfolio Preview Box */}
                  <div className="p-3.5 rounded-xl bg-[#F7F6F0] border border-[#E7E8E1] space-y-1">
                    <div className="flex items-center justify-between text-[11px] font-semibold text-[#777A72]">
                      <span className="flex items-center gap-1.5 uppercase tracking-wider text-[10px]">
                        <FolderGit2 className="w-3.5 h-3.5 text-[#08C58A]" />
                        Featured Portfolio
                      </span>
                      <span className="text-[10px] font-mono text-[#08C58A] bg-[#E3F4EB] px-1.5 py-0.5 rounded border border-[#08C58A]/20">
                        {student.projectsCompleted} Repos
                      </span>
                    </div>
                    <p className="text-xs font-semibold text-[#171916] leading-snug line-clamp-2">
                      {student.featuredWork}
                    </p>
                  </div>

                  {/* Skills tags */}
                  <div className="flex flex-wrap gap-1.5 pt-0.5">
                    {student.skills.map((skill, sIdx) => {
                      const isPrimarySkill = sIdx === 0
                      return (
                        <span
                          key={skill.name}
                          className={`px-2.5 py-0.5 rounded-md text-[11px] font-medium transition-colors ${
                            isPrimarySkill
                              ? 'bg-[#E3F4EB] text-[#123D30] border border-[#08C58A]/30'
                              : 'bg-[#F7F6F0] text-[#171916] border border-[#E7E8E1]'
                          }`}
                        >
                          {skill.name}
                        </span>
                      )
                    })}
                  </div>
                </div>

                {/* Card Footer: Status & Action */}
                <div className="pt-4 mt-5 border-t border-[#E7E8E1] flex items-center justify-between gap-3">
                  <div className="flex items-center gap-1.5 text-xs text-[#777A72]">
                    <span
                      className={`w-2 h-2 rounded-full shrink-0 ${
                        student.availability === 'Available now'
                          ? 'bg-[#08C58A]'
                          : 'bg-amber-400'
                      }`}
                    />
                    <span className="text-[11px] font-medium text-[#171916]">
                      {student.availability}
                    </span>
                  </div>

                  <button
                    type="button"
                    onClick={() =>
                      setSelectedStudent(isRequested ? null : student.id)
                    }
                    className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-semibold transition-all duration-200 cursor-pointer ${
                      isRequested
                        ? 'bg-[#123D30] text-white border border-[#123D30] shadow-2xs'
                        : 'bg-white hover:bg-[#08C58A] text-[#171916] hover:text-[#0A261D] border border-[#E7E8E1] hover:border-[#08C58A] shadow-2xs'
                    }`}
                  >
                    {isRequested ? (
                      <>
                        <Check className="w-3 h-3 stroke-[2.5]" />
                        <span>Requested</span>
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

        {/* Bottom helper bar */}
        <div className="mt-12 text-center">
          <p className="text-xs sm:text-sm text-[#777A72]">
            Looking for specific deliverables or have a scoped project?{' '}
            <a
              href="#projects"
              className="text-[#08C58A] font-semibold hover:underline inline-flex items-center gap-1"
            >
              Explore sample project opportunities
              <ArrowRight className="w-3.5 h-3.5" />
            </a>
          </p>
        </div>
      </div>
    </section>
  )
}
