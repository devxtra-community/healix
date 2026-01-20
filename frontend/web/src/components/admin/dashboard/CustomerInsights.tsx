import { User, Crown, Users } from 'lucide-react';

const stats = [
  {
    label: 'New Customers',
    count: 15,
    sub: 'This week',
    icon: User,
    color: '#e0f2fe',
    iconColor: '#0ea5e9',
  },
  {
    label: 'VIP Customers',
    count: 12,
    sub: 'Active',
    icon: Crown,
    color: '#fef3c7',
    iconColor: '#d97706',
  },
  {
    label: 'Total Customers',
    count: '2,847',
    sub: 'All time',
    icon: Users,
    color: '#dcfce7',
    iconColor: '#16a34a',
  },
];

const topCustomers = [
  { name: 'Alice Johnson', orders: 23, spent: '$2,340', img: 'AJ' },
  { name: 'Robert Smith', orders: 18, spent: '$1,980', img: 'RS' },
  { name: 'Maria Garcia', orders: 15, spent: '$1,850', img: 'MG' },
];

export default function CustomerInsights() {
  return (
    <div className="bg-white rounded-[20px] p-6 shadow-[0_4px_6px_-1px_rgba(0,0,0,0.02)] h-full flex flex-col">
      <h3 className="text-base font-semibold text-gray-900 mb-6">
        Customer Insights
      </h3>

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

      <div className="mb-8">
        <h4 className="text-sm font-semibold text-gray-700 mb-4 block">
          Top Customers
        </h4>
        <div className="flex flex-col gap-4">
          {topCustomers.map((customer) => (
            <div key={customer.name} className="flex items-center">
              <div className="w-9 h-9 rounded-full bg-gray-200 text-gray-500 text-xs font-semibold flex items-center justify-center mr-3">
                {customer.img}
              </div>
              <div className="flex-1">
                <div className="text-[0.85rem] font-semibold text-gray-700">
                  {customer.name}
                </div>
                <div className="text-xs text-gray-400">
                  {customer.orders} orders
                </div>
              </div>
              <div className="text-[0.85rem] font-semibold text-emerald-500">
                {customer.spent}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-auto">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm font-semibold text-gray-700">
            Customer Retention
          </span>
          <span className="text-sm font-bold text-emerald-500">60%</span>
        </div>
        <div className="w-full h-1.5 bg-gray-100 rounded-full mb-2 overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-emerald-400 to-emerald-500 rounded-full"
            style={{ width: '60%' }}
          ></div>
        </div>
        <p className="text-xs text-gray-400">+2.4% from last month</p>
      </div>
    </div>
  );
}
