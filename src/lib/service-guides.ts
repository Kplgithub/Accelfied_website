/**
 * Hiring advice shown on service and location pages ("How to choose a web development company in Jaipur").
 * Written by hand for the services people search for most; every other service falls back to the advice
 * for its group. No prices or ratings here: those come only from real listings and reviews.
 */

export interface ServiceGuide {
  /** Two or three sentences on what the service covers and the first decision a buyer faces. */
  lead: (where: string, service: string) => string;
  /** Things to check before signing, written as plain advice. */
  checks: string[];
  /** A cost calculator for this kind of work, when we have one. */
  cost?: { href: string; label: string };
}

const WEBSITE_COST = { href: '/tools/website-cost-calculator', label: 'Work out a rough website budget' };

const SERVICES: Record<string, ServiceGuide> = {
  'web-development': {
    lead: (where) =>
      `A good web development company in ${where} should be able to show you live sites it has built, not just screenshots. Most projects fall into one of three kinds: a business website on WordPress or a headless CMS, a portal with logins and dashboards, or a custom web app on a stack like React, Next.js, Node.js or Laravel. Knowing which kind you need before the first call saves a week of back and forth.`,
    checks: [
      'Open three of their live sites on your phone. A slow page or a broken mobile layout tells you more than any pitch deck.',
      'Ask who will write the code. Some firms pass work to freelancers, which is not always bad, but you should know.',
      'Make sure the domain, hosting and admin logins are registered in your name, not the agency’s.',
      'Agree in writing what “done” means: pages, forms, speed, basic SEO set-up and how many rounds of changes.',
      'Check whether the quote includes GST and at least a few months of bug fixes after launch.',
    ],
    cost: WEBSITE_COST,
  },
  'mobile-app-development': {
    lead: (where) =>
      `Building an app with a company in ${where} usually starts with one choice: separate native apps for Android and iOS, or one shared codebase in Flutter or React Native. In India, where most of your users will be on Android, a cross-platform first version is often the sensible start. Ask every company on your shortlist which way they would go for your idea, and why. A straight answer is a good sign.`,
    checks: [
      'Download two apps they have built from the Play Store or App Store and read what real users say about them.',
      'The developer accounts on Google Play and the App Store should be opened in your company’s name.',
      'Confirm the backend, admin panel and APIs are part of the quote, not only the app screens.',
      'Mention UPI or Razorpay payments, OTP login and push notifications early. Each one changes the effort.',
      'Ask how they handle updates when a new Android or iOS version breaks something.',
    ],
    cost: { href: '/tools/app-development-cost-calculator', label: 'Estimate your app budget' },
  },
  'custom-software-development': {
    lead: (where) =>
      `Custom software makes sense when ready-made tools stop fitting the way your business runs: an ERP shaped around your workflow, a CRM for how your sales team actually sells, or a portal that ties vendors, stock and billing together. Software companies in ${where} work in very different ways, from small teams that ship a lean first version in weeks to larger firms with formal project managers. Pick the style that fits the size of your problem.`,
    checks: [
      'Ask for a short, paid discovery phase before a fixed quote. Firms that skip it are often guessing.',
      'Your contract should say that the source code, database and documents belong to you.',
      'Meet the project manager and lead developer who will do the work, not only the sales contact.',
      'If you need GST billing, Tally or Zoho links, or data kept in India, raise it in the first meeting.',
      'Agree on support after go-live, with response times in writing.',
    ],
    cost: { href: '/tools/software-development-cost-calculator', label: 'Estimate your software budget' },
  },
  'ecommerce-development': {
    lead: (where) =>
      `An ecommerce company in ${where} can build your store on Shopify, WooCommerce or a custom platform. For most Indian sellers the hard parts are not the product pages: they are cash on delivery, payment gateways, GST invoices, shipping partners and returns. Ask early how each of these will work on your store.`,
    checks: [
      'Ask to place a test order on a store they built, from payment to the confirmation message.',
      'Check that Razorpay, PhonePe, Paytm or another gateway you prefer is supported, along with COD.',
      'Ask how orders reach your courier partner and how stock stays in sync if you also sell on marketplaces.',
      'Keep the store account, domain and payment gateway in your own name.',
      'Agree on training for your team so you can add products and offers without calling the agency.',
    ],
    cost: { href: '/tools/ecommerce-website-cost-calculator', label: 'Estimate your online store budget' },
  },
  'web-design': {
    lead: (where) =>
      `Web design decides how your site looks and feels before any code is written: layout, colours, type, images and the path a visitor takes from the home page to your enquiry form. Many web design companies in ${where} also build the site, while some only design and hand the files to developers. Ask which kind you are talking to.`,
    checks: [
      'Look at their portfolio on a phone first. Most of your visitors will arrive there.',
      'Ask for the designs in Figma and make sure the source files are handed over to you.',
      'If your buyers read Hindi or a regional language, check they have designed for it before.',
      'Agree on the number of first concepts and revision rounds before work starts.',
      'Ask how they keep a design fast. Heavy images and sliders slow a site down.',
    ],
    cost: WEBSITE_COST,
  },
  'ux-ui-design': {
    lead: (where) =>
      `UX and UI work starts with how people use your product and ends with screens they find easy. A strong design team in ${where} will want to talk to your users, look at your data and test early sketches before polishing pixels. If a firm jumps straight to colours and mock-ups, ask what research it plans to do.`,
    checks: [
      'Ask for a case study that shows the problem, the research and what changed after launch.',
      'Check that they deliver a design system or component library your developers can reuse.',
      'Ask how they test designs with real users, and how many people they usually test with.',
      'Make sure all Figma files and research notes are handed over to you.',
    ],
  },
  'digital-marketing': {
    lead: (where) =>
      `A digital marketing agency in ${where} may run your Google Ads, Meta campaigns, SEO, social pages and email, or only some of these. Before you compare quotes, decide what you are paying for: leads, sales, app installs or reach. Agencies that ask about your margins and sales cycle in the first meeting usually understand that ad spend is a cost, not a goal.`,
    checks: [
      'Ask for results from a client in a business like yours, with numbers they are allowed to share.',
      'Keep ownership of your ad accounts, Google Analytics and Search Console. Add the agency as a user.',
      'The quote should show the agency fee and the ad budget separately, and say where GST applies.',
      'Agree on a monthly report that shows cost per lead or sale, not only clicks and impressions.',
      'Avoid long lock-in contracts until the first three months have shown progress.',
    ],
    cost: { href: '/tools/digital-marketing-cost-calculator', label: 'Estimate your monthly marketing budget' },
  },
  seo: {
    lead: (where) =>
      `SEO is slow work, and an honest SEO company in ${where} will say so upfront. For competitive search terms, steady movement often takes three to six months. The work has three parts: technical fixes on your site, content that answers what your buyers search for, and links from other trusted sites. If someone promises first-page rankings in a few weeks, keep looking.`,
    checks: [
      'Ask for a short audit of your site first. It shows how they think before you commit.',
      'Ask which keywords they would target and why. City and “near me” searches often bring the best enquiries.',
      'They should work inside your own Search Console and Analytics, and share access with you.',
      'Ask how they get links. Bought link packages can get a site penalised by Google.',
      'Content written for you should be original, and you should own it.',
    ],
  },
  'social-media-marketing': {
    lead: (where) =>
      `Social media agencies in ${where} range from teams that only post and design creatives to full studios that shoot reels, manage influencers and run paid campaigns. Decide which platforms matter for your buyers first. A B2B firm may only need LinkedIn, while a café or clothing brand will live on Instagram.`,
    checks: [
      'Look at pages they manage today, not only their own page.',
      'Ask who shoots and edits video, and whether that is part of the monthly fee.',
      'Agree on how many posts, reels and stories you get each month, and who approves them.',
      'Keep admin access to every account in your own name.',
    ],
  },
};

