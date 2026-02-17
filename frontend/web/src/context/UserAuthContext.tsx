'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { authService } from '../services/auth.services';

export type User = {
  id: string;
  name: string;
  email: string;
  avatar?: string;
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
    try {
      const res = await userMe();
      setUser(res.data);
    } catch {
      setUser(null);
      router.replace('/login');
    }
  };

  const logout = async () => {
    await logoutUser();
    setUser(null);
    router.replace('/login');
  };

  useEffect(() => {
    refreshUser().finally(() => setLoading(false));
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
