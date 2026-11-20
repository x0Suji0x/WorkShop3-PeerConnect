export const DEMO_COPY = {
  banner: 'Accounts, student profiles, and project listings are saved with Supabase. Marketplace applications and shortlists are still stored only on this device; verification remains a prototype feature.',
  device: 'Applications and shortlists are saved only in this browser on this device. They are not synced to an account or server.',
  verification:
    'Coming soon: real verification will use consent, secure evidence checks, review status, and an audit trail. No checks happen in this demo.',
  verificationNotPerformed:
    'No identity, college, experience, skill, or portfolio checks are performed here.',
} as const

export const DEMO_BANNER_SESSION_KEY = 'peerconnect_demo_banner_dismissed_v1'
