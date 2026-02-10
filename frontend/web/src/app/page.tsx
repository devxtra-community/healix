'use client';

import Image from 'next/image'; // Import Next.js Image component
import Hero from '../components/landingpage/Hero';
import Personalization from '../components/landingpage/Personalization';
import Testimonials from '../components/landingpage/Testimonials';
import Footer from '../components/landingpage/Footer';

import { User, Heart, ShoppingBag, ArrowUpRight } from 'lucide-react';

// --- Components ---

const Navbar = () => (
  <nav className="flex items-center justify-between py-6 px-6 max-w-[1400px] mx-auto w-full">
    {/* Logo Section */}
    <div className="flex items-center gap-2">
      <div className="relative w-6 h-6">
        <Image
          src="/images/leaf.png"
          alt="Healix Leaf"
          fill
          className="object-contain"
        />
      </div>
      <span className="text-2xl font-bold text-gray-900 tracking-tight">
        Healix
      </span>
    </div>

    {/* Links */}
    <div className="hidden md:flex items-center gap-10 text-xl font-medium text-gray-800">
      <a href="#" className="hover:text-green-600 transition">
        Shop
      </a>
      <a href="#" className="hover:text-green-600 transition">
        Health Goals
      </a>
      <a href="#" className="hover:text-green-600 transition">
        Blog
      </a>
      <a href="#" className="hover:text-green-600 transition">
        About
      </a>
    </div>

    {/* Icons */}
    <div className="flex items-center  gap-6">
      <button className="text-gray-900 hover:text-green-600">
        <User className="w-7 h-7" />
      </button>
      <button className="text-gray-900 hover:text-green-600">
        <Heart className="w-7 h-7" />
      </button>
      <button className="text-gray-900 hover:text-green-600">
        <ShoppingBag className="w-7 h-7" />
      </button>
    </div>
  </nav>
);

const HeroText = () => (
  <section className="text-center px-4 mt-12 mb-16 max-w-4xl mx-auto">
    <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6 tracking-tight leading-tight">
      Pure Nutrition for <br />
      Your Wellness Journey
    </h1>
    <p className="text-gray-500 text-lg md:text-xl mb-10 max-w-2xl mx-auto leading-relaxed">
      Clean, targeted formulas that fuel your gut,
      <br className="hidden md:block" />
      mind, and energy every day.
    </p>

    <div className="flex items-center bg-white border border-gray-200 p-2 pl-6 rounded-full shadow-sm max-w-md mx-auto">
      <input
        type="text"
        placeholder="Search your product"
        className="bg-transparent flex-grow outline-none text-gray-600 placeholder-gray-400 text-base"
      />
      <button className="bg-[#00DC58] hover:bg-[#00c950] text-white px-8 py-3 rounded-full text-sm font-bold transition-colors shadow-lg shadow-green-100">
        Search
      </button>
    </div>
  </section>
);

// UPDATED: Now accepts an imageSrc prop
const ProductCard = ({
  imageSrc,
  heightClass,
  title,
  shapeClass = 'rounded-3xl',
  bgColor = 'bg-gray-100', // Fallback color while image loads
}: {
  imageSrc: string;
  heightClass: string;
  title: string;
  shapeClass?: string;
  bgColor?: string;
}) => (
  <div
    className={`${heightClass} ${shapeClass} ${bgColor} w-full relative group overflow-hidden transition-transform hover:scale-[1.02] duration-500`}
  >
    {/* The Image */}
    <Image
      src={imageSrc}
      alt={title}
      fill // This makes the image fill the container container
      className="object-cover" // Ensures image covers the area without stretching
      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
    />

    {/* Optional: Hover overlay effect */}
    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors duration-300" />
  </div>
);

const MasonryGrid = () => {
  return (
    <div className="px-4 pb-20 max-w-[1400px] mx-auto">
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6 items-end">
        {/* Column 1 */}
        <div className="flex flex-col gap-6">
          <ProductCard
            imageSrc="/images/orange.png"
            bgColor="bg-white"
            heightClass="h-[380px]"
            title="Orange"
          />
          <ProductCard
            imageSrc="/images/lemon.png"
            bgColor="bg-white"
            heightClass="h-[140px]"
            title="Lemon Energy"
          />
        </div>

        {/* Column 2 */}
        <div className="flex flex-col gap-6">
          <ProductCard
            imageSrc="/images/greenboost.png"
            bgColor="bg-white"
            heightClass="h-[410px]"
            title="Green Boost"
          />
        </div>

        {/* Column 3 (Center) */}
        <div className="flex flex-col gap-6 items-center">
          <ProductCard
            imageSrc="/images/red.png"
            bgColor="bg-rose-600"
            heightClass="h-[240px]"
            title="Pomegranate Oatmeal"
          />

          <button className="w-full bg-gray-900 text-white py-6 rounded-2xl flex items-center justify-center gap-2 hover:bg-black transition-colors group">
            <span className="font-medium">Explore Products</span>
            <ArrowUpRight className="w-4 h-4 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
          </button>
        </div>

        {/* Column 4 */}
        <div className="flex flex-col gap-6">
          <ProductCard
            imageSrc="/images/blue.png"
            bgColor="bg-white"
            heightClass="h-[410px]"
            title="Blue Vitality"
          />
        </div>

        {/* Column 5 */}
        <div className="flex flex-col gap-6">
          <ProductCard
            imageSrc="/images/apple.png"
            bgColor="bg-white"
            heightClass="h-[380px]"
            title="Apple Vitality"
          />
          <ProductCard
            imageSrc="/images/watermelon.png"
            bgColor="bg-red-400"
            heightClass="h-[140px]"
            title="Watermelon"
          />
        </div>
      </div>
    </div>
  );
};

export default function Home() {
  return (
    <main className="min-h-screen bg-white font-sans text-gray-900 selection:bg-green-100">
      <Navbar />
      <HeroText />
      <MasonryGrid />
      <Hero />
      <Personalization />
      <Testimonials />
      <Footer />
    </main>
  );
}
