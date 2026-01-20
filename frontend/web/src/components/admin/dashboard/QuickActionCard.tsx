import { ArrowUpRight } from 'lucide-react';

interface QuickActionCardProps {
  title: string;
  subtitle: string;
  gradient: string;
}

export default function QuickActionCard({
  title,
  subtitle,
  gradient,
}: QuickActionCardProps) {
  return (
    <div
      className="rounded-2xl p-5 flex justify-between items-start min-h-[100px] relative overflow-hidden transition-transform duration-200 cursor-pointer hover:-translate-y-0.5"
      style={{ background: gradient }}
    >
      <div className="relative z-10">
        <h3 className="text-[0.95rem] font-semibold text-gray-800 mb-1">
          {title}
        </h3>
        <p className="text-xs text-gray-600 leading-snug max-w-[90%]">
          {subtitle}
        </p>
      </div>
      <div className="bg-white/40 p-1.5 rounded-full flex items-center justify-center backdrop-blur-sm">
        <ArrowUpRight size={18} className="text-gray-800" />
      </div>
    </div>
  );
}
