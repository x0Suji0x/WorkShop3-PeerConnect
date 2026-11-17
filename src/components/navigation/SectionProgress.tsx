import { useState, useEffect } from 'react'
import { useSmoothScroll } from '../../hooks/useSmoothScroll'

const SECTIONS = [
  { id: 'intro', label: 'Intro', step: '01' },
  { id: 'problem', label: 'The Gap', step: '02' },
  { id: 'students', label: 'Students', step: '03' },
  { id: 'creators', label: 'Creators', step: '04' },
  { id: 'process', label: 'Process', step: '05' },
  { id: 'marketplace', label: 'Marketplace', step: '06' },
  { id: 'cta', label: 'Join', step: '07' },
]

export function SectionProgress() {
  const [activeId, setActiveId] = useState('intro')
  const { scrollTo } = useSmoothScroll()

  useEffect(() => {
    const observerOptions = {
      root: null,
      rootMargin: '-30% 0px -30% 0px',
      threshold: 0,
    }

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setActiveId(entry.target.id)
        }
      })
    }, observerOptions)

    SECTIONS.forEach(({ id }) => {
      const el = document.getElementById(id)
      if (el) observer.observe(el)
    })

    return () => {
      observer.disconnect()
    }
  }, [])

  return (
    <aside
      aria-label="Section Navigation"
      className="hidden xl:flex fixed right-6 top-1/2 -translate-y-1/2 z-40 flex-col gap-2.5 bg-[#090A0F]/85 backdrop-blur-md p-2.5 rounded-2xl border border-white/10 shadow-2xl"
    >
      <div className="px-2 py-1 border-b border-white/10 mb-1">
        <span className="text-[9px] font-mono tracking-widest text-[#8E95A5] uppercase">
          STORYBOARD
        </span>
      </div>

      {SECTIONS.map((section) => {
        const isActive = activeId === section.id
        return (
          <button
            key={section.id}
            type="button"
            onClick={() => scrollTo(`#${section.id}`)}
            className={`group flex items-center justify-between gap-3 px-2.5 py-1.5 rounded-lg text-left transition-all duration-200 cursor-pointer ${
              isActive
                ? 'bg-white/10 text-white font-semibold'
                : 'text-[#8E95A5] hover:text-white hover:bg-white/5'
            }`}
          >
            <span
              className={`text-[10px] font-mono transition-colors ${
                isActive ? 'text-[#D4FF00] font-bold' : 'text-[#8E95A5]'
              }`}
            >
              {section.step}
            </span>
            <span className="text-xs tracking-tight">{section.label}</span>
            <span
              className={`w-1.5 h-1.5 rounded-full transition-all duration-200 ${
                isActive
                  ? 'bg-[#D4FF00] scale-125 shadow-[0_0_8px_#D4FF00]'
                  : 'bg-white/20 group-hover:bg-white/50'
              }`}
            />
          </button>
        )
      })}
    </aside>
  )
}
