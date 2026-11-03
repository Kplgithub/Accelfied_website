'use client';

import { Button } from '@/components/ui/button';
import { Container } from '@/components/ui/container';

export default function ErrorPage({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <Container className="max-w-2xl py-24 text-center">
      <h1 className="font-display text-4xl font-semibold text-ink">Something went wrong on our side</h1>
      <p className="mt-3 text-lg text-ink-soft">Please try again. If it keeps happening, come back in a few minutes.</p>
      <Button onClick={reset} className="mt-8">
        Try again
      </Button>
    </Container>
  );
}
