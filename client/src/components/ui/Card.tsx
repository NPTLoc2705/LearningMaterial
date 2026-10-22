import React from 'react';

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  hoverable?: boolean;
  className?: string;
  innerClassName?: string;
  doubleBezel?: boolean;
}

export function Card({
  children,
  hoverable = false,
  doubleBezel = true,
  className = '',
  innerClassName = '',
  ...props
}: CardProps) {
  if (!doubleBezel) {
    return (
      <div
        className={`bg-white rounded-xl border border-[#E8E7E4] shadow-subtle ${
          hoverable ? 'hover:border-[#D5D4CE] transition-colors duration-150' : ''
        } ${className}`}
        {...props}
      >
        {children}
      </div>
    );
  }

  // Double-Bezel nested architecture
  return (
    <div
      className={`bg-[#F6F5F2] border border-[#E8E7E4] p-1.5 rounded-[1.25rem] transition-all duration-150 ${
        hoverable ? 'hover:border-[#DCDAD4] hover:bg-[#F2F1EC]' : ''
      } ${className}`}
      {...props}
    >
      <div
        className={`bg-white border border-[#EFEFEA] rounded-[calc(1.25rem-0.375rem)] shadow-[inset_0_1px_1px_rgba(255,255,255,0.9)] h-full ${innerClassName}`}
      >
        {children}
      </div>
    </div>
  );
}
