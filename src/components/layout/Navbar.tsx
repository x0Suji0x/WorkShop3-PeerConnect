import { useState } from 'react'
import { Sparkles, ArrowRight, Menu, X, Code2 } from 'lucide-react'
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
    <header className="sticky top-0 z-50 w-full bg-[#F7F6F0]/90 backdrop-blur-md border-b border-[#E7E8E1] transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        {/* Brand Logo & Prototype Badge */}
        <div
          onClick={() => handleNavClick('#hero')}
          className="flex items-center gap-2.5 cursor-pointer group select-none"
        >
          <div className="w-10 h-10 rounded-xl bg-[#171916] flex items-center justify-center text-[#08C58A] shadow-xs group-hover:scale-105 group-hover:shadow-[0_2px_10px_rgba(8,197,138,0.25)] transition-all duration-200">
            <Code2 className="w-5 h-5" />
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xl font-extrabold tracking-tight text-[#171916] group-hover:text-[#08C58A] transition-colors">
              PeerConnect
            </span>
            <Badge variant="green" size="sm">
              <span className="w-1.5 h-1.5 rounded-full bg-[#08C58A] animate-pulse" />
              <span>Prototype</span>
            </Badge>
          </div>
        </div>

        {/* Desktop Navigation Links */}
        <nav className="hidden md:flex items-center gap-7 lg:gap-8 text-sm font-medium text-[#777A72]">
          <button
            type="button"
            onClick={() => handleNavClick('#talent')}
            className="hover:text-[#171916] transition-colors cursor-pointer py-1 relative group"
          >
            <span>Discover Talent</span>
            <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-[#08C58A] group-hover:w-full transition-all duration-200 rounded-full" />
          </button>
          <button
            type="button"
            onClick={() => handleNavClick('#projects')}
            className="hover:text-[#171916] transition-colors cursor-pointer py-1 relative group"
          >
            <span>Project Board</span>
            <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-[#08C58A] group-hover:w-full transition-all duration-200 rounded-full" />
          </button>
          <button
            type="button"
            onClick={() => handleNavClick('#how-it-works')}
            className="hover:text-[#171916] transition-colors cursor-pointer py-1 relative group"
          >
            <span>How it Works</span>
            <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-[#08C58A] group-hover:w-full transition-all duration-200 rounded-full" />
          </button>
          <button
            type="button"
            onClick={() => handleNavClick('#cta')}
            className="hover:text-[#171916] transition-colors cursor-pointer py-1 relative group"
          >
            <span>For Startups</span>
            <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-[#08C58A] group-hover:w-full transition-all duration-200 rounded-full" />
          </button>
        </nav>

        {/* Action Buttons */}
        <div className="hidden lg:flex items-center gap-3">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => handleNavClick('#talent')}
          >
            Sign in
          </Button>
          <Button
            variant="secondary"
            size="sm"
            onClick={() => handleNavClick('#cta')}
          >
            Join as Talent
          </Button>
          <Button
            variant="primary"
            size="sm"
            onClick={() => handleNavClick('#projects')}
          >
            <span>Post a Project</span>
            <ArrowRight className="w-3.5 h-3.5 ml-1" />
          </Button>
        </div>

        {/* Mobile menu trigger */}
        <div className="lg:hidden flex items-center gap-2">
          <Button
            variant="primary"
            size="sm"
            onClick={() => handleNavClick('#projects')}
            className="text-xs px-3"
          >
            Post Project
          </Button>
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 rounded-xl text-[#171916] hover:bg-[#171916]/5 transition-colors cursor-pointer"
            aria-label="Toggle navigation menu"
            aria-expanded={mobileMenuOpen}
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-b border-[#E7E8E1] bg-[#F7F6F0]/98 backdrop-blur-lg px-4 pt-3 pb-6 space-y-4 shadow-lg animate-in fade-in duration-200">
          <nav className="flex flex-col gap-2 text-base font-semibold text-[#171916]">
            <button
              type="button"
              onClick={() => handleNavClick('#talent')}
              className="text-left py-2.5 px-3 rounded-xl hover:bg-white transition-colors cursor-pointer"
            >
              Discover Talent
            </button>
            <button
              type="button"
              onClick={() => handleNavClick('#projects')}
              className="text-left py-2.5 px-3 rounded-xl hover:bg-white transition-colors cursor-pointer"
            >
              Project Board
            </button>
            <button
              type="button"
              onClick={() => handleNavClick('#how-it-works')}
              className="text-left py-2.5 px-3 rounded-xl hover:bg-white transition-colors cursor-pointer"
            >
              How it Works
            </button>
            <button
              type="button"
              onClick={() => handleNavClick('#cta')}
              className="text-left py-2.5 px-3 rounded-xl hover:bg-white transition-colors cursor-pointer"
            >
              For Startups
            </button>
          </nav>
          <div className="pt-2 flex flex-col gap-2.5 border-t border-[#E7E8E1]">
            <Button
              variant="secondary"
              size="md"
              className="w-full justify-center"
              onClick={() => handleNavClick('#cta')}
            >
              Join as Talent
            </Button>
            <Button
              variant="primary"
              size="md"
              className="w-full justify-center"
              onClick={() => handleNavClick('#projects')}
            >
              <Sparkles className="w-4 h-4 mr-1" />
              Post a Project
            </Button>
          </div>
        </div>
      )}
    </header>
  )
}
