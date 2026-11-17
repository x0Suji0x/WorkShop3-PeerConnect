interface FilterPillsProps {
  label: string
  options: string[]
  value: string
  onChange: (value: string) => void
}

export function FilterPills({ label, options, value, onChange }: FilterPillsProps) {
  return (
    <div className="flex flex-wrap gap-2" aria-label={label}>
      {options.map((option) => <button key={option} type="button" onClick={() => onChange(option)} aria-pressed={value === option} className={`rounded-full px-3.5 py-2 text-xs font-bold transition ${value === option ? 'bg-[#123D30] text-white' : 'border border-[#E7E8E1] bg-white text-[#525A55] hover:border-[#08C58A] hover:text-[#123D30]'}`}>{option}</button>)}
    </div>
  )
}
