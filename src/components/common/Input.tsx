import type { InputHTMLAttributes } from 'react'

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string
  hint?: string
}

export function Input({ label, hint, id, className = '', ...props }: InputProps) {
  const inputId = id ?? label?.toLowerCase().replace(/\s+/g, '-')

  return (
    <label className="block space-y-1.5" htmlFor={inputId}>
      {label && <span className="text-sm font-semibold text-[#171916]">{label}</span>}
      <input
        id={inputId}
        className={`w-full rounded-xl border border-[#E7E8E1] bg-white px-3.5 py-2.5 text-sm text-[#171916] outline-none transition focus:border-[#08C58A] focus:ring-2 focus:ring-[#08C58A]/20 placeholder:text-[#9A9D96] ${className}`}
        {...props}
      />
      {hint && <span className="block text-xs text-[#777A72]">{hint}</span>}
    </label>
  )
}
