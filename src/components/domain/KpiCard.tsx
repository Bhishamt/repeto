import React from 'react';
import { Card } from '../ui/Card';
import { TrendingUp, TrendingDown } from 'lucide-react';

interface KpiCardProps {
  title: string;
  value: string | number;
  change?: string;
  isPositive?: boolean;
  icon: React.ReactNode;
  subtitle?: string;
}

export const KpiCard: React.FC<KpiCardProps> = ({
  title,
  value,
  change,
  isPositive = true,
  icon,
  subtitle,
}) => {
  return (
    <Card variant="glass" className="hover:border-[#3D281D]/30 transition-all duration-200">
      <div className="flex items-start justify-between">
        <div>
          <span className="text-xs font-semibold uppercase tracking-wider text-[#8C827A]">
            {title}
          </span>
          <h3 className="text-3xl font-extrabold font-heading text-[#3D281D] mt-1 tracking-tight">
            {value}
          </h3>
        </div>
        <div className="p-2.5 bg-[#EFE7DC] text-[#3D281D] rounded-xl border border-[#3D281D]/10">
          {icon}
        </div>
      </div>

      <div className="flex items-center gap-2 mt-4 pt-3 border-t border-[#3D281D]/10">
        {change && (
          <span
            className={`inline-flex items-center gap-1 text-xs font-bold px-2 py-0.5 rounded-full ${
              isPositive ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
            }`}
          >
            {isPositive ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
            {change}
          </span>
        )}
        <span className="text-xs text-[#57504B] font-medium">{subtitle || 'vs last month'}</span>
      </div>
    </Card>
  );
};