/** Advice for every other service, by service group. */
const GROUPS: Record<string, ServiceGuide> = {
  development: {
    lead: (where, service) =>
      `When you hire for ${service} in ${where}, the best signal is work that is already live and in use. Ask each company on your shortlist to walk you through a similar project: what the client asked for, what went wrong and how they fixed it. You will learn more from that conversation than from any brochure.`,
    checks: [
      'Ask to see or try a live project similar to yours.',
      'Your contract should say that the code and data belong to you.',
      'Meet the people who will do the work, not only the sales contact.',
      'Agree on testing, launch and support after go-live before you sign.',
    ],
    cost: { href: '/tools/software-development-cost-calculator', label: 'Estimate your software budget' },
  },
  'design-production': {
    lead: (where, service) =>
      `Good ${service} is easy to judge: look at the work. Studios in ${where} differ in style, so shortlist the ones whose past projects already feel close to what you want, then ask how they would approach your brief.`,
    checks: [
      'Ask for three pieces of work that are close to your brief.',
      'Agree on the number of first concepts and revision rounds.',
      'Make sure the final source files are handed over to you.',
      'Check who owns the rights to photos, fonts and music used in the work.',
    ],
  },
  marketing: {
    lead: (where, service) =>
      `A ${service} partner in ${where} should talk about results you can measure, such as enquiries, sales or sign-ups, not only likes and impressions. Ask how they would measure success for you in the first ninety days.`,
    checks: [
      'Ask for results from a client like you, with numbers they can share.',
      'Keep every account and login in your own name.',
      'Agree on what the monthly report will show.',
      'Avoid long lock-in contracts at the start.',
    ],
    cost: { href: '/tools/digital-marketing-cost-calculator', label: 'Estimate your monthly marketing budget' },
  },
  advertising: {
    lead: (where, service) =>
      `For ${service} in ${where}, ask each agency to show campaigns it ran for brands of your size, and what those campaigns achieved. Big-brand work looks good in a deck, but it may not tell you how they will treat a smaller budget.`,
    checks: [
      'Ask for campaigns run for brands of a similar size.',
      'Get the creative fee and the media spend quoted separately.',
      'Agree on how results will be tracked and reported.',
      'Check who owns the final creatives.',
    ],
  },
  'business-services': {
    lead: (where, service) =>
      `Choosing a ${service} firm in ${where} is mostly about reliability. Ask how they handle your work on a busy month, who your day-to-day contact will be and what happens when that person is away.`,
    checks: [
      'Ask for references from clients who have stayed with them for over a year.',
      'Agree on turnaround times and quality checks in writing.',
      'Check how they protect your data and documents.',
      'Make sure GST invoicing and payment terms are clear from day one.',
    ],
  },
  'it-services': {
    lead: (where, service) =>
      `For ${service} in ${where}, look for a team that explains things clearly and puts response times in writing. When something breaks at 9 PM on a Friday, the contract matters more than the pitch.`,
    checks: [
      'Ask for a written service level: response and fix times, and support hours in IST.',
      'Check which certifications their engineers hold for the tools you use.',
      'Make sure every admin password and account stays in your name.',
      'Ask how they report on the work done each month.',
    ],
  },
};

const DEFAULT_GUIDE: ServiceGuide = GROUPS['business-services'];

export function serviceGuide(serviceSlug: string, groupSlug: string): ServiceGuide {
  return SERVICES[serviceSlug] ?? GROUPS[groupSlug] ?? DEFAULT_GUIDE;
}
