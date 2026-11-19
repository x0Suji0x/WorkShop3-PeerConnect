import { LegalPageLayout, LegalSection } from './LegalPageLayout'

export function PrivacyPage() {
  return (
    <LegalPageLayout title="Privacy Policy">
      <p>This draft outlines privacy topics for PeerConnect. It is not a final privacy notice; data flows, retention periods, vendors, and contact details must be confirmed before launch.</p>
      <LegalSection title="Data that may be collected">A future production service may collect account details, student profile information, portfolio links, project listings, applications, and messages that users choose to submit. The prototype may also keep limited demo state in this browser.</LegalSection>
      <LegalSection title="How information may be used">Information may be used to provide profiles, recommend relevant projects or collaborators, support applications, protect the service, and respond to user requests. The final notice must identify each actual purpose and any service providers involved.</LegalSection>
      <LegalSection title="Student data">Students should share only information needed for their profile and collaboration. The production service must explain which profile details are public, how contact information is protected, and what controls students have over visibility and removal.</LegalSection>
      <LegalSection title="Storage, security, and retention">This frontend prototype is not a secure account system. Some demo interactions are stored only in the browser and may be lost or visible to anyone using that device. Production storage, access controls, retention periods, and deletion procedures must be documented before launch.</LegalSection>
      <LegalSection title="Choices and requests">The final service should provide a way to review, correct, export, or delete personal information where applicable, and explain how to exercise those choices.</LegalSection>
      <LegalSection title="Contact">A privacy contact email and responsible organization must be added here before publication.</LegalSection>
    </LegalPageLayout>
  )
}
