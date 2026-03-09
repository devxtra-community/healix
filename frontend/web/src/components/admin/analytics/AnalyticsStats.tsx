'use client';

import { useEffect, useState } from 'react';
import {
  DollarSign,
  ShoppingCart,
  TrendingUp,
  CreditCard,
  ArrowUpRight,
  ArrowDownRight,
} from 'lucide-react';

import { analyticsService } from '@/src/services/analytics.service';
import { OverviewStats, GrowthStats } from '@/src/types/api/analytics.api';

interface StatsState {
  overview: OverviewStats;
  growth: GrowthStats;
}

export default function AnalyticsStats() {
  const [data, setData] = useState<StatsState | null>(null);

  useEffect(() => {
    const loadStats = async () => {
      const overview = await analyticsService.getOverview();
      const growth = await analyticsService.getGrowthStats();

      setData({ overview, growth });
    };

    loadStats();
  }, []);

  if (!data) return null;

  const stats = [
    {
      title: 'Total Revenue',
      value: `₹${data.overview.revenue.toLocaleString()}`,
      change: `${data.growth.revenueGrowth.toFixed(1)}%`,
      trend: data.growth.revenueGrowth >= 0 ? 'up' : 'down',
      icon: DollarSign,
      color: 'bg-emerald-100 text-emerald-600',
    },
    {
      title: 'Total Orders',
      value: data.overview.orders.toString(),
      change: `${data.growth.orderGrowth.toFixed(1)}%`,
      trend: data.growth.orderGrowth >= 0 ? 'up' : 'down',
      icon: ShoppingCart,
      color: 'bg-blue-100 text-blue-600',
    },
    {
      title: 'Avg. Order Value',
      value: `₹${data.overview.avgOrderValue.toFixed(2)}`,
      change: '—',
      trend: 'up',
      icon: CreditCard,
      color: 'bg-purple-100 text-purple-600',
    },
    {
      title: 'Refund Rate',
      value: `${data.overview.refundRate.toFixed(1)}%`,
      change: '—',
      trend: 'down',
      icon: TrendingUp,
      color: 'bg-amber-100 text-amber-600',
    },
  ];

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
