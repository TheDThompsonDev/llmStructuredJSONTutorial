'use client';

import { ComponentProps, forwardRef } from 'react';

interface CardProps extends ComponentProps<'div'> {
  variant?: 'default' | 'glass' | 'metric-primary' | 'metric-success' | 'metric-warning' | 'metric-secondary';
  hover?: boolean;
}

const getCardClasses = (variant: string = 'default', hover: boolean = false) => {
  const baseClasses = 'rounded-2xl p-6';
  
  const variantClasses = {
    default: 'bg-white shadow-sage-md border border-sage-700/10',
    glass: 'glass shadow-sage-lg',
    'metric-primary': 'bg-blue-50 border border-blue-200',
    'metric-success': 'bg-emerald-50 border border-emerald-200', 
    'metric-warning': 'bg-orange-50 border border-orange-200',
    'metric-secondary': 'bg-purple-50 border border-purple-200'
  };
  
  const hoverClass = hover ? 'hover-lift cursor-pointer' : '';
  
  return `${baseClasses} ${variantClasses[variant as keyof typeof variantClasses]} ${hoverClass}`;
};

export const Card = forwardRef<HTMLDivElement, CardProps>(
  ({ className, variant = 'default', hover = false, children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={`${getCardClasses(variant, hover)} ${className || ''}`}
        {...props}
      >
        {children}
      </div>
    );
  }
);

Card.displayName = 'Card';