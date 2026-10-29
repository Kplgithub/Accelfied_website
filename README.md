# Accelfied website

The public site for Accelfied: clients find and compare agencies by real client reviews, then ask for quotes. Companies apply to be listed and collect reviews.

Stack: Next.js 16 (App Router, Cache Components), React 19, Tailwind CSS 4, TypeScript. Data comes from the Accelfied API (`Accelfied_backend`).

## Run locally

```bash
cp .env.example .env.local    # point API_URL at a running API
npm install
npm run dev                   # http://localhost:3000
```

`npm run build` needs the API to be reachable, because service pages and the most-visited profiles are prerendered at build time.

## Pages

| Route | What it is |
| --- | --- |
| `/` | Hero search, service groups, how it works, highly rated companies, trust section |
| `/services` | Every service, grouped |
| `/agencies` | All companies with name search and filters |
| `/agencies/[service]` | Companies for one service, with location, budget, rate, size, industry, rating and verified filters |
| `/profile/[slug]` | Company profile: overview, service focus, portfolio, rating breakdown and reviews |
| `/get-a-quote` | Project brief form, optionally addressed to one company (`?company=`). Needs an account |
| `/write-a-review` | Find a company, then a structured review form. Needs an account |
| `/get-listed` | Company application form. Needs an account; one company per account |
| `/join`, `/login` | Account type choice (hire, or get listed), sign up and log in with "stay logged in" |
| `/forgot-password`, `/reset-password` | Email link to set a new password |
| `/dashboard` | Overview. Companies see an onboarding checklist, rating and requests; clients see their briefs |
| `/dashboard/company/*` | Company profile editing, project requests, client reviews with a review link, portfolio |
| `/dashboard/requests`, `/dashboard/reviews` | Briefs and reviews this account sent |
| `/dashboard/settings` | Name and password |
| `/how-reviews-work` | How reviews are checked and scored |
| `/api/revalidate` | Called by the API after moderation so changes show right away |

The session lives in an httpOnly `af_session` cookie set by server actions. Pages read it inside `<Suspense>` so the rest of each page still prerenders.

## Rules this codebase follows

- **Ratings are real.** Every rating and review count comes from the API, which computes it from published reviews only. When a company has no reviews the site says "No reviews yet"; it never shows a placeholder number. Featured companies must have at least one review.
- **Times are in IST.** All dates go through `src/lib/format.ts`, which formats in `Asia/Kolkata`.
- **Design tokens only.** Colours, fonts and shadows are defined once in `src/app/globals.css` (evergreen brand, saffron accent, warm paper background, Fraunces + Geist). Components use the token names, never raw values.
- **Accessible by default.** Visible labels, inline errors tied to fields, keyboard focus rings, `prefers-reduced-motion`, and no horizontal scroll at 390px.

## Caching and scale

- Reads go through `src/lib/data.ts`. Each function uses `'use cache'` with a lifetime and tags, so pages are served from cache and refreshed in the background.
- Page shells are prerendered (Partial Prerendering). Only the parts that depend on the URL query, such as filters and review pages, render per request, and they stream in.
- When a moderator publishes a company or review, the API calls `/api/revalidate` with the affected tags. Visitors see the change on their next visit instead of waiting for the cache to expire.
- Forms post through Server Actions. The API URL never reaches the browser, and the visitor's IP is forwarded so the API can rate-limit per person.
