export const DEMO_COPY = {
  banner: 'Account sign-in is provided by Supabase. Projects, profile details beyond your name, applications, shortlists, and verification are still prototype features and may reset on reload.',
  session: 'These changes are held in memory and reset when you reload this page.',
  device: 'Applications and shortlists are saved only in this browser on this device. They are not synced to an account or server.',
  verification:
    'Coming soon: real verification will use consent, secure evidence checks, review status, and an audit trail. No checks happen in this demo.',
  verificationNotPerformed:
    'No identity, college, experience, skill, or portfolio checks are performed here.',
} as const

export const DEMO_BANNER_SESSION_KEY = 'peerconnect_demo_banner_dismissed_v1'
