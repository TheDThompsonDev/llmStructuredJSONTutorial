'use client';

export const cn = (...classes: (string | undefined | false | null)[]): string => {
  return classes.filter(Boolean).join(' ');
};

export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD'
  }).format(amount);
};

export const formatPercentage = (value: number): string => {
  return `${value.toFixed(1)}%`;
};

export const formatDuration = (milliseconds: number): string => {
  if (milliseconds < 1000) {
    return `${milliseconds}ms`;
  }
  return `${(milliseconds / 1000).toFixed(1)}s`;
};

export const truncateText = (text: string, maxLength: number): string => {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + '...';
};

export const capitalizeFirst = (str: string): string => {
  return str.charAt(0).toUpperCase() + str.slice(1);
};

export const getSentimentColor = (sentiment: string): string => {
  const colorMap = {
    positive: 'text-green-600 bg-green-50 border-green-200',
    negative: 'text-red-600 bg-red-50 border-red-200', 
    neutral: 'text-blue-600 bg-blue-50 border-blue-200'
  };
  return colorMap[sentiment as keyof typeof colorMap] || 'text-gray-600 bg-gray-50 border-gray-200';
};

export const getPriorityColor = (priority: string): string => {
  const colorMap = {
    high: 'text-red-600 bg-red-50 border-red-200',
    medium: 'text-yellow-600 bg-yellow-50 border-yellow-200',
    low: 'text-green-600 bg-green-50 border-green-200'
  };
  return colorMap[priority as keyof typeof colorMap] || 'text-gray-600 bg-gray-50 border-gray-200';
};

export const getDepartmentName = (department: string): string => {
  const nameMap = {
    customer_support: 'Customer Support',
    online_ordering: 'Online Ordering',
    product_quality: 'Product Quality',
    shipping_and_delivery: 'Shipping & Delivery',
    other_off_topic: 'General Inquiry'
  };
  return nameMap[department as keyof typeof nameMap] || department;
};

export const getStatusIcon = (status: string) => {
  const iconMap = {
    idle: '⏳',
    parsing: '🔍',
    analyzing: '🧠',
    structuring: '🏗️',
    validating: '✅',
    complete: '🎉',
    error: '❌'
  };
  return iconMap[status as keyof typeof iconMap] || '⏳';
};

export const debounce = <T extends (...args: unknown[]) => void>(
  func: T,
  wait: number
): ((...args: Parameters<T>) => void) => {
  let timeout: NodeJS.Timeout;
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
};

export const throttle = <T extends (...args: unknown[]) => void>(
  func: T,
  limit: number
): ((...args: Parameters<T>) => void) => {
  let inThrottle: boolean;
  return (...args: Parameters<T>) => {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
};