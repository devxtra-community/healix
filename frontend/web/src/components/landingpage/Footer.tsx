import React from 'react';

export default function Footer() {
  return (
    <footer className="bg-[#5D9F3C] text-white py-10 md:py-16 px-6 md:px-10">
      <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12">
        {/* Story Column */}
        <div className="col-span-2 md:col-span-1">
          <h2 className="text-xl md:text-2xl font-bold mb-4 md:mb-6">
            HEALIX STORY
          </h2>
          <p className="text-sm md:text-lg leading-relaxed opacity-90">
            Bringing premium products to your doorstep with quality and trust.
          </p>
        </div>

        {/* Quick Links */}
        <div>
          <h3 className="font-bold mb-4 md:mb-6 text-base md:text-xl">
            Quick Links
          </h3>
          <ul className="space-y-2 md:space-y-3 opacity-90 text-sm md:text-base">
            <li>
              <a href="#" className="hover:underline">
                Home
              </a>
            </li>
            <li>
              <a href="#" className="hover:underline">
                Health Goals
              </a>
            </li>
            <li>
              <a href="#" className="hover:underline">
                Blog
              </a>
            </li>
            <li>
              <a href="#" className="hover:underline">
                About
              </a>
            </li>
          </ul>
        </div>

        {/* Customer Support */}
        <div>
          <h3 className="font-bold mb-4 md:mb-6 text-base md:text-xl">
            Customer support
          </h3>
          <ul className="space-y-2 md:space-y-3 opacity-90 text-sm md:text-base">
            <li>
              <a href="#" className="hover:underline">
                Shipping Policy
              </a>
            </li>
            <li>
              <a href="#" className="hover:underline">
                Return & Refund
              </a>
            </li>
            <li>
              <a href="#" className="hover:underline">
                Privacy Policy
              </a>
            </li>
            <li>
              <a href="#" className="hover:underline">
                Terms & Conditions
              </a>
            </li>
          </ul>
        </div>

        {/* Contact */}
        <div>
          <h3 className="font-bold mb-4 md:mb-6 text-base md:text-xl">
            Contact
          </h3>
          <ul className="space-y-2 md:space-y-3 opacity-90 text-sm md:text-base">
            <li>+91-7458946131</li>
            <li>support@gmail.com</li>
            <li>Kochi, Kerala</li>
          </ul>
        </div>
      </div>

      {/* Copyright */}
      <div className="mt-8 md:mt-12 pt-6 border-t border-white/20 text-center text-sm opacity-80">
        © 2025 Healix. All rights reserved.
      </div>
    </footer>
  );
}
