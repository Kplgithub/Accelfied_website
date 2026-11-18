import type { CalculatorPage, Modifier } from './types';

/**
 * Cost calculators. Base ranges are what a small Indian studio (5 to 20 people) typically quotes in
 * November 2026, collected from public agency packages, freelance marketplace rate pages and directory
 * listings. The team and city factors then move the range up or down.
 */

const TEAM: Modifier = {
  id: 'team',
  label: 'Who builds it',
  initial: 1,
  options: [
    { label: 'Freelancer', factor: 0.65 },
    { label: 'Small studio (5 to 20 people)', factor: 1 },
    { label: 'Mid-size agency (20 to 250 people)', factor: 1.4 },
    { label: 'Large firm (250+ people)', factor: 2 },
  ],
};

const CITY: Modifier = {
  id: 'city',
  label: 'Where the team is based',
  initial: 0,
  options: [
    { label: 'Anywhere in India', factor: 1 },
    { label: 'Tier 2 city (Jaipur, Indore, Kochi, Coimbatore...)', factor: 0.88 },
    { label: 'Metro (Bengaluru, Mumbai, Delhi NCR, Pune...)', factor: 1.15 },
  ],
};

const RATES_TABLE = {
  caption: 'Typical hourly rates in India (November 2026)',
  headers: ['Who you hire', 'Hourly rate', 'Best for'],
  rows: [
    ['Freelancer', '₹600 to ₹2,500', 'Small, well-defined jobs you can manage yourself'],
    ['Small studio (5 to 20 people)', '₹1,200 to ₹3,000', 'Business websites, stores and first app versions'],
    ['Mid-size agency (20 to 250 people)', '₹2,000 to ₹4,200', 'Custom builds that need design, QA and a project manager'],
    ['Large firm (250+ people)', '₹3,500 and up', 'Enterprise work with strict security or compliance needs'],
  ],
  note: 'Teams in tier 2 cities are often 15 to 30 percent cheaper than equivalent teams in Bengaluru, Mumbai or Gurugram, mainly because of salary and office costs.',
};

