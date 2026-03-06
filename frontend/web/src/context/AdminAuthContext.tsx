'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { authService } from '../services/auth.services';

export type Admin = {
  id: string;
  name: string;
  email: string;
  role: string;
  avatar?: string;
};

type AdminAuthContextType = {
  admin: Admin | null;
  loading: boolean;
  refreshAdmin: () => Promise<void>;
  logout: () => Promise<void>;
};

const AdminAuthContext = createContext<AdminAuthContextType | null>(null);

export function AdminAuthProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [admin, setAdmin] = useState<Admin | null>(null);
  const [loading, setLoading] = useState(true);

  const { adminMe, logoutAdmin } = authService;

  const refreshAdmin = async () => {
    try {
      const res = await adminMe();
      console.log(res);
      setAdmin(res.data);
    } catch {
      setAdmin(null);
      router.replace('/admin/login');
    }
  };

  const logout = async () => {
    await logoutAdmin();
    setAdmin(null);
    router.replace('/admin/login');
  };

  useEffect(() => {
    refreshAdmin().finally(() => setLoading(false));
  }, []);

  return (
    <AdminAuthContext.Provider value={{ admin, loading, refreshAdmin, logout }}>
      {children}
    </AdminAuthContext.Provider>
  );
}

export function useAdminAuthContext() {
  const ctx = useContext(AdminAuthContext);
  if (!ctx) {
    throw new Error(
      'useAdminAuthContext must be used inside AdminAuthProvider',
    );
  }
  return ctx;
}
