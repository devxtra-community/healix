import { ArrowUp, ArrowDown } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: string;
  trend: number; // positive or negative percentage
  trendLabel: string;
}

export default function StatCard({
  title,
  value,
  trend,
  trendLabel,
}: StatCardProps) {
  const isPositive = trend > 0;

  return (
    <div className="bg-white rounded-[20px] p-5 md:p-6 shadow-[0_4px_6px_-1px_rgba(0,0,0,0.02),0_2px_4px_-1px_rgba(0,0,0,0.02)] flex flex-col justify-between h-full">
      <h3 className="text-sm text-gray-500 font-medium mb-3">{title}</h3>
      <div className="text-[2rem] font-bold text-gray-900 mb-4 -tracking-[0.03em]">
        {value}
      </div>

      <div className="flex items-center gap-2 text-xs">
        <span
          className={`
                    flex items-center gap-0.5 font-semibold px-1.5 py-0.5 rounded-xl
                    ${isPositive ? 'text-emerald-500 bg-emerald-100' : 'text-red-500 bg-red-100'}
                `}
        >
          {isPositive ? <ArrowUp size={14} /> : <ArrowDown size={14} />}
          {Math.abs(trend)}%
        </span>
        <span className="text-gray-400">{trendLabel}</span>
      </div>
    </div>
  );
}
