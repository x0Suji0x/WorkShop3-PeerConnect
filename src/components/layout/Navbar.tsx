import { useState } from 'react'
import { ArrowRight, Menu, X, Terminal } from 'lucide-react'
import { Button } from '../common/Button'
import { Badge } from '../common/Badge'
import { useSmoothScroll } from '../../hooks/useSmoothScroll'

export function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const { scrollTo } = useSmoothScroll()

  const handleNavClick = (target: string) => {
    scrollTo(target)
    setMobileMenuOpen(false)
  }

  return (
    <header className="sticky top-0 z-50 w-full bg-[#090A0F]/90 backdrop-blur-md border-b border-white/10 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        {/* Brand Logo & Editorial Network Label */}
        <div
          onClick={() => handleNavClick('#intro')}
          className="flex items-center gap-3 cursor-pointer group select-none"
        >
          <div className="w-10 h-10 rounded-xl bg-[#D4FF00] flex items-center justify-center text-[#090A0F] font-black shadow-[0_0_16px_rgba(212,255,0,0.3)] group-hover:scale-105 transition-all duration-200">
            <Terminal className="w-5 h-5 stroke-[2.5]" />
          </div>
          <div className="flex flex-col">
            <div className="flex items-center gap-2">
              <span className="text-xl font-black tracking-tight text-white group-hover:text-[#D4FF00] transition-colors">
                PeerConnect
              </span>
              <Badge variant="lime" size="sm">
                <span className="w-1.5 h-1.5 rounded-full bg-[#D4FF00] animate-pulse" />
                <span>Network</span>
              </Badge>
            </div>
            <span className="text-[10px] font-mono tracking-wider text-[#8E95A5] uppercase hidden sm:block">
              Campus Builder Marketplace
            </span>
          </div>
        </div>

        {/* Desktop Navigation Links */}
        <nav className="hidden lg:flex items-center gap-7 text-xs font-mono uppercase tracking-wider text-[#8E95A5]">
          <button
            type="button"
            onClick={() => handleNavClick('#problem')}
            className="hover:text-white transition-colors cursor-pointer py-1 relative group"
          >
            <span>02 · The Gap</span>
            <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-[#D4FF00] group-hover:w-full transition-all duration-200" />
          </button>
          <button
            type="button"
            onClick={() => handleNavClick('#students')}
            className="hover:text-white transition-colors cursor-pointer py-1 relative group"
          >
            <span>03 · Students</span>
            <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-[#D4FF00] group-hover:w-full transition-all duration-200" />
          </button>
          <button
            type="button"
            onClick={() => handleNavClick('#creators')}
            className="hover:text-white transition-colors cursor-pointer py-1 relative group"
          >
            <span>04 · Creators</span>
            <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-[#D4FF00] group-hover:w-full transition-all duration-200" />
          </button>
          <button
            type="button"
            onClick={() => handleNavClick('#process')}
            className="hover:text-white transition-colors cursor-pointer py-1 relative group"
          >
            <span>05 · Process</span>
            <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-[#D4FF00] group-hover:w-full transition-all duration-200" />
          </button>
          <button
            type="button"
            onClick={() => handleNavClick('#marketplace')}
            className="hover:text-white transition-colors cursor-pointer py-1 relative group"
          >
            <span>06 · Marketplace</span>
            <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-[#D4FF00] group-hover:w-full transition-all duration-200" />
          </button>
        </nav>

        {/* Action Buttons */}
        <div className="hidden sm:flex items-center gap-3">
          <Button
            variant="secondary"
            size="sm"
            onClick={() => handleNavClick('#students')}
            className="font-mono text-xs"
          >
            Explore Talent
          </Button>
          <Button
            variant="primary"
            size="sm"
            onClick={() => handleNavClick('#creators')}
            className="font-mono text-xs"
          >
            <span>Post a Project</span>
            <ArrowRight className="w-3.5 h-3.5 ml-1" />
          </Button>
        </div>

        {/* Mobile menu trigger */}
        <div className="flex lg:hidden items-center gap-2">
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2.5 rounded-xl border border-white/10 text-white bg-white/5 hover:bg-white/10 transition-colors cursor-pointer"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-b border-white/10 bg-[#090A0F]/98 backdrop-blur-xl px-4 py-6 space-y-4 animate-in fade-in slide-in-from-top-4 duration-200">
          <nav className="flex flex-col space-y-3 font-mono text-xs uppercase tracking-wider">
            <button
              type="button"
              onClick={() => handleNavClick('#intro')}
              className="text-left py-2 px-3 rounded-lg text-white hover:bg-white/5 flex items-center justify-between"
            >
              <span>01 · Introduction</span>
              <span className="text-[#D4FF00]">→</span>
            </button>
            <button
              type="button"
              onClick={() => handleNavClick('#problem')}
              className="text-left py-2 px-3 rounded-lg text-[#8E95A5] hover:text-white hover:bg-white/5 flex items-center justify-between"
            >
              <span>02 · The Problem</span>
              <span className="text-[#8E95A5]">→</span>
            </button>
            <button
              type="button"
              onClick={() => handleNavClick('#students')}
              className="text-left py-2 px-3 rounded-lg text-[#8E95A5] hover:text-white hover:bg-white/5 flex items-center justify-between"
            >
              <span>03 · For Students</span>
              <span className="text-[#8E95A5]">→</span>
            </button>
            <button
              type="button"
              onClick={() => handleNavClick('#creators')}
              className="text-left py-2 px-3 rounded-lg text-[#8E95A5] hover:text-white hover:bg-white/5 flex items-center justify-between"
            >
              <span>04 · For Creators</span>
              <span className="text-[#8E95A5]">→</span>
            </button>
            <button
              type="button"
              onClick={() => handleNavClick('#process')}
              className="text-left py-2 px-3 rounded-lg text-[#8E95A5] hover:text-white hover:bg-white/5 flex items-center justify-between"
            >
              <span>05 · How It Works</span>
              <span className="text-[#8E95A5]">→</span>
            </button>
            <button
              type="button"
              onClick={() => handleNavClick('#marketplace')}
              className="text-left py-2 px-3 rounded-lg text-[#8E95A5] hover:text-white hover:bg-white/5 flex items-center justify-between"
            >
              <span>06 · Marketplace</span>
              <span className="text-[#8E95A5]">→</span>
            </button>
            <button
              type="button"
              onClick={() => handleNavClick('#cta')}
              className="text-left py-2 px-3 rounded-lg text-[#8E95A5] hover:text-white hover:bg-white/5 flex items-center justify-between"
            >
              <span>07 · Join Network</span>
              <span className="text-[#8E95A5]">→</span>
            </button>
          </nav>

          <div className="pt-4 border-t border-white/10 flex flex-col gap-2.5">
            <Button
              variant="secondary"
              size="md"
              onClick={() => handleNavClick('#students')}
              className="w-full justify-center"
            >
              Explore Talent
            </Button>
            <Button
              variant="primary"
              size="md"
              onClick={() => handleNavClick('#creators')}
              className="w-full justify-center"
            >
              <span>Post a Project</span>
              <ArrowRight className="w-4 h-4 ml-1" />
            </Button>
          </div>
        </div>
      )}
    </header>
  )
}
