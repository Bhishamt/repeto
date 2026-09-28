import React from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { Award, Shield, Crown, Sparkles } from 'lucide-react';
import { LoyaltyTier } from '../../utils/formatters';

interface TierBadgeProps {
  tier: LoyaltyTier | string;
  showIcon?: boolean;
  className?: string;
}

export const TierBadge: React.FC<TierBadgeProps> = ({
  tier,
  showIcon = true,
  className,
}) => {
  const normalized = (tier || 'Bronze') as LoyaltyTier;

  const config: Record<
    string,
    { style: string; icon: React.ComponentType<{ className?: string }> }
  > = {
    Bronze: {
      style: 'bg-amber-900/10 text-amber-900 border-amber-900/20',
      icon: Shield,
    },
    Silver: {
      style: 'bg-slate-200/60 text-slate-700 border-slate-300',
      icon: Award,
    },
    Gold: {
      style: 'bg-amber-100 text-amber-800 border-amber-300',
      icon: Crown,
    },
    Platinum: {
      style: 'bg-purple-100 text-purple-900 border-purple-300',
      icon: Sparkles,
    },
  };

  const item = config[normalized] || config.Bronze;
  const IconComponent = item.icon;

  return (
    <span
      className={twMerge(
        clsx(
          'inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold uppercase tracking-wide border',
          item.style,
          className
        )
      )}
    >
      {showIcon && <IconComponent className="w-3.5 h-3.5" />}
      {normalized}
    </span>
  );
};
