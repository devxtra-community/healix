'use client';

import {
  Wind,
  Brain,
  Moon,
  Activity,
  Sparkles,
  ShieldCheck,
  Dumbbell,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';

const categories = [
  { id: 1, name: 'Gut Health', icon: <Wind className="w-6 h-6" /> },
  { id: 2, name: 'Drinks', icon: <Brain className="w-6 h-6" /> },
  { id: 3, name: 'Sleep & Stress', icon: <Moon className="w-6 h-6" /> },
  { id: 4, name: "Women's Health", icon: <Activity className="w-6 h-6" /> },
  { id: 5, name: 'Beauty', icon: <Sparkles className="w-6 h-6" /> },
  { id: 6, name: 'Immunity', icon: <ShieldCheck className="w-6 h-6" /> },
  { id: 7, name: 'Muscle Gain', icon: <Dumbbell className="w-6 h-6" /> },
];

const CategorySection = () => {
  return (
    <section className="px-4 max-w-7xl mx-auto mb-16">
      <div className="flex justify-between mb-8">
        <h2 className="text-2xl font-bold">Category</h2>
        <div className="flex gap-2">
          <ChevronLeft className="w-8 h-8 p-2 bg-gray-100 rounded-full" />
          <ChevronRight className="w-8 h-8 p-2 bg-green-500 text-white rounded-full" />
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4">
        {categories.map(cat => (
          <div
            key={cat.id}
            className="bg-gray-50 hover:bg-white rounded-2xl p-6 flex flex-col items-center hover:shadow-lg transition"
          >
            {cat.icon}
            <span className="text-xs mt-2">{cat.name}</span>
          </div>
        ))}
      </div>
    </section>
  );
};

export default CategorySection;
