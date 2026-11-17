import { useState } from 'react'
import { ChevronDown, Menu, X } from 'lucide-react'
import { useSmoothScroll } from '../../hooks/useSmoothScroll'

export function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const { scrollTo } = useSmoothScroll()

  const handleNavClick = (target: string) => {
    scrollTo(target)
    setMobileMenuOpen(false)
  }

  return (
    <header className="sticky top-0 z-50 w-full bg-[#FAF8F5]/90 backdrop-blur-md border-b border-[#E7E8E1] transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        {/* Brand Logo matching the reference image */}
        <div
          onClick={() => handleNavClick('#hero')}
          className="flex items-center gap-2.5 cursor-pointer group select-none"
        >
          {/* Stylized Green Leaf / P Emblem */}
          <div className="w-8 h-8 rounded-full bg-[#123D30] flex items-center justify-center text-[#08C58A] shadow-2xs group-hover:scale-105 transition-transform">
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="w-4 h-4 text-[#08C58A]"
            >
              <path d="M12 2a10 10 0 0 1 10 10c0 5.5-4.5 10-10 10S2 17.5 2 12A10 10 0 0 1 12 2z" />
              <path d="M12 6a4 4 0 0 1 4 4c0 2.2-1.8 4-4 4H8V6h4z" fill="#08C58A" stroke="none" />
            </svg>
          </div>
          <span className="text-xl font-extrabold tracking-tight text-[#171916]">
            PeerConnect
          </span>
        </div>

        {/* Desktop Navigation Links matching the reference picture */}
        <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-[#171916]">
          <button
            type="button"
            onClick={() => handleNavClick('#talent')}
            className="flex items-center gap-1 hover:text-[#08C58A] transition-colors cursor-pointer py-1"
          >
            <span>Explore</span>
            <ChevronDown className="w-3.5 h-3.5 text-[#525A55]" />
          </button>
          <button
            type="button"
            onClick={() => handleNavClick('#talent')}
            className="hover:text-[#08C58A] transition-colors cursor-pointer py-1"
          >
            <span>Talent</span>
          </button>
          <button
            type="button"
            onClick={() => handleNavClick('#projects')}
            className="hover:text-[#08C58A] transition-colors cursor-pointer py-1"
          >
            <span>Projects</span>
          </button>
          <button
            type="button"
            onClick={() => handleNavClick('#how-it-works')}
            className="hover:text-[#08C58A] transition-colors cursor-pointer py-1"
          >
            <span>About</span>
          </button>
        </nav>

        {/* Action Buttons matching the reference picture */}
        <div className="hidden lg:flex items-center gap-3">
          <button
            type="button"
            onClick={() => handleNavClick('#talent')}
            className="px-5 py-2 rounded-full font-medium text-sm text-[#171916] border border-[#CBD5E1] hover:border-[#94A3B8] hover:bg-white transition-all cursor-pointer shadow-2xs"
          >
            Sign In
          </button>
          <button
            type="button"
            onClick={() => handleNavClick('#projects')}
            className="px-5 py-2 rounded-full font-semibold text-sm bg-[#08C58A] hover:bg-[#07b27c] text-[#0A261D] shadow-[0_2px_10px_rgba(8,197,138,0.25)] hover:shadow-[0_4px_16px_rgba(8,197,138,0.35)] transition-all cursor-pointer"
          >
            Get Started
          </button>
        </div>

        {/* Mobile menu trigger */}
        <div className="lg:hidden flex items-center gap-2">
          <button
            type="button"
            onClick={() => handleNavClick('#projects')}
            className="px-3 py-1.5 rounded-full font-semibold text-xs bg-[#08C58A] text-[#0A261D]"
          >
            Get Started
          </button>
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 rounded-xl text-[#171916] hover:bg-black/5 transition-colors cursor-pointer"
            aria-label="Toggle navigation menu"
            aria-expanded={mobileMenuOpen}
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-b border-[#E7E8E1] bg-[#FAF8F5]/98 backdrop-blur-lg px-4 pt-3 pb-6 space-y-4 shadow-lg animate-in fade-in duration-200">
          <nav className="flex flex-col gap-2 text-base font-semibold text-[#171916]">
            <button
              type="button"
              onClick={() => handleNavClick('#talent')}
              className="text-left py-2.5 px-3 rounded-xl hover:bg-white transition-colors cursor-pointer"
            >
              Explore
            </button>
            <button
              type="button"
              onClick={() => handleNavClick('#talent')}
              className="text-left py-2.5 px-3 rounded-xl hover:bg-white transition-colors cursor-pointer"
            >
              Talent
            </button>
            <button
              type="button"
              onClick={() => handleNavClick('#projects')}
              className="text-left py-2.5 px-3 rounded-xl hover:bg-white transition-colors cursor-pointer"
            >
              Projects
            </button>
            <button
              type="button"
              onClick={() => handleNavClick('#how-it-works')}
              className="text-left py-2.5 px-3 rounded-xl hover:bg-white transition-colors cursor-pointer"
            >
              About
            </button>
          </nav>
          <div className="pt-2 flex flex-col gap-2.5 border-t border-[#E7E8E1]">
            <button
              type="button"
              onClick={() => handleNavClick('#talent')}
              className="w-full py-2.5 rounded-full font-medium text-sm text-[#171916] border border-[#CBD5E1] bg-white text-center cursor-pointer"
            >
              Sign In
            </button>
            <button
              type="button"
              onClick={() => handleNavClick('#projects')}
              className="w-full py-2.5 rounded-full font-semibold text-sm bg-[#08C58A] text-[#0A261D] text-center cursor-pointer shadow-sm"
            >
              Get Started
            </button>
          </div>
        </div>
      )}
    </header>
  )
}
