import { Reveal } from '@/components/motion/reveal';
import { Container } from '@/components/ui/container';
import type { ClientLogo } from '@/lib/home-showcase';

/** Fewer logos than this sit still in one centred row; more scroll gently. */
const SCROLL_FROM = 6;

/**
 * "Trusted by" strip with client logos our team uploads in the admin panel.
 * Nothing renders until at least one logo is added.
 */
export function ClientLogos({ heading, logos }: { heading: string; logos: ClientLogo[] }) {
  if (!logos.length) return null;
  const scroll = logos.length >= SCROLL_FROM;
  return (
    <section aria-labelledby="client-logos-heading" className="border-b border-line bg-paper py-12 lg:py-14">
      <Container>
        <Reveal className="flex items-center gap-5">
          <span className="h-px flex-1 bg-gradient-to-r from-transparent to-line-strong" aria-hidden="true" />
          <h2 id="client-logos-heading" className="text-center text-sm font-semibold tracking-[0.16em] text-ink-soft uppercase">
            {heading || 'Businesses hiring through Accelfied'}
          </h2>
          <span className="h-px flex-1 bg-gradient-to-l from-transparent to-line-strong" aria-hidden="true" />
        </Reveal>
      </Container>
      {scroll ? (
        <div className="logo-fade mt-9 overflow-hidden">
          <div className="flex w-max marquee [animation-duration:45s]">
            {[0, 1].map((copy) => (
              <ul key={copy} className="flex shrink-0 items-center gap-14 pr-14 sm:gap-20 sm:pr-20" aria-hidden={copy === 1 || undefined}>
                {logos.map((logo) => (
                  <li key={logo.imageUrl}>
                    <Logo logo={logo} focusable={copy === 0} />
                  </li>
                ))}
              </ul>
            ))}
          </div>
        </div>
      ) : (
        <Container>
          <ul className="mt-9 flex flex-wrap items-center justify-center gap-x-14 gap-y-8 sm:gap-x-20">
            {logos.map((logo) => (
              <li key={logo.imageUrl}>
                <Logo logo={logo} focusable />
              </li>
            ))}
          </ul>
        </Container>
      )}
    </section>
  );
}

function Logo({ logo, focusable }: { logo: ClientLogo; focusable: boolean }) {
  const image = (
    // eslint-disable-next-line @next/next/no-img-element -- small uploaded logo of any shape; next/image needs fixed sizes
    <img src={logo.imageUrl} alt={logo.name} loading="lazy" decoding="async" className="client-logo h-9 w-auto max-w-[150px] object-contain sm:h-10" />
  );
  if (!logo.href) return image;
  return (
    <a href={logo.href} target="_blank" rel="noopener nofollow" tabIndex={focusable ? undefined : -1} className="block">
      {image}
    </a>
  );
}
