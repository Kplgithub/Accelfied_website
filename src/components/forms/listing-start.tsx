'use client';

import { ArrowRight, Globe, PenLine, RotateCcw } from 'lucide-react';
import { useState, useTransition } from 'react';
import { autofillFromWebsite, type WebsiteDraft } from '@/app/autofill-actions';
import type { ServiceGroup } from '@/lib/types';
import { Button } from '../ui/button';
import { AutofillLoader } from './autofill-loader';
import { ListingForm, type ListingPrefill } from './listing-form';

type Stage = { name: 'website' } | { name: 'loading'; host: string } | { name: 'form'; prefill?: ListingPrefill };

/**
 * Get listed, step one: the company website. We read it on our server and
 * fill the listing form with what we find; the person checks and edits
 * everything before sending.
 */
export function ListingStart({ groups, account }: { groups: ServiceGroup[]; account: { email: string } }) {
  const [stage, setStage] = useState<Stage>({ name: 'website' });
  const [website, setWebsite] = useState('');
  const [problem, setProblem] = useState('');
  const [finishing, setFinishing] = useState(false);
  const [, startTransition] = useTransition();

  function fetchDetails(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const value = website.trim();
    if (!/^(https?:\/\/)?[^\s/]+\.[a-z]{2,}/i.test(value)) {
      setProblem('Enter your company website, for example yourcompany.com');
      return;
    }
    setProblem('');
    setFinishing(false);
    setStage({ name: 'loading', host: hostLabel(value) });
    requestAnimationFrame(scrollToStart);
    startTransition(async () => {
      const result = await autofillFromWebsite(value);
      if (result.status === 'error') {
        setProblem(result.message);
        setStage({ name: 'website' });
        return;
      }
      // Let the last step finish visibly before the form appears.
      setFinishing(true);
      await new Promise((resolve) => setTimeout(resolve, 700));
      setStage({ name: 'form', prefill: toPrefill(result.draft) });
      requestAnimationFrame(scrollToStart);
    });
  }

  if (stage.name === 'loading') {
    return (
      <div id="listing-start">
        <AutofillLoader host={stage.host} done={finishing} />
      </div>
    );
  }

  if (stage.name === 'form') {
    return (
      <div id="listing-start" className="animate-rise rounded-[var(--radius-card)] border border-line bg-surface p-6 shadow-[var(--shadow-card)] sm:p-10">
        <div className="mb-8 flex flex-wrap items-center justify-between gap-3">
          <p className="text-sm font-semibold tracking-[0.14em] text-brand uppercase">Step 2 of 2 · Check your details</p>
          <button
            type="button"
            onClick={() => setStage({ name: 'website' })}
            className="inline-flex cursor-pointer items-center gap-1.5 text-sm font-medium text-accent hover:underline"
          >
            <RotateCcw className="size-3.5" aria-hidden="true" />
            Use a different website
          </button>
        </div>
        <ListingForm groups={groups} account={account} prefill={stage.prefill} />
      </div>
    );
  }

  return (
    <div id="listing-start" className="relative overflow-hidden rounded-[var(--radius-card)] border border-line bg-surface p-6 shadow-[var(--shadow-card)] sm:p-10 lg:p-12">
      <div className="pointer-events-none absolute -top-24 -right-24 size-72 rounded-full bg-accent-tint blur-3xl" aria-hidden="true" />
      <div className="pointer-events-none absolute -bottom-28 -left-20 size-64 rounded-full bg-brand-tint blur-3xl" aria-hidden="true" />
      <div className="relative mx-auto max-w-2xl text-center">
        <p className="text-sm font-semibold tracking-[0.14em] text-brand uppercase">Step 1 of 2</p>
        <h2 className="mt-3 font-display text-3xl font-semibold tracking-tight text-ink sm:text-4xl">Start with your website</h2>
        <p className="mx-auto mt-3 max-w-xl text-[17px] text-ink-soft">
          Add your company website and we fill in your listing for you: name, logo, about, services, location and contacts. You can change
          everything before you submit.
        </p>
        <form onSubmit={fetchDetails} className="mt-8 flex flex-col gap-3 sm:flex-row" noValidate>
          <label htmlFor="company-website" className="sr-only">
            Company website
          </label>
          <div className="relative flex-1">
            <Globe className="pointer-events-none absolute top-1/2 left-4 size-5 -translate-y-1/2 text-ink-faint" aria-hidden="true" />
            <input
              id="company-website"
              type="text"
              inputMode="url"
              autoComplete="url"
              autoCapitalize="none"
              spellCheck={false}
              autoFocus
              placeholder="yourcompany.com"
              value={website}
              onChange={(event) => setWebsite(event.target.value)}
              aria-invalid={Boolean(problem)}
              aria-describedby={problem ? 'company-website-error' : undefined}
              className="h-14 w-full rounded-full border border-line-strong bg-surface pr-4 pl-12 text-base text-ink shadow-[var(--shadow-card)] transition-[border-color,box-shadow] placeholder:text-ink-faint hover:border-ink/40 focus:border-accent focus:ring-4 focus:ring-accent/12 focus:outline-none aria-[invalid=true]:border-danger"
            />
          </div>
          <Button type="submit" size="lg" className="h-14 shrink-0">
            Fetch my details
            <ArrowRight className="size-4" aria-hidden="true" />
          </Button>
        </form>
        {problem && (
          <p id="company-website-error" role="alert" className="mt-3 text-[15px] font-medium text-danger">
            {problem}
          </p>
        )}
        <button
          type="button"
          onClick={() => setStage({ name: 'form' })}
          className="mt-6 inline-flex cursor-pointer items-center gap-1.5 text-[15px] font-medium text-ink-soft underline-offset-4 hover:text-ink hover:underline"
        >
          <PenLine className="size-4" aria-hidden="true" />
          No website yet? Fill in the details yourself
        </button>
      </div>
    </div>
  );
}

/** Brings the loader or the form to the top of the screen, below the sticky header. */
function scrollToStart() {
  const top = document.getElementById('listing-start')?.getBoundingClientRect().top;
  if (top !== undefined) window.scrollTo({ top: Math.max(0, window.scrollY + top - 140), behavior: 'smooth' });
}

function hostLabel(value: string): string {
  try {
    return new URL(/^https?:\/\//i.test(value) ? value : `https://${value}`).hostname.replace(/^www\./, '');
  } catch {
    return value;
  }
}

function toPrefill(draft: WebsiteDraft): ListingPrefill {
  const values: Record<string, string> = {
    website: draft.website,
    name: draft.name,
    tagline: draft.tagline,
    description: draft.description,
    logoUrl: draft.logoUrl,
    foundedYear: draft.foundedYear ? String(draft.foundedYear) : '',
    teamSize: draft.teamSize,
    'headquarters.city': draft.headquarters.city,
    'headquarters.region': draft.headquarters.region,
    'headquarters.countryCode': draft.headquarters.countryCode,
    contactEmail: draft.contactEmail,
    contactPhone: draft.contactPhone,
  };
  draft.services.forEach((service, index) => {
    values[`services.${index}.slug`] = service.slug;
    values[`services.${index}.percent`] = String(service.percent);
  });
  for (const [key, link] of Object.entries(draft.socials)) values[`socials.${key}`] = link;
  return { values, industries: draft.industries, filled: draft.filled, source: hostLabel(draft.website) };
}
