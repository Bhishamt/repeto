import React from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'glass' | 'dark' | 'paper' | 'cream' | 'flat';
  children: React.ReactNode;
}

export const Card: React.FC<CardProps> = ({
  variant = 'glass',
  className,
  children,
  ...props
}) => {
  const styles = {
    glass:
      'bg-[#FDFBF7]/80 backdrop-blur-md border border-[#3D281D]/10 rounded-2xl shadow-[0_8px_30px_rgb(26,22,21,0.04)]',
    dark:
      'bg-[#291A12] text-[#FDFBF7] border border-[#FDFBF7]/10 rounded-2xl shadow-xl',
    paper:
      'bg-[#FDFBF7] border border-[#3D281D]/12 rounded-2xl shadow-sm',
    cream:
      'bg-[#EFE7DC] border border-[#3D281D]/10 rounded-2xl',
    flat:
      'bg-[#F7F3EC] rounded-2xl p-4',
  };

  return (
    <div className={twMerge(clsx('p-5 transition-all duration-300', styles[variant], className))} {...props}>
      {children}
    </div>
  );
};
