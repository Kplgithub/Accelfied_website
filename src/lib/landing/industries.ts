import type { IndustryPage } from './types';

/**
 * Industry pages. `industry` must match a value companies choose on their profile, so the page can list
 * the real companies on Accelfied that work in that industry.
 */
export const INDUSTRY_PAGES: IndustryPage[] = [
  {
    slug: 'healthcare-software-development',
    industry: 'Healthcare & medical',
    short: 'healthcare',
    title: 'Healthcare Software Development Companies in India',
    metaTitle: 'Healthcare Software Development Companies in India',
    description:
      'Find healthcare software and app developers in India. What they build, ABDM and DPDP rules to plan for, real cost ranges and questions to ask.',
    eyebrow: 'Industry',
    intro: [
      'Hospitals, clinics, diagnostic labs, pharmacies and health startups in India need software that is easy for patients, fast for doctors and careful with medical data. A developer who has worked in healthcare already knows the rules, the integrations and the mistakes to avoid.',
      'Below are companies on Accelfied that list healthcare among the industries they serve, followed by a buyer’s guide to costs, compliance and choosing a partner.',
    ],
    services: ['custom-software-development', 'mobile-app-development', 'web-development'],
    reviewed: '2026-11-18',
    builds: [
      { title: 'Hospital and clinic management', text: 'OPD and IPD workflows, appointments, billing, pharmacy and bed management in one system.' },
      { title: 'Telemedicine apps', text: 'Video consultations, e-prescriptions, payments and follow-up reminders for doctors and patients.' },
      { title: 'Lab and diagnostics software', text: 'Sample tracking, report generation, home collection booking and report delivery on WhatsApp.' },
      { title: 'Electronic health records', text: 'Patient histories that doctors can search quickly, built on standards such as HL7 FHIR.' },
      { title: 'Pharmacy and medicine delivery', text: 'Prescription upload, inventory, substitutes and delivery tracking.' },
      { title: 'Fitness and wellness apps', text: 'Programmes, trackers, wearables integration and subscriptions.' },
    ],
    compliance: {
      heading: 'Rules a healthcare product in India must plan for',
      bullets: [
        'Digital Personal Data Protection Act, 2023 and its Rules: health data needs clear consent, purpose limits, security safeguards and breach reporting.',
        'Ayushman Bharat Digital Mission (ABDM): linking ABHA health IDs and registering with the Health Facility and Healthcare Professionals registries if you want to share records in the national network. ABDM uses HL7 FHIR.',
        'Telemedicine Practice Guidelines (2020): rules for how registered doctors consult, identify patients and prescribe online.',
        'If you serve US patients or clients, HIPAA applies to how health information is stored, accessed and shared.',
      ],
    },
    costs: {
      caption: 'Typical cost of healthcare software in India',
      headers: ['Product', 'Typical price', 'Timeline'],
      rows: [
        ['Clinic website with appointment booking', '₹40,000 to ₹1,50,000', '3 to 6 weeks'],
        ['Telemedicine app (Android and iOS)', '₹6,00,000 to ₹20,00,000', '4 to 7 months'],
        ['Lab or diagnostics management system', '₹4,00,000 to ₹15,00,000', '3 to 6 months'],
        ['Hospital management system (custom)', '₹15,00,000 to ₹60,00,000+', '6 to 12 months'],
      ],
      note: 'Small studio and mid-size agency quotes in India, November 2026. Compliance work, integrations and security testing move a project to the top of the range.',
    },
    sections: [
      {
        heading: 'Build custom or customise a ready product?',
        paragraphs: [
          'Clinics and small hospitals can often start with an established hospital or clinic management product and customise it. Custom development makes sense when your workflow is unusual, when you are building a product to sell, or when you need deep integrations with labs, insurers or devices.',
        ],
      },
    ],
    questions: [
      'Which healthcare products have you built, and can I speak to one of those clients?',
      'How do you handle consent, encryption and access logs for patient data?',
      'Have you integrated with ABDM, and do you work with HL7 FHIR?',
      'Where will the data be hosted, and who in your team can access production data?',
      'Will you run a security test (VAPT) before launch?',
    ],
    faqs: [
      {
        q: 'How much does a telemedicine app cost in India?',
        a: 'A telemedicine app for Android and iOS with video consultations, payments, e-prescriptions and an admin panel typically costs ₹6 lakh to ₹20 lakh and takes four to seven months.',
      },
      {
        q: 'Do healthcare apps in India need ABDM integration?',
        a: 'It is not mandatory for every app, but ABDM integration lets patients link and share records through their ABHA ID, and many hospitals and government schemes now expect it.',
      },
      {
        q: 'Does the DPDP Act apply to health apps?',
        a: 'Yes. Any app that processes personal data of people in India must follow the Digital Personal Data Protection Act, 2023, and health data needs particular care with consent and security.',
      },
    ],
  },
  {
    slug: 'fintech-software-development',
    industry: 'Financial services',
    short: 'fintech',
    title: 'Fintech Software Development Companies in India',
    metaTitle: 'Fintech Software Development Companies in India',
    description:
      'Fintech app and software developers in India: payments, lending, wealth and insurance products, RBI and SEBI rules to plan for, costs and questions.',
    eyebrow: 'Industry',
    intro: [
      'Payments, lending, investing and insurance products in India run on UPI, Account Aggregator, video KYC and strict RBI and SEBI rules. Building them well takes a team that understands both the technology and the regulation.',
      'Below are companies on Accelfied that list financial services among the industries they serve, followed by what to plan for when you hire one.',
    ],
    services: ['custom-software-development', 'mobile-app-development', 'cybersecurity'],
    reviewed: '2026-11-18',
    builds: [
      { title: 'Payments and wallets', text: 'UPI collections, payment links, payouts and merchant dashboards.' },
      { title: 'Lending platforms', text: 'Loan origination, underwriting rules, e-sign, e-mandate and collections.' },
      { title: 'Wealth and investing apps', text: 'Mutual funds, stocks, portfolio tracking and advisory tools.' },
      { title: 'Insurance platforms', text: 'Quote comparison, policy issuance, claims tracking and agent apps.' },
      { title: 'Neo-banking and expense tools', text: 'Business accounts, corporate cards, expense management on partner bank rails.' },
      { title: 'Back-office systems', text: 'Reconciliation, reporting, fraud monitoring and compliance dashboards.' },
    ],
    compliance: {
      heading: 'Rules a fintech product in India must plan for',
      bullets: [
        'RBI storage of payment system data (2018): payment data must be stored only in India.',
        'RBI guidelines on payment aggregators and gateways: governance, merchant onboarding and security baselines for anyone handling merchant funds.',
        'RBI Digital Lending Guidelines (2022): loans must be disbursed and repaid between the borrower’s and the regulated lender’s accounts, with a key fact statement shown to the borrower.',
        'KYC rules: Aadhaar e-KYC, video KYC and CKYC must follow RBI’s Master Direction on KYC.',
        'PCI DSS if you store, process or transmit card data, and SEBI’s cybersecurity framework if you build for brokers or other SEBI-regulated entities.',
        'Digital Personal Data Protection Act, 2023 for all personal data.',
      ],
    },
    costs: {
      caption: 'Typical cost of fintech software in India',
      headers: ['Product', 'Typical price', 'Timeline'],
      rows: [
        ['Loan or insurance lead and application portal', '₹3,00,000 to ₹10,00,000', '2 to 4 months'],
        ['Payments or wallet app (on a licensed partner)', '₹10,00,000 to ₹35,00,000', '4 to 8 months'],
        ['Lending platform (origination to collections)', '₹15,00,000 to ₹50,00,000', '5 to 9 months'],
        ['Investment or trading app', '₹20,00,000 to ₹80,00,000+', '6 to 12 months'],
      ],
      note: 'Small studio and mid-size agency quotes in India, November 2026. Excludes licences, partner bank or API fees and security audits by certified auditors.',
    },
    sections: [
      {
        heading: 'Partner, license or build?',
        paragraphs: [
          'Most fintech startups do not hold their own licence at first. They build on a regulated partner: a bank, an NBFC, a payment aggregator or a broker, using their APIs. Your development partner should have integrated with such providers before, because their sandbox, certification and go-live steps take weeks of the timeline.',
        ],
      },
    ],
    questions: [
      'Which banks, payment aggregators or NBFC APIs have you integrated with?',
      'How do you store and encrypt financial and KYC data, and is it hosted in India?',
      'Have your past fintech products passed a security audit or a partner bank’s review?',
      'How do you handle audit logs, maker-checker approvals and access control?',
    ],
    faqs: [
      {
        q: 'How much does it cost to build a fintech app in India?',
        a: 'A lending or insurance application portal often costs ₹3 lakh to ₹10 lakh. A full payments, lending or investment app usually costs ₹10 lakh to ₹80 lakh depending on features, partners and compliance.',
      },
      {
        q: 'Does fintech data have to be stored in India?',
        a: 'Payment system data must be stored only in India under RBI’s 2018 directive. Other regulators and partner banks often require Indian hosting for financial and KYC data as well.',
      },
      {
        q: 'Do I need an RBI licence to launch a fintech app?',
        a: 'Not always. Many fintech apps work with a licensed bank, NBFC or payment aggregator. Whether you need your own licence depends on whether you hold customer funds or lend from your own books.',
      },
    ],
  },
  {
    slug: 'retail-ecommerce-software-development',
    industry: 'Retail',
    short: 'retail',
    title: 'Retail and D2C Ecommerce Developers in India',
    metaTitle: 'Retail and D2C Ecommerce Developers in India',
    description:
      'Retail and D2C ecommerce developers in India: stores, apps, POS and inventory systems, e-commerce rules to follow, real costs and how to choose.',
    eyebrow: 'Industry',
    intro: [
      'Indian retail now runs on several channels at once: a website, marketplaces, Instagram, WhatsApp and physical stores. Retail brands need developers who can keep stock, orders and customers in sync across all of them.',
      'Below are companies on Accelfied that list retail among the industries they serve, then a guide to what retail software costs and the rules online sellers must follow.',
    ],
    services: ['ecommerce-development', 'web-development', 'mobile-app-development'],
    reviewed: '2026-11-18',
    builds: [
      { title: 'D2C online stores', text: 'Shopify, WooCommerce or custom stores with UPI, COD and fast checkout.' },
      { title: 'Shopping apps', text: 'Android and iOS apps with wishlists, offers and push notifications.' },
      { title: 'Inventory and order management', text: 'One stock count across the website, marketplaces and shops.' },
      { title: 'POS and store systems', text: 'Billing, GST invoices, loyalty and returns at the counter.' },
      { title: 'B2B ordering portals', text: 'Dealer and distributor ordering with their own price lists and credit limits.' },
      { title: 'WhatsApp commerce', text: 'Catalogue, cart and order updates inside WhatsApp.' },
    ],
    compliance: {
      heading: 'Rules an online retailer in India must follow',
      bullets: [
        'Consumer Protection (E-Commerce) Rules, 2020: show seller details, return, refund and exchange policies, and a grievance officer’s contact; no fake reviews or hidden charges.',
        'Legal Metrology (Packaged Commodities) Rules: product pages must show MRP, net quantity, country of origin and manufacturer details.',
        'GST: tax invoices for every sale, and e-invoicing with an IRN for B2B invoices once turnover crosses the government’s threshold.',
        'Digital Personal Data Protection Act, 2023 for customer data, and consent for marketing messages on SMS, email and WhatsApp.',
      ],
    },
    costs: {
      caption: 'Typical cost of retail software in India',
      headers: ['Product', 'Typical price', 'Timeline'],
      rows: [
        ['Shopify or WooCommerce D2C store', '₹40,000 to ₹2,50,000', '3 to 8 weeks'],
        ['Shopping app (Android and iOS)', '₹2,00,000 to ₹8,00,000', '2 to 4 months'],
        ['Inventory and order management system', '₹3,00,000 to ₹12,00,000', '2 to 5 months'],
        ['Custom multi-store or B2B commerce platform', '₹8,00,000 to ₹30,00,000', '4 to 8 months'],
      ],
      note: 'Small studio and mid-size agency quotes in India, November 2026, excluding platform plans, apps and payment gateway fees.',
    },
    sections: [
      {
        heading: 'Start with the channel that sells',
        paragraphs: [
          'Most D2C brands should launch on Shopify or WooCommerce, prove demand and only then invest in an app or a custom platform. An app pays off when you have repeat buyers who order often; a custom platform pays off when your catalogue, pricing or B2B rules outgrow what a theme can do.',
        ],
      },
    ],
    questions: [
      'Which Indian payment, shipping and marketplace integrations have you built?',
      'How will stock stay in sync between the website, marketplaces and stores?',
      'What page speed scores do your recent stores reach on mobile?',
      'Who maintains the store after launch, and what does it cost each month?',
    ],
    faqs: [
      {
        q: 'How much does a D2C website cost in India?',
        a: 'A D2C store on Shopify or WooCommerce usually costs ₹40,000 to ₹2.5 lakh to build, depending on design, number of products and integrations such as COD rules, shipping and GST invoicing.',
      },
      {
        q: 'Do I need an app for my online store?',
        a: 'Not at launch. A fast mobile website covers most shoppers. An app becomes worth it when you have loyal customers who buy often and respond to push notifications.',
      },
      {
        q: 'What details must an Indian online store show?',
        a: 'Seller name and address, return and refund policy, grievance officer contact, and for packaged goods the MRP, net quantity, country of origin and manufacturer details.',
      },
    ],
  },
  {
    slug: 'education-software-development',
    industry: 'Education',
    short: 'education',
    title: 'Education and EdTech Software Developers in India',
    metaTitle: 'EdTech and Education Software Developers in India',
    description:
      'EdTech and education software developers in India: learning apps, LMS and school ERP, rules for children’s data, real costs and how to hire well.',
    eyebrow: 'Industry',
    intro: [
      'Schools, colleges, coaching institutes and EdTech startups in India need software that works on low-cost phones and patchy internet, handles thousands of students at exam time and keeps children’s data safe.',
      'Below are companies on Accelfied that list education among the industries they serve, then a guide to costs, rules and choosing a developer.',
    ],
    services: ['mobile-app-development', 'custom-software-development', 'web-development'],
    reviewed: '2026-11-18',
    builds: [
      { title: 'Learning apps', text: 'Recorded and live classes, notes, quizzes and doubt solving.' },
      { title: 'Learning management systems', text: 'Courses, assignments, grading and certificates for institutes and companies.' },
      { title: 'School and college ERP', text: 'Admissions, fees, attendance, timetables, results and parent communication.' },
      { title: 'Online test platforms', text: 'Mock tests, timed exams, proctoring and performance analysis.' },
      { title: 'Coaching institute apps', text: 'Batches, fee reminders, video lectures and test series under the institute’s brand.' },
    ],
    compliance: {
      heading: 'Rules an education product in India must plan for',
      bullets: [
        'Digital Personal Data Protection Act, 2023: children’s data (under 18) needs verifiable consent from a parent, and tracking, behavioural monitoring and targeted ads directed at children are not allowed.',
        'UGC regulations on online and open and distance learning if you deliver degree programmes online with a university.',
        'Accessibility: design for screen readers and low vision in line with the Rights of Persons with Disabilities Act, 2016 and WCAG guidelines.',
      ],
    },
    costs: {
      caption: 'Typical cost of education software in India',
      headers: ['Product', 'Typical price', 'Timeline'],
      rows: [
        ['Coaching institute app (white-label base, customised)', '₹1,00,000 to ₹4,00,000', '4 to 8 weeks'],
        ['School ERP (custom)', '₹4,00,000 to ₹15,00,000', '3 to 6 months'],
        ['Learning management system (custom)', '₹5,00,000 to ₹20,00,000', '3 to 6 months'],
        ['EdTech app with live classes and tests', '₹10,00,000 to ₹40,00,000', '4 to 9 months'],
      ],
      note: 'Small studio and mid-size agency quotes in India, November 2026. Video hosting and live-class platforms are billed separately by usage.',
    },
    sections: [
      {
        heading: 'Design for the devices students actually use',
        paragraphs: [
          'A large share of Indian students learn on entry-level Android phones with limited storage and data. Ask developers how they keep the app small, cache lessons for offline viewing, compress video and handle exam-day traffic spikes.',
        ],
      },
    ],
    questions: [
      'Have you built learning or school software that handled exam-day traffic? How many users at once?',
      'How do you collect parental consent and protect children’s data?',
      'How does the app perform on entry-level Android phones and slow networks?',
      'Which video, live-class and payment providers have you integrated?',
    ],
    faqs: [
      {
        q: 'How much does an EdTech app cost in India?',
        a: 'A customised coaching institute app can cost ₹1 lakh to ₹4 lakh. A full EdTech app with live classes, tests and payments usually costs ₹10 lakh to ₹40 lakh.',
      },
      {
        q: 'Does the DPDP Act affect apps for school students?',
        a: 'Yes. For users under 18, the Act requires verifiable parental consent and bars tracking, behavioural monitoring and targeted advertising aimed at children.',
      },
      {
        q: 'Should a school buy an ERP or build one?',
        a: 'Most schools are better served by an established school ERP. Custom development makes sense for school groups with unusual processes, or for companies building an ERP to sell.',
      },
    ],
  },
  {
    slug: 'real-estate-software-development',
    industry: 'Real estate',
    short: 'real estate',
    title: 'Real Estate Software and App Developers in India',
    metaTitle: 'Real Estate Software and App Developers in India',
    description:
      'Real estate software developers in India: property portals, builder CRMs and broker apps, RERA and messaging rules, real costs and questions to ask.',
    eyebrow: 'Industry',
    intro: [
      'Builders, brokers and property platforms in India win or lose deals on lead speed: how fast an enquiry reaches a salesperson and how well it is followed up. The right software captures every lead, shows projects well and keeps buyers informed after booking.',
      'Below are companies on Accelfied that list real estate among the industries they serve, then a guide to costs, rules and choosing a developer.',
    ],
    services: ['web-development', 'custom-software-development', 'digital-marketing'],
    reviewed: '2026-11-18',
    builds: [
      { title: 'Project and builder websites', text: 'Project pages with floor plans, price lists, virtual tours and enquiry forms.' },
      { title: 'Real estate CRM', text: 'Lead capture from portals and ads, site visit scheduling, follow-ups and booking.' },
      { title: 'Property portals', text: 'Listings, search filters, owner and broker accounts, paid promotions.' },
      { title: 'Customer apps after booking', text: 'Payment schedules, construction updates, documents and possession tracking.' },
      { title: 'Rental and property management', text: 'Tenants, rent collection, maintenance requests and agreements.' },
    ],
    compliance: {
      heading: 'Rules real estate software in India must respect',
      bullets: [
        'RERA: advertisements and project pages for registered projects must show the RERA registration number and the state RERA website address.',
        'Telecom Commercial Communications Customer Preference Regulations (TRAI): promotional SMS must go through DLT-registered headers and templates, and respect the Do Not Disturb registry.',
        'WhatsApp Business policy: buyers must opt in before you send them messages.',
        'Digital Personal Data Protection Act, 2023 for leads and buyer documents, including clear consent on enquiry forms.',
      ],
    },
    costs: {
      caption: 'Typical cost of real estate software in India',
      headers: ['Product', 'Typical price', 'Timeline'],
      rows: [
        ['Project website with enquiry forms', '₹40,000 to ₹2,00,000', '3 to 6 weeks'],
        ['Real estate CRM (custom)', '₹4,00,000 to ₹15,00,000', '3 to 5 months'],
        ['Customer app for bookings and updates', '₹4,00,000 to ₹12,00,000', '3 to 5 months'],
        ['Property listing portal', '₹8,00,000 to ₹30,00,000', '4 to 8 months'],
      ],
      note: 'Small studio and mid-size agency quotes in India, November 2026. 3D tours, map APIs and SMS or WhatsApp messages are billed separately.',
    },
    sections: [
      {
        heading: 'Where real estate software pays back fastest',
        paragraphs: [
          'For builders and brokers, the quickest return usually comes from routing every lead from property portals, Google and Meta ads into one CRM within minutes, with automatic follow-ups. A beautiful website helps, but a lead that waits a day for a call is often lost.',
        ],
      },
    ],
    questions: [
      'Which property portals and ad platforms can your CRM pull leads from?',
      'How do you handle DLT registration for SMS and opt-in for WhatsApp?',
      'Can buyers see payment schedules and construction updates in one place?',
      'How will project pages show RERA details and stay fast on mobile?',
    ],
    faqs: [
      {
        q: 'How much does a real estate CRM cost in India?',
        a: 'A custom real estate CRM usually costs ₹4 lakh to ₹15 lakh. Many brokers start with a ready CRM subscription and move to custom software once their process or volume outgrows it.',
      },
      {
        q: 'Must a builder’s website show the RERA number?',
        a: 'Yes. Advertisements for RERA-registered projects, including websites and ads, must show the registration number and the state RERA website address.',
      },
      {
        q: 'What does a property portal cost to build?',
        a: 'A property portal with listings, search, owner and broker accounts and paid promotions typically costs ₹8 lakh to ₹30 lakh in India.',
      },
    ],
  },
  {
    slug: 'logistics-software-development',
    industry: 'Supply chain, logistics & transport',
    short: 'logistics',
    title: 'Logistics and Transport Software Developers in India',
    metaTitle: 'Logistics Software Developers in India',
    description:
      'Logistics and transport software developers in India: TMS, WMS, fleet tracking and delivery apps, e-way bill and ULIP integrations, costs and tips.',
    eyebrow: 'Industry',
    intro: [
      'Transporters, warehouses, couriers and delivery businesses in India run on tight margins. Software that cuts empty kilometres, speeds up proof of delivery and automates e-way bills pays for itself quickly.',
      'Below are companies on Accelfied that list logistics and transport among the industries they serve, then a guide to costs, integrations and choosing a developer.',
    ],
    services: ['custom-software-development', 'mobile-app-development', 'iot-development'],
    reviewed: '2026-11-18',
    builds: [
      { title: 'Transport management systems', text: 'Orders, trip planning, vehicle assignment, freight billing and settlements.' },
      { title: 'Warehouse management systems', text: 'Inward, putaway, picking, packing and stock accuracy with barcodes.' },
      { title: 'Fleet tracking', text: 'GPS tracking, geofences, fuel and driver behaviour reports.' },
      { title: 'Delivery and driver apps', text: 'Routes, proof of delivery with photos and OTP, COD collection.' },
      { title: 'Customer tracking portals', text: 'Shipment status, documents and invoices for your clients.' },
    ],
    compliance: {
      heading: 'Integrations and rules logistics software in India should support',
      bullets: [
        'GST e-way bills: generation and updates through the e-way bill system for consignments above the value threshold.',
        'Unified Logistics Interface Platform (ULIP) under the National Logistics Policy, 2022: APIs for vehicle, driver, FASTag and other government data.',
        'Vehicle tracking rules: AIS-140 compliant tracking devices for public service and many commercial vehicles.',
        'Digital Personal Data Protection Act, 2023 for driver and customer data, including location history.',
      ],
    },
    costs: {
      caption: 'Typical cost of logistics software in India',
      headers: ['Product', 'Typical price', 'Timeline'],
      rows: [
        ['Delivery or driver app with admin panel', '₹3,00,000 to ₹10,00,000', '2 to 4 months'],
        ['Fleet tracking platform (devices extra)', '₹4,00,000 to ₹12,00,000', '3 to 5 months'],
        ['Transport management system (custom)', '₹8,00,000 to ₹25,00,000', '4 to 7 months'],
        ['Warehouse management system (custom)', '₹10,00,000 to ₹35,00,000', '4 to 8 months'],
      ],
      note: 'Small studio and mid-size agency quotes in India, November 2026. GPS devices, map APIs and SMS are billed separately.',
    },
    sections: [
      {
        heading: 'Plan for the field, not the office',
        paragraphs: [
          'Driver and warehouse apps are used in trucks, docks and godowns, often with weak signal and gloves on. Ask developers how the app works offline, how large the buttons are, whether it supports Hindi and regional languages, and how it handles barcode scanning on low-cost devices.',
        ],
      },
    ],
    questions: [
      'Have you integrated with the e-way bill system, ULIP or FASTag data?',
      'How does the driver app work without network coverage?',
      'Which GPS devices and map providers have you worked with, and what do the APIs cost at our volume?',
      'Can the system connect to our ERP or accounting software for freight billing?',
    ],
    faqs: [
      {
        q: 'How much does transport management software cost in India?',
        a: 'A custom transport management system usually costs ₹8 lakh to ₹25 lakh and takes four to seven months, depending on modules such as trip planning, billing, tracking and integrations.',
      },
      {
        q: 'Can logistics software generate e-way bills automatically?',
        a: 'Yes. Software can generate and update e-way bills through the government system’s APIs, usually via an authorised GST Suvidha Provider.',
      },
      {
        q: 'What is ULIP?',
        a: 'The Unified Logistics Interface Platform is a government platform that gives logistics companies API access to data such as vehicle registration, driver licences and FASTag transactions.',
      },
    ],
  },
];

export function getIndustryPage(slug: string): IndustryPage | undefined {
  return INDUSTRY_PAGES.find((page) => page.slug === slug);
}
