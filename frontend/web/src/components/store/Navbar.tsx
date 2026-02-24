'use client';
import Link from 'next/link';
import { User, Heart, ShoppingBag, Leaf } from 'lucide-react';

const Navbar = () => {
   const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  };
  return (
    <nav className="flex items-center justify-between py-6 px-4 max-w-7xl mx-auto">
      <Link href={'/'} className="flex items-center gap-2">
        <Leaf className="w-6 h-6 text-green-500" />
        <span className="text-xl font-bold text-gray-900">Healix</span>
      </Link>

      <div className="hidden md:flex items-center gap-8 text-sm font-medium text-gray-600">
        <Link href="/" className="text-gray-900">
          Home
        </Link>        
        <a className='text-gray-900' onClick={() => scrollToSection("category")}>Category</a>
        <a className='text-gray-900' onClick={() => scrollToSection("products")} >Products</a>
        <Link className='text-gray-900' href="/about">About</Link>
      </div>

      <div className="flex items-center gap-6">
        <Link href="/profile">
          <User className="w-5 h-5 cursor-pointer" />
        </Link>
        <Heart className="w-5 h-5" />
        <Link href="/cart">
          <ShoppingBag className="w-5 h-5" />
        </Link>
      </div>
    </nav>
  );
};

export default Navbar;
