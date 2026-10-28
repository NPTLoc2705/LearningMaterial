import React from 'react';

export interface KidActionButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  icon?: string;
  variant?: 'primary' | 'secondary';
  fullWidth?: boolean;
}

export function KidActionButton({
  icon,
  variant = 'primary',
  fullWidth = false,
  className = '',
  children,
  disabled,
  ...props
}: KidActionButtonProps) {
  const variantClasses =
    variant === 'primary'
      ? 'bg-[#141413] text-white border-2 border-[#141413] hover:bg-[#282725]'
      : 'bg-white text-[#141413] border-2 border-[#E8E7E4] hover:bg-[#F4F3EF]';

  return (
    <button
      type="button"
      disabled={disabled}
      className={`min-h-[64px] min-w-[64px] px-6 py-3 rounded-2xl font-semibold text-base sm:text-lg inline-flex items-center justify-center gap-3 select-none touch-manipulation transition-transform active:scale-[0.98] motion-reduce:transition-none motion-reduce:active:scale-100 disabled:opacity-50 ${variantClasses} ${
        fullWidth ? 'w-full' : ''
      } ${className}`}
      {...props}
    >
      {icon && (
        <span className="text-2xl leading-none" aria-hidden="true">
          {icon}
        </span>
      )}
      <span>{children}</span>
    </button>
  );
}

