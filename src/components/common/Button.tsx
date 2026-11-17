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
    'inline-flex items-center justify-center font-medium rounded-full transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer'

  const variantStyles = {
    primary:
      'bg-emerald-500 hover:bg-emerald-400 text-stone-950 font-semibold shadow-sm hover:shadow active:scale-[0.98]',
    dark:
      'bg-stone-900 hover:bg-stone-800 text-white font-medium shadow-sm hover:shadow active:scale-[0.98]',
    secondary:
      'bg-white hover:bg-stone-50 text-stone-900 border border-stone-200 shadow-2xs hover:border-stone-300 active:scale-[0.98]',
    ghost:
      'bg-transparent hover:bg-stone-200/50 text-stone-700 hover:text-stone-950',
    outline:
      'bg-transparent border border-stone-300 hover:border-stone-400 text-stone-800 hover:bg-stone-100/50',
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
