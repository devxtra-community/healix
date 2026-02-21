'use client';

import React from 'react';
import { Brain, Zap, Activity, Leaf, ArrowUpRight } from 'lucide-react';
import {CircularGallery} from '../animation/CircularGallery';
import Marquee from 'react-fast-marquee';


export default function HealixPage() {
  const categories = [
    { icon: <Zap size={18} />, label: 'Energy Boost' },
    { icon: <Brain size={18} />, label: 'Mental Clarity' },
    { icon: <Activity size={18} />, label: 'Daily Vitality' },
    { icon: <Leaf size={18} />, label: 'Gut Support' },
    { icon: <Zap size={18} />, label: 'Energy Boost' },
    { icon: <Brain size={18} />, label: 'Mental Clarity' },
    { icon: <Activity size={18} />, label: 'Daily Vitality' },
    { icon: <Leaf size={18} />, label: 'Gut Support' },
  ];

  // Data formatted specifically for the CircularGallery logic
  const galleryItems = [
    { image: '/images/scroll/1.png', text: 'Apple Vitality' },
    { image: '/images/scroll/2.png', text: 'Blue Vitality' },
    { image: '/images/scroll/3.png', text: 'Green Boost' },
    { image: '/images/scroll/4.png', text: 'Orange Vitality' },
    { image: '/images/scroll/5.png', text: 'Pomegranate Oats' },
  ];

  return (
    <div className="min-h-screen bg-white font-sans text-slate-900">
      {/* Top Banner Navigation */}
      <div className="border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4">
          <p className="text-center py-6 text-sm font-medium text-gray-600">
            Benefits That Support Your Everyday Wellness
          </p>
          <div className="flex overflow-x-auto no-scrollbar justify-between items-center py-4 border-t border-gray-100">
            <Marquee>
              {categories.map((cat, idx) => (
                <div
                  key={idx}
                  className="flex items-center space-x-2 px-6 border-r last:border-r-0 border-gray-200 whitespace-nowrap"
                >
                  {cat.icon}
                  <span className="text-sm font-bold uppercase tracking-tight">
                    {cat.label}
                  </span>
                </div>
              ))}
            </Marquee>
          </div>
        </div>
      </div>

      {/* Hero Section */}
      <section className="max-w-4xl mx-auto text-center py-20 px-6">
        <h1 className="text-3xl md:text-4xl leading-snug font-medium mb-10">
          At <span className="text-[#5D9F3C] font-bold">Healix,</span> we are
          passionate about <br />
          delivering clean, nutrient-dense products <br />
          that support a <span className="text-[#5D9F3C]">healthier</span>{' '}
          lifestyle. Rooted in <br />
          the
          <span className="text-[#5D9F3C]">science of wellness,</span> our store
          sources <br /> <span className="text-[#5D9F3C]">high-quality</span>{' '}
          ingredients and
          <span className="text-[#5D9F3C] ">
            follows <br />
            sustainable, transparent practices
          </span>{' '}
          to <br /> protect your health.
        </h1>
        <button className="bg-[#10E36E] hover:bg-[#0dc961] text-white px-8 py-3 rounded-full font-semibold flex items-center gap-2 mx-auto transition-all">
          Learn More
          <span className="bg-white text-[#10E36E] rounded-full p-1">
            <ArrowUpRight size={16} />
          </span>
        </button>
      </section>

      {/* WEBGL CIRCULAR GALLERY SECTION */}
      <section className="">
        <h2 className="text-center text-xl font-medium ">
          Your Daily Essential for Better Health
        </h2>

        {/* The height here is crucial for the OGL renderer */}
        <div className="h-[500px] w-full relative mb-6">
          <CircularGallery
            items={galleryItems}
            bend={2}
            textColor="black"
            borderRadius={0.03}
            scrollSpeed={1.5}
            scrollEase={0.05}
            font="bold 30px 'Inter', sans-serif"
          />
        </div>

        {/* Bottom CTA */}
        <div className="text-center px-6 mb-10">
          <p className="text-gray-600 text-sm max-w-md mx-auto mb-8">
            Explore our full range of targeted nutrition products designed to
            help you feel and perform your best every day.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="bg-[#10E36E] text-white px-8 py-3 rounded-full font-bold hover:brightness-105 transition-all">
              Find Your Perfect Product
            </button>
            <button className="bg-[#232323] text-white px-8 py-3 rounded-full font-bold hover:bg-black transition-all">
              Discover More
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
