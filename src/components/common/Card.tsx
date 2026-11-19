import type { HTMLAttributes, ReactNode } from 'react'

export interface CardProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode
  padding?: 'none' | 'sm' | 'md' | 'lg'
  variant?: 'default' | 'editorial' | 'flat'
}

export function Card({
  children,
  padding = 'md',
  variant = 'default',
  className = '',
  ...props
}: CardProps) {
  const paddingStyles = {
    none: '',
    sm: 'p-4',
    md: 'p-5 sm:p-6',
    lg: 'p-6 sm:p-8',
  }

  const variantStyles = {
    default:
      'rounded-2xl border border-[rgba(91,112,96,0.16)] bg-white/95 backdrop-blur-xs shadow-[0_8px_24px_rgba(66,53,40,0.04)] transition-all',
    editorial:
      'peer-card-glass',
    flat:
      'rounded-2xl border border-[#E7E8E1] bg-white',
  }

  return (
    <div
      className={`${variantStyles[variant]} ${paddingStyles[padding]} ${className}`}
      {...props}
    >
      {children}
    </div>
  )
}
