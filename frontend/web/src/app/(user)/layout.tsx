'use client';

import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import UserSidebar from './Sidebar';
import UserHeader from './Header';
import { UserAuthProvider } from '@/src/context/UserAuthContext';

export default function UserLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // useEffect(() => {
  //   const checkUserAuth = async () => {
  //     try {
  //       await authService.userMe(); // 👈 normal user check
  //       setLoading(false);
  //     } catch {
  //       router.replace('/login'); // 👈 user login
  //     }
  //   };

  //   checkUserAuth();
  // }, [router]);

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

  // if (loading) {
  //   return <div>Loading user...</div>;
  // }

  return (
    <UserAuthProvider>
      <div className="flex min-h-screen bg-background-secondary relative">
        {/* Sidebar */}
        <UserSidebar
          isOpen={isSidebarOpen}
          onClose={closeSidebar}
          pathname={pathname}
        />

        {/* Mobile Overlay */}
        <div
          className={`fixed inset-0 bg-black/50 z-40 transition-opacity duration-300 md:hidden ${
            isSidebarOpen
              ? 'opacity-100 pointer-events-auto'
              : 'opacity-0 pointer-events-none'
          }`}
          onClick={closeSidebar}
        />

        {/* Main Content */}
        <div className="flex-1 flex flex-col min-h-screen">
          <UserHeader onMenuClick={toggleSidebar} />
          <main className="flex-1 overflow-y-auto px-4 pb-4 md:px-8 md:pb-8">
            {children}
          </main>
        </div>
      </div>
    </UserAuthProvider>
  );
}
