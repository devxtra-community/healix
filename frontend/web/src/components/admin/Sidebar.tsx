import Link from 'next/link';
import {
  LayoutDashboard,
  ShoppingCart,
  Package,
  List,
  Users,
  Star,
  Percent,
  BarChart,
  Megaphone,
  Settings,
  X,
  LogOut,
} from 'lucide-react';
import { useAdminAuth } from '@/src/hooks/useAdminAuth';

const menuItems = [
  {
    name: 'Dashboard',
    icon: LayoutDashboard,
    href: '/admin/dashboard',
    active: true,
  },
  { name: 'Orders', icon: ShoppingCart, href: '/admin/orders', count: 24 },
  { name: 'Products', icon: Package, href: '/admin/products' },
  { name: 'Categories', icon: List, href: '/admin/categories' },
  { name: 'Customers', icon: Users, href: '/admin/customers', count: 32 },
  { name: 'Reviews', icon: Star, href: '/admin/reviews', count: 14 },
  { name: 'Discounts', icon: Percent, href: '/admin/discounts' },
  { name: 'Analytics', icon: BarChart, href: '/admin/analytics' },
  { name: 'Marketing', icon: Megaphone, href: '/admin/marketing' },
  { name: 'Settings', icon: Settings, href: '/admin/settings' },
];

interface SidebarProps {
  isOpen?: boolean;
  onClose?: () => void;
  pathname: string;
}

export default function Sidebar({
  isOpen = false,
  onClose,
  pathname,
}: SidebarProps) {
  const { admin, logout } = useAdminAuth();

  return (
    <aside
      className={`
            fixed top-0 left-0 bottom-0 z-50 w-[280px] md:w-[260px] bg-white border-r border-gray-200 
            flex flex-col p-6 overflow-y-auto transition-transform duration-300 ease-in-out shadow-2xl md:shadow-none
            md:sticky md:translate-x-0
            ${isOpen ? 'translate-x-0' : '-translate-x-full'}
        `}
    >
      <div className="flex justify-between items-center mb-10 pl-2">
        <div className="flex items-center">
          <h1 className="text-2xl font-bold text-heading-color tracking-tight">
            Healix
          </h1>
        </div>
        <button className="md:hidden text-text-secondary p-1" onClick={onClose}>
          <X size={24} />
        </button>
      </div>

      <nav className="flex flex-col gap-2 flex-1">
        {menuItems.map((item) => (
          <Link
            key={item.name}
            href={item.href}
            className={`
                            flex items-center px-4 py-3 rounded-xl transition-all duration-200 font-medium text-[0.95rem]
                            ${
                              pathname.includes(item.href)
                                ? 'bg-sidebar-active-bg text-sidebar-active-text shadow-lg shadow-black/15 bg-black  text-white'
                                : 'text-text-secondary hover:bg-hover-color hover:text-text-primary'
                            }
                        `}
            onClick={onClose}
          >
            <item.icon size={20} className="mr-3" />
            <span className="flex-1">{item.name}</span>
            {item.count && (
              <span className="text-xs font-semibold">{item.count}</span>
            )}
          </Link>
        ))}
      </nav>

      <div className="mt-8 pt-6 border-t border-gray-100">
        <div className="flex items-center gap-3 p-3 rounded-[20px] bg-gray-50 border border-gray-100 mb-3">
          <div className="w-10 h-10 rounded-full bg-black text-white flex items-center justify-center font-bold text-sm">
            AD
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-gray-900 truncate">
              {admin?.name}
            </p>
            <p className="text-xs text-gray-500 truncate">{admin?.email}</p>
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
