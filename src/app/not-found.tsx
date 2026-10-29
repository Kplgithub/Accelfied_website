import { ButtonLink } from '@/components/ui/button';
import { Container } from '@/components/ui/container';

export default function NotFound() {
  return (
    <Container className="max-w-2xl py-24 text-center">
      <p className="font-display text-8xl font-semibold text-line-strong">404</p>
      <h1 className="mt-4 font-display text-4xl font-semibold text-ink">We could not find that page</h1>
      <p className="mt-3 text-lg text-ink-soft">It may have moved, or the company may no longer be listed.</p>
      <div className="mt-8 flex justify-center gap-3">
        <ButtonLink href="/">Go home</ButtonLink>
        <ButtonLink href="/services" variant="secondary">
          Browse services
        </ButtonLink>
      </div>
    </Container>
  );
}
