'use client';

import {
  Megaphone,
  Users,
  Target,
  BarChart2,
  ArrowUpRight,
  ArrowDownRight,
} from 'lucide-react';

const stats = [
  {
    title: 'Total Reach',
    value: '1.2M',
    change: '+15.3%',
    trend: 'up',
    icon: Megaphone,
    color: 'bg-indigo-100 text-indigo-600',
  },
  {
    title: 'Ad Spend',
    value: '$12,450',
    change: '+4.2%',
    trend: 'up',
    icon: Target,
    color: 'bg-rose-100 text-rose-600',
  },
  {
    title: 'Return on Ad Spend',
    value: '4.2x',
    change: '+1.1%',
    trend: 'up',
    icon: BarChart2,
    color: 'bg-emerald-100 text-emerald-600',
  },
  {
    title: 'Conversion Rate',
    value: '3.8%',
    change: '-0.5%',
    trend: 'down',
    icon: Users,
    color: 'bg-blue-100 text-blue-600',
  },
];

export default function MarketingStats() {
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
