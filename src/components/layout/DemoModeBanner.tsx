import { useState } from 'react'
import { X } from 'lucide-react'
import { DEMO_BANNER_SESSION_KEY, DEMO_COPY } from '../../config/demoCopy'

function wasDismissedThisSession() {
  try {
    return window.sessionStorage.getItem(DEMO_BANNER_SESSION_KEY) === 'true'
  } catch {
    return false
  }
}

export function DemoModeBanner() {
  const [isDismissed, setIsDismissed] = useState(wasDismissedThisSession)

  const dismiss = () => {
    try {
      window.sessionStorage.setItem(DEMO_BANNER_SESSION_KEY, 'true')
    } catch {
      // Keep the banner dismissible for the current render when storage is unavailable.
    }
    setIsDismissed(true)
  }

  if (isDismissed) return null

  return (
    <aside className="flex items-center justify-between gap-4 border-b border-[#E9D9B7] bg-[#FBF5E8] px-4 py-2 text-xs text-[#765820] sm:px-6 lg:px-8" aria-label="Prototype feature notice">
      <p>{DEMO_COPY.banner}</p>
      <button type="button" onClick={dismiss} aria-label="Dismiss demo notice for this session" className="shrink-0 rounded-full p-1 hover:bg-[#765820]/10">
        <X className="h-4 w-4" aria-hidden="true" />
      </button>
    </aside>
  )
}
