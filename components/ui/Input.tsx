'use client';

import { ComponentProps, forwardRef } from 'react';

interface InputProps extends ComponentProps<'input'> {
  error?: string;
  label?: string;
}

interface TextareaProps extends ComponentProps<'textarea'> {
  error?: string;
  label?: string;
}

const inputClasses = 'w-full p-4 border-2 border-sage-700/20 rounded-xl focus:border-teal-400 focus:outline-none transition-colors bg-white/50 text-sage-primary placeholder:text-sage-700/40';

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, error, label, ...props }, ref) => {
    return (
      <div className="space-y-2">
        {label && (
          <label className="block text-sm font-medium text-sage-secondary">
            {label}
          </label>
        )}
        <input
          ref={ref}
          className={`${inputClasses} ${error ? 'border-red-400 focus:border-red-400' : ''} ${className || ''}`}
          {...props}
        />
        {error && (
          <p className="text-sm text-red-600">{error}</p>
        )}
      </div>
    );
  }
);

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, error, label, ...props }, ref) => {
    return (
      <div className="space-y-2">
        {label && (
          <label className="block text-sm font-medium text-sage-secondary">
            {label}
          </label>
        )}
        <textarea
          ref={ref}
          className={`${inputClasses} resize-none ${error ? 'border-red-400 focus:border-red-400' : ''} ${className || ''}`}
          {...props}
        />
        {error && (
          <p className="text-sm text-red-600">{error}</p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';
Textarea.displayName = 'Textarea';