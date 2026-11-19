import { NavLink } from 'react-router-dom'
import { routes } from '../../app/routes'

const tabs = [
  { label: 'Colleges', to: routes.colleges },
  { label: 'Clubs', to: routes.clubs },
  { label: 'Events', to: routes.events },
]

export function CommunityTabs() {
  return (
    <nav aria-label="Community directory" className="mt-6 flex gap-1 overflow-x-auto rounded-2xl border border-[rgba(91,112,96,0.16)] bg-white/90 backdrop-blur-md p-1.5 shadow-xs">
      {tabs.map((tab) => (
        <NavLink key={tab.to} to={tab.to} className={({ isActive }) => `shrink-0 rounded-lg px-4 py-2 text-sm font-bold transition ${isActive ? 'bg-[#123D30] text-white' : 'text-[#777A72] hover:bg-[#F7F6F0] hover:text-[#171916]'}`}>
          {tab.label}
        </NavLink>
      ))}
    </nav>
  )
}
