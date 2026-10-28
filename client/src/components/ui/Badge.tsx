import React from 'react';

export interface BadgeProps {
  children: React.ReactNode;
  variant?: 'slate' | 'green' | 'red' | 'blue' | 'amber';
  size?: 'sm' | 'md';
  className?: string;
}

const SIZE_STYLES = {
  sm: 'text-[11px] px-2 py-0.5 font-medium rounded-md tracking-tight',
  md: 'text-xs px-2.5 py-1 font-medium rounded-md tracking-tight',
};

const VARIANT_STYLES = {
  slate: 'bg-[#F4F3EF] text-[#6B6A66] border border-[#E8E7E4]',
  green: 'bg-[#EDF3EC] text-[#346538] border border-[#DCE8DA]',
  red: 'bg-[#FDEBEC] text-[#9F2F2D] border border-[#FAD4D6]',
  blue: 'bg-[#E1F3FE] text-[#1F6C9F] border border-[#CCE9FD]',
  amber: 'bg-[#FBF3DB] text-[#956400] border border-[#F5E6BF]',
};

export function Badge({
  children,
  variant = 'slate',
  size = 'md',
  className = '',
}: BadgeProps) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 font-mono ${SIZE_STYLES[size]} ${VARIANT_STYLES[variant]} ${className}`}
    >
      {children}
    </span>
  );
}
