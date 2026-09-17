import React from 'react';
import { Business, BusinessCustomer } from '../../types';
import { QrCode, Sparkles, ChevronRight } from 'lucide-react';
import { Badge } from '../ui/Badge';

interface WalletCardProps {
  business: Business;
  membership?: BusinessCustomer;
  onOpenQr?: () => void;
  isActive?: boolean;
}

export const WalletCard: React.FC<WalletCardProps> = ({
  business,
  membership,
  onOpenQr,
  isActive = false,
}) => {
  const points = membership?.totalPoints ?? 0;
  const visits = membership?.totalVisits ?? 0;
  const tier = membership?.tier || 'Bronze';

  return (
    <div
      className={`relative w-full rounded-2xl p-6 transition-all duration-300 overflow-hidden ${
        isActive
          ? 'espresso-gradient text-[#FDFBF7] shadow-xl border border-amber-500/30 ring-2 ring-[#D97706]/40'
          : 'bg-[#291A12] text-[#FDFBF7] border border-[#FDFBF7]/10 hover:border-[#D97706]/50 shadow-lg'
      }`}
    >
      {/* Background Decorative Accents */}
      <div className="absolute -top-12 -right-12 w-40 h-40 rounded-full bg-amber-500/10 blur-2xl pointer-events-none" />
      <div className="absolute -bottom-12 -left-12 w-40 h-40 rounded-full bg-[#3B1F2B]/40 blur-2xl pointer-events-none" />

      <div className="relative z-10 flex flex-col gap-5">
        {/* Header: Logo, Name & Tier */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img
              src={business.logoUrl}
              alt={business.name}
              className="w-11 h-11 rounded-xl object-cover border border-white/20 shadow-md"
            />
            <div>
              <h3 className="font-heading font-bold text-lg leading-tight tracking-tight text-white">
                {business.name}
              </h3>
              <p className="text-xs text-amber-200/80 font-medium">{business.city}</p>
            </div>
          </div>
          <Badge variant="amber" className="bg-amber-500/20 text-amber-300 border-amber-400/30">
            {tier}
          </Badge>
        </div>

        {/* Balance & Stats */}
        <div className="flex items-baseline justify-between pt-2 border-t border-white/10">
          <div>
            <span className="text-xs font-semibold uppercase tracking-widest text-amber-200/70">
              Loyalty Points
            </span>
            <div className="flex items-center gap-2 mt-1">
              <span className="text-4xl font-extrabold font-heading text-white tracking-tight">
                {points.toLocaleString()}
              </span>
              <span className="text-sm font-semibold text-amber-400">pts</span>
            </div>
          </div>

          <div className="text-right">
            <span className="text-xs font-semibold uppercase tracking-widest text-amber-200/70">
              Total Visits
            </span>
            <p className="text-lg font-bold text-white mt-1">{visits} Visits</p>
          </div>
        </div>

        {/* Footer Action */}
        <div className="flex items-center justify-between pt-2">
          <div className="flex items-center gap-1.5 text-xs text-amber-200/80">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>₹100 spend = 10 pts</span>
          </div>

          {onOpenQr && (
            <button
              onClick={onOpenQr}
              className="flex items-center gap-2 px-3.5 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white text-xs font-semibold backdrop-blur-sm border border-white/15 transition-all active:scale-95"
            >
              <QrCode className="w-3.5 h-3.5 text-amber-400" />
              <span>Show QR</span>
              <ChevronRight className="w-3.5 h-3.5 opacity-70" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
