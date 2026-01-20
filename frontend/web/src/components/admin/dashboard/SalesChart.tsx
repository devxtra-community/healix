'use client';

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

const data = [
  { name: 'Jan', sales: 2500 },
  { name: 'Feb', sales: 7500 },
  { name: 'Mar', sales: 6000 },
  { name: 'Apr', sales: 9000 },
  { name: 'May', sales: 7800 },
  { name: 'Jun', sales: 5500 },
  { name: 'Jul', sales: 3000 },
  { name: 'Aug', sales: 8500 },
  { name: 'Sep', sales: 7000 },
  { name: 'Oct', sales: 10000 },
  { name: 'Nov', sales: 6500 },
  { name: 'Dec', sales: 3500 },
];

export default function SalesChart() {
  return (
    <div className="bg-white rounded-[20px] p-6 shadow-[0_4px_6px_-1px_rgba(0,0,0,0.02)] h-full flex flex-col">
      <div className="flex justify-between items-center mb-8 max-[500px]:flex-col max-[500px]:items-start max-[500px]:gap-4">
        <h3 className="text-base font-semibold text-gray-900">
          Sales Analytics
        </h3>
        <div className="flex bg-gray-100 p-1 rounded-3xl max-[500px]:w-full max-[500px]:overflow-x-auto max-[500px]:pb-2">
          <button className="border-none bg-transparent py-1.5 px-4 rounded-3xl text-xs text-gray-500 cursor-pointer transition-all hover:bg-white hover:shadow-sm">
            Daily
          </button>
          <button className="border-none bg-transparent py-1.5 px-4 rounded-3xl text-xs text-gray-500 cursor-pointer transition-all hover:bg-white hover:shadow-sm">
            Weekly
          </button>
          <button className="border-none bg-black text-white py-1.5 px-4 rounded-3xl text-xs font-medium cursor-pointer transition-all shadow-sm">
            Monthly
          </button>
        </div>
      </div>

      <div className="flex-1 min-h-[250px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} barSize={32}>
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
              cursor={{ fill: 'transparent' }}
              contentStyle={{
                borderRadius: '12px',
                border: 'none',
                boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
              }}
            />
            <Bar dataKey="sales" fill="url(#colorSales)" radius={[6, 6, 6, 6]}>
              {/* Optional gradient definition if Recharts supports it inside or we use simple fill */}
            </Bar>
            {/* We can inject SVG defs for gradient fill */}
            <defs>
              <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#FCD34D" stopOpacity={1} />
                <stop offset="100%" stopColor="#FBBF24" stopOpacity={0.8} />
              </linearGradient>
            </defs>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
