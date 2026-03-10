'use client';

import Link from 'next/link';
import {
  LayoutDashboard,
  ShoppingBag,
  Heart,
  MapPin,
  User,
  Settings,
  X,
  LogOut,
} from 'lucide-react';
import { useUserAuth } from '@/src/hooks/useUserAuth';

const menuItems = [
  { name: 'Profile', icon: LayoutDashboard, href: '/profile' },
  { name: 'My Orders', icon: ShoppingBag, href: '/orders' },
  { name: 'Wishlist', icon: Heart, href: '/wishlist' },
  { name: 'Addresses', icon: MapPin, href: '/addresses' },
  { name: 'Account', icon: User, href: '/account' },
  { name: 'Settings', icon: Settings, href: '/settings' },
];

interface SidebarProps {
  isOpen?: boolean;
  onClose?: () => void;
  pathname: string;
}

export default function UserSidebar({
  isOpen = false,
  onClose,
  pathname,
}: SidebarProps) {
  const { user, logout, loading } = useUserAuth();

  if (loading) {
    return null;
  }

  return (
    <aside
      className={`
        fixed top-0 left-0 bottom-0 z-50 w-[280px] md:w-[260px] bg-white border-r border-gray-200 
        flex flex-col p-6 overflow-y-auto transition-transform duration-300 ease-in-out shadow-2xl md:shadow-none
        md:sticky md:translate-x-0
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}
      `}
    >
      {/* Logo */}
      <div className="flex justify-between items-center mb-10 pl-2">
        <Link href="/">
          {' '}
          <h1 className="text-2xl font-bold tracking-tight">Healix</h1>
        </Link>
        <button className="md:hidden p-1" onClick={onClose}>
          <X size={24} />
        </button>
      </div>

      {/* Menu */}
      <nav className="flex flex-col gap-2 flex-1">
        {menuItems.map((item) => (
          <Link
            key={item.name}
            href={item.href}
            onClick={onClose}
            className={`
              flex items-center px-4 py-3 rounded-xl transition-all duration-200 font-medium text-[0.95rem]
              ${
                pathname.includes(item.href)
                  ? 'bg-black text-white shadow-lg'
                  : 'text-gray-600 hover:bg-gray-100'
              }
            `}
          >
            <item.icon size={20} className="mr-3" />
            <span>{item.name}</span>
          </Link>
        ))}
      </nav>

      {/* Static User Info (Temporary) */}
      <div className="mt-8 pt-6 border-t border-gray-100">
        <div className="flex items-center gap-3 p-3 rounded-2xl bg-gray-50 border mb-3">
          <div className="w-10 h-10 rounded-full bg-black text-white flex items-center justify-center font-bold text-sm">
            U
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold truncate">{user?.name}</p>
            <p className="text-xs text-gray-500 truncate">{user?.email}</p>
          </div>
        </div>

        <button
          onClick={logout}
          className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-red-600 hover:bg-red-50 transition-colors duration-200 font-medium text-[0.95rem]"
        >
          <LogOut size={20} />
          Logout
        </button>
      </div>
    </aside>
  );
}
