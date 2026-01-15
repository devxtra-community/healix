'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { authService } from '@/src/services/auth.services';

export default function UserLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const { adminMe } = authService;

  useEffect(() => {
    setLoading(true);
    adminMe()
      .then(() => setLoading(false))
      .catch(() => {
        router.replace('/admin/login');
        setLoading(false);
      });
  }, []);

  if (loading) {
    return <div>Loading admin...</div>;
  }

  return (
    <div className="flex">
      <aside className="w-64">Admin Sidebar</aside>
      <main className="flex-1">{children}</main>
    </div>
  );
}
