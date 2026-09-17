import React from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

interface BadgeProps {
  variant?: 'espresso' | 'amber' | 'aubergine' | 'emerald' | 'gray';
  children: React.ReactNode;
  className?: string;
}

export const Badge: React.FC<BadgeProps> = ({
  variant = 'espresso',
  children,
  className,
}) => {
  const styles = {
    espresso: 'bg-[#3D281D]/10 text-[#3D281D] border border-[#3D281D]/20',
    amber: 'bg-[#FEF3C7] text-[#D97706] border border-[#D97706]/30',
    aubergine: 'bg-[#F5EBF0] text-[#3B1F2B] border border-[#3B1F2B]/20',
    emerald: 'bg-emerald-50 text-emerald-700 border border-emerald-200',
    gray: 'bg-stone-100 text-stone-600 border border-stone-200',
  };

  return (
    <span
      className={twMerge(
        clsx(
          'inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold uppercase tracking-wider',
          styles[variant],
          className
        )
      )}
    >
      {children}
    </span>
  );
};
