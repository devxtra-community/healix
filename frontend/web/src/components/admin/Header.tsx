import { Search, Bell, Menu } from 'lucide-react';

interface HeaderProps {
  onMenuClick?: () => void;
}

export default function Header({ onMenuClick }: HeaderProps) {
  return (
    <header className="flex items-center justify-between py-4 px-4 md:py-6 md:px-8 bg-transparent w-full gap-4">
      <div className="flex items-center gap-4">
        <button
          className="md:hidden p-0 bg-transparent border-none cursor-pointer text-heading-color"
          onClick={onMenuClick}
        >
          <Menu size={24} />
        </button>
        <h2 className="text-xl md:text-2xl font-bold text-heading-color m-0 whitespace-nowrap">
          Dashboard
        </h2>
      </div>

      <div className="flex-1 hidden md:flex justify-center px-8 max-w-[600px]">
        <div className="relative w-full max-w-[400px]">
          <input
            type="text"
            placeholder="Search products..."
            className="w-full py-3 px-4 rounded-xl border-none bg-white text-sm text-text-primary shadow-sm outline-none pr-10 placeholder:text-gray-400"
          />
          <Search
            className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
            size={18}
          />
        </div>
      </div>

      <div className="flex items-center gap-4 md:gap-6">
        <button className="relative bg-white p-2.5 rounded-full cursor-pointer text-text-secondary shadow-sm flex items-center justify-center border-none">
          <Bell size={20} />
          <span className="absolute -top-0.5 -right-0.5 bg-accent-orange text-white text-[10px] font-bold h-4 w-4 rounded-full flex items-center justify-center border-2 border-background-secondary">
            3
          </span>
        </button>
      </div>
    </header>
  );
}
