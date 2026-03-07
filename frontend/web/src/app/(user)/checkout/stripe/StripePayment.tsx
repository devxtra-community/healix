'use client';

import { FormEvent, useEffect, useRef, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { toast } from 'sonner';

type StripeInstance = {
  elements: (options: { clientSecret: string }) => StripeElements;
  confirmPayment: (options: {
    elements: StripeElements;
    confirmParams: { return_url: string };
  }) => Promise<{ error?: { message?: string } }>;
};

type StripeElements = {
  create: (type: 'payment') => StripePaymentElement;
};

type StripePaymentElement = {
  mount: (selector: string) => void;
  on?: (
    event: 'ready' | 'loaderror',
    handler: (event?: { error?: { message?: string } }) => void,
  ) => void;
  unmount?: () => void;
  destroy?: () => void;
};

declare global {
  interface Window {
    Stripe?: (publishableKey: string) => StripeInstance;
  }
}

export default function StripePaymentPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const clientSecret = searchParams.get('clientSecret');
  const orderId = searchParams.get('orderId');

  const publishableKey = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY;

  const setupError = !clientSecret
    ? 'Missing Stripe client secret in URL.'
    : !publishableKey
    ? 'Missing NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY in frontend environment.'
    : null;

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [elementReady, setElementReady] = useState(false);

  const stripeRef = useRef<StripeInstance | null>(null);
  const elementsRef = useRef<StripeElements | null>(null);
  const paymentElementRef = useRef<StripePaymentElement | null>(null);

  useEffect(() => {
    if (setupError) {
      setLoading(false);
      return;
    }

    let cancelled = false;

    const setupStripe = () => {
      if (cancelled) return;

      const stripeFactory = window.Stripe;
      if (!stripeFactory) {
        toast.error('Stripe failed to load');
        setLoading(false);
        return;
      }

      paymentElementRef.current?.unmount?.();
      paymentElementRef.current?.destroy?.();
      paymentElementRef.current = null;
      setElementReady(false);

      const stripe = stripeRef.current ?? stripeFactory(publishableKey!);
      const elements = stripe.elements({ clientSecret: clientSecret! });

      const paymentElement = elements.create('payment');

      paymentElement.on?.('ready', () => {
        if (cancelled) return;
        setElementReady(true);
        setLoading(false);
      });

      paymentElement.on?.('loaderror', (event) => {
        if (cancelled) return;
        setLoading(false);
        toast.error(
          event?.error?.message || 'Failed to load Stripe Payment Element'
        );
      });

      paymentElement.mount('#stripe-payment-element');

      stripeRef.current = stripe;
      elementsRef.current = elements;
      paymentElementRef.current = paymentElement;
    };

    if (window.Stripe) {
      setupStripe();
      return;
    }

    const script = document.createElement('script');
    script.src = 'https://js.stripe.com/v3/';
    script.async = true;

    script.onload = setupStripe;
    script.onerror = () => {
      toast.error('Unable to load Stripe script');
      setLoading(false);
    };

    document.body.appendChild(script);

    return () => {
      cancelled = true;
      paymentElementRef.current?.unmount?.();
      paymentElementRef.current?.destroy?.();
    };
  }, [publishableKey, setupError, clientSecret]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    const stripe = stripeRef.current;
    const elements = elementsRef.current;

    if (!stripe || !elements || !elementReady) {
      toast.error('Stripe is not ready');
      return;
    }

    setSubmitting(true);

    const returnUrl = `${window.location.origin}/orders${
      orderId ? `?orderId=${orderId}` : ''
    }`;

    const { error } = await stripe.confirmPayment({
      elements,
      confirmParams: { return_url: returnUrl },
    });

    if (error?.message) {
      toast.error(error.message);
    }

    setSubmitting(false);
  };

  return (
    <div className="max-w-3xl mx-auto py-10">
      <div className="bg-white border border-gray-100 rounded-2xl p-6 md:p-8 shadow-sm">
        <h1 className="text-2xl font-bold mb-1">Stripe Payment</h1>
        <p className="text-sm text-gray-500 mb-6">
          Complete your payment securely using Stripe.
        </p>

        {setupError ? (
          <div className="space-y-4">
            <div className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-xl p-4">
              {setupError}
            </div>

            <button
              onClick={() => router.push('/checkout')}
              className="w-full bg-black text-white py-3 rounded-xl font-semibold"
            >
              Back to Checkout
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-5">
            <div
              id="stripe-payment-element"
              className="border border-gray-200 rounded-xl p-4"
            />

            {loading && (
              <div className="text-sm text-gray-600">Loading Stripe...</div>
            )}

            <button
              type="submit"
              disabled={submitting || loading || !elementReady}
              className="w-full bg-[#635bff] hover:bg-[#564ee4] text-white py-3 rounded-xl font-semibold disabled:opacity-50"
            >
              {submitting ? 'Processing...' : 'Pay with Stripe'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}