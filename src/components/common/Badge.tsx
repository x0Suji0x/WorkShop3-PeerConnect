import type { ReactNode } from 'react'

export interface BadgeProps {
  children: ReactNode
  variant?: 'green' | 'peach' | 'lavender' | 'blue' | 'neutral' | 'dark'
  size?: 'sm' | 'md'
  className?: string
}

export function Badge({
  children,
  variant = 'green',
  size = 'md',
  className = '',
}: BadgeProps) {
  const variantStyles = {
    green: 'bg-[#E3F4EB] text-[#123D30] border-[#08C58A]/30',
    peach: 'bg-orange-50 text-orange-800 border-orange-200/70',
    lavender: 'bg-purple-50 text-purple-800 border-purple-200/70',
    blue: 'bg-sky-50 text-sky-800 border-sky-200/70',
    neutral: 'bg-[#F7F6F0] text-[#777A72] border-[#E7E8E1]',
    dark: 'bg-[#171916] text-white border-[#2A2E28]',
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
