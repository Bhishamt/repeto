import React from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
}

export const Input: React.FC<InputProps> = ({
  label,
  error,
  helperText,
  className,
  id,
  ...props
}) => {
  const inputId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);

  return (
    <div className="flex flex-col gap-1.5 w-full">
      {label && (
        <label htmlFor={inputId} className="text-xs font-semibold text-[#57504B] tracking-wide uppercase">
          {label}
        </label>
      )}
      <input
        id={inputId}
        className={twMerge(
          clsx(
            'w-full px-3.5 py-2.5 bg-[#FDFBF7] border border-[#3D281D]/20 rounded-xl text-sm text-[#1A1615] placeholder:text-[#8C827A] focus:outline-none focus:border-[#3D281D] focus:ring-2 focus:ring-[#3D281D]/10 transition-all duration-200',
            error && 'border-rose-500 focus:ring-rose-500/20',
            className
          )
        )}
        {...props}
      />
      {error && <span className="text-xs text-rose-600 font-medium">{error}</span>}
      {helperText && !error && <span className="text-xs text-[#8C827A]">{helperText}</span>}
    </div>
  );
};
