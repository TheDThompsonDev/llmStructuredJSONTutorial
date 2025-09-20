'use client';

import { ComponentProps, forwardRef } from 'react';

interface ButtonProps extends ComponentProps<'button'> {
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  loading?: boolean;
}

const getButtonClasses = (variant: string = 'primary', size: string = 'md') => {
  const baseClasses = 'inline-flex items-center justify-center gap-2 rounded-xl font-semibold transition-all disabled:opacity-50 disabled:cursor-not-allowed';
  
  const variantClasses = {
    primary: 'bg-teal-gradient text-white hover:shadow-sage-lg',
    secondary: 'border-2 border-sage-700/20 text-sage-secondary hover:border-teal-400 hover:text-teal-primary',
    danger: 'bg-red-500 text-white hover:bg-red-600',
    ghost: 'hover:bg-sage-50 text-sage-secondary'
  };
  
  const sizeClasses = {
    sm: 'px-3 py-2 text-sm',
    md: 'px-4 py-2',
    lg: 'px-6 py-3',
    xl: 'px-8 py-4'
  };
  
  return `${baseClasses} ${variantClasses[variant as keyof typeof variantClasses]} ${sizeClasses[size as keyof typeof sizeClasses]}`;
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'md', loading, children, disabled, ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={`${getButtonClasses(variant, size)} ${className || ''}`}
        disabled={disabled || loading}
        {...props}
      >
        {loading && <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />}
        {children}
      </button>
    );
  }
);

Button.displayName = 'Button';