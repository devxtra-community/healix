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

  useEffect(() => {
    const checkAdminAuth = async () => {
      try {
        await authService.adminMe();
        setLoading(false);
      } catch {
        router.replace('/admin/login');
      }
    };

    checkAdminAuth();
  }, [router]);

  if (loading) {
    return <div>Loading admin...</div>;
  }

  return <main>{children}</main>;
}
