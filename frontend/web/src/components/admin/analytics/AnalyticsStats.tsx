'use client';

import {
  DollarSign,
  ShoppingCart,
  TrendingUp,
  CreditCard,
  ArrowUpRight,
  ArrowDownRight,
} from 'lucide-react';

const stats = [
  {
    title: 'Total Revenue',
    value: '$54,239',
    change: '+12.5%',
    trend: 'up',
    icon: DollarSign,
    color: 'bg-emerald-100 text-emerald-600',
  },
  {
    title: 'Total Orders',
    value: '1,253',
    change: '+8.2%',
    trend: 'up',
    icon: ShoppingCart,
    color: 'bg-blue-100 text-blue-600',
  },
  {
    title: 'Avg. Order Value',
    value: '$43.28',
    change: '-2.1%',
    trend: 'down',
    icon: CreditCard,
    color: 'bg-purple-100 text-purple-600',
  },
  {
    title: 'Refund Rate',
    value: '1.2%',
    change: '+0.4%',
    trend: 'down', // down is bad for refund rate usually, but visually down arrow red is consistent
    icon: TrendingUp, // Maybe iterate on icon
    color: 'bg-amber-100 text-amber-600',
  },
];

export default function AnalyticsStats() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      {stats.map((stat, index) => (
        <div
          key={index}
          className="bg-white p-6 rounded-[20px] shadow-sm border border-gray-100 hover:shadow-md transition-shadow"
        >
          <div className="flex justify-between items-start mb-4">
            <div className={`p-3 rounded-xl ${stat.color}`}>
              <stat.icon size={22} />
            </div>
            <div
              className={`flex items-center gap-1 text-xs font-semibold px-2 py-1 rounded-lg ${
                stat.trend === 'up'
                  ? 'bg-emerald-50 text-emerald-600'
                  : 'bg-red-50 text-red-600'
              }`}
            >
              {stat.trend === 'up' ? (
                <ArrowUpRight size={14} />
              ) : (
                <ArrowDownRight size={14} />
              )}
              {stat.change}
            </div>
          </div>
          <div>
            <p className="text-gray-500 text-sm font-medium">{stat.title}</p>
            <h3 className="text-2xl font-bold text-gray-900 mt-1">
              {stat.value}
            </h3>
          </div>
        </div>
      ))}
    </div>
  );
}
