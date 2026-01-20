'use client';

import AnalyticsStats from '@/src/components/admin/analytics/AnalyticsStats';
import RevenueChart from '@/src/components/admin/analytics/RevenueChart';
import TrafficSourceChart from '@/src/components/admin/analytics/TrafficSourceChart';
import { Calendar, Download } from 'lucide-react';

export default function AnalyticsPage() {
  return (
    <div className="flex flex-col gap-6 pt-2 pb-8">
      <div className="flex justify-between items-center max-sm:flex-col max-sm:items-start max-sm:gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Analytics</h1>
          <p className="text-gray-500 text-sm mt-1">
            Overview of your store's performance
          </p>
        </div>
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <button className="flex items-center gap-2 px-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors shadow-sm max-sm:flex-1">
            <Calendar size={18} className="text-gray-500" />
            <span>Oct 24, 2023 - Nov 24, 2023</span>
          </button>
          <button className="flex items-center justify-center gap-2 px-4 py-2.5 bg-black text-white rounded-xl text-sm font-medium hover:translate-y-[-1px] shadow-lg shadow-black/5 transition-all max-sm:flex-none">
            <Download size={18} />
          </button>
        </div>
      </div>

      <AnalyticsStats />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 min-h-[400px]">
          <RevenueChart />
        </div>
        <div className="min-h-[400px]">
          <TrafficSourceChart />
        </div>
      </div>
    </div>
  );
}
