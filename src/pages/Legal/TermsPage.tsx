import { LegalPageLayout, LegalSection } from './LegalPageLayout'

export function TermsPage() {
  return (
    <LegalPageLayout title="Terms of Service">
      <p>This draft describes the intended terms for using the PeerConnect prototype. The final terms, governing law, and operating details must be reviewed and completed before a public launch.</p>
      <LegalSection title="Using PeerConnect">PeerConnect is currently an educational marketplace prototype. Features, sample listings, and account flows may be incomplete and may change while the service is being developed.</LegalSection>
      <LegalSection title="Accounts and eligibility">Users should provide accurate information and keep access to their accounts secure. The final service must define eligibility, account responsibilities, and the process for suspending or closing accounts.</LegalSection>
      <LegalSection title="Profiles, projects, and applications">Students and project owners are responsible for the information and materials they submit. The final terms must explain ownership, permissions, project agreements, payments, and how disputes are handled.</LegalSection>
      <LegalSection title="No guarantee of work or outcomes">Listings and profiles do not guarantee selection, payment, project completion, or any particular result. Users should agree on scope and terms directly through the service’s approved workflow before beginning work.</LegalSection>
      <LegalSection title="Acceptable use">Users must not misuse the service, misrepresent their identity or work, infringe others’ rights, or submit unlawful or harmful content. Detailed enforcement and reporting procedures remain to be finalized.</LegalSection>
      <LegalSection title="Contact">Before publication, PeerConnect must add a monitored support contact and identify the legal entity responsible for the service.</LegalSection>
    </LegalPageLayout>
  )
}
