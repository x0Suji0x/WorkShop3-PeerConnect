import { FolderGit2, Sparkles } from 'lucide-react'

export interface StudentProfileCardProps {
  variant: 'primary' | 'secondary'
  cardRef: React.RefObject<HTMLDivElement | null>
  onMouseMove?: (e: React.MouseEvent<HTMLDivElement>) => void
  onMouseLeave?: (e: React.MouseEvent<HTMLDivElement>) => void
  className?: string
}

export function StudentProfileCard({
  variant,
  cardRef,
  onMouseMove,
  onMouseLeave,
  className = '',
}: StudentProfileCardProps) {
  if (variant === 'primary') {
    return (
      <div
        ref={cardRef}
        className={`hero-student-card absolute will-change-transform ${className}`}
      >
        <div
          onMouseMove={onMouseMove}
          onMouseLeave={onMouseLeave}
          className="w-full bg-white rounded-2xl p-4 sm:p-5 border border-[#E7E8E1] shadow-[0_10px_32px_rgba(23,25,22,0.08)] hover:border-[#08C58A]/60 transition-all duration-200"
        >
          {/* Header Row: Avatar, Name, Role, Rate */}
          <div className="flex items-center gap-3">
            <div className="relative shrink-0">
              <img
                src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=180&q=80"
                alt="Sofia Rodriguez"
                className="w-12 h-12 rounded-xl object-cover border border-[#E7E8E1]"
              />
              <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full bg-[#08C58A] border-2 border-white" />
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex items-center justify-between">
                <h4 className="font-extrabold text-[#171916] text-sm sm:text-base truncate">
                  Sofia Rodriguez
                </h4>
                <span className="font-mono text-xs font-bold text-[#08C58A] bg-[#E3F4EB] px-2 py-0.5 rounded-full">
                  $65/hr
                </span>
              </div>
              <p className="text-xs text-[#777A72] truncate">
                Design Engineer &amp; Frontend
              </p>
            </div>
          </div>

          {/* Portfolio Preview Box */}
          <div className="mt-3.5 p-3 rounded-xl bg-[#F7F6F0] border border-[#E7E8E1] space-y-1.5">
            <div className="flex items-center justify-between text-[11px] text-[#777A72]">
              <span className="font-semibold text-[#171916] flex items-center gap-1.5">
                <FolderGit2 className="w-3.5 h-3.5 text-[#08C58A]" />
                Featured Portfolio Work
              </span>
              <span className="text-[10px] text-[#777A72] font-mono">Demo Showcase</span>
            </div>
            <p className="text-xs font-semibold text-[#171916] leading-snug">
              Interactive 3D Web Experience &amp; Design System
            </p>
            <p className="text-[10px] text-[#777A72] line-clamp-2">
              Clean UI components, fluid micro-interactions, and responsive layout architecture.
            </p>
          </div>

          {/* Skills & Availability Row */}
          <div className="flex items-center justify-between pt-3 text-xs">
            <div className="flex flex-wrap gap-1.5">
              <span className="px-2 py-0.5 rounded-md text-[10px] font-medium bg-[#E3F4EB] text-[#123D30]">
                React 19
              </span>
              <span className="px-2 py-0.5 rounded-md text-[10px] font-medium bg-[#F7F6F0] text-[#171916] border border-[#E7E8E1]">
                Next.js
              </span>
              <span className="px-2 py-0.5 rounded-md text-[10px] font-medium bg-[#F7F6F0] text-[#171916] border border-[#E7E8E1]">
                Tailwind CSS
              </span>
            </div>
            <span className="text-[11px] text-[#08C58A] font-semibold flex items-center gap-1 shrink-0">
              <span className="w-1.5 h-1.5 rounded-full bg-[#08C58A]" />
              Available
            </span>
          </div>
        </div>
      </div>
    )
  }

  // Secondary Variant (Marcus Chen)
  return (
    <div
      ref={cardRef}
      className={`hero-student-card absolute will-change-transform ${className}`}
    >
      <div
        onMouseMove={onMouseMove}
        onMouseLeave={onMouseLeave}
        className="w-full bg-white rounded-2xl p-4 border border-[#E7E8E1] shadow-[0_8px_24px_rgba(23,25,22,0.06)] hover:border-[#08C58A]/50 transition-all duration-200"
      >
        <div className="flex items-center gap-3">
          <div className="relative shrink-0">
            <img
              src="https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=150&q=80"
              alt="Marcus Chen"
              className="w-10 h-10 rounded-xl object-cover border border-[#E7E8E1]"
            />
            <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-[#08C58A] border-2 border-white" />
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex items-center justify-between">
              <h4 className="font-bold text-[#171916] text-sm truncate">Marcus Chen</h4>
              <span className="font-mono text-xs font-semibold text-[#171916]">
                $55/hr
              </span>
            </div>
            <p className="text-xs text-[#777A72] truncate">
              Systems &amp; Backend Engineering
            </p>
          </div>
        </div>

        <div className="mt-2.5 p-2 rounded-xl bg-[#F7F6F0] border border-[#E7E8E1] text-[11px] text-[#777A72]">
          <span className="font-semibold text-[#171916] block">
            Real-Time Data Pipeline &amp; Telemetry
          </span>
          <span className="text-[10px]">High-throughput WebSockets &amp; Go services</span>
        </div>

        <div className="flex items-center justify-between pt-2.5 text-[10px]">
          <div className="flex gap-1.5">
            <span className="px-1.5 py-0.5 rounded font-medium bg-[#E3F4EB] text-[#123D30]">
              Go
            </span>
            <span className="px-1.5 py-0.5 rounded font-medium bg-[#F7F6F0] text-[#171916] border border-[#E7E8E1]">
              PostgreSQL
            </span>
            <span className="px-1.5 py-0.5 rounded font-medium bg-[#F7F6F0] text-[#171916] border border-[#E7E8E1]">
              TypeScript
            </span>
          </div>
          <span className="text-[#777A72] flex items-center gap-1 font-medium">
            <Sparkles className="w-3 h-3 text-[#08C58A]" />
            Student Builder
          </span>
        </div>
      </div>
    </div>
  )
}
