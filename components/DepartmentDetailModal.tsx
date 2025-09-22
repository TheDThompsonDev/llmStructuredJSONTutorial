'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Users, Clock, TrendingUp, MessageSquare, AlertCircle, CheckCircle, Star, Truck, ShoppingCart, HelpCircle } from 'lucide-react';

interface DepartmentDetailModalProps {
  departmentKey: string | null;
  isOpen: boolean;
  onClose: () => void;
  recentTickets?: Array<{
    id: string;
    message: string;
    sentiment: 'positive' | 'neutral' | 'negative';
    priority: 'low' | 'medium' | 'high';
    timestamp: Date;
    status: 'pending' | 'processing' | 'resolved';
  }>;
}

const DEPARTMENT_CONFIGS = {
  customer_support: {
    name: 'Customer Support',
    icon: Users,
    color: 'bg-gradient-to-br from-blue-500 to-blue-600',
    borderColor: 'border-blue-300',
    textColor: 'text-blue-600',
    bgColor: 'bg-blue-50',
    description: 'General inquiries and account issues',
    avgResponseTime: '2 minutes',
    teamSize: 12,
    satisfaction: 94,
    ticketsToday: 47,
    commonIssues: [
      'Account login problems',
      'Billing questions', 
      'General product information',
      'Feature requests'
    ],
    responseTemplates: [
      'Thank you for contacting us. We\'ll help resolve your account issue right away.',
      'I understand your frustration. Let me look into this billing question for you.',
      'Great question! Here\'s the information you requested about our product features.'
    ]
  },
  online_ordering: {
    name: 'Online Ordering',
    icon: ShoppingCart,
    color: 'bg-gradient-to-br from-green-500 to-green-600',
    borderColor: 'border-green-300',
    textColor: 'text-green-600',
    bgColor: 'bg-green-50',
    description: 'Order placement and checkout issues',
    avgResponseTime: '1 minute',
    teamSize: 8,
    satisfaction: 97,
    ticketsToday: 23,
    commonIssues: [
      'Payment processing errors',
      'Website checkout problems',
      'Order modification requests',
      'Discount code issues'
    ],
    responseTemplates: [
      'I can help you complete your order right now. Let me check what went wrong.',
      'Sorry about the checkout issue! I\'ll process your order manually.',
      'I\'ve applied the discount code to your order. You\'re all set!'
    ]
  },
  product_quality: {
    name: 'Product Quality',
    icon: Star,
    color: 'bg-gradient-to-br from-yellow-500 to-yellow-600',
    borderColor: 'border-yellow-300',
    textColor: 'text-yellow-600',
    bgColor: 'bg-yellow-50',
    description: 'Product defects and quality concerns',
    avgResponseTime: '3 minutes',
    teamSize: 6,
    satisfaction: 89,
    ticketsToday: 15,
    commonIssues: [
      'Product defects',
      'Quality complaints',
      'Return requests',
      'Replacement inquiries'
    ],
    responseTemplates: [
      'I sincerely apologize for the product defect. We\'ll send a replacement immediately.',
      'Thank you for bringing this quality issue to our attention. Here\'s what we\'ll do...',
      'I understand your disappointment. Let me arrange a full refund for you.'
    ]
  },
  shipping_and_delivery: {
    name: 'Shipping & Delivery',
    icon: Truck,
    color: 'bg-gradient-to-br from-purple-500 to-purple-600',
    borderColor: 'border-purple-300',
    textColor: 'text-purple-600',
    bgColor: 'bg-purple-50',
    description: 'Delivery tracking and shipping issues',
    avgResponseTime: '1.5 minutes',
    teamSize: 10,
    satisfaction: 92,
    ticketsToday: 31,
    commonIssues: [
      'Package tracking',
      'Delivery delays',
      'Missing packages',
      'Address changes'
    ],
    responseTemplates: [
      'I can see your package is currently in transit. Here\'s the latest tracking info...',
      'I apologize for the delivery delay. Let me check with our shipping partner.',
      'I\'ve located your package and arranged for redelivery tomorrow.'
    ]
  },
  other_off_topic: {
    name: 'Other/Off-topic',
    icon: HelpCircle,
    color: 'bg-gradient-to-br from-gray-500 to-gray-600',
    borderColor: 'border-gray-300',
    textColor: 'text-gray-600',
    bgColor: 'bg-gray-50',
    description: 'Unrelated or unclear messages',
    avgResponseTime: '30 seconds',
    teamSize: 3,
    satisfaction: 85,
    ticketsToday: 8,
    commonIssues: [
      'Unrelated inquiries',
      'Spam messages',
      'Unclear requests',
      'Misdirected contacts'
    ],
    responseTemplates: [
      'Thanks for your message. It seems this might be outside our area of support.',
      'I\'d be happy to direct you to the right team for this inquiry.',
      'Could you clarify what you\'re looking for so I can better assist you?'
    ]
  }
} as const;

const generateMockTickets = (department: string, count: number = 5) => {
  const tickets = [];
  const config = DEPARTMENT_CONFIGS[department as keyof typeof DEPARTMENT_CONFIGS];
  
  for (let i = 0; i < count; i++) {
    const sentiments: Array<'positive' | 'neutral' | 'negative'> = ['positive', 'neutral', 'negative'];
    const priorities: Array<'low' | 'medium' | 'high'> = ['low', 'medium', 'high'];
    const statuses: Array<'pending' | 'processing' | 'resolved'> = ['pending', 'processing', 'resolved'];
    
    tickets.push({
      id: `${department}-${i + 1}`,
      message: config?.commonIssues[Math.floor(Math.random() * config.commonIssues.length)] || 'General inquiry',
      sentiment: sentiments[Math.floor(Math.random() * sentiments.length)],
      priority: priorities[Math.floor(Math.random() * priorities.length)],
      timestamp: new Date(Date.now() - Math.random() * 86400000),
      status: statuses[Math.floor(Math.random() * statuses.length)]
    });
  }
  
  return tickets.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
};

