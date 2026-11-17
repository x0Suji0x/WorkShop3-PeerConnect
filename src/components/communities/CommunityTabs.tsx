import { NavLink } from 'react-router-dom'
import { routes } from '../../app/routes'

const tabs = [
  { label: 'Colleges', to: routes.colleges },
  { label: 'Clubs', to: routes.clubs },
  { label: 'Events', to: routes.events },
]

export function CommunityTabs() {
  return (
    <nav aria-label="Community directory" className="mt-6 flex gap-1 overflow-x-auto rounded-xl border border-[#E7E8E1] bg-white p-1.5">
      {tabs.map((tab) => (
        <NavLink key={tab.to} to={tab.to} className={({ isActive }) => `shrink-0 rounded-lg px-4 py-2 text-sm font-bold transition ${isActive ? 'bg-[#123D30] text-white' : 'text-[#777A72] hover:bg-[#F7F6F0] hover:text-[#171916]'}`}>
          {tab.label}
        </NavLink>
      ))}
    </nav>
  )
}
