'use client';

import { Lock } from 'lucide-react';
import { useState, useTransition } from 'react';
import { confirmPostPayment, type OrderResult } from '@/app/company-post-actions';
import { Button } from '../ui/button';

const CHECKOUT_SRC = 'https://checkout.razorpay.com/v1/checkout.js';

interface OrderResponse {
  razorpay_order_id: string;
  razorpay_payment_id: string;
  razorpay_signature: string;
}

interface CheckoutInstance {
  open(): void;
  on(event: 'payment.failed', handler: (response: { error?: { description?: string } }) => void): void;
}

type CheckoutConstructor = new (options: Record<string, unknown>) => CheckoutInstance;
const checkoutClass = () => (window as unknown as { Razorpay?: CheckoutConstructor }).Razorpay;

let loading: Promise<void> | null = null;

/** Loads Razorpay Checkout once, on the first press. Shares the script with the plan checkout. */
function loadCheckout(): Promise<void> {
  if (checkoutClass()) return Promise.resolve();
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
 * Pays for one blog post: `start` has the server make a Razorpay order,
 * Checkout takes the money, and the server checks the signature.
 */
export function PostCheckout({
  postId,
  label,
  description,
  email,
  name,
  start,
}: {
  postId: string;
  label: string;
  description: string;
  email: string;
  name: string;
  start: () => Promise<OrderResult>;
}) {
  const [message, setMessage] = useState('');
  const [busy, setBusy] = useState(false);
  const [confirming, startConfirm] = useTransition();

  async function pay() {
    setMessage('');
    setBusy(true);
    try {
      const [order] = await Promise.all([start(), loadCheckout()]);
      if (!order.ok) {
        setMessage(order.message);
        setBusy(false);
        return;
      }
      const Checkout = checkoutClass();
      if (!Checkout) throw new Error('checkout missing');
      const checkout = new Checkout({
        key: order.keyId,
        order_id: order.orderId,
        amount: order.amount,
        currency: order.currency,
        name: 'Accelfied',
        description,
        prefill: { name, email },
        theme: { color: '#C7362F' },
        modal: { ondismiss: () => setBusy(false) },
        handler: (response: OrderResponse) =>
          startConfirm(async () => {
            const result = await confirmPostPayment(postId, response);
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
      <Button type="button" size="lg" onClick={() => void pay()} disabled={working} className="w-full sm:w-auto">
        {working && <span className="size-4 animate-spin rounded-full border-2 border-white/40 border-t-white" aria-hidden="true" />}
        {confirming ? 'Confirming payment…' : busy ? 'Opening payment…' : label}
      </Button>
      <p className="mt-2 flex items-center gap-1.5 text-sm text-ink-faint">
        <Lock className="size-3.5" aria-hidden="true" /> Secure one-time payment by Razorpay.
      </p>
      {message && (
        <p role="alert" className="mt-3 rounded-xl border border-danger/30 bg-danger-tint px-4 py-3 text-sm font-medium text-danger">
          {message}
        </p>
      )}
    </div>
  );
}
