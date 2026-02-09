'use client';

import React, { useState } from 'react';
import { 
  Search, 
  User, 
  Heart, 
  ShoppingBag, 
  ChevronLeft, 
  ChevronRight, 
  Wind, 
  Brain, 
  Moon, 
  Activity, // Using Activity as a proxy for 'Women's Health' icon
  Sparkles, 
  ShieldCheck, 
  Dumbbell,
  Leaf,
  Plus,
  Minus
} from 'lucide-react';

// --- Types ---
interface Category {
  id: number;
  name: string;
  icon: React.ReactNode;
}

interface Product {
  id: number;
  name: string;
  price: number;
  image: string;
}

// --- Mock Data ---
const categories: Category[] = [
  { id: 1, name: 'Gut Health', icon: <Wind className="w-6 h-6" /> },
  { id: 2, name: 'Drinks', icon: <Brain className="w-6 h-6" /> },
  { id: 3, name: 'Sleep & Stress', icon: <Moon className="w-6 h-6" /> },
  { id: 4, name: "Women's Health", icon: <Activity className="w-6 h-6" /> },
  { id: 5, name: 'Beauty', icon: <Sparkles className="w-6 h-6" /> },
  { id: 6, name: 'Immunity', icon: <ShieldCheck className="w-6 h-6" /> },
  { id: 7, name: 'Muscle Gain', icon: <Dumbbell className="w-6 h-6" /> },
];

const products: Product[] = [
  { id: 1, name: 'Kambucha', price: 10, image: '/kombucha.png' }, // Placeholder paths
  { id: 2, name: 'Kambucha', price: 10, image: '/kombucha.png' },
  { id: 3, name: 'Kambucha', price: 10, image: '/kombucha.png' },
];

// --- Components ---

const Navbar = () => (
  <nav className="flex items-center justify-between py-6 px-4 max-w-7xl mx-auto">
    {/* Logo */}
    <div className="flex items-center gap-2">
      <div className="text-green-500">
        <Leaf className="w-6 h-6 fill-current" />
      </div>
      <span className="text-xl font-bold text-gray-900 tracking-tight">Healix</span>
    </div>

    {/* Links */}
    <div className="hidden md:flex items-center gap-8 text-sm font-medium text-gray-600">
      <a href="#" className="text-gray-900">Home</a>
      <a href="#" className="hover:text-gray-900">Category</a>
      <a href="#" className="hover:text-gray-900">Products</a>
      <a href="#" className="hover:text-gray-900">About</a>
    </div>

    {/* Icons */}
    <div className="flex items-center gap-6">
      <button className="text-gray-700 hover:text-green-500"><User className="w-5 h-5" /></button>
      <button className="text-gray-700 hover:text-green-500"><Heart className="w-5 h-5" /></button>
      <button className="text-gray-700 hover:text-green-500"><ShoppingBag className="w-5 h-5" /></button>
    </div>
  </nav>
);

