type AccountRole = 'student' | 'client'

/**
 * Starts the real Google-hosted account chooser. The provider owns the page
 * where users choose an account and enter credentials; PeerConnect never sees
 * a Google password.
 */
export function startGoogleOAuth(role: AccountRole): void {
  const authUrl = `/api/auth/google?role=${encodeURIComponent(role)}`
  const width = 520
  const height = 720
  const left = Math.max(0, window.screenX + (window.outerWidth - width) / 2)
  const top = Math.max(0, window.screenY + (window.outerHeight - height) / 2)
  const popup = window.open(
    authUrl,
    'peerconnect-google-oauth',
    `width=${width},height=${height},left=${left},top=${top},popup=yes`
  )

  if (popup) {
    popup.focus()
    return
  }

  // If a browser blocks pop-ups, use the same secure flow in the current tab.
  window.location.assign(authUrl)
}
