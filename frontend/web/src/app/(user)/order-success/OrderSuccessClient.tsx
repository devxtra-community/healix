'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { toast } from 'sonner';
import OrderSuccessOverlay from '@/src/components/OrderSuccessOverlay';
import { checkoutService } from '@/src/services/checkout.service';

export default function OrderSuccessClient() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const sessionId = searchParams.get('session_id');

  const [status, setStatus] = useState<'loading' | 'success' | 'failed'>(
    'loading',
  );
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [orderId, setOrderId] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    const getErrorMessage = (error: unknown) => {
      if (
        error &&
        typeof error === 'object' &&
        'response' in error &&
        error.response &&
        typeof error.response === 'object' &&
        'data' in error.response &&
        error.response.data &&
        typeof error.response.data === 'object' &&
        'message' in error.response.data &&
        typeof error.response.data.message === 'string'
      ) {
        return error.response.data.message;
      }

      return 'Unable to verify Stripe payment.';
    };

    const verify = async () => {
      if (!sessionId) {
        setStatus('failed');
        setErrorMessage('Missing Stripe session id.');
        return;
      }

      for (let attempt = 0; attempt < 8; attempt += 1) {
        try {
          const result = await checkoutService.verifyStripeSession(sessionId);

          if (cancelled) return;

          if (result.status === 'SUCCESS') {
            setOrderId(result.orderId ?? null);
            setStatus('success');
            return;
          }

          if (result.status === 'FAILED') {
            setStatus('failed');
            setErrorMessage('Stripe payment was not completed.');
            return;
          }
        } catch (error) {
          console.error('Failed to verify Stripe session', error);

          if (cancelled) return;

          if (attempt === 7) {
            setStatus('failed');
            setErrorMessage(getErrorMessage(error));
            return;
          }
        }

        await new Promise((resolve) => setTimeout(resolve, 1500));
      }

      if (!cancelled) {
        setStatus('failed');
        setErrorMessage('Stripe payment is still processing. Please refresh.');
      }
    };

    verify();

    return () => {
      cancelled = true;
    };
  }, [sessionId]);

  const handleOverlayComplete = () => {
    const target = orderId
      ? `/orders?orderId=${encodeURIComponent(orderId)}`
      : '/orders';
    router.replace(target);
  };

  if (status === 'success') {
    return <OrderSuccessOverlay onComplete={handleOverlayComplete} />;
  }

  if (status === 'failed') {
    return (
      <div className="max-w-2xl mx-auto py-16 px-6">
        <div className="rounded-2xl border border-red-200 bg-red-50 p-6">
          <h1 className="text-2xl font-bold text-red-700">
            Payment not completed
          </h1>
          <p className="mt-2 text-sm text-red-600">
            {errorMessage ?? 'Stripe did not confirm this payment.'}
          </p>
          <div className="mt-5 flex gap-3">
            <button
              onClick={() => router.push('/checkout')}
              className="rounded-xl bg-black px-4 py-3 text-sm font-semibold text-white"
            >
              Back to Checkout
            </button>
            <button
              onClick={() => {
                toast.message(
                  'You can retry checkout from the cart or checkout page.',
                );
                router.push('/orders');
              }}
              className="rounded-xl border border-gray-300 bg-white px-4 py-3 text-sm font-semibold text-gray-900"
            >
              Go to Orders
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto py-16 px-6">
      <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
        <h1 className="text-2xl font-bold">Verifying payment...</h1>
        <p className="mt-2 text-sm text-gray-600">
          Confirming your Stripe checkout session.
        </p>
      </div>
    </div>
  );
}
