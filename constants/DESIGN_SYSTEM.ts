'use client';

export const COLORS = {
  sage: {
    50: '#f0f5f4',
    700: '#344b47',
    primary: '#344b47',
    secondary: 'rgba(52, 75, 71, 0.7)'
  },
  teal: {
    400: '#7eb6ad',
    primary: '#7eb6ad'
  },
  sky: {
    50: '#e3f5ff'
  },
  slate: {
    300: '#abbdde'
  }
} as const;

export const GRADIENTS = {
  sage: 'linear-gradient(135deg, #f0f5f4 0%, rgba(240, 245, 244, 0.8) 100%)',
  teal: 'linear-gradient(135deg, #7eb6ad 0%, rgba(126, 182, 173, 0.8) 100%)',
  sky: 'linear-gradient(135deg, #e3f5ff 0%, rgba(227, 245, 255, 0.8) 100%)',
  emerald: 'linear-gradient(135deg, #10b981 0%, #059669 100%)'
} as const;

export const SHADOWS = {
  sage: '0 1px 3px 0 rgba(52, 75, 71, 0.06), 0 1px 2px -1px rgba(52, 75, 71, 0.06)',
  'sage-md': '0 4px 6px -1px rgba(52, 75, 71, 0.1), 0 2px 4px -2px rgba(52, 75, 71, 0.1)',
  'sage-lg': '0 10px 15px -3px rgba(52, 75, 71, 0.1), 0 4px 6px -4px rgba(52, 75, 71, 0.1)'
} as const;

export const SPACING = {
  xs: '0.5rem',
  sm: '1rem', 
  md: '1.5rem',
  lg: '2rem',
  xl: '3rem',
  '2xl': '4rem',
  '3xl': '6rem'
} as const;

export const BORDER_RADIUS = {
  sm: '0.5rem',
  md: '0.75rem', 
  lg: '1rem',
  xl: '1.5rem',
  '2xl': '2rem',
  '3xl': '3rem'
} as const;

export const TYPOGRAPHY = {
  sizes: {
    xs: '0.75rem',
    sm: '0.875rem',
    base: '1rem',
    lg: '1.125rem',
    xl: '1.25rem',
    '2xl': '1.5rem',
    '3xl': '1.875rem',
    '4xl': '2.25rem',
    '5xl': '3rem'
  },
  weights: {
    normal: '400',
    medium: '500',
    semibold: '600',
    bold: '700'
  }
} as const;

export const ANIMATIONS = {
  durations: {
    fast: '150ms',
    normal: '300ms',
    slow: '500ms'
  },
  easings: {
    'ease-out': 'cubic-bezier(0, 0, 0.2, 1)',
    'ease-in': 'cubic-bezier(0.4, 0, 1, 1)',
    'ease-in-out': 'cubic-bezier(0.4, 0, 0.2, 1)'
  }
} as const;