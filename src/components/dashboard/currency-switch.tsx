import Link from 'next/link';
import { CURRENCIES, PAY_METHODS, type Currency } from '@/lib/verified-plan';

const LABEL: Record<Currency, string> = { INR: '₹ Rupees', USD: '$ Dollars' };

/**
 * Pay in rupees or dollars. Each choice is a link (`?currency=`), so the page
 * renders the right prices on the server and the choice survives a refresh.
 */
export function CurrencySwitch({ value, href, className = '' }: { value: Currency; href: string; className?: string }) {
  return (
    <nav aria-label="Currency" className={className}>
      <div className="inline-flex w-full rounded-xl bg-paper-deep p-1 sm:w-auto">
        {CURRENCIES.map((currency) => {
          const active = currency === value;
          return (
            <Link
              key={currency}
              href={`${href}?currency=${currency}`}
              scroll={false}
              replace
              aria-current={active ? 'true' : undefined}
              className={`flex flex-1 flex-col rounded-lg px-4 py-2 text-left transition-colors sm:flex-none ${
                active ? 'bg-surface text-ink shadow-[var(--shadow-card)]' : 'text-ink-soft hover:text-ink'
              }`}
            >
              <span className="text-sm font-semibold">{LABEL[currency]}</span>
              <span className="text-xs text-ink-faint">{PAY_METHODS[currency]}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
