'use client';

import { User, Heart, ShoppingBag, Leaf } from 'lucide-react';

const Navbar = () => {
  return (
    <nav className="flex items-center justify-between py-6 px-4 max-w-7xl mx-auto">
      <div className="flex items-center gap-2">
        <Leaf className="w-6 h-6 text-green-500" />
        <span className="text-xl font-bold text-gray-900">Healix</span>
      </div>

      <div className="hidden md:flex items-center gap-8 text-sm font-medium text-gray-600">
        <a className="text-gray-900">Home</a>
        <a>Category</a>
        <a>Products</a>
        <a>About</a>
      </div>

      <div className="flex items-center gap-6">
        <User className="w-5 h-5" />
        <Heart className="w-5 h-5" />
        <ShoppingBag className="w-5 h-5" />
      </div>
    </nav>
  );
};

export default Navbar;
