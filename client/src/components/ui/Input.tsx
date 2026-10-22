import React from 'react';
import { IconCross } from './Icons';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  icon?: React.ReactNode;
  clearable?: boolean;
  onClear?: () => void;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ icon, clearable, onClear, className = '', value, ...props }, ref) => {
    return (
      <div className="relative flex items-center w-full">
        {icon && (
          <div className="absolute left-3 text-[#9E9D97] pointer-events-none flex items-center">
            {icon}
          </div>
        )}
        <input
          ref={ref}
          value={value}
          className={`w-full rounded-lg border border-[#E8E7E4] bg-white py-2 text-xs sm:text-sm text-[#141413] placeholder-[#9E9D97] transition-all focus:border-[#141413] focus:ring-1 focus:ring-[#141413] focus:outline-none ${
            icon ? 'pl-9' : 'pl-3'
          } ${clearable && value ? 'pr-8' : 'pr-3'} ${className}`}
          {...props}
        />
        {clearable && value && (
          <button
            type="button"
            onClick={onClear}
            className="absolute right-2 p-1 text-[#9E9D97] hover:text-[#141413] transition-colors"
            title="Clear text"
          >
            <IconCross size={13} />
          </button>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';
