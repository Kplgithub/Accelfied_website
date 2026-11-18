import type { Metadata } from 'next';
import Link from 'next/link';
import { LegalPage, legalDetails, MailOrContact } from '@/components/legal/legal-page';
import { getSiteSettings } from '@/lib/data';

export const metadata: Metadata = {
  title: 'Privacy policy',
  description: 'What Accelfied collects, why, who sees it and how to change or delete it.',
  alternates: { canonical: '/privacy' },
};

export default async function PrivacyPage() {
  const d = legalDetails(await getSiteSettings());
  return (
    <LegalPage
      title="Privacy policy"
      updatedOn={d.updatedOn}
      intro={`Accelfied${d.runBy} is a directory where businesses find service companies and read reviews from their clients. This page explains what we collect, why, and the choices you have.`}
    >
      <h2>What we collect</h2>
      <ul>
        <li>
          <strong>Your account:</strong> name, email, password (stored only as a secure hash) and account type. If you sign in with Google or LinkedIn, we receive
          your name and email from them.
        </li>
        <li>
          <strong>Company listings:</strong> the details a company adds to its profile, such as services, rates, locations, team, portfolio, logo and contact details.
        </li>
        <li>
          <strong>Reviews:</strong> your review, ratings and project details. Your email and phone are never shown with a review. You can choose to hide your name.
        </li>
        <li>
          <strong>Briefs and messages:</strong> project briefs you send and messages between clients and companies, so both sides can read the conversation.
        </li>
        <li>
          <strong>Claims and verification:</strong> work email, job title and business documents such as GST and registration details, used only to confirm a company.
        </li>
        <li>
          <strong>Payments:</strong> Razorpay processes card payments for the Verified plan. We keep invoices and payment references. We never see or store your full card
          number.
        </li>
        <li>
          <strong>Usage:</strong> page views, how far articles are read, and clicks to company profiles and websites. We use these to show companies how their profile
          performs and to improve the site. We do not use advertising cookies.
        </li>
      </ul>

      <h2>Cookies and storage</h2>
      <p>
        We set one cookie to keep you signed in. Your browser also remembers which articles and profiles you already opened, so the same visit is not counted twice. You
        can clear these at any time in your browser settings.
      </p>

      <h2>How we use your information</h2>
      <ul>
        <li>To run your account, show listings and reviews, and deliver briefs and messages.</li>
        <li>To check that companies, claims and reviews are genuine.</li>
        <li>To send emails you need: sign-in help, confirmations, new messages and decisions about your listing or review.</li>
        <li>To bill the Verified plan and keep the records tax law requires.</li>
        <li>To keep Accelfied safe from spam, fraud and abuse.</li>
      </ul>

      <h2>Who can see it</h2>
      <p>
        Published profiles and reviews are public. A brief goes only to the company you chose, or to companies that match an open brief. Messages are seen only by the two
        sides of the conversation and, when needed to handle a report, our team. We share data with service providers who help run Accelfied, such as hosting, email
        delivery and payments, and only for that purpose. We do not sell your data.
      </p>

      <h2>How long we keep it</h2>
      <p>
        We keep your account data while your account is open. Invoices are kept for as long as tax law requires. Published reviews stay on a company profile unless they are
        removed under our <Link href="/terms">terms</Link>.
      </p>

      <h2>Your choices</h2>
      <p>
        You can update your details from your <Link href="/dashboard/settings">account settings</Link>. To get a copy of your data, correct it or delete your account,
        write to <MailOrContact email={d.supportEmail} />. We reply within 30 days.
      </p>

      <h2>Grievance Officer</h2>
      <p>
        If you have a concern about how we handle your data, contact {d.officer} at <MailOrContact email={d.grievanceEmail} />
        {d.address ? `, ${d.address}` : ''}. We acknowledge complaints within 48 hours and aim to resolve them within 30 days.
      </p>

      <h2>Changes</h2>
      <p>If we change this policy in a way that matters, we will update the date above and, for big changes, email account holders.</p>
    </LegalPage>
  );
}
