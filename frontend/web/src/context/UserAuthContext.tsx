'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { authService } from '../services/auth.services';

export type User = {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  phone?: string;
  provider?: 'google' | 'email';
  emailVerified?: boolean;
  isActive?: boolean;
  lastLogin?: string | Date | null;
  createdAt?: string | Date;
  role?: string;
};

type UserAuthContextType = {
  user: User | null;
  loading: boolean;
  refreshUser: () => Promise<void>;
  logout: () => Promise<void>;
};

const UserAuthContext = createContext<UserAuthContextType | null>(null);

export function UserAuthProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const { userMe, logoutUser } = authService;

  const refreshUser = async () => {
    setLoading(true);
    try {
      const res = await userMe();
      setUser(res.data);
    } catch {
      setUser(null);
      router.replace('/login');
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    await logoutUser();
    setUser(null);
    router.replace('/login');
  };

  useEffect(() => {
    void refreshUser();
    // refreshUser depends on router and service references that are stable here.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <UserAuthContext.Provider value={{ user, loading, refreshUser, logout }}>
      {children}
    </UserAuthContext.Provider>
  );
}

export function useUserAuthContext() {
  const ctx = useContext(UserAuthContext);
  if (!ctx) {
    throw new Error('useUserAuthContext must be used inside UserAuthProvider');
  }
  return ctx;
}
