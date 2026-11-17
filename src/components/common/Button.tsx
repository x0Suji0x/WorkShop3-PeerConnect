import type { ButtonHTMLAttributes, ReactNode } from 'react'

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode
  variant?: 'primary' | 'dark' | 'secondary' | 'ghost' | 'outline' | 'violet'
  size?: 'sm' | 'md' | 'lg'
  className?: string
}

export function Button({
  children,
  variant = 'primary',
  size = 'md',
  className = '',
  ...props
}: ButtonProps) {
  const baseStyles =
    'inline-flex items-center justify-center font-medium rounded-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#D4FF00]/50 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer select-none'

  const variantStyles = {
    primary:
      'bg-[#D4FF00] hover:bg-[#c6ed00] text-[#090A0F] font-bold shadow-[0_2px_14px_rgba(212,255,0,0.25)] hover:shadow-[0_4px_22px_rgba(212,255,0,0.38)] active:scale-[0.98]',
    dark:
      'bg-[#12151E] hover:bg-[#1B202D] text-white border border-white/10 active:scale-[0.98]',
    secondary:
      'bg-white/10 hover:bg-white/15 text-white border border-white/15 hover:border-white/30 backdrop-blur-sm active:scale-[0.98]',
    ghost:
      'bg-transparent hover:bg-white/5 text-[#8E95A5] hover:text-white',
    outline:
      'bg-transparent border border-white/20 hover:border-[#D4FF00] text-white hover:text-[#D4FF00]',
    violet:
      'bg-[#6366F1] hover:bg-[#4F46E5] text-white font-semibold shadow-[0_2px_14px_rgba(99,102,241,0.3)] active:scale-[0.98]',
  }

  const sizeStyles = {
    sm: 'text-xs px-3.5 py-1.5 gap-1.5',
    md: 'text-sm px-5 py-2.5 gap-2',
    lg: 'text-base px-6 py-3 gap-2.5 font-semibold',
  }

  return (
    <button
      className={`${baseStyles} ${variantStyles[variant]} ${sizeStyles[size]} ${className}`}
      {...props}
    >
      {children}
    </button>
  )
}
