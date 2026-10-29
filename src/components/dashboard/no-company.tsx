import { ButtonLink } from '../ui/button';
import { EmptyState } from '../ui/empty-state';

export function NoCompany() {
  return (
    <EmptyState title="You have not listed a company yet" action={<ButtonLink href="/get-listed">List your company</ButtonLink>}>
      Listing is free. Once our team approves it, clients can find you, send briefs and review your work.
    </EmptyState>
  );
}
