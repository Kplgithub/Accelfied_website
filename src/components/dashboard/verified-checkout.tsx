'use client';

import { Lock } from 'lucide-react';
import { useState, useTransition } from 'react';
import { confirmVerifiedPayment, type StartResult } from '@/app/billing-actions';
import type { Currency } from '@/lib/verified-plan';
import { Button } from '../ui/button';
import { CurrencyChoice, type CurrencyPrices } from './currency-choice';

const CHECKOUT_SRC = 'https://checkout.razorpay.com/v1/checkout.js';

interface CheckoutResponse {
  razorpay_payment_id: string;
  razorpay_subscription_id: string;
  razorpay_signature: string;
}

interface RazorpayInstance {
  open(): void;
  on(event: 'payment.failed', handler: (response: { error?: { description?: string } }) => void): void;
}

declare global {
  interface Window {
    Razorpay?: new (options: Record<string, unknown>) => RazorpayInstance;
  }
}

let loading: Promise<void> | null = null;

/** Loads Razorpay Checkout once, on the first press. */
function loadCheckout(): Promise<void> {
  if (window.Razorpay) return Promise.resolve();
  loading ??= new Promise<void>((resolve, reject) => {
    const script = document.createElement('script');
    script.src = CHECKOUT_SRC;
    script.async = true;
    script.onload = () => resolve();
    script.onerror = () => {
      loading = null;
      script.remove();
      reject(new Error('checkout script failed'));
    };
    document.head.appendChild(script);
  });
  return loading;
}

/**
 * Starts a subscription: `start` has the server create it on Razorpay,
 * Checkout takes the first payment, and the server checks its signature.
 * Used for the Verified plan and for sponsored places.
 */
export function VerifiedCheckout({
  label,
  description,
  email,
  name,
  prices,
  priceNote,
  start: startSubscription,
  size = 'lg',
}: {
  label: string;
  /** Shown in the Razorpay window, such as "Verified plan for Acme". */
  description: string;
  email: string;
  name: string;
  /** Rupees or dollars is asked after Pay is pressed. Without prices (an older API) it charges dollars. */
  prices?: CurrencyPrices;
  /** Shown under each price in that question, such as "/ month". */
  priceNote?: string;
  start: (currency: Currency) => Promise<StartResult>;
  size?: 'lg' | 'md';
}) {
  const [message, setMessage] = useState('');
  const [busy, setBusy] = useState(false);
  const [choosing, setChoosing] = useState(false);
  const [confirming, startConfirm] = useTransition();

  function press() {
    setMessage('');
    if (prices) setChoosing(true);
    else void start('USD');
  }

  async function start(currency: Currency) {
    setChoosing(false);
    setMessage('');
    setBusy(true);
    try {
      const [plan] = await Promise.all([startSubscription(currency), loadCheckout()]);
      if (!plan.ok) {
        setMessage(plan.message);
        setBusy(false);
        return;
      }
      if (!window.Razorpay) throw new Error('checkout missing');
      const checkout = new window.Razorpay({
        key: plan.keyId,
        subscription_id: plan.subscriptionId,
        name: 'Accelfied',
        description,
        prefill: { name, email },
        theme: { color: '#C7362F' },
        modal: { ondismiss: () => setBusy(false) },
        handler: (response: CheckoutResponse) =>
          startConfirm(async () => {
            const result = await confirmVerifiedPayment(response);
            setBusy(false);
            if (!result.ok) setMessage(result.message);
          }),
      });
      checkout.on('payment.failed', (response) => {
        setMessage(response.error?.description ? `Payment failed: ${response.error.description}` : 'Payment failed. You have not been charged.');
      });
      checkout.open();
    } catch {
      setMessage('The payment window could not open. Check your connection and try again.');
      setBusy(false);
    }
  }

  const working = busy || confirming;
  return (
    <div>
      <Button type="button" size={size} onClick={press} disabled={working} className="w-full sm:w-auto">
        {working && <span className="size-4 animate-spin rounded-full border-2 border-white/40 border-t-white" aria-hidden="true" />}
        {confirming ? 'Confirming payment…' : busy ? 'Opening payment…' : label}
      </Button>
      <p className="mt-2 flex items-center gap-1.5 text-sm text-ink-faint sm:justify-end">
        <Lock className="size-3.5" aria-hidden="true" /> Secure payment by Razorpay. Cancel any time.
      </p>
      {message && (
        <p role="alert" className="mt-3 rounded-xl border border-danger/30 bg-danger-tint px-4 py-3 text-sm font-medium text-danger">
          {message}
        </p>
      )}
      {prices && <CurrencyChoice open={choosing} prices={prices} note={priceNote} onChoose={start} onClose={() => setChoosing(false)} />}
    </div>
  );
}
