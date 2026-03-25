import { Suspense } from 'react';
import OrderSuccessClient from './OrderSuccessClient';

export const dynamic = 'force-dynamic';

export default function OrderSuccessPage() {
  return (
    <Suspense fallback={<div className="p-6">Verifying payment...</div>}>
      <OrderSuccessClient />
    </Suspense>
  );
}
