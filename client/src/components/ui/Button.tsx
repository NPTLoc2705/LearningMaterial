import React from 'react';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'danger' | 'ghost' | 'success';
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
}

export function Button({
  children,
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  className = '',
  disabled,
  ...props
}: ButtonProps) {
  const baseStyles =
    'inline-flex items-center justify-center font-medium rounded-lg transition-all duration-150 active:scale-[0.99] disabled:opacity-40 disabled:pointer-events-none select-none touch-manipulation';

  const sizeStyles = {
    sm: 'text-xs min-h-[36px] sm:min-h-[32px] px-3 py-1.5 gap-1.5',
    md: 'text-xs sm:text-sm min-h-[42px] px-4 py-2 gap-2',
    lg: 'text-sm sm:text-base min-h-[46px] px-5 py-2.5 gap-2.5',
  };

  const variantStyles = {
    primary:
      'bg-[#141413] text-white hover:bg-[#282725] border border-[#141413]',
    secondary:
      'bg-[#F4F3EF] text-[#141413] hover:bg-[#EAE8E3] border border-[#E8E7E4]',
    outline:
      'border border-[#E8E7E4] bg-white text-[#141413] hover:bg-[#FBFBFA] hover:border-[#D5D4CE]',
    danger:
      'bg-[#FDEBEC] text-[#9F2F2D] border border-[#FAD4D6] hover:bg-[#F9DBDC]',
    ghost:
      'text-[#6B6A66] hover:text-[#141413] hover:bg-[#F4F3EF]',
    success:
      'bg-[#EDF3EC] text-[#346538] border border-[#DCE8DA] hover:bg-[#E3EDE2]',
  };

  return (
    <button
      className={`${baseStyles} ${sizeStyles[size]} ${variantStyles[variant]} ${
        fullWidth ? 'w-full' : ''
      } ${className}`}
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  );
}
