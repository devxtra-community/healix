"use client";

import React, { useState } from 'react';
import { Trash2, Plus, Minus, User, Heart, ShoppingBag, ArrowRight } from 'lucide-react';

const CartPage = () => {
  const [cartItems, setCartItems] = useState([
    {
      id: 1,
      name: "Healix",
      category: "Gut Health",
      price: 99.29,
      quantity: 1,
      image: "/api/placeholder/100/120",
      selected: true
    },
    {
      id: 2,
      name: "Healix",
      category: "Gut Health",
      price: 99.29,
      quantity: 1,
      image: "/api/placeholder/100/120",
      selected: true
    },
    {
      id: 3,
      name: "Healix",
      category: "Gut Health",
      price: 99.29,
      quantity: 1,
      image: "/api/placeholder/100/120",
      selected: false
    }
  ]);

  return (
    <div className="min-h-screen bg-white font-sans text-slate-900">
      {/* Promo Bar */}
      <div className="bg-[#1a1a1a] text-white text-center py-3 text-sm font-medium">
        Get Free SHIPPING On Order Above $200
      </div>

      {/* Navigation */}
      <nav className="flex items-center justify-between px-10 py-6 border-b border-gray-100">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 bg-[#2EB150] rounded-full flex items-center justify-center">
             <div className="w-2 h-2 bg-white rounded-full"></div>
          </div>
          <span className="font-bold text-xl">Healix</span>
        </div>
        
        <div className="hidden md:flex items-center gap-10 font-medium text-sm">
          <a href="#" className="hover:text-[#2EB150]">Category</a>
          <a href="#" className="hover:text-[#2EB150]">Products</a>
          <a href="#" className="hover:text-[#2EB150]">About</a>
        </div>

        <div className="flex items-center gap-6">
          <User size={22} className="cursor-pointer" />
          <Heart size={22} className="cursor-pointer" />
          <ShoppingBag size={22} className="cursor-pointer" />
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-10 py-12">
        <h1 className="text-3xl font-bold mb-10">Shopping Cart</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          
          {/* Cart Items List */}
          <div className="lg:col-span-2 space-y-8">
            {cartItems.map((item) => (
              <div key={item.id} className="pb-8 border-b border-gray-100 last:border-0 flex items-center gap-6">
                {/* Custom Checkbox */}
                <div className={`w-5 h-5 rounded border flex items-center justify-center cursor-pointer transition-colors ${item.selected ? 'bg-[#2EB150] border-[#2EB150]' : 'border-gray-300'}`}>
                  {item.selected && <div className="w-2 h-2 bg-white rounded-full" />}
                </div>

                {/* Product Image */}
                <div className="bg-[#f3f3f3] rounded-xl p-4 w-32 h-36 flex items-center justify-center">
                  <img src={item.image} alt={item.name} className="mix-blend-multiply h-full object-contain" />
                </div>

                {/* Product Details */}
                <div className="flex-grow">
                  <h3 className="font-bold text-lg">{item.name}</h3>
                  <p className="text-sm text-gray-500 mb-4">Category: <span className="text-gray-700">{item.category}</span></p>
                  
                  <div className="flex items-center gap-4 border border-gray-200 rounded-full w-fit px-3 py-1">
                    <button className="hover:text-[#2EB150]"><Minus size={14} /></button>
                    <span className="font-bold text-sm">{item.quantity}</span>
                    <button className="hover:text-[#2EB150]"><Plus size={14} /></button>
                  </div>
                </div>

                {/* Price & Action */}
                <div className="text-right flex flex-col justify-between items-end h-36 py-2">
                  <button className="text-gray-400 hover:text-red-500 bg-gray-50 p-2 rounded-full transition-colors">
                    <Trash2 size={20} />
                  </button>
                  <p className="font-bold text-xl">${item.price}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Order Summary Card */}
          <div className="lg:col-span-1">
            <div className="border border-gray-100 rounded-3xl p-8 sticky top-8">
              <h2 className="text-2xl font-bold mb-8">Order Summary</h2>
              
              <div className="space-y-4 text-gray-600 font-medium pb-6 border-b border-gray-100">
                <div className="flex justify-between">
                  <span>Subtotal Product</span>
                  <span className="text-black">$179.28</span>
                </div>
                <div className="flex justify-between">
                  <span>Shipping Fee</span>
                  <span className="text-black">$3.00</span>
                </div>
                <div className="flex justify-between">
                  <span>Taxes</span>
                  <span className="text-black">$2.00</span>
                </div>
                <div className="flex justify-between">
                  <span>Total Discount</span>
                  <span className="text-red-500">-$38.00</span>
                </div>
                <div className="flex justify-between">
                  <span>Service Charge</span>
                  <span className="text-black">$1.00</span>
                </div>
              </div>

              <div className="flex justify-between py-8 text-xl font-bold">
                <span>Total</span>
                <span>$147.00</span>
              </div>

              <button className="w-full bg-[#00e676] hover:bg-[#00c853] text-white py-4 rounded-full font-bold flex items-center justify-center gap-2 transition-transform active:scale-95">
                Checkout <ArrowRight size={20} />
              </button>
            </div>
          </div>

        </div>
      </main>
    </div>
  );
};

export default CartPage;