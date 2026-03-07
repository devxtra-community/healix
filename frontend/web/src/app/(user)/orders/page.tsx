import { Suspense } from 'react';
import OrdersPage from './OrdersPage';

export const dynamic = 'force-dynamic';

export default function Page() {
  return (
    <Suspense fallback={<div className="p-6">Loading orders...</div>}>
      <OrdersPage />
    </Suspense>
  );
}
