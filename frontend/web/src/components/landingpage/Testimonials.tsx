import React from 'react';

const reviews = [
  { img: '/images/scroll/1.png', name: 'Sarah M.' },
  { img: '/images/scroll/2.png', name: 'Sarah M.' },
  { img: '/images/scroll/3.png', name: 'Sarah M.' },
  { img: '/images/scroll/4.png', name: 'Sarah M.' },
  { img: '/images/scroll/5.png', name: 'Sarah M.' },
];

export default function Testimonials() {
  const quote =
    "I've tried so many supplements, but nothing ever felt right. My personalized formula finally gave me steady energy without the crashes. Total game changer!";

  return (
    <section className="py-12 md:py-20 bg-white overflow-hidden">
      <h2 className="text-2xl md:text-3xl font-semibold text-center mb-8 md:mb-16">
        What Our Customers Are Saying
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 px-4 max-w-5xl mx-auto">
        {reviews.map((item, idx) => (
          <div
            key={idx}
            className="flex bg-white border border-gray-100 rounded-xl p-4 shadow-sm w-full items-start gap-4"
          >
            <img
              src={item.img}
              alt="Product"
              className="w-16 h-16 md:w-20 md:h-20 rounded-lg object-cover flex-shrink-0"
            />
            <div>
              <p className="text-sm text-gray-600 italic mb-2">"{quote}"</p>
              <p className="text-sm font-bold">{item.name}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
