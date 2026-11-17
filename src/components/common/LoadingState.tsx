export interface LoadingStateProps {
  label?: string
}

export function LoadingState({ label = 'Loading…' }: LoadingStateProps) {
  return (
    <div className="flex min-h-48 items-center justify-center gap-3 text-sm font-medium text-[#777A72]" role="status">
      <span className="h-5 w-5 animate-spin rounded-full border-2 border-[#E7E8E1] border-t-[#08C58A]" />
      {label}
    </div>
  )
}
