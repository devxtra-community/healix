'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { authService } from '@/src/services/auth.services';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  const { adminMe } = authService;

  const getUser = async () => {
    const user = await adminMe()
      .then(() => setLoading(false))
      .catch(() => {
        router.replace('/admin/login');
        setLoading(false);
      });

    console.log(user);
  };

  useEffect(() => {
    getUser();
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