export const CALCULATORS: CalculatorPage[] = [
  {
    slug: 'website-cost-calculator',
    title: 'Website Cost Calculator for India',
    metaTitle: 'Website Cost Calculator India (2026 Prices)',
    description:
      'Estimate what your website will cost in India. Pick the site type, features and team, and see a realistic rupee range with timelines and running costs.',
    eyebrow: 'Cost calculator',
    intro: [
      'Choose the kind of website you need, tick the features you want and pick who will build it. The calculator shows the price range Indian studios and agencies typically quote for that scope, in rupees.',
      'Use it to set a budget before you ask for quotes, or to check whether a quote you already have is in a normal range.',
    ],
    services: ['web-development', 'web-design', 'ecommerce-development'],
    reviewed: '2026-11-18',
    unit: 'project',
    typesLabel: 'Type of website',
    types: [
      { id: 'landing', label: 'Landing page', hint: 'One long page for a campaign, event or product launch', low: 5_000, high: 30_000, weeks: [1, 2] },
      { id: 'template', label: 'Template business website', hint: '3 to 6 pages on a ready-made theme', low: 8_000, high: 25_000, weeks: [1, 3] },
      { id: 'custom', label: 'Custom-designed business website', hint: '8 to 20 pages, original design, editable CMS', low: 30_000, high: 1_50_000, weeks: [4, 8] },
      { id: 'portal', label: 'Web portal or web application', hint: 'Logins, dashboards, bookings or custom workflows', low: 2_50_000, high: 15_00_000, weeks: [12, 24] },
    ],
    addonsLabel: 'Features',
    addons: [
      { id: 'copy', label: 'Copywriting for every page', hint: 'Agency writes the text', low: 8_000, high: 30_000 },
      { id: 'blog', label: 'Blog with categories', hint: 'You publish articles yourself', low: 5_000, high: 20_000 },
      { id: 'bilingual', label: 'Hindi and English', hint: 'Or any second language', low: 10_000, high: 40_000 },
      { id: 'booking', label: 'Booking or appointments', hint: 'Calendar, slots, reminders', low: 15_000, high: 60_000 },
      { id: 'crm', label: 'CRM or WhatsApp integration', hint: 'Leads go straight to your sales team', low: 10_000, high: 40_000 },
      { id: 'payments', label: 'Online payments', hint: 'Razorpay, PayU or Cashfree', low: 8_000, high: 30_000 },
      { id: 'seo', label: 'Technical SEO and speed tuning', hint: 'Core Web Vitals, schema, sitemaps', low: 10_000, high: 40_000 },
      { id: 'accounts', label: 'User accounts and dashboard', hint: 'Customers log in to see their data', low: 40_000, high: 1_50_000 },
      { id: 'care', label: '12 months of maintenance', hint: 'Updates, backups, small changes', low: 24_000, high: 1_20_000 },
    ],
    modifiers: [TEAM, CITY],
    resultNote: 'Domain, hosting and paid plugins or themes are extra. Budget about ₹3,000 to ₹15,000 a year for those on a small site.',
    tables: [
      {
        caption: 'Website cost in India by type',
        headers: ['Type of website', 'Typical price', 'Timeline'],
        rows: [
          ['Landing page', '₹5,000 to ₹30,000', '1 to 2 weeks'],
          ['Template business website (3 to 6 pages)', '₹8,000 to ₹25,000', '1 to 3 weeks'],
          ['Custom business website (8 to 20 pages)', '₹30,000 to ₹1,50,000', '4 to 8 weeks'],
          ['Shopify or WooCommerce store', '₹40,000 to ₹2,50,000', '3 to 8 weeks'],
          ['Web portal or web application', '₹2,50,000 to ₹15,00,000+', '3 to 6 months'],
        ],
      },
      RATES_TABLE,
    ],
    sections: [
      {
        heading: 'How this estimate is worked out',
        paragraphs: [
          'Each website type starts from the range a small Indian studio usually quotes for it. Every feature you tick adds its own range, because it adds design, development and testing hours. The total is then adjusted for who builds it and where the team is based.',
          'The low end assumes clear requirements, content ready on time and few revision rounds. The high end assumes more unique page designs, more revisions and stronger testing. Real quotes land outside the range when a scope is unusual, so treat the result as a budget guide, not a price.',
        ],
      },
      {
        heading: 'What makes a website cost more',
        bullets: [
          'Unique page designs. Ten pages built on two layouts cost far less than ten pages that all look different.',
          'Content. If nobody on your side writes the text or supplies photos, the agency has to, and it shows up in the bill.',
          'Integrations. Each connection to a CRM, payment gateway, ERP or WhatsApp API adds development and testing time.',
          'Logins and roles. As soon as people sign in and see their own data, a website becomes an application.',
          'Rushed deadlines. More people working at once to hit a date costs more than a steady team.',
        ],
      },
      {
        heading: 'How to use your estimate when you ask for quotes',
        bullets: [
          'Share the budget range with the companies you contact. Good agencies will tell you what fits and what does not.',
          'Ask for an itemised quote that lists design, development, content, testing and support separately.',
          'Confirm in writing that you own the code, design files, domain and hosting accounts after launch.',
          'Read client reviews of each company before paying an advance, and ask for one past client you can call.',
        ],
      },
    ],
    faqs: [
      {
        q: 'How accurate is this website cost calculator?',
        a: 'It gives the range most Indian studios and agencies quote for the scope you pick, based on November 2026 market prices. Your final price depends on details such as the number of unique designs and revisions, so always compare at least three itemised quotes.',
      },
      {
        q: 'What is the cheapest way to get a website in India?',
        a: 'A template website from a freelancer, usually ₹8,000 to ₹15,000 plus a few thousand rupees a year for domain and hosting. It suits shops and consultants who mainly need to look credible online.',
      },
      {
        q: 'Why do two agencies quote very different prices for the same website?',
        a: 'They are usually quoting different scopes. One may include original design, copywriting, SEO setup and a year of support while the other quotes only the build on a template. An itemised quote makes the difference visible.',
      },
      {
        q: 'Does the estimate include GST?',
        a: 'Treat the ranges as before tax. Registered agencies add 18 percent GST to their invoice, while many freelancers below the GST threshold do not charge it.',
      },
    ],
  },
  {
    slug: 'app-development-cost-calculator',
    title: 'App Development Cost Calculator for India',
    metaTitle: 'App Development Cost Calculator India (2026)',
    description:
      'Estimate your mobile app development cost in India. Choose app size, platforms, features and team to get a realistic rupee range and timeline.',
    eyebrow: 'Cost calculator',
    intro: [
      'Mobile app quotes in India range from under ₹2 lakh to well over ₹50 lakh. This calculator narrows that down for your idea: pick how complex the app is, which platforms it runs on and the features it needs.',
      'The result is the range Indian app development companies typically quote for that scope, with a rough timeline.',
    ],
    services: ['mobile-app-development', 'ux-ui-design', 'custom-software-development'],
    reviewed: '2026-11-18',
    unit: 'project',
    typesLabel: 'How complex is the app',
    types: [
      { id: 'simple', label: 'Simple app', hint: '5 to 10 screens, content or catalogue, basic forms', low: 1_50_000, high: 4_00_000, weeks: [6, 10] },
      { id: 'medium', label: 'Medium app', hint: 'Sign-in, payments, API, admin panel', low: 4_00_000, high: 12_00_000, weeks: [12, 20] },
      { id: 'complex', label: 'Complex app', hint: 'Marketplace, real-time features, several user roles', low: 12_00_000, high: 40_00_000, weeks: [20, 40] },
    ],
    addonsLabel: 'Features',
    addons: [
      { id: 'design', label: 'Custom UI/UX design', hint: 'Research, wireframes, Figma prototype', low: 60_000, high: 3_00_000 },
      { id: 'payments', label: 'Payments and wallet', hint: 'UPI, cards, refunds, wallet balance', low: 40_000, high: 1_50_000 },
      { id: 'chat', label: 'In-app chat', hint: 'Real-time messages and media', low: 60_000, high: 2_00_000 },
      { id: 'maps', label: 'Maps and live tracking', hint: 'Delivery, rides, field staff', low: 60_000, high: 2_50_000 },
      { id: 'video', label: 'Video calls or streaming', hint: 'Consultations, classes, live events', low: 80_000, high: 3_00_000 },
      { id: 'admin', label: 'Web admin panel', hint: 'Manage users, orders and content', low: 80_000, high: 3_00_000 },
      { id: 'push', label: 'Push notifications and analytics', hint: 'Campaigns, events, crash reports', low: 15_000, high: 50_000 },
      { id: 'languages', label: 'Multiple languages', hint: 'Hindi and regional languages', low: 30_000, high: 1_00_000 },
      { id: 'support', label: '12 months of support', hint: 'Bug fixes, OS updates, store releases', low: 60_000, high: 3_00_000 },
    ],
    modifiers: [
      {
        id: 'platform',
        label: 'Platforms',
        initial: 2,
        options: [
          { label: 'Android only', factor: 1 },
          { label: 'iOS only', factor: 1.05 },
          { label: 'Android and iOS, one codebase (Flutter or React Native)', factor: 1.35 },
          { label: 'Android and iOS, two native apps', factor: 1.8 },
        ],
      },
      TEAM,
      CITY,
    ],
    resultNote:
      'Not included: Google Play (one-time $25) and Apple developer ($99 a year) accounts, servers, SMS and map API usage, which grow with your users.',
    tables: [
      {
        caption: 'App development cost in India by complexity',
        headers: ['App type', 'One platform', 'Android and iOS (cross-platform)', 'Timeline'],
        rows: [
          ['Simple app', '₹1,50,000 to ₹4,00,000', '₹2,02,500 to ₹5,40,000', '6 to 10 weeks'],
          ['Medium app', '₹4,00,000 to ₹12,00,000', '₹5,40,000 to ₹16,20,000', '3 to 5 months'],
          ['Complex app', '₹12,00,000 to ₹40,00,000', '₹16,20,000 to ₹54,00,000', '5 to 10 months'],
        ],
        note: 'Cross-platform figures use the calculator’s 1.35 factor for Flutter or React Native compared with a single platform.',
      },
      RATES_TABLE,
    ],
    sections: [
      {
        heading: 'Native or cross-platform: what it does to your budget',
        paragraphs: [
          'Building two native apps (Kotlin for Android, Swift for iOS) means two codebases and close to double the development effort. Flutter and React Native let one team ship both platforms from one codebase, which is why most Indian startups and SMEs choose them for a first version.',
          'Native still makes sense for apps that lean heavily on device hardware, complex animations or platform features that cross-platform tools support late.',
        ],
      },
      {
        heading: 'Costs that come after launch',
        bullets: [
          'Servers and databases: from a few thousand rupees a month for a small app, growing with users.',
          'Third-party APIs: SMS OTPs, maps, video calls and email are billed per use.',
          'Store accounts: Google Play charges a one-time $25 and Apple charges $99 a year.',
          'Updates: every new Android and iOS version needs testing and sometimes fixes. Many agencies charge 15 to 20 percent of the build cost a year for support.',
        ],
      },
      {
        heading: 'How to keep the first version affordable',
        bullets: [
          'Launch with the one journey that proves your idea, and list everything else for version two.',
          'Use proven services for chat, payments and video instead of building them from scratch.',
          'Ask agencies for a fixed price for the first milestone (design and a clickable prototype) before committing to the full build.',
        ],
      },
    ],
    faqs: [
      {
        q: 'How much does it cost to make an app in India?',
        a: 'A simple single-platform app usually costs ₹1.5 lakh to ₹4 lakh, a medium app with sign-in, payments and an admin panel ₹4 lakh to ₹12 lakh, and a complex marketplace or real-time app ₹12 lakh to ₹40 lakh or more.',
      },
      {
        q: 'Is Flutter cheaper than native app development?',
        a: 'For most business apps, yes. One Flutter or React Native codebase covers Android and iOS, so it typically costs about a third more than one native app instead of nearly twice as much.',
      },
      {
        q: 'How long does it take to build an app?',
        a: 'Simple apps take 6 to 10 weeks, medium apps 3 to 5 months and complex apps 5 to 10 months, including design, testing and store approval.',
      },
      {
        q: 'Should I pay a fixed price or hourly for app development?',
        a: 'A fixed price works when the scope is written down in detail. If you expect to change features as you learn from users, a monthly team or hourly contract with a cap is usually fairer to both sides.',
      },
    ],
  },
  {
    slug: 'software-development-cost-calculator',
    title: 'Custom Software Development Cost Calculator for India',
    metaTitle: 'Software Development Cost Calculator India',
    description:
      'Estimate custom software development cost in India for internal tools, ERP and CRM systems, SaaS products and enterprise platforms, in rupees.',
    eyebrow: 'Cost calculator',
    intro: [
      'Custom software is priced by effort, not by pages or screens. This calculator estimates that effort from the kind of system you need and the work around it, such as integrations, data migration and security testing.',
      'The result is the range Indian software development companies typically quote for that scope.',
    ],
    services: ['custom-software-development', 'it-services', 'cloud-consulting'],
    reviewed: '2026-11-18',
    unit: 'project',
    typesLabel: 'What you are building',
    types: [
      { id: 'tool', label: 'Internal tool or dashboard', hint: 'Replaces spreadsheets for one team', low: 2_00_000, high: 6_00_000, weeks: [6, 12] },
      { id: 'business', label: 'Business system', hint: 'CRM, ERP module, HR or inventory with several roles', low: 6_00_000, high: 20_00_000, weeks: [12, 28] },
      { id: 'saas', label: 'SaaS product, first version', hint: 'Sign-up, subscriptions, multi-tenant data', low: 8_00_000, high: 25_00_000, weeks: [14, 26] },
      { id: 'enterprise', label: 'Enterprise platform', hint: 'Many modules, high load, strict security', low: 25_00_000, high: 1_00_00_000, weeks: [26, 52] },
    ],
    addonsLabel: 'Extra work',
    addons: [
      { id: 'integrations', label: 'Integrations with Tally, SAP or other ERP', hint: 'Two-way data sync', low: 80_000, high: 4_00_000 },
      { id: 'mobile', label: 'Companion mobile app', hint: 'For field staff or customers', low: 3_00_000, high: 10_00_000 },
      { id: 'reports', label: 'Reports and analytics', hint: 'Dashboards, exports, scheduled reports', low: 60_000, high: 3_00_000 },
      { id: 'sso', label: 'Single sign-on and detailed roles', hint: 'Google Workspace, Microsoft 365, permissions', low: 40_000, high: 1_50_000 },
      { id: 'migration', label: 'Data migration', hint: 'Move records from old systems or Excel', low: 50_000, high: 3_00_000 },
      { id: 'security', label: 'Security testing (VAPT)', hint: 'Vulnerability assessment and penetration test', low: 50_000, high: 2_50_000 },
      { id: 'devops', label: 'Cloud setup and CI/CD', hint: 'AWS, Azure or Google Cloud, automated deploys', low: 40_000, high: 2_00_000 },
      { id: 'support', label: '12 months of support', hint: 'Fixes, small changes, monitoring', low: 1_50_000, high: 8_00_000 },
    ],
    modifiers: [TEAM, CITY],
    resultNote: 'Cloud hosting, licences for third-party software and per-user SaaS tools are billed separately and grow with usage.',
    tables: [
      {
        caption: 'Custom software cost in India by type',
        headers: ['System', 'Typical price', 'Timeline'],
        rows: [
          ['Internal tool or dashboard', '₹2,00,000 to ₹6,00,000', '6 to 12 weeks'],
          ['Business system (CRM, ERP module, HRMS)', '₹6,00,000 to ₹20,00,000', '3 to 7 months'],
          ['SaaS product, first version', '₹8,00,000 to ₹25,00,000', '3.5 to 6 months'],
          ['Enterprise platform', '₹25,00,000 to ₹1,00,00,000+', '6 to 12 months'],
        ],
      },
      {
        caption: 'Monthly cost of a dedicated team in India',
        headers: ['Role', 'Monthly cost from an agency'],
        rows: [
          ['Junior developer (1 to 3 years)', '₹1,20,000 to ₹2,00,000'],
          ['Senior developer (5+ years)', '₹2,50,000 to ₹4,50,000'],
          ['QA engineer', '₹1,00,000 to ₹2,00,000'],
          ['Project manager (shared)', '₹60,000 to ₹1,50,000'],
        ],
        note: 'Agency rates for full-time dedicated staff, including the agency’s margin, management and infrastructure.',
      },
    ],
    sections: [
      {
        heading: 'Buy, customise or build?',
        paragraphs: [
          'Before paying for custom software, check whether an off-the-shelf product covers 80 percent of your needs. Zoho, Tally, Odoo and similar tools are cheaper to start with. Custom software pays off when your process is your advantage, when per-user licences become expensive at your size, or when you need to own the data and the roadmap.',
        ],
      },
      {
        heading: 'Where custom software budgets go wrong',
        bullets: [
          'Requirements that are only in people’s heads. A two-week discovery phase that ends in written user stories saves months later.',
          'Underestimated integrations. Old systems rarely have clean APIs, and data is rarely as tidy as expected.',
          'No budget for change. Set aside 15 to 20 percent for things you learn once real users start working in the system.',
          'Skipping tests. Automated tests cost time up front but stop every new feature from breaking an old one.',
        ],
      },
      {
        heading: 'Pricing models Indian companies offer',
        bullets: [
          'Fixed price per milestone: best when the scope is clear and written down.',
          'Time and material: you pay for hours worked, best for products that will change as you learn.',
          'Dedicated team: a monthly fee for developers who work only on your product, best for long-term builds.',
        ],
      },
    ],
    faqs: [
      {
        q: 'How much does custom software development cost in India?',
        a: 'A small internal tool usually costs ₹2 lakh to ₹6 lakh, a business system such as a CRM or ERP module ₹6 lakh to ₹20 lakh, and a SaaS product’s first version ₹8 lakh to ₹25 lakh. Enterprise platforms often cross ₹1 crore.',
      },
      {
        q: 'What is the hourly rate of software developers in India?',
        a: 'Freelancers typically charge ₹600 to ₹2,500 an hour, small studios ₹1,200 to ₹3,000 and mid-size agencies ₹2,000 to ₹4,200, depending on experience and technology.',
      },
      {
        q: 'Who owns the source code of custom software?',
        a: 'You should. Make sure the contract transfers full intellectual property rights and source code to you on payment, and that code lives in a repository your company controls.',
      },
      {
        q: 'How can I reduce the cost of custom software?',
        a: 'Start with the smallest version that solves the main problem, reuse proven open-source components and cloud services, and write requirements down before development starts.',
      },
    ],
  },
  {
    slug: 'ecommerce-website-cost-calculator',
    title: 'Ecommerce Website Cost Calculator for India',
    metaTitle: 'Ecommerce Website Cost Calculator India',
    description:
      'Estimate what an online store costs in India on Shopify, WooCommerce or custom code, with payments, shipping, COD and GST features priced in rupees.',
    eyebrow: 'Cost calculator',
    intro: [
      'Pick the platform, the features your store needs and who will build it. The calculator shows the build cost Indian ecommerce developers typically quote for that setup.',
      'Platform subscriptions, payment gateway fees and shipping charges are ongoing costs, so the page also lists what to budget every month.',
    ],
    services: ['ecommerce-development', 'web-development', 'digital-marketing'],
    reviewed: '2026-11-18',
    unit: 'project',
    typesLabel: 'Platform and size',
    types: [
      { id: 'woo', label: 'WooCommerce store', hint: 'WordPress, up to a few hundred products', low: 35_000, high: 1_20_000, weeks: [3, 6] },
      { id: 'shopify', label: 'Shopify store', hint: 'Customised theme, up to a few hundred products', low: 40_000, high: 1_20_000, weeks: [3, 6] },
      { id: 'premium', label: 'Custom-designed or headless store', hint: 'Original design, custom storefront', low: 1_50_000, high: 4_00_000, weeks: [8, 14] },
      { id: 'marketplace', label: 'Multi-vendor marketplace', hint: 'Seller onboarding, commissions, payouts', low: 3_00_000, high: 15_00_000, weeks: [14, 28] },
    ],
    addonsLabel: 'Store features',
    addons: [
      { id: 'catalogue', label: 'Product upload (per 500 products)', hint: 'Photos, variants, descriptions', low: 10_000, high: 30_000 },
      { id: 'cod', label: 'COD rules and pincode checks', hint: 'Limit COD by pincode or order value', low: 10_000, high: 35_000 },
      { id: 'shipping', label: 'Shipping integration', hint: 'Shiprocket, Delhivery and similar', low: 10_000, high: 30_000 },
      { id: 'gst', label: 'GST invoices and Tally sync', hint: 'B2B invoices with GSTIN', low: 15_000, high: 50_000 },
      { id: 'filters', label: 'Advanced filters and search', hint: 'Size, colour, price, fast search', low: 20_000, high: 80_000 },
      { id: 'loyalty', label: 'Loyalty points or wallet', hint: 'Rewards, referral credits', low: 30_000, high: 1_00_000 },
      { id: 'international', label: 'International selling', hint: 'Multi-currency, global shipping', low: 20_000, high: 80_000 },
      { id: 'app', label: 'Android and iOS shopping app', hint: 'Connected to the same store', low: 2_00_000, high: 6_00_000 },
    ],
    modifiers: [TEAM, CITY],
    resultNote: 'Not included: platform plans, paid themes and apps, payment gateway fees (often around 2 percent a transaction) and shipping charges.',
    tables: [
      {
        caption: 'Monthly running costs of an online store in India',
        headers: ['Cost', 'Typical amount', 'Notes'],
        rows: [
          ['Shopify plan', 'Monthly or yearly subscription', 'Check Shopify India’s current plans; yearly billing is cheaper'],
          ['WooCommerce hosting', '₹300 to ₹3,000 a month', 'Managed WordPress or a small cloud server'],
          ['Payment gateway', 'Around 2% a transaction', 'Razorpay, PayU, Cashfree; international cards cost more'],
          ['Paid apps and plugins', '₹1,000 to ₹10,000 a month', 'Reviews, upsells, WhatsApp, subscriptions'],
          ['Maintenance', '₹3,000 to ₹20,000 a month', 'Updates, small changes, monitoring'],
        ],
      },
    ],
    sections: [
      {
        heading: 'Shopify, WooCommerce or custom?',
        paragraphs: [
          'Shopify is the quickest to launch and needs the least upkeep, but you pay a monthly plan and app fees. WooCommerce is free software on your own hosting, so it is cheaper to run but needs more care with updates and security.',
          'A custom or headless store makes sense once you have the traffic and catalogue to justify it, or when you need B2B pricing, complex bundles, multiple sellers or very fast pages that a theme cannot deliver.',
        ],
      },
      {
        heading: 'Features Indian shoppers expect',
        bullets: [
          'UPI, cards, net banking and wallets at checkout, plus cash on delivery for many categories.',
          'Delivery date and COD availability by pincode before checkout.',
          'Order updates on WhatsApp and SMS, not only email.',
          'GST-compliant invoices, and a GSTIN field for business buyers.',
          'Easy returns and exchanges, especially for fashion and footwear.',
        ],
      },
    ],
    faqs: [
      {
        q: 'How much does an ecommerce website cost in India?',
        a: 'A Shopify or WooCommerce store typically costs ₹35,000 to ₹1.2 lakh to build, a custom-designed or headless store ₹1.5 lakh to ₹4 lakh, and a multi-vendor marketplace ₹3 lakh to ₹15 lakh or more.',
      },
      {
        q: 'Is Shopify or WooCommerce cheaper in India?',
        a: 'WooCommerce usually costs less to run because there is no platform subscription, but it needs more maintenance. Shopify costs more each month and saves time on hosting, security and updates.',
      },
      {
        q: 'Can I add cash on delivery to my online store?',
        a: 'Yes. Both Shopify and WooCommerce support COD, and shipping partners such as Shiprocket collect the cash for you. Many stores limit COD by pincode or order value to reduce returns.',
      },
      {
        q: 'How long does it take to build an online store?',
        a: 'A Shopify or WooCommerce store takes 3 to 6 weeks, a custom-designed store 2 to 3.5 months and a marketplace 3.5 to 7 months.',
      },
    ],
  },
  {
    slug: 'digital-marketing-cost-calculator',
    title: 'Digital Marketing Cost Calculator for India',
    metaTitle: 'Digital Marketing Cost Calculator India',
    description:
      'Estimate your monthly digital marketing agency fee in India for SEO, Google Ads, Meta ads, social media and content, with ad spend explained.',
    eyebrow: 'Cost calculator',
    intro: [
      'Digital marketing agencies in India charge a monthly retainer for the channels they run. Pick your business size and the channels you want, and the calculator shows the monthly fee range agencies typically quote.',
      'Ad spend, the money paid to Google or Meta for the ads themselves, is separate and shown on your own ad account.',
    ],
    services: ['digital-marketing', 'seo', 'social-media-marketing', 'ppc'],
    reviewed: '2026-11-18',
    unit: 'month',
    typesLabel: 'Size of your business',
    types: [
      { id: 'local', label: 'Local business', hint: 'One city or one location', low: 5_000, high: 10_000, scale: 1 },
      { id: 'growing', label: 'Growing brand', hint: 'Several cities, D2C or B2B lead generation', low: 10_000, high: 25_000, scale: 1.6 },
      { id: 'national', label: 'National brand', hint: 'All-India reach, large catalogue or many locations', low: 25_000, high: 60_000, scale: 2.5 },
    ],
    addonsLabel: 'Channels',
    addons: [
      { id: 'seo', label: 'SEO', hint: 'Technical fixes, content, links, reporting', low: 15_000, high: 50_000 },
      { id: 'gads', label: 'Google Ads management', hint: 'Search, Performance Max, YouTube', low: 10_000, high: 40_000 },
      { id: 'meta', label: 'Meta ads management', hint: 'Facebook and Instagram campaigns', low: 10_000, high: 35_000 },
      { id: 'social', label: 'Social media content', hint: '12 to 15 posts and reels a month', low: 12_000, high: 40_000 },
      { id: 'content', label: 'Blog content', hint: '4 SEO articles a month', low: 6_000, high: 20_000 },
      { id: 'email', label: 'Email and WhatsApp marketing', hint: 'Campaigns and automations', low: 6_000, high: 25_000 },
      { id: 'local', label: 'Google Business Profile and local SEO', hint: 'Posts, reviews, map rankings', low: 5_000, high: 15_000 },
    ],
    modifiers: [TEAM, CITY],
    resultNote:
      'This is the agency fee only. Ad spend is paid to Google or Meta on top, and some agencies charge 10 to 20 percent of ad spend instead of a fixed fee once spend is high.',
    tables: [
      {
        caption: 'Monthly digital marketing fees in India by channel',
        headers: ['Channel', 'Local business', 'Growing brand'],
        rows: [
          ['SEO', '₹15,000 to ₹50,000', '₹24,000 to ₹80,000'],
          ['Google Ads management', '₹10,000 to ₹40,000', '₹16,000 to ₹64,000'],
          ['Meta ads management', '₹10,000 to ₹35,000', '₹16,000 to ₹56,000'],
          ['Social media content', '₹12,000 to ₹40,000', '₹19,200 to ₹64,000'],
        ],
        note: 'Agency fee per month, excluding ad spend and GST. The growing brand column applies the calculator’s 1.6 scale factor for more locations, products and campaigns.',
      },
    ],
    sections: [
      {
        heading: 'How much ad spend do you need?',
        paragraphs: [
          'There is no fixed minimum, but campaigns need enough budget to learn. Many local businesses start Google Search ads at ₹15,000 to ₹30,000 a month and Meta ads at ₹10,000 to ₹25,000. Spend less than that and the agency fee can be larger than the ads themselves.',
          'Always keep the ad accounts in your company’s name and give the agency access, so you keep your data and history if you change agencies.',
        ],
      },
      {
        heading: 'What a fair retainer includes',
        bullets: [
          'A written plan for the first three months, with targets you both agree on.',
          'A monthly report on leads, sales or calls, not only clicks and impressions.',
          'A named account manager and a regular review call.',
          'Clear ownership: ad accounts, analytics, social pages and content stay yours.',
        ],
      },
      {
        heading: 'Warning signs in a marketing proposal',
        bullets: [
          'Guaranteed first-page rankings or a fixed number of leads before they have seen your account.',
          'Long lock-in contracts with no exit clause.',
          'Reports that only show vanity numbers such as likes and impressions.',
        ],
      },
    ],
    faqs: [
      {
        q: 'How much does a digital marketing agency charge per month in India?',
        a: 'Small businesses usually pay ₹15,000 to ₹60,000 a month for one or two channels. Growing brands running SEO, ads and social together often pay ₹70,000 to ₹2.3 lakh a month, excluding ad spend.',
      },
      {
        q: 'What is the cost of SEO services in India?',
        a: 'Monthly SEO retainers typically run from ₹15,000 to ₹50,000 for a local business and more for national or ecommerce sites with thousands of pages.',
      },
      {
        q: 'Is ad spend included in the agency fee?',
        a: 'No. Ad spend is paid directly to Google or Meta. The agency fee pays for planning, creatives, setup, optimisation and reporting.',
      },
      {
        q: 'How long before digital marketing shows results?',
        a: 'Paid ads can bring leads within days. SEO usually takes three to six months to show steady growth, and longer in competitive industries.',
      },
    ],
  },
];

export function getCalculator(slug: string): CalculatorPage | undefined {
  return CALCULATORS.find((page) => page.slug === slug);
}
