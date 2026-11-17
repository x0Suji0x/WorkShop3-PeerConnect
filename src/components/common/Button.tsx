import type { ButtonHTMLAttributes, ReactNode } from 'react'

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode
  variant?: 'primary' | 'dark' | 'secondary' | 'ghost' | 'outline'
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
    'inline-flex items-center justify-center font-medium rounded-full transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#08C58A]/50 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer'

  const variantStyles = {
    primary:
      'bg-[#08C58A] hover:bg-[#07B27C] text-[#0A261D] font-semibold shadow-[0_2px_12px_rgba(8,197,138,0.22)] hover:shadow-[0_4px_18px_rgba(8,197,138,0.32)] active:scale-[0.98]',
    dark:
      'bg-[#171916] hover:bg-[#242723] text-white font-medium shadow-2xs hover:shadow-xs active:scale-[0.98]',
    secondary:
      'bg-white hover:bg-[#F2F1EA] text-[#171916] border border-[#E7E8E1] hover:border-[#D1D2C9] shadow-2xs active:scale-[0.98]',
    ghost:
      'bg-transparent hover:bg-[#171916]/5 text-[#777A72] hover:text-[#171916]',
    outline:
      'bg-transparent border border-[#E7E8E1] hover:border-[#08C58A] text-[#171916] hover:bg-[#E3F4EB]/30',
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
