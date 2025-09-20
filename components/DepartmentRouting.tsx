'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, CheckCircle, AlertCircle, Star, Truck, ShoppingCart, HelpCircle, Users } from 'lucide-react';
import DepartmentDetailModal from './DepartmentDetailModal';

interface DepartmentRoutingProps {
  result?: {
    sentiment: 'positive' | 'neutral' | 'negative';
    department: string;
    reply: string;
    confidence?: number;
    priority?: 'low' | 'medium' | 'high';
  };
  isVisible: boolean;
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
    processingTime: '~2 minutes',
  },
  online_ordering: {
    name: 'Online Ordering',
    icon: ShoppingCart,
    color: 'bg-gradient-to-br from-green-500 to-green-600',
    borderColor: 'border-green-300',
    textColor: 'text-green-600',
    bgColor: 'bg-green-50',
    description: 'Order placement and checkout issues',
    processingTime: '~1 minute',
  },
  product_quality: {
    name: 'Product Quality',
    icon: Star,
    color: 'bg-gradient-to-br from-yellow-500 to-yellow-600',
    borderColor: 'border-yellow-300',
    textColor: 'text-yellow-600',
    bgColor: 'bg-yellow-50',
    description: 'Product defects and quality concerns',
    processingTime: '~3 minutes',
  },
  shipping_and_delivery: {
    name: 'Shipping & Delivery',
    icon: Truck,
    color: 'bg-gradient-to-br from-purple-500 to-purple-600',
    borderColor: 'border-purple-300',
    textColor: 'text-purple-600',
    bgColor: 'bg-purple-50',
    description: 'Delivery tracking and shipping issues',
    processingTime: '~1.5 minutes',
  },
  other_off_topic: {
    name: 'Other/Off-topic',
    icon: HelpCircle,
    color: 'bg-gradient-to-br from-gray-500 to-gray-600',
    borderColor: 'border-gray-300',
    textColor: 'text-gray-600',
    bgColor: 'bg-gray-50',
    description: 'Unrelated or unclear messages',
    processingTime: '~30 seconds',
  },
};

const getSentimentColor = (sentiment: string) => {
  switch (sentiment) {
    case 'positive': return 'text-green-600';
    case 'negative': return 'text-red-600';
    default: return 'text-yellow-600';
  }
};

const getPriorityColor = (priority: string) => {
  switch (priority) {
    case 'high': return 'bg-red-100 text-red-800 border-red-200';
    case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
    default: return 'bg-green-100 text-green-800 border-green-200';
  }
};

