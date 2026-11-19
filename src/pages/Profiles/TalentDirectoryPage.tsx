import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import {
  Search,
  Star,
  ArrowRight,
  Briefcase,
  FolderGit2,
} from 'lucide-react'
import { PageHeading } from '../../components/common/PageHeading'
import { Button } from '../../components/common/Button'
import { talentDirectoryStudents } from '../../data/talentDirectoryMockData'
import { DemoNotice } from '../../components/common/DemoNotice'
import type { SkillCategory } from '../../types'

const CATEGORY_TABS: { id: SkillCategory | 'all'; label: string }[] = [
  { id: 'all', label: 'All Talent' },
  { id: 'dev', label: 'Engineering & Web' },
  { id: 'design', label: 'UI/UX & Design' },
  { id: 'ai', label: 'AI & Data Science' },
  { id: 'mobile', label: 'Mobile Apps' },
]

export function TalentDirectoryPage() {
  const [activeCategory, setActiveCategory] = useState<SkillCategory | 'all'>('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [availableOnly, setAvailableOnly] = useState(false)
  const [collegeFilter, setCollegeFilter] = useState('All')

  const allStudents = talentDirectoryStudents

  const filteredStudents = useMemo(() => {
    return allStudents.filter((student) => {
      // Category filter
      if (activeCategory !== 'all') {
        const matchesCategory = student.skills.some((s) => s.category === activeCategory)
        const matchesRole =
          (activeCategory === 'dev' &&
            /engineer|web|full-stack|frontend|backend/i.test(student.headline)) ||
          (activeCategory === 'design' && /design|ui|ux|product/i.test(student.headline)) ||
          (activeCategory === 'ai' && /ai|ml|data|learning|llm/i.test(student.headline)) ||
          (activeCategory === 'mobile' && /mobile|flutter|react native|ios/i.test(student.headline))
        if (!matchesCategory && !matchesRole) return false
      }

      // Availability filter
      if (availableOnly && !/available/i.test(student.availability)) {
        return false
      }

      // College filter
      if (collegeFilter !== 'All' && !student.university.toLowerCase().includes(collegeFilter.toLowerCase())) {
        return false
      }

      // Search query filter
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim()
        const matchName = student.name.toLowerCase().includes(q)
        const matchHeadline = student.headline.toLowerCase().includes(q)
        const matchUni = student.university.toLowerCase().includes(q)
        const matchSkills = student.skills.some((s) => s.name.toLowerCase().includes(q))
        if (!matchName && !matchHeadline && !matchUni && !matchSkills) {
          return false
        }
      }

      return true
    })
  }, [allStudents, activeCategory, availableOnly, collegeFilter, searchQuery])

  return (
    <div className="peer-page-surface min-h-[calc(100vh-80px)] relative overflow-hidden">
      {/* Ambient lighting glows identical to home page */}
      <div className="peer-ambient-glow peer-glow-gold -top-24 -left-24 h-96 w-96" />
      <div className="peer-ambient-glow peer-glow-rose top-1/4 -right-24 h-96 w-96" />
      <div className="peer-ambient-glow peer-glow-mint -bottom-24 left-1/3 h-96 w-96" />
      <div className="pointer-events-none absolute inset-0 bg-grid-pattern opacity-30 -z-0" />

      <div className="relative z-10 mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 sm:py-10 lg:px-8 space-y-8">
        {/* Page Heading */}
        <PageHeading
          eyebrow="Student Talent Directory"
          title="Discover student builders."
          description="Explore sample student talent across engineering, design, media, content, and marketing. Ratings and reviews are illustrative demo content."
          actions={
            <div className="flex items-center gap-2">
              <Link to="/signup/student">
                <Button size="sm" variant="primary">
                  Join as Student <ArrowRight className="h-3.5 w-3.5 ml-1" />
                </Button>
              </Link>
              <Link to="/signin?role=client">
                <Button size="sm" variant="secondary">
                  <Briefcase className="h-3.5 w-3.5 mr-1" /> Hire Talent
                </Button>
              </Link>
            </div>
          }
        />

        {/* Search and Filters Section */}
        <section className="rounded-2xl border border-[rgba(91,112,96,0.18)] bg-white/70 p-4 sm:p-5 space-y-4 backdrop-blur-md shadow-2xs">
        {/* Search Bar */}
        <div className="relative">
          <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[#777A72]" />
          <input
            type="text"
            placeholder="Search by student name, skill (e.g. React, Three.js, Python), college, or role..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-xl border border-[#E7E8E1] bg-white py-3 pl-11 pr-4 text-xs text-[#171916] outline-none transition focus:border-[#08C58A] focus:ring-2 focus:ring-[#08C58A]/20 sm:text-sm"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery('')}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs font-bold text-[#777A72] hover:text-[#171916]"
            >
              Clear
            </button>
          )}
        </div>

        {/* Filter Badges and Selectors */}
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          {/* Category Tabs */}
          <div className="flex flex-wrap items-center gap-1.5">
            {CATEGORY_TABS.map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveCategory(tab.id)}
                className={`rounded-full px-3.5 py-1.5 text-xs font-bold transition-all ${
                  activeCategory === tab.id
                    ? 'bg-[#123D30] text-white shadow-2xs'
                    : 'bg-white text-[#525A55] border border-[#E7E8E1] hover:border-[#08C58A]'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Quick Filters */}
          <div className="flex flex-wrap items-center gap-2">
            <select
              value={collegeFilter}
              onChange={(e) => setCollegeFilter(e.target.value)}
              className="rounded-full border border-[#E7E8E1] bg-white px-3 py-1.5 text-xs font-semibold text-[#171916] outline-none"
            >
              <option value="All">All Campuses</option>
              <option value="NID">National Institute of Design (NID)</option>
              <option value="IIT">IITs</option>
              <option value="IIIT">IIITs</option>
              <option value="BITS">BITS Pilani</option>
            </select>

            <button
              type="button"
              onClick={() => setAvailableOnly(!availableOnly)}
              className={`rounded-full px-3 py-1.5 text-xs font-bold transition-all border ${
                availableOnly
                  ? 'bg-[#E3F4EB] text-[#123D30] border-[#08C58A]'
                  : 'bg-white text-[#525A55] border-[#E7E8E1]'
              }`}
            >
              ✓ Available Now
            </button>
          </div>
        </div>
      </section>

      {/* Results Count */}
      <div className="flex items-center justify-between text-xs text-[#777A72]">
        <span>
          Showing <strong className="text-[#171916]">{filteredStudents.length}</strong> student builder profiles
        </span>
      </div>
      <div className="mt-3"><DemoNotice>Demo profiles only. Ratings and reviews are sample content; student identity, enrollment, skills, and work history have not been independently checked.</DemoNotice></div>

      {/* Student Cards Grid */}
      {filteredStudents.length > 0 ? (
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
          {filteredStudents.map((student) => (
            <div
              key={student.id}
              className="peer-card-glass p-5 group flex flex-col justify-between hover:-translate-y-1 transition-all duration-200"
            >
              <div className="space-y-4">
                {/* Header: Avatar and name */}
                <div className="flex items-start gap-3.5">
                  <div className="relative shrink-0">
                    <img
                      src={student.avatarUrl}
                      alt={student.name}
                      className="h-14 w-14 rounded-2xl object-cover border-2 border-white shadow-xs"
                    />
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between gap-1">
                      <h3 className="truncate text-base font-black text-[#171916] group-hover:text-[#08A876] transition-colors">
                        {student.name}
                      </h3>
                      <span className="rounded-md bg-[#E3F4EB] px-1.5 py-0.5 text-[10px] font-bold text-[#08A876]">
                        {student.availability}
                      </span>
                    </div>

                    <p className="truncate text-xs font-semibold text-[#08A876]">
                      {student.headline}
                    </p>
                    <p className="truncate text-[11px] text-[#777A72]">
                      {student.university}
                    </p>
                  </div>
                </div>

                {/* Bio / Summary */}
                <p className="text-xs leading-relaxed text-[#525A55] line-clamp-2">
                  {student.bio}
                </p>

                {student.sampleReview && (
                  <blockquote className="rounded-xl border border-[#E7E8E1] bg-white/70 px-3 py-2.5 text-xs leading-relaxed text-[#525A55] line-clamp-2">
                    <span className="mb-1 block text-[10px] font-bold uppercase tracking-wide text-[#777A72]">Sample review</span>
                    “{student.sampleReview}”
                  </blockquote>
                )}

                {/* Featured Work Highlight */}
                {student.featuredWork && (
                  <div className="rounded-xl bg-[#FAF8F5] border border-[#E7E8E1] p-2.5 text-[11px] text-[#525A55]">
                    <div className="flex items-center gap-1 font-bold text-[#171916] mb-0.5">
                      <FolderGit2 className="h-3 w-3 text-[#08C58A]" />
                      <span>Sample Work</span>
                    </div>
                    <span className="italic">{student.featuredWork}</span>
                  </div>
                )}

                {/* Skills tags */}
                <div className="flex flex-wrap gap-1.5">
                  {student.skills.slice(0, 4).map((skill) => (
                    <span
                      key={skill.name}
                      className="rounded-md bg-[#F7F6F0] px-2 py-0.5 text-[11px] font-semibold text-[#525A55] border border-[#E7E8E1]"
                    >
                      {skill.name}
                    </span>
                  ))}
                  {student.skills.length > 4 && (
                    <span className="rounded-md bg-[#F7F6F0] px-1.5 py-0.5 text-[10px] font-semibold text-[#777A72]">
                      +{student.skills.length - 4}
                    </span>
                  )}
                </div>
              </div>

              {/* Card Footer: Metrics & Action */}
              <div className="mt-5 peer-divider-fade-t pt-3 flex items-center justify-between text-xs">
                <div className="flex items-center gap-1 text-[#777A72]">
                  <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                  <span className="font-bold text-[#171916]">{student.rating.toFixed(1)}/5</span>
                  <span>({student.reviewsCount} reviews)</span>
                </div>

                <Link
                  to={`/profiles/${student.id}`}
                  className="inline-flex items-center gap-1 text-xs font-bold text-[#123D30] hover:text-[#08A876] transition-colors"
                >
                  View Profile <ArrowRight className="h-3 w-3" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="rounded-2xl border border-dashed border-[#CBD5E1] bg-white p-12 text-center space-y-3">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-[#E3F4EB] text-[#08C58A]">
            <Search className="h-6 w-6" />
          </div>
          <h3 className="text-base font-bold text-[#171916]">No student builders found</h3>
          <p className="text-xs text-[#777A72] max-w-sm mx-auto">
            We couldn't find any profiles matching your search criteria. Try clearing your filters or search terms.
          </p>
          <Button
            size="sm"
            variant="secondary"
            onClick={() => {
              setSearchQuery('')
              setActiveCategory('all')
              setCollegeFilter('All')
              setAvailableOnly(false)
            }}
          >
            Reset Filters
          </Button>
        </div>
      )}
      </div>
    </div>
  )
}
