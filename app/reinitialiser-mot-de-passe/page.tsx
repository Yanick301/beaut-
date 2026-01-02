import { Suspense } from 'react';
import ResetPasswordClient from './ResetPasswordClient';

export default function Page() {
  return (
    <Suspense fallback={<p>Chargement...</p>}>
      <ResetPasswordClient />
    </Suspense>
  );
}
