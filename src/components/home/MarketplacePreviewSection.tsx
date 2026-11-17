import { useState, useMemo } from 'react'
import { Search, X, FolderGit2, Briefcase } from 'lucide-react'
import { mockStudents, mockProjects } from '../../data/mockData'
import type { SkillCategory } from '../../types'

export function MarketplacePreviewSection() {
  const [activeTab, setActiveTab] = useState<'students' | 'projects'>('students')
  const [studentCategory, setStudentCategory] = useState<SkillCategory>('all')
  const [projectCategory, setProjectCategory] = useState<string>('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [connectedStudents, setConnectedStudents] = useState<Record<string, boolean>>({})
  const [appliedProjects, setAppliedProjects] = useState<Record<string, boolean>>({})

  // Toggle student connection
  const toggleConnect = (id: string) => {
    setConnectedStudents((prev) => ({ ...prev, [id]: !prev[id] }))
  }

  // Toggle project application
  const toggleApply = (id: string) => {
    setAppliedProjects((prev) => ({ ...prev, [id]: !prev[id] }))
  }

  // Filter students
  const filteredStudents = useMemo(() => {
    return mockStudents.filter((student) => {
      const matchesCategory =
        studentCategory === 'all' ||
        student.skills.some((s) => s.category === studentCategory)

      const matchesSearch =
        searchQuery.trim() === '' ||
        student.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        student.headline.toLowerCase().includes(searchQuery.toLowerCase()) ||
        student.skills.some((s) => s.name.toLowerCase().includes(searchQuery.toLowerCase()))

      return matchesCategory && matchesSearch
    })
  }, [studentCategory, searchQuery])

  // Filter projects
  const filteredProjects = useMemo(() => {
    return mockProjects.filter((project) => {
      const matchesCategory =
        projectCategory === 'all' ||
        (projectCategory === 'dev' && project.skillsRequired.some((s) => ['React', 'TypeScript', 'PostgreSQL', 'Go'].some(k => s.includes(k)))) ||
        (projectCategory === 'design' && project.skillsRequired.some((s) => ['Figma', 'Three.js', 'GSAP'].some(k => s.includes(k)))) ||
        (projectCategory === 'ai' && project.skillsRequired.some((s) => ['Python', 'FastAPI', 'LangChain', 'pgvector'].some(k => s.includes(k)))) ||
        (projectCategory === 'mobile' && project.skillsRequired.some((s) => ['React Native', 'Expo', 'Supabase'].some(k => s.includes(k))))

      const matchesSearch =
        searchQuery.trim() === '' ||
        project.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        project.clientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        project.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        project.skillsRequired.some((s) => s.toLowerCase().includes(searchQuery.toLowerCase()))

      return matchesCategory && matchesSearch
    })
  }, [projectCategory, searchQuery])

  return (
    <section
      id="marketplace"
      className="snap-section min-h-screen w-full relative flex flex-col justify-center py-20 lg:py-24 bg-[#090A0F] text-white overflow-hidden border-b border-white/10"
    >
      {/* Anchor targets to preserve legacy navigation destinations */}
      <span id="talent" className="absolute -top-10" />
      <span id="projects" className="absolute -top-10" />

      {/* Background Architectural Grid */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-line-grid opacity-50 -z-0"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute bottom-1/3 left-1/2 -translate-x-1/2 w-[700px] h-[350px] bg-[#D4FF00]/10 rounded-full blur-[160px] -z-0"
      />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full space-y-8">
        {/* Editorial Top Eyebrow & Headline */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-white/10 pb-6">
          <div className="space-y-3 max-w-2xl">
            <div className="inline-flex items-center gap-2 font-mono text-[11px] tracking-widest uppercase text-[#D4FF00]">
              <span className="w-1.5 h-1.5 rounded-full bg-[#D4FF00]" />
              <span>06 // LIVE MARKETPLACE DISPATCH</span>
            </div>
            <h2 className="text-3xl sm:text-5xl lg:text-[54px] font-black tracking-tight leading-[1.02] text-white">
              Explore talent and <span className="text-[#D4FF00]">active briefs.</span>
            </h2>
            <p className="text-sm sm:text-base text-[#8E95A5] leading-relaxed">
              Test drive the platform. Filter verified student profiles or inspect open project deliverables.
            </p>
          </div>

          {/* Interactive Mode Switcher */}
          <div className="flex items-center bg-[#151924] p-1.5 rounded-xl border border-white/10 shrink-0">
            <button
              type="button"
              onClick={() => {
                setActiveTab('students')
                setSearchQuery('')
              }}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-mono font-bold transition-all cursor-pointer ${
                activeTab === 'students'
                  ? 'bg-[#D4FF00] text-[#090A0F] shadow-sm'
                  : 'text-[#8E95A5] hover:text-white'
              }`}
            >
              <FolderGit2 className="w-3.5 h-3.5" />
              <span>Student Builders ({mockStudents.length})</span>
            </button>
            <button
              type="button"
              onClick={() => {
                setActiveTab('projects')
                setSearchQuery('')
              }}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-mono font-bold transition-all cursor-pointer ${
                activeTab === 'projects'
                  ? 'bg-[#D4FF00] text-[#090A0F] shadow-sm'
                  : 'text-[#8E95A5] hover:text-white'
              }`}
            >
              <Briefcase className="w-3.5 h-3.5" />
              <span>Project Briefs ({mockProjects.length})</span>
            </button>
          </div>
        </div>

        {/* Filter & Search Bar */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 bg-[#10131B] p-3 rounded-2xl border border-white/10">
          {/* Category Chips */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 scrollbar-none font-mono text-xs">
            {activeTab === 'students' ? (
              <>
                {(['all', 'dev', 'design', 'ai', 'mobile'] as SkillCategory[]).map((cat) => (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => setStudentCategory(cat)}
                    className={`px-3 py-1.5 rounded-lg uppercase tracking-wider text-[11px] font-bold transition-all cursor-pointer shrink-0 ${
                      studentCategory === cat
                        ? 'bg-white/15 text-white border border-white/20'
                        : 'text-[#8E95A5] hover:text-white hover:bg-white/5'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </>
            ) : (
              <>
                {[
                  { id: 'all', label: 'All Scopes' },
                  { id: 'dev', label: 'Full-Stack' },
                  { id: 'design', label: 'Frontend / 3D' },
                  { id: 'mobile', label: 'Mobile MVP' },
                  { id: 'ai', label: 'AI Pipelines' },
                ].map((cat) => (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => setProjectCategory(cat.id)}
                    className={`px-3 py-1.5 rounded-lg uppercase tracking-wider text-[11px] font-bold transition-all cursor-pointer shrink-0 ${
                      projectCategory === cat.id
                        ? 'bg-white/15 text-white border border-white/20'
                        : 'text-[#8E95A5] hover:text-white hover:bg-white/5'
                    }`}
                  >
                    {cat.label}
                  </button>
                ))}
              </>
            )}
          </div>

          {/* Search Box */}
          <div className="relative w-full sm:w-72">
            <Search className="w-3.5 h-3.5 text-[#8E95A5] absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={activeTab === 'students' ? 'Search by skill, name...' : 'Search by brief, tech...'}
              className="w-full bg-[#151924] border border-white/10 rounded-xl pl-9 pr-8 py-2 text-xs font-mono text-white placeholder-[#8E95A5] focus:outline-none focus:border-[#D4FF00]"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[#8E95A5] hover:text-white cursor-pointer"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>

        {/* Content Listing Area */}
        <div className="space-y-4 max-h-[480px] overflow-y-auto pr-1">
          {activeTab === 'students' ? (
            /* Student Profiles Grid */
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredStudents.map((student) => {
                const isConnected = !!connectedStudents[student.id]
                return (
                  <div
                    key={student.id}
                    className="p-5 rounded-2xl bg-[#10131B] border border-white/10 hover:border-white/25 transition-all space-y-4 flex flex-col justify-between"
                  >
                    <div className="space-y-3">
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex items-center gap-3">
                          <img
                            src={student.avatarUrl}
                            alt={student.name}
                            className="w-12 h-12 rounded-xl object-cover border border-white/20 shrink-0"
                          />
                          <div>
                            <h3 className="text-sm font-bold text-white">{student.name}</h3>
                            <p className="text-xs text-[#8E95A5] line-clamp-1">{student.headline}</p>
                          </div>
                        </div>
                        <span className="text-xs font-mono font-bold text-[#D4FF00] shrink-0">
                          ${student.hourlyRate}/h
                        </span>
                      </div>

                      <p className="text-xs text-[#8E95A5] line-clamp-2 leading-relaxed">
                        {student.featuredWork}
                      </p>

                      <div className="flex flex-wrap gap-1.5 pt-1">
                        {student.skills.slice(0, 3).map((skill) => (
                          <span
                            key={skill.name}
                            className="text-[10px] font-mono px-2 py-0.5 rounded bg-white/5 border border-white/10 text-white/90"
                          >
                            {skill.name}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="pt-3 border-t border-white/10 flex items-center justify-between">
                      <span className="text-[10px] font-mono text-[#8E95A5]">
                        {student.projectsCompleted} briefs completed
                      </span>
                      <button
                        type="button"
                        onClick={() => toggleConnect(student.id)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold transition-all cursor-pointer ${
                          isConnected
                            ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                            : 'bg-[#D4FF00] hover:bg-[#c6ed00] text-[#090A0F]'
                        }`}
                      >
                        {isConnected ? '✓ Connected' : 'Connect'}
                      </button>
                    </div>
                  </div>
                )
              })}
            </div>
          ) : (
            /* Project Briefs Rows */
            <div className="space-y-3">
              {filteredProjects.map((project) => {
                const isApplied = !!appliedProjects[project.id]
                return (
                  <div
                    key={project.id}
                    className="p-5 sm:p-6 rounded-2xl bg-[#10131B] border border-white/10 hover:border-white/25 transition-all flex flex-col md:flex-row items-start md:items-center justify-between gap-4"
                  >
                    <div className="space-y-2 max-w-3xl">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="text-[10px] font-mono uppercase bg-white/10 text-white/80 px-2 py-0.5 rounded">
                          {project.clientName}
                        </span>
                        <span className="text-[10px] font-mono text-[#8E95A5]">
                          {project.duration} · {project.hoursPerWeek}
                        </span>
                      </div>
                      <h3 className="text-base sm:text-lg font-bold text-white tracking-tight">
                        {project.title}
                      </h3>
                      <p className="text-xs text-[#8E95A5] leading-relaxed line-clamp-2">
                        {project.description}
                      </p>
                      <div className="flex flex-wrap gap-1.5 pt-1">
                        {project.skillsRequired.map((skill) => (
                          <span
                            key={skill}
                            className="text-[10px] font-mono px-2 py-0.5 rounded bg-white/5 border border-white/10 text-white/90"
                          >
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="flex md:flex-col items-center md:items-end justify-between w-full md:w-auto gap-3 shrink-0 pt-3 md:pt-0 border-t md:border-t-0 border-white/10">
                      <div className="text-left md:text-right font-mono">
                        <span className="text-lg font-black text-[#D4FF00]">${project.budget}</span>
                        <span className="text-[10px] text-[#8E95A5] block">Fixed Milestone</span>
                      </div>
                      <button
                        type="button"
                        onClick={() => toggleApply(project.id)}
                        className={`px-4 py-2 rounded-xl text-xs font-mono font-bold transition-all cursor-pointer ${
                          isApplied
                            ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                            : 'bg-white/10 hover:bg-white/20 text-white border border-white/20'
                        }`}
                      >
                        {isApplied ? '✓ Applied' : 'Apply with Profile'}
                      </button>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>

        {/* Demo Disclaimer Baseline */}
        <div className="flex items-center justify-between text-[11px] font-mono text-[#8E95A5] pt-2 border-t border-white/10">
          <span>Prototype Environment: Live state toggles active for demonstration purposes.</span>
          <span className="text-white">Active Campus Network</span>
        </div>
      </div>
    </section>
  )
}
