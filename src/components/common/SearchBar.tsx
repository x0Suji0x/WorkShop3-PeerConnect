import { Search, X } from 'lucide-react'
import type { InputHTMLAttributes } from 'react'

export interface SearchBarProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> {
  onClear?: () => void
}

export function SearchBar({ className = '', value, onClear, ...props }: SearchBarProps) {
  return (
    <div className={`relative ${className}`}>
      <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-[#777A72]" />
      <input
        type="search"
        value={value}
        className="w-full rounded-xl border border-[#E7E8E1] bg-white py-2.5 pl-10 pr-10 text-sm text-[#171916] outline-none transition focus:border-[#08C58A] focus:ring-2 focus:ring-[#08C58A]/20 placeholder:text-[#9A9D96]"
        {...props}
      />
      {value && onClear && (
        <button
          type="button"
          onClick={onClear}
          aria-label="Clear search"
          className="absolute right-2 top-1/2 rounded-lg p-1.5 text-[#777A72] transition hover:bg-[#F7F6F0] hover:text-[#171916]"
        >
          <X className="h-4 w-4" />
        </button>
      )}
    </div>
  )
}
