import type { HTMLAttributes, ReactNode } from 'react'

export interface CardProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode
  padding?: 'none' | 'sm' | 'md' | 'lg'
}

export function Card({ children, padding = 'md', className = '', ...props }: CardProps) {
  const paddingStyles = {
    none: '',
    sm: 'p-4',
    md: 'p-5 sm:p-6',
    lg: 'p-6 sm:p-8',
  }

  return (
    <div
      className={`rounded-2xl border border-[#E7E8E1] bg-white shadow-[0_4px_18px_rgba(23,25,22,0.04)] ${paddingStyles[padding]} ${className}`}
      {...props}
    >
      {children}
    </div>
  )
}
