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
    <header className="sticky top-0 z-50 w-full bg-[#FAF9F5]/85 backdrop-blur-md border-b border-stone-200/70 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        {/* Brand */}
        <div
          onClick={() => handleNavClick('#hero')}
          className="flex items-center gap-2.5 cursor-pointer group"
        >
          <div className="w-10 h-10 rounded-xl bg-stone-900 flex items-center justify-center text-emerald-400 shadow-xs group-hover:scale-105 transition-transform">
            <Code2 className="w-5 h-5" />
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xl font-bold tracking-tight text-stone-900">
              PeerConnect
            </span>
            <Badge variant="green" size="sm">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              Prototype
            </Badge>
          </div>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-stone-600">
          <button
            onClick={() => handleNavClick('#talent')}
            className="hover:text-stone-950 transition-colors cursor-pointer"
          >
            Discover Talent
          </button>
          <button
            onClick={() => handleNavClick('#projects')}
            className="hover:text-stone-950 transition-colors cursor-pointer"
          >
            Project Board
          </button>
          <button
            onClick={() => handleNavClick('#how-it-works')}
            className="hover:text-stone-950 transition-colors cursor-pointer"
          >
            How it Works
          </button>
          <button
            onClick={() => handleNavClick('#cta')}
            className="hover:text-stone-950 transition-colors cursor-pointer"
          >
            For Startups
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
            <span>Post Project</span>
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
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 rounded-xl text-stone-700 hover:text-stone-900 hover:bg-stone-200/60"
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile dropdown */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-b border-stone-200 bg-[#FAF9F5] px-4 pt-2 pb-6 space-y-4 animate-in fade-in duration-200">
          <nav className="flex flex-col gap-3 text-base font-medium text-stone-700">
            <button
              onClick={() => handleNavClick('#talent')}
              className="text-left py-2 px-3 rounded-lg hover:bg-stone-100"
            >
              Discover Talent
            </button>
            <button
              onClick={() => handleNavClick('#projects')}
              className="text-left py-2 px-3 rounded-lg hover:bg-stone-100"
            >
              Project Board
            </button>
            <button
              onClick={() => handleNavClick('#how-it-works')}
              className="text-left py-2 px-3 rounded-lg hover:bg-stone-100"
            >
              How it Works
            </button>
            <button
              onClick={() => handleNavClick('#cta')}
              className="text-left py-2 px-3 rounded-lg hover:bg-stone-100"
            >
              For Startups
            </button>
          </nav>
          <div className="pt-2 flex flex-col gap-2">
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