export default function DepartmentRouting({ result, isVisible }: DepartmentRoutingProps) {
  const [routingStage, setRoutingStage] = useState<'analyzing' | 'routing' | 'complete'>('analyzing');
  const [selectedDepartment, setSelectedDepartment] = useState<string | null>(null);
  const [detailModalOpen, setDetailModalOpen] = useState(false);
  const [detailModalDepartment, setDetailModalDepartment] = useState<string | null>(null);
  
  useEffect(() => {
    if (!isVisible || !result) {
      setRoutingStage('analyzing');
      setSelectedDepartment(null);
      return;
    }

    // Route immediately
    setRoutingStage('routing');
    setSelectedDepartment(result.department);
    setRoutingStage('complete');
  }, [isVisible, result]);

  const handleDepartmentClick = (departmentKey: string) => {
    if (routingStage === 'complete' && selectedDepartment === departmentKey) {
      // Only allow clicking on the selected department when routing is complete
      setDetailModalDepartment(departmentKey);
      setDetailModalOpen(true);
    } else {
      // For demo purposes, allow clicking on any department to see details
      setDetailModalDepartment(departmentKey);
      setDetailModalOpen(true);
    }
  };

  if (!isVisible) {
    return (
      <div className="w-full max-w-6xl mx-auto">
        <div className="glass-effect rounded-2xl p-8 text-center">
          <div className="w-24 h-24 mx-auto mb-4 rounded-full bg-gradient-to-br from-indigo-100 to-purple-100 flex items-center justify-center">
            <ArrowRight className="w-12 h-12 text-indigo-600" />
          </div>
          <h3 className="text-xl font-semibold text-gray-800 mb-2">Department Routing</h3>
          <p className="text-gray-600">Processing will route the message to the appropriate department</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-6xl mx-auto space-y-6">
      {/* Routing Header */}
      <div className="glass-effect rounded-2xl p-6">
        <div className="text-center space-y-4">
          <h3 className="text-2xl font-bold gradient-text flex items-center justify-center gap-2">
            <ArrowRight className="w-8 h-8 text-indigo-600" />
            Smart Department Routing
          </h3>
          
          {result && (
            <div className="flex items-center justify-center gap-6 text-sm">
              <div className="flex items-center gap-2">
                <span className="font-semibold">Sentiment:</span>
                <span className={`font-bold ${getSentimentColor(result.sentiment)}`}>
                  {result.sentiment.toUpperCase()}
                </span>
              </div>
              
              {result.confidence && (
                <div className="flex items-center gap-2">
                  <span className="font-semibold">Confidence:</span>
                  <span className="font-bold text-blue-600">
                    {Math.round(result.confidence * 100)}%
                  </span>
                </div>
              )}
              
              {result.priority && (
                <div className="flex items-center gap-2">
                  <span className="font-semibold">Priority:</span>
                  <span className={`px-2 py-1 rounded-full border text-xs font-bold ${getPriorityColor(result.priority)}`}>
                    {result.priority.toUpperCase()}
                  </span>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Department Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <AnimatePresence>
          {Object.entries(DEPARTMENT_CONFIGS).map(([key, config]) => {
            const Icon = config.icon;
            const isSelected = selectedDepartment === key;
            const isRouting = routingStage === 'routing' && !selectedDepartment;
            
            return (
              <motion.div
                key={key}
                layout
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{
                  opacity: 1,
                  scale: 1,
                  ...(isSelected ? {
                    scale: 1.05,
                    zIndex: 10,
                  } : {}),
                  ...(isRouting ? {
                    scale: [1, 1.02, 1],
                    transition: { repeat: Infinity, duration: 1.5 }
                  } : {})
                }}
                className={`relative overflow-hidden rounded-2xl border-2 transition-all duration-300 cursor-pointer ${
                  isSelected
                    ? `${config.borderColor} shadow-2xl ${config.bgColor}`
                    : isRouting
                      ? 'border-gray-200 bg-white animate-pulse-slow'
                      : 'border-gray-200 bg-white hover:border-gray-300 hover:shadow-lg'
                }`}
                onClick={() => handleDepartmentClick(key)}
              >
                {/* Selection Animation */}
                {isSelected && (
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: '100%' }}
                    transition={{ duration: 0.8, ease: 'easeOut' }}
                    className="absolute top-0 left-0 h-1 bg-gradient-to-r from-blue-500 to-purple-500"
                  />
                )}
                
                <div className="p-6 space-y-4">
                  {/* Department Icon & Name */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className={`w-12 h-12 rounded-xl ${config.color} flex items-center justify-center`}>
                        <Icon className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <h4 className="font-bold text-gray-800">{config.name}</h4>
                        <p className="text-sm text-gray-600">{config.processingTime}</p>
                        {!isSelected && !isRouting && (
                          <p className="text-xs text-blue-500 mt-1">Click to view details →</p>
                        )}
                      </div>
                    </div>
                    
                    {isSelected && (
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: 0.5 }}
                      >
                        <CheckCircle className="w-8 h-8 text-green-500" />
                      </motion.div>
                    )}
                  </div>
                  
                  {/* Description */}
                  <p className="text-gray-600 text-sm">
                    {config.description}
                  </p>
                  
                  {/* Status Indicator */}
                  <div className="flex items-center justify-between">
                    <span className={`text-xs font-semibold ${
                      isSelected 
                        ? config.textColor 
                        : 'text-gray-400'
                    }`}>
                      {isSelected 
                        ? 'SELECTED' 
                        : isRouting 
                          ? 'ANALYZING...' 
                          : 'AVAILABLE'
                      }
                    </span>
                    
                    {isRouting && !selectedDepartment && (
                      <motion.div 
                        animate={{ rotate: 360 }}
                        transition={{ repeat: Infinity, duration: 2, ease: 'linear' }}
                        className="w-4 h-4 border-2 border-gray-300 border-t-blue-500 rounded-full"
                      />
                    )}
                  </div>
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>

      {/* Generated Response */}
      {result && selectedDepartment && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="glass-effect rounded-2xl p-6"
        >
          <h4 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
            <CheckCircle className="w-6 h-6 text-green-600" />
            Generated Response
          </h4>
          <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
            <p className="text-gray-800 italic">"{result.reply}"</p>
          </div>
          <div className="mt-4 text-center">
            <span className="text-sm text-gray-600">
              Routed to: <strong className={DEPARTMENT_CONFIGS[selectedDepartment as keyof typeof DEPARTMENT_CONFIGS]?.textColor}>
                {DEPARTMENT_CONFIGS[selectedDepartment as keyof typeof DEPARTMENT_CONFIGS]?.name}
              </strong>
            </span>
          </div>
        </motion.div>
      )}

      {/* Department Detail Modal */}
      <DepartmentDetailModal
        departmentKey={detailModalDepartment}
        isOpen={detailModalOpen}
        onClose={() => {
          setDetailModalOpen(false);
          setDetailModalDepartment(null);
        }}
      />
    </div>
  );
}