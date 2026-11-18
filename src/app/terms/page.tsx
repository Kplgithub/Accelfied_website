import type { Metadata } from 'next';
import Link from 'next/link';
import { LegalPage, legalDetails, MailOrContact } from '@/components/legal/legal-page';
import { getSiteSettings } from '@/lib/data';

export const metadata: Metadata = {
  title: 'Terms of use',
  description: 'The rules for using Accelfied as a client, a company or a reviewer.',
  alternates: { canonical: '/terms' },
};

export default async function TermsPage() {
  const d = legalDetails(await getSiteSettings());
  return (
    <LegalPage title="Terms of use" updatedOn={d.updatedOn} intro={`These terms apply when you use Accelfied${d.runBy.replace(/,$/, '')}. By creating an account or using the site, you agree to them.`}>
      <h2>Your account</h2>
      <p>
        Give accurate details and keep your password safe. You are responsible for what happens under your account. You must be at least 18 and able to enter a contract.
      </p>

      <h2>Company listings</h2>
      <ul>
        <li>Only list a company you are allowed to represent. Our team checks every listing before it goes live and may ask for proof.</li>
        <li>Profile details, rates and portfolio work must be true and yours to publish.</li>
        <li>
          If someone else listed your company, you can claim it with your work email. We may move a listing to the person who can best prove they manage the company.
        </li>
      </ul>

      <h2>Reviews</h2>
      <ul>
        <li>Review only work you were directly involved in, and describe it honestly.</li>
        <li>Companies may not write reviews of themselves or competitors, offer payment or gifts for reviews, or pressure clients to change one.</li>
        <li>
          Our team checks every review before it is published and may contact the reviewer. We can refuse or remove reviews that break these rules. See{' '}
          <Link href="/how-reviews-work">how reviews work</Link>.
        </li>
        <li>Ratings come only from published reviews. They cannot be bought or edited by a company.</li>
      </ul>

      <h2>Briefs and messages</h2>
      <p>
        Use briefs and messages for real project enquiries. No spam, harassment or requests for payment outside a proper agreement. Any contract you make with a company is
        between you and that company. Accelfied is not a party to it and does not guarantee the work.
      </p>

      <h2>Accelfied Verified</h2>
      <p>
        The Verified plan is a monthly subscription. The badge shows while the plan is paid and our team has approved your business details. Billing and refunds are
        explained in our <Link href="/refund-policy">refund policy</Link>.
      </p>

      <h2>What we may do</h2>
      <p>
        We may edit or remove content that breaks these terms or the law, pause or close accounts that misuse the site, and change features. We try to give notice
        before changes that affect paying companies.
      </p>

      <h2>Our responsibility</h2>
      <p>
        Accelfied helps you find and compare companies, but you decide whom to hire. Reviews are the opinions of their authors. To the extent the law allows, we are not
        liable for losses from work done by companies listed here, and our total liability to a company is limited to what it paid us in the last three months.
      </p>

      <h2>Law and disputes</h2>
      <p>
        These terms follow the laws of India.{' '}
        {d.city ? `Courts in ${d.city} have jurisdiction over any dispute.` : 'Courts in the city of our registered office have jurisdiction over any dispute.'}
      </p>

      <h2>Contact</h2>
      <p>
        Questions about these terms: <MailOrContact email={d.supportEmail} />. Complaints about content or data: {d.officer}, <MailOrContact email={d.grievanceEmail} />.
      </p>
    </LegalPage>
  );
}
