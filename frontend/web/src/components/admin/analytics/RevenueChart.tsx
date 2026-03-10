'use client';

import { useEffect, useState } from 'react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

import { analyticsService } from '@/src/services/analytics.service';
import { RevenueChartPoint } from '@/src/types/api/analytics.api';

interface ChartPoint {
  name: string;
  revenue: number;
  profit: number;
}

export default function RevenueChart() {
  const [data, setData] = useState<ChartPoint[]>([]);

  useEffect(() => {
    const loadRevenue = async () => {
      const res: RevenueChartPoint[] =
        await analyticsService.getRevenueChart(365);

      const chartData: ChartPoint[] = res.map((item) => ({
        name: new Date(item.date).toLocaleDateString('en-US', {
          month: 'short',
        }),
        revenue: item.revenue,
        profit: Math.round(item.revenue * 0.3), // placeholder profit calc
      }));

      setData(chartData);
    };

    loadRevenue();
  }, []);
  return (
    <div className="bg-white p-6 rounded-[20px] shadow-sm border border-gray-100 flex flex-col h-full">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h3 className="text-lg font-bold text-gray-900">Revenue Overview</h3>
          <p className="text-gray-500 text-sm">Monthly earnings performance</p>
        </div>
        <select className="bg-gray-50 border border-gray-200 text-gray-700 text-sm rounded-lg px-3 py-2 outline-none cursor-pointer">
          <option>Yearly</option>
          <option>Monthly</option>
          <option>Weekly</option>
        </select>
      </div>

      <div className="flex-1 min-h-[300px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data}>
            <defs>
              <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#10B981" stopOpacity={0.2} />
                <stop offset="95%" stopColor="#10B981" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="colorProfit" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.2} />
                <stop offset="95%" stopColor="#3B82F6" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid
              strokeDasharray="3 3"
              vertical={false}
              stroke="#E5E7EB"
            />
            <XAxis
              dataKey="name"
              axisLine={false}
              tickLine={false}
              tick={{ fill: '#9CA3AF', fontSize: 12 }}
              dy={10}
            />
            <YAxis
              axisLine={false}
              tickLine={false}
              tick={{ fill: '#9CA3AF', fontSize: 12 }}
              dx={-10}
            />
            <Tooltip
              contentStyle={{
                borderRadius: '12px',
                border: 'none',
                boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
              }}
            />
            <Area
              type="monotone"
              dataKey="revenue"
              stroke="#10B981"
              fillOpacity={1}
              fill="url(#colorRevenue)"
              strokeWidth={3}
            />
            <Area
              type="monotone"
              dataKey="profit"
              stroke="#3B82F6"
              fillOpacity={1}
              fill="url(#colorProfit)"
              strokeWidth={3}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
