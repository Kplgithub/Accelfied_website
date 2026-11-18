import type { ComparisonPage } from './types';

/** Side-by-side guides for the choices buyers make before hiring. */
export const COMPARISONS: ComparisonPage[] = [
  {
    slug: 'agency-vs-freelancer',
    title: 'Agency vs Freelancer: Which Should You Hire in India?',
    metaTitle: 'Agency vs Freelancer in India: Cost, Risk, Fit',
    description:
      'Agency or freelancer for your website, app or marketing in India? Compare cost, quality, risk and speed, with rupee examples and a checklist to decide.',
    eyebrow: 'Comparison',
    intro: [
      'A freelancer is one skilled person. An agency is a team with a designer, developers, a tester and someone who manages the project. Both can do excellent work, and both can let you down. The right choice depends on the size of the job and how much of the managing you want to do yourself.',
      'This guide compares the two on the points that matter when you hire in India: price, quality, risk, speed and support after launch.',
    ],
    services: ['web-development', 'mobile-app-development', 'digital-marketing'],
    reviewed: '2026-11-18',
    sides: ['Agency', 'Freelancer'],
    chooseTitles: ['Choose an agency when', 'Choose a freelancer when'],
    rows: [
      { factor: 'Typical hourly rate in India', a: '₹1,200 to ₹4,200', b: '₹600 to ₹2,500' },
      { factor: 'Skills on one contract', a: 'Design, development, testing, project management', b: 'Usually one or two skills' },
      { factor: 'Who manages the project', a: 'A project manager on their side', b: 'Mostly you' },
      { factor: 'If someone falls ill or leaves', a: 'Another team member takes over', b: 'Work stops until they return' },
      { factor: 'Speed on large jobs', a: 'Several people work in parallel', b: 'Limited to one person’s hours' },
      { factor: 'Paperwork', a: 'GST invoice, formal contract, NDA', b: 'Varies; many work without GST' },
      { factor: 'Support after launch', a: 'Usually a paid support plan', b: 'Depends on availability' },
      { factor: 'Best for', a: 'Projects with several skills, deadlines or compliance', b: 'Small, clearly defined tasks' },
    ],
    chooseA: [
      'The project needs design, development and testing together, such as an app or a custom web platform.',
      'You have a fixed launch date and cannot afford a single point of failure.',
      'You need GST invoices, a formal contract and someone accountable for delivery.',
      'You do not have time to manage the work day to day.',
    ],
    chooseB: [
      'The job is small and clear: a landing page, a WordPress fix, a logo or a month of social posts.',
      'You or someone on your team can write the brief, review the work and test it.',
      'Budget is tight and the deadline is flexible.',
      'You want a specialist for one skill, such as a senior React developer to join your own team.',
    ],
    sections: [
      {
        heading: 'Real cost example: a 10-page business website',
        paragraphs: [
          'A freelancer might quote ₹25,000 to ₹45,000 and deliver in four to six weeks, with design, content entry and testing done by the same person. A small studio would typically quote ₹45,000 to ₹90,000 for the same site, with a designer, a developer and a tester, and deliver in four to five weeks.',
          'The agency costs more on paper. Whether it costs more in practice depends on how much of your own time the freelancer project takes, and what a delayed launch costs your business.',
        ],
      },
      {
        heading: 'The middle option: a small studio',
        paragraphs: [
          'Studios of five to twenty people sit between the two. Their rates are close to an experienced freelancer’s, but they bring a small team and some process. For most Indian small businesses building a website, store or first app, a small studio is the best balance of price and safety.',
        ],
      },
      {
        heading: 'How to check either one before you pay',
        bullets: [
          'Read reviews from past clients and look for projects similar to yours.',
          'Ask for a written scope with milestones and a payment schedule tied to them.',
          'Never pay more than 30 to 40 percent up front.',
          'Make sure code, designs and accounts are created in your name.',
        ],
      },
    ],
    faqs: [
      {
        q: 'Is it cheaper to hire a freelancer than an agency in India?',
        a: 'Per hour, yes. Indian freelancers typically charge ₹600 to ₹2,500 an hour against ₹1,200 to ₹4,200 for agencies. On larger projects the gap narrows because agencies work faster with several people and you spend less of your own time managing.',
      },
      {
        q: 'Can a freelancer build a mobile app?',
        a: 'An experienced freelancer can build a simple app, especially with Flutter or React Native. For apps with payments, several user roles or an admin panel, a team is safer because design, back-end and testing all need attention.',
      },
      {
        q: 'How do I know if an agency is genuine?',
        a: 'Check its company registration and GSTIN, read client reviews on independent platforms, ask for a call with a past client and look at live projects it has built.',
      },
    ],
  },
  {
    slug: 'in-house-team-vs-outsourcing',
    title: 'In-House Team vs Outsourcing Software Development in India',
    metaTitle: 'In-House Team vs Outsourcing Development in India',
    description:
      'Should you hire your own developers or outsource to an agency in India? Compare real monthly costs, hiring time, control and risk before you decide.',
    eyebrow: 'Comparison',
    intro: [
      'Hiring your own developers gives you full control and builds knowledge inside the company. Outsourcing to an agency gets a working team started in days instead of months. Many Indian businesses end up using both at different stages.',
      'Here is how the two compare on cost, speed, control and risk, with real salary and agency figures.',
    ],
    services: ['custom-software-development', 'it-staff-augmentation', 'mobile-app-development'],
    reviewed: '2026-11-18',
    sides: ['In-house team', 'Outsourcing to an agency'],
    chooseTitles: ['Build an in-house team when', 'Outsource to an agency when'],
    rows: [
      { factor: 'Time to start', a: '1 to 3 months to hire each person', b: '1 to 3 weeks' },
      { factor: 'Monthly cost of one mid-level developer', a: '₹70,000 to ₹1,40,000 salary, plus benefits, laptop, office and tools', b: '₹1,50,000 to ₹2,50,000, all inclusive' },
      { factor: 'Skills available', a: 'Only who you hire', b: 'Designers, testers, DevOps and specialists when needed' },
      { factor: 'Control over priorities', a: 'Full, every day', b: 'Agreed in sprints or milestones' },
      { factor: 'Product knowledge', a: 'Stays in the company', b: 'Needs documentation and handover' },
      { factor: 'Scaling up or down', a: 'Slow; notice periods and hiring', b: 'Change team size with a month’s notice' },
      { factor: 'Management needed', a: 'A tech lead or CTO to hire and guide', b: 'A product owner on your side' },
    ],
    chooseA: [
      'Software is your core product and you will build it for years.',
      'You already have a technical leader who can hire, review code and set direction.',
      'Your product depends on deep knowledge of your business that is hard to hand over.',
    ],
    chooseB: [
      'You need to launch in months, not quarters.',
      'You do not have a technical co-founder or CTO yet.',
      'The work is a project with an end date, such as a website, an app version or a system migration.',
      'You need skills for a short time, such as UI design, DevOps or security testing.',
    ],
    sections: [
      {
        heading: 'The true cost of an in-house developer',
        paragraphs: [
          'A salary is only part of the cost. Add the employer’s share of provident fund, health insurance, a laptop and software licences, office space, recruitment fees (often 8.33 percent of annual salary for an agency hire) and the months the seat stays empty while you hire. A developer on a ₹12 lakh salary often costs the company ₹15 lakh to ₹17 lakh a year in total.',
          'An agency developer at ₹1.8 lakh a month costs ₹21.6 lakh a year, but you pay only for the months you need and the agency carries hiring, leave cover and equipment.',
        ],
      },
      {
        heading: 'A common path: outsource first, then build the team',
        paragraphs: [
          'Many Indian startups outsource the first version to an agency, prove the product with real users, then hire a small in-house team and ask the agency to hand over code and documentation. If you plan this, put the handover in the contract from day one: code in your repository, documented setup, and a few weeks of overlap.',
        ],
      },
    ],
    faqs: [
      {
        q: 'Is outsourcing software development cheaper than hiring in India?',
        a: 'For short projects and early-stage products, usually yes, because you avoid hiring time, recruitment fees and idle months. For a product you will build continuously for years, an in-house team usually costs less over time.',
      },
      {
        q: 'What is staff augmentation?',
        a: 'Staff augmentation means hiring developers from an agency who join your own team and follow your processes, paid monthly. It sits between outsourcing a full project and hiring employees.',
      },
      {
        q: 'How do I protect my code when outsourcing?',
        a: 'Sign an NDA and a contract that assigns all intellectual property to you, keep the code in your own repository and cloud accounts, and limit access to what each person needs.',
      },
    ],
  },
  {
    slug: 'fixed-price-vs-hourly',
    title: 'Fixed Price vs Hourly Contracts for Software Projects',
    metaTitle: 'Fixed Price vs Hourly (Time and Material) Contracts',
    description:
      'Fixed price or time and material? See how each contract works with Indian agencies, when each is safer for you, and how to avoid overruns.',
    eyebrow: 'Comparison',
    intro: [
      'Indian agencies usually offer two ways to pay: a fixed price for an agreed scope, or time and material, where you pay for the hours actually worked. The contract you pick changes how the project runs, who carries the risk and how easy it is to change your mind.',
    ],
    services: ['custom-software-development', 'web-development', 'mobile-app-development'],
    reviewed: '2026-11-18',
    sides: ['Fixed price', 'Hourly (time and material)'],
    chooseTitles: ['Choose a fixed price when', 'Choose hourly when'],
    rows: [
      { factor: 'What you pay', a: 'One agreed price, in milestones', b: 'Hours worked times the agreed rate' },
      { factor: 'Who carries the risk of overruns', a: 'The agency', b: 'You' },
      { factor: 'Changing the scope', a: 'Each change needs a change request and a new price', b: 'Change priorities any week' },
      { factor: 'Up-front work needed', a: 'A detailed written scope', b: 'A clear goal and a prioritised list' },
      { factor: 'Price padding', a: 'Agencies add a buffer for unknowns, often 15 to 30 percent', b: 'No buffer; you pay for real time' },
      { factor: 'Budget certainty', a: 'High', b: 'Lower, unless you set a monthly cap' },
      { factor: 'Best for', a: 'Websites, stores and well-defined first versions', b: 'Products that change as you learn, long-term work' },
    ],
    chooseA: [
      'You can describe every page, screen and feature before work starts.',
      'Your budget is fixed and cannot stretch.',
      'The project is short, typically under three or four months.',
    ],
    chooseB: [
      'You are building a product and expect to change features based on user feedback.',
      'The work is ongoing, such as maintenance, new features every month or a long-term team.',
      'You want to see working software every week or two and adjust the plan.',
    ],
    sections: [
      {
        heading: 'A hybrid most buyers should consider',
        paragraphs: [
          'Pay a small fixed price for discovery: workshops, user stories, wireframes and an estimate. With that document in hand you can either agree a fixed price for the build, or move to time and material with a monthly cap. Discovery for a typical app or web platform costs ₹50,000 to ₹2,00,000 in India and makes every later quote more accurate.',
        ],
      },
      {
        heading: 'How to protect yourself on either contract',
        bullets: [
          'Fixed price: list exactly what is included, how many revision rounds you get and what counts as a change request.',
          'Hourly: set a monthly hour cap, ask for weekly timesheets and demos, and agree who approves extra hours.',
          'Both: tie payments to milestones you can see working, and keep the code in your own repository.',
        ],
      },
    ],
    faqs: [
      {
        q: 'Which is cheaper, fixed price or hourly?',
        a: 'If the scope is clear and does not change, hourly is often cheaper because there is no risk buffer. If the scope is unclear, a fixed price protects you from overruns but you pay for that protection through the buffer and change requests.',
      },
      {
        q: 'What is a change request?',
        a: 'In a fixed-price project, any work outside the agreed scope is a change request. The agency estimates it and you approve the extra cost before it is built.',
      },
      {
        q: 'What is a dedicated team model?',
        a: 'You pay a monthly fee for developers who work only on your project. It is a form of time and material that suits long-term products.',
      },
    ],
  },
  {
    slug: 'indian-agency-vs-overseas-agency',
    title: 'Indian Agency vs US or UK Agency: Cost and Quality Compared',
    metaTitle: 'Indian vs US/UK Development Agency: Cost Compared',
    description:
      'Compare hiring a development agency in India with one in the US or UK: hourly rates, quality, time zones, contracts and how to choose a reliable partner.',
    eyebrow: 'Comparison',
    intro: [
      'Businesses in the US, UK, Europe, the Middle East and Australia hire Indian development and marketing agencies mainly for cost, but also for the depth of talent. This guide sets an Indian agency side by side with a local one in the US or UK, so you can see where the savings come from and what to watch for.',
    ],
    services: ['custom-software-development', 'web-development', 'mobile-app-development'],
    reviewed: '2026-11-18',
    sides: ['Agency in India', 'Agency in the US or UK'],
    chooseTitles: ['Hire an Indian agency when', 'Hire a local US or UK agency when'],
    rows: [
      { factor: 'Typical hourly rate', a: '$15 to $50', b: '$100 to $200' },
      { factor: 'Minimum project size', a: 'Often $1,000 to $10,000', b: 'Often $25,000 and up' },
      { factor: 'Time zone overlap with the US', a: '2 to 4 hours, often by shifting hours', b: 'Same business hours' },
      { factor: 'Time zone overlap with the UK and Europe', a: '4 to 6 hours', b: 'Same business hours (UK)' },
      { factor: 'Talent pool', a: 'Very large, especially for web, mobile and cloud', b: 'Smaller and more expensive' },
      { factor: 'Contracts and invoicing', a: 'Export of services, usually invoiced in USD without GST under LUT', b: 'Local contract and tax' },
      { factor: 'Quality range', a: 'Very wide; careful selection matters', b: 'Narrower, but not guaranteed' },
    ],
    chooseA: [
      'You want a full team for the price of one or two local developers.',
      'You can write clear requirements and join a regular call each week.',
      'You are building web platforms, mobile apps, ecommerce or cloud software, where Indian agencies have deep experience.',
    ],
    chooseB: [
      'You need people on site often, for workshops or work in regulated environments.',
      'The project depends on very local knowledge, such as US healthcare billing or UK public sector rules, and no shortlisted Indian team has done it before.',
      'Your budget comfortably covers local rates and same-hour working matters more than cost.',
    ],
    sections: [
      {
        heading: 'Where the savings come from',
        paragraphs: [
          'The difference is mainly salaries and office costs, not lower effort. A senior developer in Jaipur, Indore or Kochi costs a fraction of one in New York or London. Good Indian agencies use that gap to give you a complete team, with design, QA and a project manager, that you could not afford locally.',
        ],
      },
      {
        heading: 'How to pick a reliable agency in India from abroad',
        bullets: [
          'Shortlist agencies with verified reviews from clients in your country.',
          'Ask for a paid pilot of two to four weeks before signing a large contract.',
          'Agree on English-language documentation, weekly demos and a named project manager.',
          'Check that the contract uses a jurisdiction and payment terms you are comfortable with.',
        ],
      },
    ],
    faqs: [
      {
        q: 'How much does it cost to hire an Indian development agency?',
        a: 'Most Indian agencies charge $15 to $50 an hour. A business website often costs $1,000 to $5,000 and a first version of a mobile app $10,000 to $50,000, depending on scope.',
      },
      {
        q: 'Is the quality of Indian agencies good?',
        a: 'The range is wide. India has many world-class teams and many weak ones, so verified client reviews, live work and a short paid pilot matter more than location.',
      },
      {
        q: 'Do Indian agencies charge GST to foreign clients?',
        a: 'Services exported from India are generally zero-rated. Registered agencies usually invoice foreign clients without GST under a Letter of Undertaking (LUT).',
      },
    ],
  },
];

export function getComparison(slug: string): ComparisonPage | undefined {
  return COMPARISONS.find((page) => page.slug === slug);
}