export default function DepartmentDetailModal({ 
  departmentKey, 
  isOpen, 
  onClose,
  recentTickets 
}: DepartmentDetailModalProps) {
  const [mockTickets, setMockTickets] = useState<Array<any>>([]);
  const [selectedTab, setSelectedTab] = useState<'overview' | 'queue' | 'templates'>('overview');

  useEffect(() => {
    if (departmentKey && isOpen) {
      setMockTickets(generateMockTickets(departmentKey, 8));
    }
  }, [departmentKey, isOpen]);

  if (!departmentKey || !isOpen) return null;

  const config = DEPARTMENT_CONFIGS[departmentKey as keyof typeof DEPARTMENT_CONFIGS];
  if (!config) return null;

  const Icon = config.icon;

  const getSentimentColor = (sentiment: string) => {
    switch (sentiment) {
      case 'positive': return 'text-green-600 bg-green-100';
      case 'negative': return 'text-red-600 bg-red-100';
      default: return 'text-yellow-600 bg-yellow-100';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'text-red-700 bg-red-100 border-red-200';
      case 'medium': return 'text-yellow-700 bg-yellow-100 border-yellow-200';
      default: return 'text-green-700 bg-green-100 border-green-200';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'resolved': return <CheckCircle className="w-4 h-4 text-green-600" />;
      case 'processing': return <Clock className="w-4 h-4 text-blue-600" />;
      default: return <AlertCircle className="w-4 h-4 text-orange-600" />;
    }
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50"
        onClick={(e) => {
          if (e.target === e.currentTarget) onClose();
        }}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          className="w-full max-w-4xl max-h-[90vh] overflow-hidden bg-white rounded-2xl shadow-2xl"
        >
          <div className={`${config.bgColor} border-b ${config.borderColor} p-6`}>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className={`w-16 h-16 rounded-2xl ${config.color} flex items-center justify-center`}>
                  <Icon className="w-8 h-8 text-white" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-800">{config.name}</h2>
                  <p className="text-gray-600">{config.description}</p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <X className="w-6 h-6 text-gray-500" />
              </button>
            </div>
          </div>

          <div className="border-b border-gray-200">
            <div className="flex space-x-8 px-6">
              {[
                { key: 'overview', label: 'Overview', icon: TrendingUp },
                { key: 'queue', label: 'Ticket Queue', icon: MessageSquare },
                { key: 'templates', label: 'Templates', icon: Star }
              ].map(({ key, label, icon: TabIcon }) => (
                <button
                  key={key}
                  onClick={() => setSelectedTab(key as any)}
                  className={`flex items-center gap-2 py-4 px-2 border-b-2 font-medium text-sm transition-colors ${
                    selectedTab === key
                      ? `${config.textColor} border-current`
                      : 'text-gray-500 border-transparent hover:text-gray-700'
                  }`}
                >
                  <TabIcon className="w-4 h-4" />
                  {label}
                </button>
              ))}
            </div>
          </div>

          <div className="p-6 overflow-y-auto max-h-[60vh]">
            {selectedTab === 'overview' && (
              <div className="space-y-6">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="bg-gray-50 rounded-lg p-4">
                    <div className="text-2xl font-bold text-gray-800">{config.teamSize}</div>
                    <div className="text-sm text-gray-600">Team Members</div>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-4">
                    <div className="text-2xl font-bold text-gray-800">{config.avgResponseTime}</div>
                    <div className="text-sm text-gray-600">Avg Response</div>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-4">
                    <div className="text-2xl font-bold text-gray-800">{config.satisfaction}%</div>
                    <div className="text-sm text-gray-600">Satisfaction</div>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-4">
                    <div className="text-2xl font-bold text-gray-800">{config.ticketsToday}</div>
                    <div className="text-sm text-gray-600">Today's Tickets</div>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-3">Common Issues</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    {config.commonIssues.map((issue, index) => (
                      <div key={index} className="bg-gray-50 rounded-lg p-3 text-sm">
                        • {issue}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {selectedTab === 'queue' && (
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-800">Recent Tickets</h3>
                <div className="space-y-3">
                  {mockTickets.map((ticket) => (
                    <div key={ticket.id} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            {getStatusIcon(ticket.status)}
                            <span className="font-medium text-gray-800">#{ticket.id}</span>
                            <span className={`px-2 py-1 rounded-full text-xs ${getSentimentColor(ticket.sentiment)}`}>
                              {ticket.sentiment}
                            </span>
                            <span className={`px-2 py-1 rounded-full text-xs border ${getPriorityColor(ticket.priority)}`}>
                              {ticket.priority}
                            </span>
                          </div>
                          <p className="text-gray-700 text-sm">{ticket.message}</p>
                          <p className="text-xs text-gray-500 mt-1">
                            {ticket.timestamp.toLocaleString()}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {selectedTab === 'templates' && (
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-800">Response Templates</h3>
                <div className="space-y-3">
                  {config.responseTemplates.map((template, index) => (
                    <div key={index} className="bg-gray-50 rounded-lg p-4">
                      <p className="text-gray-800 italic">"{template}"</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}