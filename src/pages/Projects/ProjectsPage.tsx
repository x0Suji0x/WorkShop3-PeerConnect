import { ArrowRight, BriefcaseBusiness, CheckCircle2, MapPin, Plus, Wallet } from 'lucide-react'
import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { projectRoute, routes } from '../../app/routes'
import { Badge } from '../../components/common/Badge'
import { Button } from '../../components/common/Button'
import { Card } from '../../components/common/Card'
import { EmptyState } from '../../components/common/EmptyState'
import { PageHeading } from '../../components/common/PageHeading'
import { SearchBar } from '../../components/common/SearchBar'
import { MarketplaceTabs } from '../../components/marketplace/MarketplaceTabs'
import { marketplaceProjects, projectCategories } from '../../data/projectMarketplaceMockData'

const formatBudget = (budget: number) => new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(budget)

export function ProjectsPage() {
  const [query, setQuery] = useState('')
  const [category, setCategory] = useState('All')
  const [remoteOnly, setRemoteOnly] = useState(false)
  const filteredProjects = useMemo(() => marketplaceProjects.filter((project) => `${project.title} ${project.clientName} ${project.skillsRequired.join(' ')} ${project.category}`.toLowerCase().includes(query.toLowerCase()) && (category === 'All' || project.category === category) && (!remoteOnly || project.workMode === 'Remote')), [category, query, remoteOnly])

  return <div className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 sm:py-10 lg:px-8"><PageHeading eyebrow="Project marketplace" title="Work that gives your skills momentum." description="Find thoughtfully scoped opportunities with clear expectations, budgets, and room to contribute." actions={<Link to={routes.newProject}><Button size="sm"><Plus className="h-3.5 w-3.5" />Post a project</Button></Link>} /><MarketplaceTabs />
    <section className="mt-7 rounded-2xl border border-[#E7E8E1] bg-[#F7F6F0] p-4 sm:p-5"><div className="flex flex-col gap-4"><SearchBar value={query} onChange={(event) => setQuery(event.target.value)} onClear={() => setQuery('')} placeholder="Search roles, skills, or organisations" aria-label="Search projects" /><div className="flex flex-wrap items-center justify-between gap-3"><div className="flex flex-wrap gap-2">{projectCategories.map((option) => <button key={option} type="button" onClick={() => setCategory(option)} aria-pressed={category === option} className={`rounded-full px-3.5 py-2 text-xs font-bold transition ${category === option ? 'bg-[#123D30] text-white' : 'border border-[#E7E8E1] bg-white text-[#525A55] hover:border-[#08C58A]'}`}>{option}</button>)}</div><button type="button" onClick={() => setRemoteOnly((value) => !value)} aria-pressed={remoteOnly} className={`rounded-full px-3.5 py-2 text-xs font-bold transition ${remoteOnly ? 'bg-[#123D30] text-white' : 'border border-[#E7E8E1] bg-white text-[#525A55] hover:border-[#08C58A]'}`}>Remote only</button></div></div></section>
    <p className="mt-6 text-sm text-[#777A72]">{filteredProjects.length} open {filteredProjects.length === 1 ? 'project' : 'projects'}</p>{filteredProjects.length ? <div className="mt-4 grid grid-cols-1 gap-4 lg:grid-cols-2">{filteredProjects.map((project) => <ProjectCard key={project.id} project={project} />)}</div> : <div className="mt-6"><EmptyState icon={BriefcaseBusiness} title="No projects match that search" description="Try another skill, category, or turn off the remote-only filter." /></div>}</div>
}

function ProjectCard({ project }: { project: (typeof marketplaceProjects)[number] }) { return <Card className="flex h-full flex-col" padding="md"><div className="flex items-start justify-between gap-4"><div><div className="flex flex-wrap gap-2">{project.badge && <Badge variant={project.badge === 'High Urgency' ? 'peach' : 'green'} size="sm">{project.badge}</Badge>}{project.clientVerified && <Badge variant="neutral" size="sm"><CheckCircle2 className="h-3 w-3" />Verified client</Badge>}</div><h2 className="mt-3 text-lg font-black text-[#171916]">{project.title}</h2><p className="mt-1 text-sm font-semibold text-[#08A876]">{project.clientName}</p></div><p className="shrink-0 text-xs text-[#777A72]">{project.postedTimeAgo}</p></div><p className="mt-3 text-sm leading-relaxed text-[#525A55]">{project.description}</p><div className="mt-4 flex flex-wrap gap-1.5">{project.skillsRequired.map((skill) => <Badge key={skill} variant="neutral" size="sm">{skill}</Badge>)}</div><div className="mt-5 grid grid-cols-2 gap-3 border-t border-[#E7E8E1] pt-4 text-xs text-[#777A72]"><span className="inline-flex items-center gap-1.5"><Wallet className="h-3.5 w-3.5" /><strong className="text-[#171916]">{formatBudget(project.budget)}</strong></span><span className="inline-flex items-center gap-1.5"><MapPin className="h-3.5 w-3.5" />{project.workMode}</span></div><Link className="mt-5 inline-flex items-center gap-1 text-sm font-bold text-[#123D30] transition hover:text-[#08A876]" to={projectRoute(project.id)}>View project <ArrowRight className="h-3.5 w-3.5" /></Link></Card> }
