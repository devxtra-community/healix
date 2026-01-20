'use client';

import { useEffect, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { authService } from '@/src/services/auth.services';
import Sidebar from '@/src/components/admin/Sidebar';
import Header from '@/src/components/admin/Header';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const pathname = usePathname();

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

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth > 768) {
        setIsSidebarOpen(false);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const closeSidebar = () => {
    setIsSidebarOpen(false);
  };

  if (loading) {
    return <div>Loading admin...</div>;
  }

  return (
    <div className="flex min-h-screen bg-background-secondary relative">
      <Sidebar
        isOpen={isSidebarOpen}
        onClose={closeSidebar}
        pathname={pathname}
      />

      <div
        className={`fixed inset-0 bg-black/50 z-40 transition-opacity duration-300 md:hidden ${
          isSidebarOpen
            ? 'opacity-100 pointer-events-auto'
            : 'opacity-0 pointer-events-none'
        }`}
        onClick={closeSidebar}
      />

      {/* Main Content */}
      <div className="flex-1 flex flex-col h-screen overflow-hidden transition-all duration-300">
        <Header onMenuClick={toggleSidebar} />
        <main className="flex-1 overflow-y-auto px-4 pb-4 md:px-8 md:pb-8">
          {children}
        </main>
      </div>
    </div>
  );
}
