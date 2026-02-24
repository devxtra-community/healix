'use client';
import Header from '../Header';
import React from 'react';
import {
  ArrowLeft,
  ChevronDown,
  CheckCircle2,
  Store,
  Truck,
  Calendar,
  Clock,
  Apple,
} from 'lucide-react';

export default function CheckoutPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50/40 via-white to-blue-50/30 font-sans text-gray-900 pb-20">
      {/* Header */}
      <Header />

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 mt-12">
        <div className="flex items-center gap-4 mb-10">
          <button className="p-2 hover:bg-gray-100 rounded-full transition-colors">
            <ArrowLeft className="w-6 h-6" />
          </button>
          <h1 className="text-4xl font-bold tracking-tight">Checkout</h1>
        </div>

        <div className="flex flex-col lg:flex-row gap-12 lg:gap-24">
          {/* Left Column - Forms */}
          <div className="flex-1 max-w-2xl">
            {/* 1. Contact Information */}
            <section className="mb-12">
              <h2 className="text-sm font-bold text-gray-800 mb-5">
                1. Contact Information
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-5">
                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                    First Name
                  </label>
                  <input
                    type="text"
                    defaultValue="Eduard"
                    className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm font-medium focus:outline-none focus:border-blue-400 focus:ring-4 focus:ring-blue-50 transition-all"
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                    Last Name
                  </label>
                  <input
                    type="text"
                    defaultValue="Franz"
                    className="w-full rounded-xl border border-blue-400 px-4 py-3 text-sm font-medium focus:outline-none ring-4 ring-blue-50 transition-all"
                    autoFocus
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                    Phone
                  </label>
                  <div className="flex rounded-xl border border-gray-200 overflow-hidden items-center bg-white pr-4 transition-all focus-within:border-blue-400 focus-within:ring-4 focus-within:ring-blue-50">
                    <button className="flex items-center gap-2 px-4 py-3 bg-gray-50/50 border-r border-gray-200 text-sm font-medium">
                      <span>🇺🇸</span>
                      <span>+380</span>
                      <ChevronDown className="w-4 h-4 text-gray-400" />
                    </button>
                    <input
                      type="text"
                      defaultValue="555-0115"
                      className="w-full px-4 py-3 text-sm font-medium focus:outline-none"
                    />
                    <CheckCircle2 className="w-5 h-5 text-green-500 shrink-0" />
                  </div>
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                    E-mail
                  </label>
                  <input
                    type="email"
                    defaultValue="Dinarys@gmail.com"
                    className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm font-medium focus:outline-none focus:border-blue-400 focus:ring-4 focus:ring-blue-50 transition-all"
                  />
                </div>
              </div>
            </section>

            {/* 2. Delivery Method */}
            <section className="mb-12">
              <h2 className="text-sm font-bold text-gray-800 mb-5">
                2. Delivery method
              </h2>

              <div className="flex gap-4 mb-6">
                <button className="flex items-center justify-center gap-2 px-8 py-3 rounded-xl border border-gray-200 bg-white text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors">
                  <Store className="w-4 h-4" />
                  Store
                </button>
                <button className="flex items-center justify-center gap-2 px-8 py-3 rounded-xl border-2 border-blue-500 bg-blue-50/30 text-sm font-medium text-blue-600 shadow-sm">
                  <Truck className="w-4 h-4" />
                  Delivery
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-5 mb-5">
                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                    Delivery Date
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      defaultValue="November 26th, 2021"
                      className="w-full rounded-xl border border-gray-200 pl-4 pr-12 py-3 text-sm font-medium focus:outline-none focus:border-blue-400 focus:ring-4 focus:ring-blue-50 transition-all"
                    />
                    <Calendar className="w-4 h-4 text-gray-400 absolute right-4 top-3.5" />
                  </div>
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                    Convenient Time
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      defaultValue="1 pm - 6 pm"
                      className="w-full rounded-xl border border-gray-200 pl-4 pr-12 py-3 text-sm font-medium focus:outline-none focus:border-blue-400 focus:ring-4 focus:ring-blue-50 transition-all"
                    />
                    <Clock className="w-4 h-4 text-gray-400 absolute right-4 top-3.5" />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-[1fr_2fr_1fr] gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                    City
                  </label>
                  <div className="relative">
                    <select className="w-full rounded-xl border border-gray-200 pl-4 pr-10 py-3 text-sm font-medium appearance-none focus:outline-none focus:border-blue-400 focus:ring-4 focus:ring-blue-50 bg-white transition-all">
                      <option>New Jersey</option>
                      <option>New York</option>
                    </select>
                    <ChevronDown className="w-4 h-4 text-gray-400 absolute right-3 top-4 pointer-events-none" />
                  </div>
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                    Address
                  </label>
                  <input
                    type="text"
                    defaultValue="2464 Royal Ln. Mesa"
                    className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm font-medium focus:outline-none focus:border-blue-400 focus:ring-4 focus:ring-blue-50 transition-all"
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                    Zip Code
                  </label>
                  <input
                    type="text"
                    defaultValue="45463"
                    className="w-full rounded-xl border border-blue-400 px-4 py-3 text-sm font-medium focus:outline-none ring-4 ring-blue-50 transition-all"
                  />
                </div>
              </div>
            </section>

            {/* 3. Payment Method */}
            <section>
              <h2 className="text-sm font-bold text-gray-800 mb-5">
                3. Payment method
              </h2>
              <div className="flex flex-wrap gap-4">
                {/* Mastercard Mock */}
                <button className="flex items-center justify-center w-28 h-12 rounded-xl border border-gray-200 bg-white hover:bg-gray-50 transition-colors">
                  <div className="flex">
                    <div className="w-4 h-4 rounded-full bg-red-500 opacity-80 z-10"></div>
                    <div className="w-4 h-4 rounded-full bg-yellow-400 opacity-80 -ml-2"></div>
                  </div>
                </button>

                {/* Visa */}
                <button className="flex items-center justify-center w-28 h-12 rounded-xl border-2 border-blue-500 bg-blue-50/30 text-blue-700 font-bold italic tracking-wider shadow-sm">
                  VISA
                </button>

                {/* Apple Pay */}
                <button className="flex items-center justify-center gap-1 w-28 h-12 rounded-xl border border-gray-200 bg-white font-semibold hover:bg-gray-50 transition-colors">
                  <Apple className="w-4 h-4 fill-current" /> Pay
                </button>

                {/* Other */}
                <button className="flex items-center justify-center w-28 h-12 rounded-xl border border-gray-200 bg-gray-50 text-xs font-bold text-gray-500 hover:bg-gray-100 transition-colors tracking-wide">
                  OTHER
                </button>
              </div>
            </section>
          </div>

          {/* Right Column - Order Summary Card */}
          <div className="w-full lg:w-[400px] shrink-0">
            <div className="bg-white rounded-3xl p-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)] sticky top-32">
              <h2 className="text-xl font-bold mb-6 text-gray-900">Order</h2>

              {/* Product Image Placeholder */}
              <div className="bg-gray-50 rounded-2xl h-56 mb-6 flex items-center justify-center border border-gray-100 p-6 relative">
                {/* Visual placeholder for the product shown in mockup */}
                <div className="w-24 h-40 bg-[#745f56] rounded-t-md rounded-b-xl relative flex flex-col items-center">
                  <div className="w-6 h-6 bg-[#5c4a43] absolute -top-4 rounded-t-sm"></div>
                  <div className="mt-4 bg-gray-100 w-20 h-24 rounded flex flex-col items-center p-2">
                    <div className="text-[8px] font-bold">Energy</div>
                    <div className="text-[8px] font-bold">Gel</div>
                  </div>
                </div>
              </div>

              <h3 className="text-lg font-bold leading-tight mb-4 pr-8">
                Nike Sportswear
                <br />
                Men's T-Shirt
              </h3>

              <div className="flex items-center gap-6 mb-6">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                    Size:
                  </span>
                  <button className="flex items-center gap-1 text-xs font-bold bg-white">
                    Xl <ChevronDown className="w-3 h-3 text-gray-500" />
                  </button>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                    Color:
                  </span>
                  <span className="text-xs font-bold text-gray-800">Red</span>
                </div>
              </div>

              <div className="flex items-end gap-3 mb-8">
                <span className="text-sm font-bold text-gray-400 line-through decoration-gray-300">
                  $139
                </span>
                <span className="text-xl font-bold text-red-500">$69</span>
              </div>

              <div className="h-px bg-gray-100 w-full mb-6"></div>

              <div className="space-y-4 mb-6">
                <div className="flex justify-between items-center text-xs font-bold text-gray-500 uppercase tracking-wider">
                  <span>Subtotal</span>
                  <span className="text-gray-900">$139</span>
                </div>
                <div className="flex justify-between items-center text-xs font-bold text-gray-500 uppercase tracking-wider">
                  <span>Discount (50% Off)</span>
                  <span className="text-gray-900">-$70</span>
                </div>
                <div className="flex justify-between items-center text-xs font-bold text-gray-500 uppercase tracking-wider">
                  <span>Shipping</span>
                  <span className="text-gray-900">Free</span>
                </div>
              </div>

              <div className="h-px bg-gray-100 w-full mb-6"></div>

              <div className="flex justify-between items-end mb-8">
                <span className="text-sm font-bold text-gray-800 uppercase tracking-wider">
                  Total
                </span>
                <span className="text-2xl font-black text-gray-900">$69</span>
              </div>

              <button className="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-4 rounded-xl flex items-center justify-center gap-2 transition-colors mb-4 shadow-lg shadow-blue-500/30">
                Checkout <span className="text-lg leading-none">→</span>
              </button>

              <label className="flex items-start gap-3 cursor-pointer group">
                <div className="relative flex items-center mt-0.5">
                  <input
                    type="checkbox"
                    defaultChecked
                    className="peer w-4 h-4 appearance-none rounded border border-gray-300 checked:bg-blue-500 checked:border-blue-500 transition-colors"
                  />
                  <CheckCircle2 className="w-3 h-3 text-white absolute left-0.5 pointer-events-none opacity-0 peer-checked:opacity-100" />
                </div>
                <span className="text-xs text-gray-500 leading-relaxed font-medium">
                  by confirming the order, I accept the{' '}
                  <a
                    href="#"
                    className="text-blue-500 underline decoration-blue-500/30 hover:decoration-blue-500"
                  >
                    terms of the user
                  </a>{' '}
                  agreement
                </span>
              </label>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