const Hero = () => {
  return (
    <section className="px-4 max-w-7xl mx-auto mb-16">
      <div className="bg-[#F0FFF4] rounded-[2.5rem] p-8 md:p-16 relative overflow-hidden min-h-[480px] flex items-center">
        
        {/* Decorative Circles / Abstract Food Shapes (Placeholders for 3D assets) */}
        {/* Top Left Pomegranate */}
        <div className="absolute top-0 left-0 w-32 h-32 bg-red-100 rounded-full opacity-0 md:opacity-100 translate-x-[-20%] translate-y-[-20%] blur-sm pointer-events-none"></div>
        
        {/* Top Right Berries */}
        <div className="absolute top-10 right-10 w-24 h-24 bg-purple-100 rounded-full opacity-0 md:opacity-100 blur-sm pointer-events-none"></div>

        {/* Bottom Right Kombucha Bottle Placeholder */}
        <div className="absolute bottom-[-50px] right-[-20px] md:right-[50px] w-40 h-64 bg-orange-100 rotate-12 rounded-3xl opacity-50 blur-xl pointer-events-none"></div>


        <div className="relative z-10 max-w-xl">
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 leading-[1.1] mb-8">
            Order your <br />
            Daily Nutritions
          </h1>

          <div className="flex items-center bg-white/60 backdrop-blur-sm border border-white p-2 pl-6 rounded-full shadow-sm max-w-md">
            <input 
              type="text" 
              placeholder="Search your product" 
              className="bg-transparent flex-grow outline-none text-gray-600 placeholder-gray-400 text-sm"
            />
            <button className="bg-[#00DC58] hover:bg-[#00c950] text-white px-8 py-3 rounded-full text-sm font-semibold transition-colors">
              Search
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

const CategorySection = () => {
  return (
    <section className="px-4 max-w-7xl mx-auto mb-16">
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-2xl font-bold text-gray-900">Category</h2>
        <div className="flex gap-2">
          <button className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-200 transition">
            <ChevronLeft className="w-4 h-4 text-gray-600" />
          </button>
          <button className="w-8 h-8 rounded-full bg-[#00DC58] flex items-center justify-center hover:bg-[#00c950] transition shadow-md shadow-green-200">
            <ChevronRight className="w-4 h-4 text-white" />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4">
        {categories.map((cat) => (
          <div 
            key={cat.id} 
            className="flex flex-col items-center justify-center bg-gray-50 hover:bg-white hover:shadow-lg hover:-translate-y-1 transition-all duration-300 rounded-2xl p-6 cursor-pointer group h-32"
          >
            <div className="mb-3 text-gray-800 group-hover:text-[#00DC58] transition-colors">
              {cat.icon}
            </div>
            <span className="text-xs font-medium text-gray-600 text-center">{cat.name}</span>
          </div>
        ))}
      </div>
    </section>
  );
};

const ProductCard = ({ product }: { product: Product }) => {
  const [quantity, setQuantity] = useState(1);

  const increment = () => setQuantity(q => q + 1);
  const decrement = () => setQuantity(q => (q > 1 ? q - 1 : 1));

  return (
    <div className="bg-white border border-gray-100 rounded-3xl p-6 flex flex-col hover:shadow-xl transition-shadow duration-300">
      {/* Image Area */}
      <div className="h-48 flex items-center justify-center mb-4 relative">
        {/* Placeholder for the bottle image */}
        <div className="w-24 h-40 bg-gradient-to-b from-orange-300 to-orange-500 rounded-full opacity-80 blur-[1px] absolute"></div>
        <div className="z-10 text-center">
            {/* Since we don't have the real image asset, utilizing a colored div to simulate the bottle look */}
            <div className="w-20 h-36 bg-orange-100 rounded-t-full rounded-b-xl border-4 border-orange-200 mx-auto flex items-center justify-center">
                <span className="text-[10px] font-bold text-orange-800 -rotate-12 block bg-white px-1">KOMBUCHA</span>
            </div>
        </div>
      </div>

      <div className="mt-auto">
        <h3 className="font-semibold text-gray-900 mb-1">{product.name}</h3>
        <p className="text-lg font-bold text-gray-900 mb-4">${product.price}</p>
        
        <div className="flex items-center justify-between">
          <div className="flex items-center bg-gray-100 rounded-full px-2 py-1">
            <button 
              onClick={decrement}
              className="w-6 h-6 flex items-center justify-center text-gray-600 hover:text-black text-sm"
            >
              <Minus className="w-3 h-3" />
            </button>
            <span className="w-6 text-center text-sm font-semibold text-gray-900">{quantity}</span>
            <button 
              onClick={increment}
              className="w-6 h-6 flex items-center justify-center text-gray-600 hover:text-black text-sm"
            >
              <Plus className="w-3 h-3" />
            </button>
          </div>

          <button className="bg-[#00DC58] hover:bg-[#00c950] text-white text-xs font-semibold px-4 py-2 rounded-full shadow-lg shadow-green-100 transition-colors">
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  );
};

const ProductSection = () => {
  return (
    <section className="px-4 max-w-7xl mx-auto pb-20">
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-2xl font-bold text-gray-900">Popular Product</h2>
        <button className="bg-[#00DC58] hover:bg-[#00c950] text-white px-6 py-2 rounded-full text-sm font-semibold shadow-md shadow-green-200 transition-colors">
          See all
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {products.map((product, index) => (
          <ProductCard key={`${product.id}-${index}`} product={product} />
        ))}
      </div>
    </section>
  );
};

export default function Home() {
  return (
    <main className="min-h-screen bg-white font-sans text-gray-900">
      <Navbar />
      <Hero />
      <CategorySection />
      <ProductSection />
    </main>
  );
}