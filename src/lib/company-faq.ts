import { formatPrice, SPONSORED_PLACE, VERIFIED_PLAN } from './verified-plan';

export interface FaqItem {
  q: string;
  a: string;
}

export interface FaqTopic {
  id: string;
  title: string;
  items: FaqItem[];
}

const PRICE = formatPrice(VERIFIED_PLAN.monthly);
const YEARLY = formatPrice(VERIFIED_PLAN.yearly);

/** Questions agencies and service companies ask most, grouped the way the dashboard is. */
export const COMPANY_FAQ: FaqTopic[] = [
  {
    id: 'getting-started',
    title: 'Getting started',
    items: [
      {
        q: 'Is it free to list my company?',
        a: 'Yes. Creating your profile, collecting reviews and receiving project briefs from clients is free. Paid plans only add extra visibility.',
      },
      {
        q: 'How do I list my company?',
        a: 'Join as a company, then fill in the short listing form: name, services, location, rates and a contact email. Our team checks every new listing, usually within two working days, and emails you when it is live.',
      },
      {
        q: 'My company is already listed. How do I take it over?',
        a: 'Open your profile and choose "Claim this company". Use an email address on your company’s website domain so our team can confirm you work there.',
      },
      {
        q: 'Can one account manage more than one company?',
        a: 'Each account manages one company. If you run several brands, use a separate work email for each.',
      },
    ],
  },
  {
    id: 'profile',
    title: 'Your profile',
    items: [
      {
        q: 'What is the profile health score?',
        a: 'A score out of 100 on your dashboard that shows how complete your profile is. Each section you fill in, such as services, client focus, locations, portfolio and packages, adds to it. Complete profiles get more enquiries.',
      },
      {
        q: 'How do services and percentages work?',
        a: 'List up to five services and how much of your work each one is. The total must come to 100%. Clients see this as a chart, and it decides which directory pages you appear on.',
      },
      {
        q: 'What are packages?',
        a: 'Fixed-price offers in three sizes, Small, Medium and Large, with a delivery time and a list of what is included. They appear in the Pricing section of your profile, where clients can compare them side by side. You can add up to 8.',
      },
      {
        q: 'Can I hide a package without deleting it?',
        a: 'Yes. Tick "Hide from my profile" while editing it. It stays in your dashboard and you can show it again any time.',
      },
      {
        q: 'Where does the pricing snapshot come from?',
        a: 'Minimum project size and hourly rate come from your profile. The most common project size and the value-for-money rating come only from your published client reviews.',
      },
    ],
  },
  {
    id: 'reviews',
    title: 'Client reviews',
    items: [
      {
        q: 'How do I get reviews?',
        a: 'From your dashboard, send review requests to past clients by email. They write the review step by step and can save and finish it later.',
      },
      {
        q: 'Who checks reviews?',
        a: 'Every review is checked by a person on our team before it is published. We may contact the reviewer to confirm the project.',
      },
      {
        q: 'Can I edit or remove a review?',
        a: 'No. Reviews belong to the client who wrote them. If you think a review breaks our rules, report it and our team will look at it.',
      },
      {
        q: 'How is my rating worked out?',
        a: 'It is the average of your published reviews and nothing else. It cannot be bought, typed in or changed by a paid plan.',
      },
    ],
  },
  {
    id: 'leads',
    title: 'Project briefs and messages',
    items: [
      {
        q: 'How do clients contact me?',
        a: 'Clients can send a quote request from your profile, message you directly, or send you their project brief. Each one opens a conversation in your dashboard Messages, and we email you when it arrives.',
      },
      {
        q: 'What is a project brief?',
        a: 'A clear write-up of a client’s project: goals, deliverables, budget, start date and questions. The client builds it step by step, then sends it to up to five companies they choose.',
      },
      {
        q: 'Do I pay for leads?',
        a: 'No. Briefs and quote requests are free to receive and reply to.',
      },
      {
        q: 'How can I get more briefs?',
        a: 'Keep your services and minimum project size up to date, add packages and collect reviews. Clients compare companies on budget fit, reviews and team size.',
      },
    ],
  },
  {
    id: 'plans',
    title: 'Verified and sponsored places',
    items: [
      {
        q: 'What does Verified give me?',
        a: `Our team checks your business and you get the Verified badge, a higher place in lists and a feature blog post written by our team. It costs ${PRICE} a month or ${YEARLY} a year, GST included.`,
      },
      {
        q: 'What is Premier Verified?',
        a: 'Verified companies with at least 10 published reviews and an average of 4.5 or more get the Premier badge on their own. It comes only from real reviews.',
      },
      {
        q: 'What is a sponsored place?',
        a: `A labelled spot at the top of one directory page for ${formatPrice(SPONSORED_PLACE.monthly)} a month. Each page has only ${SPONSORED_PLACE.perPage} places.`,
      },
      {
        q: 'Can I cancel?',
        a: 'Yes, any time from Billing. Your free profile and all published reviews stay live.',
      },
    ],
  },
];
