# Frontend readiness checklist

## Local checks

Run these before merging a frontend change:

```bash
npm run build
npm run lint
npm run test
```

## Key user journeys

- Landing page: navigation links and responsive menu work at mobile and desktop widths.
- Student onboarding: complete the six steps and reach the completion screen.
- Dashboard: switch between student and employer views, open profile, and open Student Plus.
- Student Plus: choose a demo method, activate access, confirm the Plus state, then reset it.
- Talent: search and filter `/profiles`, then open a profile detail page.
- Marketplace: search projects, open a project, submit an application, and review `/applications`.
- Campus: browse, search, and filter colleges, clubs, and events; verify hash deep links open their detail screens.
- Communities and Team Finder: test filters, create a local post, and open a detail view.

## Current demo boundaries

- Authentication forms are frontend-only and do not create real accounts.
- Student profile updates are session-only mock repository updates.
- Verification states do not send OTPs or upload documents.
- Student Plus is a non-chargeable checkout demo with no payment provider.
- Marketplace, community, and campus data are mock data until a backend is selected.
