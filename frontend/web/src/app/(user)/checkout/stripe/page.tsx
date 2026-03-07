import { Suspense } from 'react';
import StripePaymentPage from './StripePayment';

export const dynamic = 'force-dynamic';

export default function Page() {
  return (
    <Suspense
      fallback={<div className="p-10 text-center">Loading payment...</div>}
    >
      <StripePaymentPage />
    </Suspense>
  );
}
