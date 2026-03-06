'use client';

import { useEffect, useState } from 'react';
import { User, Crown, Users } from 'lucide-react';
import { customerService } from '@/src/services/customer.service';

interface TopCustomer {
  _id: string;
  name: string;
  totalOrders: number;
  totalSpent: number;
}

interface Insights {
  newCustomers: number;
  vipCustomers: number;
  totalCustomers: number;
  retentionRate: number;
  retentionGrowth: number;
  topCustomers: TopCustomer[];
}

export default function CustomerInsights() {
  const [data, setData] = useState<Insights | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchInsights();
  }, []);

  const fetchInsights = async () => {
    try {
      setLoading(true);
      const res = await customerService.getCustomerInsights();
      setData(res);
    } catch (error) {
      console.error('Failed to fetch customer insights', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="bg-white rounded-[20px] p-6 shadow-sm">
        Loading insights...
      </div>
    );
  }

  if (!data) return null;

  const stats = [
    {
      label: 'New Customers',
      count: data.newCustomers,
      sub: 'This week',
      icon: User,
      color: '#e0f2fe',
      iconColor: '#0ea5e9',
    },
    {
      label: 'VIP Customers',
      count: data.vipCustomers,
      sub: 'Active',
      icon: Crown,
      color: '#fef3c7',
      iconColor: '#d97706',
    },
    {
      label: 'Total Customers',
      count: data.totalCustomers,
      sub: 'All time',
      icon: Users,
      color: '#dcfce7',
      iconColor: '#16a34a',
    },
  ];

  return (
    <div className="bg-white rounded-[20px] p-6 shadow-[0_4px_6px_-1px_rgba(0,0,0,0.02)] h-full flex flex-col">
      <h3 className="text-base font-semibold text-gray-900 mb-6">
        Customer Insights
      </h3>

      {/* Stats */}
      <div className="flex flex-col gap-5 mb-8">
        {stats.map((stat) => (
          <div key={stat.label} className="flex items-center">
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center mr-4"
              style={{ backgroundColor: stat.color }}
            >
              <stat.icon size={18} color={stat.iconColor} />
            </div>

            <div className="flex-1">
              <div className="text-sm font-semibold text-gray-700">
                {stat.label}
              </div>
              <div className="text-xs text-gray-400">{stat.sub}</div>
            </div>

            <div className="text-base font-bold text-gray-900">
              {stat.count}
            </div>
          </div>
        ))}
      </div>

      {/* Top Customers */}
      <div className="mb-8">
        <h4 className="text-sm font-semibold text-gray-700 mb-4 block">
          Top Customers
        </h4>

        <div className="flex flex-col gap-4">
          {data.topCustomers.map((customer) => (
            <div key={customer._id} className="flex items-center">
              <div className="w-9 h-9 rounded-full bg-gray-200 text-gray-500 text-xs font-semibold flex items-center justify-center mr-3">
                {customer.name?.slice(0, 2).toUpperCase()}
              </div>

              <div className="flex-1">
                <div className="text-[0.85rem] font-semibold text-gray-700">
                  {customer.name}
                </div>
                <div className="text-xs text-gray-400">
                  {customer.totalOrders} orders
                </div>
              </div>

              <div className="text-[0.85rem] font-semibold text-emerald-500">
                ₹{customer.totalSpent.toLocaleString()}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Retention */}
      <div className="mt-auto">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm font-semibold text-gray-700">
            Customer Retention
          </span>
          <span className="text-sm font-bold text-emerald-500">
            {data.retentionRate}%
          </span>
        </div>

        <div className="w-full h-1.5 bg-gray-100 rounded-full mb-2 overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-emerald-400 to-emerald-500 rounded-full"
            style={{ width: `${data.retentionRate}%` }}
          />
        </div>

        <p className="text-xs text-gray-400">
          +{data.retentionGrowth}% from last month
        </p>
      </div>
    </div>
  );
}
