import type { ReactNode } from 'react'

export interface BadgeProps {
  children: ReactNode
  variant?: 'lime' | 'violet' | 'green' | 'peach' | 'lavender' | 'blue' | 'neutral' | 'dark'
  size?: 'sm' | 'md'
  className?: string
}

export function Badge({
  children,
  variant = 'lime',
  size = 'md',
  className = '',
}: BadgeProps) {
  const variantStyles = {
    lime: 'bg-[#D4FF00]/15 text-[#D4FF00] border-[#D4FF00]/30',
    violet: 'bg-[#6366F1]/15 text-[#A5B4FC] border-[#6366F1]/30',
    green: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30',
    peach: 'bg-orange-500/15 text-orange-300 border-orange-500/30',
    lavender: 'bg-purple-500/15 text-purple-300 border-purple-500/30',
    blue: 'bg-sky-500/15 text-sky-300 border-sky-500/30',
    neutral: 'bg-white/5 text-[#8E95A5] border-white/10',
    dark: 'bg-[#10131B] text-white border-white/15',
  }

  const sizeStyles = {
    sm: 'px-2 py-0.5 text-[11px]',
    md: 'px-2.5 py-1 text-xs',
  }

  return (
    <span
      className={`inline-flex items-center gap-1.5 font-medium rounded-full border transition-colors ${variantStyles[variant]} ${sizeStyles[size]} ${className}`}
    >
      {children}
    </span>
  )
}
