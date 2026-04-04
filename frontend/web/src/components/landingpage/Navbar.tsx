'use client';

import Link from 'next/link';
import Image from 'next/image';
import { User, Heart, ShoppingBag, Menu, X } from 'lucide-react';
import { useState } from 'react';
import Container from './Container';

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <nav className="py-4 md:py-6 w-full relative">
      <Container>
        <div className="flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-2">
            <div className="relative w-6 h-6">
              <Image
                src="/images/leaf.png"
                alt="Healix Leaf"
                fill
                className="object-contain"
              />
            </div>
            <span className="text-2xl font-bold tracking-tight">Healix</span>
          </div>

          {/* Desktop Links */}
          <div className="hidden md:flex items-center gap-10 text-lg font-medium text-gray-800">
            <a href="/store" className="hover:text-green-600">
              Shop
            </a>
            <a href="#">Health Goals</a>
            <a href="#">Blog</a>
            <a href="#">About</a>
          </div>

          {/* Icons + Hamburger */}
          <div className="flex items-center gap-4 md:gap-6">
            <Link href="/profile">
              <User className="w-6 h-6" />
            </Link>
            <Link href="/">
              <Heart className="w-6 h-6" />
            </Link>
            <Link href="/cart">
              <ShoppingBag className="w-6 h-6" />
            </Link>
            <button
              className="flex md:hidden items-center justify-center"
              onClick={() => setMenuOpen(!menuOpen)}
              aria-label="Toggle menu"
            >
              {menuOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>
          </div>
        </div>
      </Container>

      {/* Mobile Dropdown Menu */}
      {menuOpen && (
        <div className="md:hidden absolute top-full left-0 w-full bg-white border-t border-gray-100 shadow-lg z-50">
          <div className="flex flex-col">
            <a
              href="/store"
              className="py-4 px-6 border-b border-gray-100 text-base font-medium hover:bg-gray-50"
              onClick={() => setMenuOpen(false)}
            >
              Shop
            </a>
            <a
              href="#"
              className="py-4 px-6 border-b border-gray-100 text-base font-medium hover:bg-gray-50"
              onClick={() => setMenuOpen(false)}
            >
              Health Goals
            </a>
            <a
              href="#"
              className="py-4 px-6 border-b border-gray-100 text-base font-medium hover:bg-gray-50"
              onClick={() => setMenuOpen(false)}
            >
              Blog
            </a>
            <a
              href="#"
              className="py-4 px-6 text-base font-medium hover:bg-gray-50"
              onClick={() => setMenuOpen(false)}
            >
              About
            </a>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
