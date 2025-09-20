'use client';

export const DEPARTMENTS = {
  customer_support: {
    name: 'Customer Support',
    color: 'bg-blue-500',
    icon: '👥',
    description: 'General inquiries and account issues'
  },
  online_ordering: {
    name: 'Online Ordering',
    color: 'bg-green-500',
    icon: '🛒',
    description: 'Order placement and checkout issues'
  },
  product_quality: {
    name: 'Product Quality',
    color: 'bg-yellow-500',
    icon: '⭐',
    description: 'Product defects and quality concerns'
  },
  shipping_and_delivery: {
    name: 'Shipping & Delivery',
    color: 'bg-purple-500',
    icon: '📦',
    description: 'Delivery tracking and shipping issues'
  },
  other_off_topic: {
    name: 'Other/Off-topic',
    color: 'bg-gray-500',
    icon: '❓',
    description: 'Unrelated or unclear messages'
  }
} as const;

export type DepartmentKey = keyof typeof DEPARTMENTS;