'use client';

import Hero from '../components/landingpage/Hero';
import Personalization from '../components/landingpage/Personalization';
import Testimonials from '../components/landingpage/Testimonials';
import Footer from '../components/landingpage/Footer';

import Navbar from '../components/landingpage/Navbar';
import MasonryGrid from '../components/landingpage/MasonrtGrid';
import HeroText from '../components/landingpage/HeroText';






export default function Home() {
  return (
    <main className="min-h-screen bg-white font-sans text-gray-900 selection:bg-green-100">
      <Navbar />
      <HeroText/>
      <MasonryGrid />
      <Hero />
      <Personalization />
      <Testimonials />
      <Footer />
    </main>
  );
}
