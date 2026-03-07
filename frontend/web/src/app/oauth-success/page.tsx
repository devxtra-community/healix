import { Suspense } from 'react';
import OAuthSuccessClient from './OAuthSuccessClient';

export const dynamic = 'force-dynamic';

export default function Page() {
  return (
    <Suspense fallback={<p>Logging you in...</p>}>
      <OAuthSuccessClient />
    </Suspense>
  );
}
