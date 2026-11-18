import type { Metadata } from 'next';
import Link from 'next/link';
import { GroupIcon } from '@/components/home/group-icon';
import { Container } from '@/components/ui/container';
import { getServiceGroups } from '@/lib/data';
import { withSeo } from '@/lib/seo';

export async function generateMetadata(): Promise<Metadata> {
  return withSeo('services', {
    title: 'All Services: Find the Right Agency in India',
    description: 'Every service on Accelfied: software and app development, web design, branding, SEO, digital marketing, IT and business services across India.',
    alternates: { canonical: '/services' },
  });
}

export default async function ServicesPage() {
  const groups = await getServiceGroups();
  return (
    <>
      <section className="grain border-b border-line">
        <Container className="py-14 lg:py-20">
          <p className="text-sm font-semibold tracking-[0.16em] text-brand uppercase">All services</p>
          <h1 className="mt-3 max-w-3xl font-display text-5xl leading-tight font-semibold tracking-tight text-ink sm:text-6xl">
            What do you need help with?
          </h1>
          <p className="mt-5 max-w-2xl text-lg text-ink-soft">
            Pick the closest match. Each service opens a list of companies across India, with their rates, smallest project size and what their clients said.
          </p>
          <nav aria-label="Service groups" className="mt-8 flex flex-wrap gap-2">
            {groups.map((group) => (
              <a
                key={group.slug}
                href={`#${group.slug}`}
                className="rounded-full border border-line-strong bg-surface px-4 py-2 text-sm text-ink-soft transition-colors hover:border-accent hover:text-accent"
              >
                {group.name}
              </a>
            ))}
          </nav>
        </Container>
      </section>
      <Container className="divide-y divide-line py-6">
        {groups.map((group) => (
          <section key={group.slug} id={group.slug} className="scroll-mt-24 py-12 lg:scroll-mt-32 lg:grid lg:grid-cols-[280px_1fr] lg:gap-12">
            <div className="flex items-center gap-3 lg:items-start">
              <span className="inline-flex size-12 items-center justify-center rounded-xl bg-brand text-paper">
                <GroupIcon slug={group.slug} className="size-6" />
              </span>
              <h2 className="font-display text-3xl font-semibold text-ink">{group.name}</h2>
            </div>
            <ul className="mt-6 grid gap-x-8 gap-y-1 sm:grid-cols-2 lg:mt-0">
              {group.services.map((service) => (
                <li key={service.slug}>
                  <Link href={`/agencies/${service.slug}`} className="group block rounded-xl px-3 py-3 -mx-3 transition-colors hover:bg-surface">
                    <span className="font-medium text-ink group-hover:text-accent">{service.name}</span>
                    <span className="mt-0.5 block text-sm text-ink-soft">{service.description}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        ))}
      </Container>
    </>
  );
}
