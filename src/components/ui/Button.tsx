import React from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'amber' | 'outline' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  children: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'md',
  className,
  children,
  ...props
}) => {
  const baseStyle =
    'inline-flex items-center justify-center font-medium rounded-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer active:scale-[0.98]';

  const variants = {
    primary:
      'bg-[#3D281D] text-[#FDFBF7] hover:bg-[#291A12] shadow-md shadow-[#3D281D]/20 focus:ring-[#3D281D]',
    secondary:
      'bg-[#EFE7DC] text-[#3D281D] hover:bg-[#E2D6C5] border border-[#3D281D]/10 focus:ring-[#3D281D]',
    amber:
      'bg-[#D97706] text-white hover:bg-[#B45309] shadow-md shadow-[#D97706]/25 focus:ring-[#D97706]',
    outline:
      'bg-transparent text-[#3D281D] border border-[#3D281D]/20 hover:bg-[#3D281D]/5 focus:ring-[#3D281D]',
    ghost:
      'bg-transparent text-[#57504B] hover:text-[#1A1615] hover:bg-[#3D281D]/5 focus:ring-[#3D281D]',
    danger:
      'bg-rose-600 text-white hover:bg-rose-700 shadow-md shadow-rose-600/20 focus:ring-rose-600',
  };

  const sizes = {
    sm: 'px-3 py-1.5 text-xs gap-1.5',
    md: 'px-4 py-2.5 text-sm gap-2',
    lg: 'px-6 py-3.5 text-base gap-2.5 font-semibold',
  };

  return (
    <button
      className={twMerge(clsx(baseStyle, variants[variant], sizes[size], className))}
      {...props}
    >
      {children}
    </button>
  );
};
