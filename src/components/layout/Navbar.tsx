import { useEffect, useState } from 'react'
import { Menu, X } from 'lucide-react'
import { Link, NavLink, useLocation } from 'react-router-dom'
import { routes, communityRoutes, authRoutes } from '../../app/routes'
import { useAuth } from '../../lib/auth/AuthProvider'

const homeLinks = [
  { label: 'Projects', to: routes.projects },
  { label: 'Talent', to: routes.profiles },
  { label: 'Communities', to: communityRoutes.communities },
  { label: 'Team Finder', to: communityRoutes.teamFinder },
  { label: 'Colleges', to: routes.colleges },
]

export function Navbar() {
  const { status, profile, signOut } = useAuth()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const { pathname } = useLocation()
  const isHome = pathname === routes.home
  const closeMenu = () => setMobileMenuOpen(false)

  const [overHero, setOverHero] = useState(true)
  useEffect(() => {
    if (!isHome) return
    const hero = document.getElementById('hero')
    if (!hero) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        setOverHero(entry.isIntersecting)
      },
      { rootMargin: '-80px 0px 0px 0px', threshold: 0 }
    )

    observer.observe(hero)
    return () => observer.disconnect()
  }, [isHome])

  return (
    <header
      data-over-hero={isHome && overHero}
      className="sticky top-0 z-50 w-full bg-[#FAF8F5]/85 backdrop-blur-md transition-colors relative"
    >
      <div className="peer-navbar-fade-line" />
      <div className="peer-navbar-fade-glow" />
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

        <nav className="hidden items-center gap-5 text-sm font-medium text-[#171916] lg:flex xl:gap-7">
          {homeLinks.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              className={({ isActive }) =>
                `py-1 transition-colors ${isActive ? 'text-[#08A876]' : 'text-[#171916] hover:text-[#08C58A]'}`
              }
            >
              {link.label}
            </NavLink>
          ))}
        </nav>

        <div className="hidden items-center gap-3 lg:flex">
          {status === 'signedIn' ? (
            <>
              <Link to={routes.dashboard} className="rounded-full bg-[#08C58A] px-5 py-2 text-sm font-semibold text-[#0A261D]">Dashboard</Link>
              <button type="button" onClick={() => void signOut()} className="rounded-full border border-[#CBD5E1] px-5 py-2 text-sm font-medium">Sign out</button>
            </>
          ) : (
            <>
              <Link
                to={authRoutes.signin}
                className="rounded-full border border-[#CBD5E1] px-5 py-2 text-sm font-medium text-[#171916] shadow-2xs transition-all hover:border-[#94A3B8] hover:bg-white"
              >
                Sign In
              </Link>
              <Link
                to={routes.getStarted}
                className="rounded-full bg-[#08C58A] px-5 py-2 text-sm font-semibold text-[#0A261D] shadow-[0_2px_10px_rgba(8,197,138,0.25)] transition-all hover:bg-[#07b27c]"
              >
                Get Started
              </Link>
            </>
          )}
        </div>

        <div className="flex items-center gap-2 lg:hidden">
          <Link to={status === 'signedIn' ? routes.dashboard : routes.getStarted} onClick={closeMenu}
            className="rounded-full bg-[#08C58A] px-3 py-1.5 text-xs font-semibold text-[#0A261D]"
          >
            {status === 'signedIn' ? 'Dashboard' : 'Get Started'}
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
        <div className="peer-divider-fade bg-[#FAF8F5]/98 px-4 pb-6 pt-3 shadow-lg backdrop-blur-lg lg:hidden">
          <nav className="flex flex-col gap-1 text-base font-semibold text-[#171916]">
            {isHome ? (
              homeLinks.map((link) => (
                <Link key={link.to} to={link.to} onClick={closeMenu} className="rounded-xl px-3 py-2.5 text-left hover:bg-white">
                  {link.label}
                </Link>
              ))
            ) : (
              homeLinks.map((link) => (
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
          <div className="mt-3 peer-divider-fade-t pt-3">
            {status === 'signedIn' ? <button type="button" onClick={() => { closeMenu(); void signOut() }} className="mb-2 block w-full rounded-full border border-[#CBD5E1] bg-white py-2.5 text-center text-sm font-medium text-[#171916]">Sign out{profile?.full_name ? ` · ${profile.full_name}` : ''}</button> : null}
            <Link
              to={status === 'signedIn' ? routes.dashboard : routes.getStarted}
              onClick={closeMenu}
              className="block rounded-full border border-[#CBD5E1] bg-white py-2.5 text-center text-sm font-medium text-[#171916]"
            >
              {status === 'signedIn' ? 'Open dashboard' : 'Get Started'}
            </Link>
          </div>
        </div>
      )}
    </header>
  )
}
