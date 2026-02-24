'use client';

import { useEffect, useState } from 'react';
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
import { CategoryService } from '@/src/services/category.service';

interface Category {
  _id: string;
  name: string;
  icon: string;
}

const iconMap: Record<string, React.ReactNode> = {
  wind: <Wind className="w-6 h-6" />,
  brain: <Brain className="w-6 h-6" />,
  moon: <Moon className="w-6 h-6" />,
  activity: <Activity className="w-6 h-6" />,
  sparkles: <Sparkles className="w-6 h-6" />,
  shield: <ShieldCheck className="w-6 h-6" />,
  dumbbell: <Dumbbell className="w-6 h-6" />,
};

const CategorySection = () => {
  const [categories, setCategories] = useState<Category[]>([]);

  useEffect(() => {
    const fetchCategories = async () => {
      const res = await CategoryService.getCategories();

      setCategories(res);
    };

    fetchCategories();
  }, []);

  return (
    <section className="px-4 max-w-7xl mx-auto mb-16">
      <div className="flex justify-between mb-8">
        <h2 className="text-2xl font-bold">Category</h2>
        <div className="flex gap-2">
          <ChevronLeft className="w-8 h-8 p-2 bg-gray-100 rounded-full" />
          <ChevronRight className="w-8 h-8 p-2 bg-green-500 text-white rounded-full" />
        </div>
      </div>

      <div id='products'  className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4">
        {categories.map((cat) => (
          <div
            key={cat._id}
            className="bg-gray-50 hover:bg-white rounded-2xl p-6 flex flex-col items-center hover:shadow-lg transition"
          >
            {iconMap[cat.icon]}
            <span className="text-xs mt-2">{cat.name}</span>
          </div>
        ))}
      </div>
    </section>
  );
};

export default CategorySection;
