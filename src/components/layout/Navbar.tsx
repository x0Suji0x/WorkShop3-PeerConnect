import { useEffect, useState } from 'react'
import { ChevronDown, Menu, X } from 'lucide-react'
import { Link, NavLink, useLocation } from 'react-router-dom'
import { routes, communityRoutes, authRoutes } from '../../app/routes'
import { useSmoothScroll } from '../../hooks/useSmoothScroll'

const appLinks = [
  { label: 'Dashboard', to: routes.dashboard },
  { label: 'Communities', to: communityRoutes.communities },
  { label: 'Team Finder', to: communityRoutes.teamFinder },
  { label: 'Profiles', to: routes.profiles },
  { label: 'Projects', to: routes.projects },
]

export function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const { scrollTo } = useSmoothScroll()
  const { pathname } = useLocation()
  const isHome = pathname === routes.home
  const closeMenu = () => setMobileMenuOpen(false)

  const [overHero, setOverHero] = useState(true)
  useEffect(() => {
    if (!isHome) return
    const update = () => {
      const hero = document.getElementById('hero')
      setOverHero(Boolean(hero && hero.getBoundingClientRect().bottom > 80))
    }
    update()
    window.addEventListener('scroll', update, { passive: true })
    return () => window.removeEventListener('scroll', update)
  }, [isHome])

  const homeNav = (target: string) => {
    scrollTo(target)
    closeMenu()
  }

  return (
    <header
      data-over-hero={isHome && overHero}
      className="sticky top-0 z-50 w-full border-b border-[#E7E8E1] bg-[#FAF8F5]/90 backdrop-blur-md transition-colors"
    >
      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link to={routes.home} onClick={closeMenu} className="group flex items-center gap-2.5 select-none">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#123D30] text-[#08C58A] shadow-2xs transition-transform group-hover:scale-105">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4">
              <path d="M12 2a10 10 0 0 1 10 10c0 5.5-4.5 10-10 10S2 17.5 2 12A10 10 0 0 1 12 2z" />
              <path d="M12 6a4 4 0 0 1 4 4c0 2.2-1.8 4-4 4H8V6h4z" fill="#08C58A" stroke="none" />
            </svg>
          </div>
          <span className="text-xl font-extrabold tracking-tight text-[#171916]">PeerConnect</span>
        </Link>

        {isHome ? (
          <nav className="hidden items-center gap-7 text-sm font-medium text-[#171916] md:flex">
            <button type="button" onClick={() => homeNav('#talent')} className="flex items-center gap-1 py-1 transition-colors hover:text-[#08C58A]">
              <span>Explore</span>
              <ChevronDown className="h-3.5 w-3.5 text-[#525A55]" />
            </button>
            <button type="button" onClick={() => homeNav('#talent')} className="py-1 transition-colors hover:text-[#08C58A]">
              Talent
            </button>
            <button type="button" onClick={() => homeNav('#projects')} className="py-1 transition-colors hover:text-[#08C58A]">
              Projects
            </button>
            <Link to={communityRoutes.communities} className="py-1 transition-colors hover:text-[#08C58A]">
              Communities
            </Link>
            <Link to={communityRoutes.teamFinder} className="py-1 transition-colors hover:text-[#08C58A]">
              Team Finder
            </Link>
            <button type="button" onClick={() => homeNav('#about')} className="py-1 transition-colors hover:text-[#08C58A]">
              About
            </button>
          </nav>
        ) : (
          <nav className="hidden items-center gap-6 text-sm font-medium md:flex">
            {appLinks.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                className={({ isActive }) =>
                  `transition-colors ${isActive ? 'text-[#08A876]' : 'text-[#525A55] hover:text-[#171916]'}`
                }
              >
                {link.label}
              </NavLink>
            ))}
          </nav>
        )}

        <div className="hidden items-center gap-3 lg:flex">
          {isHome ? (
            <>
              <Link
                to={authRoutes.signin}
                className="rounded-full border border-[#CBD5E1] px-5 py-2 text-sm font-medium text-[#171916] shadow-2xs transition-all hover:border-[#94A3B8] hover:bg-white"
              >
                Sign In
              </Link>
              <Link
                to={authRoutes.signup}
                className="rounded-full bg-[#08C58A] px-5 py-2 text-sm font-semibold text-[#0A261D] shadow-[0_2px_10px_rgba(8,197,138,0.25)] transition-all hover:bg-[#07b27c]"
              >
                Get Started
              </Link>
            </>
          ) : (
            <Link
              to={routes.dashboard}
              className="rounded-full bg-[#08C58A] px-5 py-2 text-sm font-semibold text-[#0A261D] shadow-[0_2px_10px_rgba(8,197,138,0.25)] transition-all hover:bg-[#07b27c]"
            >
              My dashboard
            </Link>
          )}
        </div>

        <div className="flex items-center gap-2 lg:hidden">
          <Link
            to={routes.dashboard}
            onClick={closeMenu}
            className="rounded-full bg-[#08C58A] px-3 py-1.5 text-xs font-semibold text-[#0A261D]"
          >
            Dashboard
          </Link>
          <button
            type="button"
            onClick={() => setMobileMenuOpen((open) => !open)}
            className="rounded-xl p-2 text-[#171916] transition-colors hover:bg-black/5"
            aria-label="Toggle navigation menu"
            aria-expanded={mobileMenuOpen}
          >
            {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {mobileMenuOpen && (
        <div className="border-b border-[#E7E8E1] bg-[#FAF8F5]/98 px-4 pb-6 pt-3 shadow-lg backdrop-blur-lg lg:hidden">
          <nav className="flex flex-col gap-1 text-base font-semibold text-[#171916]">
            {isHome ? (
              <>
                <button type="button" onClick={() => homeNav('#talent')} className="rounded-xl px-3 py-2.5 text-left hover:bg-white">
                  Explore talent
                </button>
                <button type="button" onClick={() => homeNav('#projects')} className="rounded-xl px-3 py-2.5 text-left hover:bg-white">
                  Projects
                </button>
                <Link to={communityRoutes.communities} onClick={closeMenu} className="rounded-xl px-3 py-2.5 text-left hover:bg-white">
                  Communities
                </Link>
                <Link to={communityRoutes.teamFinder} onClick={closeMenu} className="rounded-xl px-3 py-2.5 text-left hover:bg-white">
                  Team Finder
                </Link>
                <button type="button" onClick={() => homeNav('#about')} className="rounded-xl px-3 py-2.5 text-left hover:bg-white">
                  About
                </button>
              </>
            ) : (
              appLinks.map((link) => (
                <NavLink
                  key={link.to}
                  to={link.to}
                  onClick={closeMenu}
                  className={({ isActive }) =>
                    `rounded-xl px-3 py-2.5 ${isActive ? 'bg-[#E3F4EB] text-[#123D30]' : 'hover:bg-white'}`
                  }
                >
                  {link.label}
                </NavLink>
              ))
            )}
          </nav>
          <div className="mt-3 border-t border-[#E7E8E1] pt-3">
            <Link
              to={isHome ? routes.dashboard : routes.home}
              onClick={closeMenu}
              className="block rounded-full border border-[#CBD5E1] bg-white py-2.5 text-center text-sm font-medium text-[#171916]"
            >
              {isHome ? 'Open dashboard' : 'Back to home'}
            </Link>
          </div>
        </div>
      )}
    </header>
  )
}
