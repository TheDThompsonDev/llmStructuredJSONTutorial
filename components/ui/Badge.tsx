'use client';

import { ComponentProps } from 'react';

interface BadgeProps extends ComponentProps<'span'> {
  variant?: 'default' | 'success' | 'warning' | 'danger' | 'info';
  size?: 'sm' | 'md';
}

const getBadgeClasses = (variant: string = 'default', size: string = 'md') => {
  const baseClasses = 'inline-flex items-center justify-center font-medium rounded-full border';
  
  const variantClasses = {
    default: 'bg-gray-50 text-gray-700 border-gray-200',
    success: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    warning: 'bg-orange-50 text-orange-700 border-orange-200',
    danger: 'bg-red-50 text-red-700 border-red-200',
    info: 'bg-blue-50 text-blue-700 border-blue-200'
  };
  
  const sizeClasses = {
    sm: 'px-2 py-1 text-xs',
    md: 'px-3 py-1 text-sm'
  };
  
  return `${baseClasses} ${variantClasses[variant as keyof typeof variantClasses]} ${sizeClasses[size as keyof typeof sizeClasses]}`;
};

export const Badge = ({ className, variant = 'default', size = 'md', children, ...props }: BadgeProps) => {
  return (
    <span
      className={`${getBadgeClasses(variant, size)} ${className || ''}`}
      {...props}
    >
      {children}
    </span>
  );
};