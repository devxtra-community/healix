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
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
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
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const selectedCategoryId = searchParams.get('category');

  useEffect(() => {
    const fetchCategories = async () => {
      const res = await CategoryService.getCategories();

      setCategories(res.data);
    };

    fetchCategories();
  }, []);

  const updateCategoryFilter = (categoryId?: string) => {
    const params = new URLSearchParams(searchParams.toString());

    if (categoryId) {
      params.set('category', categoryId);
    } else {
      params.delete('category');
    }

    const query = params.toString();
    router.push(
      query
        ? `${pathname}?${query}#products-section`
        : `${pathname}#products-section`,
    );
  };

  return (
    <section className="px-4 max-w-7xl mx-auto mb-16">
      <div className="flex justify-between mb-8">
        <h2 className="text-2xl font-bold">Category</h2>
        <div className="flex gap-2">
          <ChevronLeft className="w-8 h-8 p-2 bg-gray-100 rounded-full" />
          <ChevronRight className="w-8 h-8 p-2 bg-green-500 text-white rounded-full" />
        </div>
      </div>

      <div
        id="products"
        className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4"
      >
        <button
          type="button"
          onClick={() => updateCategoryFilter()}
          className={`rounded-2xl p-6 flex flex-col items-center border transition ${
            !selectedCategoryId
              ? 'bg-green-500 text-white border-green-500 shadow-lg'
              : 'bg-gray-50 hover:bg-white border-transparent hover:shadow-lg'
          }`}
        >
          <Sparkles className="w-6 h-6" />
          <span className="text-xs mt-2 font-medium">All</span>
        </button>
        {categories.map((cat) => (
          <button
            type="button"
            key={cat._id}
            onClick={() =>
              updateCategoryFilter(
                selectedCategoryId === cat._id ? undefined : cat._id,
              )
            }
            className={`rounded-2xl p-6 flex flex-col items-center border transition ${
              selectedCategoryId === cat._id
                ? 'bg-green-500 text-white border-green-500 shadow-lg'
                : 'bg-gray-50 hover:bg-white border-transparent hover:shadow-lg'
            }`}
          >
            {iconMap[cat.icon] ?? <Sparkles className="w-6 h-6" />}
            <span className="text-xs mt-2 font-medium">{cat.name}</span>
          </button>
        ))}
      </div>
    </section>
  );
};

export default CategorySection;
