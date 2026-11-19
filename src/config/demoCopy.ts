export const DEMO_COPY = {
  banner: 'Demo mode: changes may reset on reload and are not tied to a real account. Avoid real passwords or sensitive details.',
  signIn: "Demo sign-in: any password is accepted. Don't enter a real password.",
  session: 'Demo changes reset when you reload this page.',
  device: "Saved on this device only. These changes aren't synced to an account or server.",
  verification:
    'Coming soon: real verification will use consent, secure evidence checks, review status, and an audit trail. No checks happen in this demo.',
  verificationNotPerformed:
    'No identity, college, experience, skill, or portfolio checks are performed here.',
} as const

export const DEMO_BANNER_SESSION_KEY = 'peerconnect_demo_banner_dismissed_v1'
