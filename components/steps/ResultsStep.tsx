'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Target, 
  Clock, 
  TrendingUp, 
  Users, 
  AlertTriangle, 
  CheckCircle2,
  ArrowRight,
  Star,
  Award,
  Zap
} from 'lucide-react';
import DepartmentDetailModal from '../DepartmentDetailModal';

interface ProcessingResult {
  routing?: {
    department: string;
    confidence: number;
  };
  analysis?: {
    priority: string;
    topics?: string[];
  };
}

interface StepData {
  message?: string;
  timestamp?: string;
  result?: ProcessingResult;
}

interface ResultsStepProps {
  data?: StepData;
  onComplete: () => void;
  onNext: () => void;
}

export default function ResultsStep({ data, onComplete, onNext }: ResultsStepProps) {
  const [selectedDepartment, setSelectedDepartment] = useState<string | null>(null);
  const [showComparison, setShowComparison] = useState(false);

  const routing = data?.result?.routing;
  const analysis = data?.result?.analysis;

  // Mock traditional routing metrics for comparison
  const traditionalMetrics = {
    averageTime: 4.2,
    accuracy: 68,
    customerSatisfaction: 3.2,
    escalationRate: 15
  };

  const aiMetrics = {
    averageTime: 0.8,
    accuracy: 94,
    customerSatisfaction: 4.7,
    escalationRate: 3
  };

  const departments = [
    {
      id: 'technical_support',
      name: 'Technical Support',
      description: 'Hardware and software issues, troubleshooting',
      icon: '🔧',
      color: 'from-blue-500 to-cyan-500',
      staff: 12,
      avgResponseTime: '15 mins',
      expertise: ['Hardware', 'Software', 'Network', 'Database']
    },
    {
      id: 'billing',
      name: 'Billing & Finance',
      description: 'Payment issues, refunds, billing inquiries',
      icon: '💰',
      color: 'from-green-500 to-emerald-500',
      staff: 8,
      avgResponseTime: '12 mins',
      expertise: ['Payments', 'Refunds', 'Subscriptions', 'Invoicing']
    },
    {
      id: 'sales',
      name: 'Sales & Upgrades',
      description: 'Product inquiries, upgrades, new purchases',
      icon: '📈',
      color: 'from-purple-500 to-pink-500',
      staff: 15,
      avgResponseTime: '8 mins',
      expertise: ['Products', 'Pricing', 'Upgrades', 'Demos']
    },
    {
      id: 'general',
      name: 'General Support',
      description: 'General questions and account management',
      icon: '💬',
      color: 'from-orange-500 to-red-500',
      staff: 10,
      avgResponseTime: '10 mins',
      expertise: ['Accounts', 'General', 'Information', 'Guidance']
    }
  ];

  const selectedDept = departments.find(d => d.id === routing?.department) || departments[0];

  const getPriorityColor = (priority: string) => {
    switch (priority?.toLowerCase()) {
      case 'high': return 'text-red-400 bg-red-500/20';
      case 'medium': return 'text-yellow-400 bg-yellow-500/20';
      case 'low': return 'text-green-400 bg-green-500/20';
      default: return 'text-blue-400 bg-blue-500/20';
    }
  };

  return (
    <div className="max-w-6xl mx-auto">
      {/* Results Header */}
      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-12"
      >
        <div className="inline-flex items-center gap-3 px-6 py-3 bg-gradient-to-r from-green-500/20 to-emerald-500/20 rounded-full border border-white/20 backdrop-blur-sm mb-6">
          <CheckCircle2 className="w-5 h-5 text-green-400" />
          <span className="text-white font-medium">Analysis Complete</span>
        </div>
        
        <h2 className="text-4xl font-bold text-white mb-4">
          Routing Results
        </h2>
        <p className="text-xl text-gray-300 max-w-3xl mx-auto">
          Your message has been analyzed and intelligently routed to the optimal department
        </p>
      </motion.div>

      {/* Main Results Card */}
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white/5 backdrop-blur-xl rounded-3xl p-8 border border-white/10 shadow-2xl mb-8"
      >
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Routing Decision */}
          <div>
            <div className="flex items-center gap-3 mb-6">
              <div className={`p-3 bg-gradient-to-r ${selectedDept.color} rounded-xl`}>
                <Target className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-xl font-semibold text-white">Recommended Department</h3>
                <p className="text-gray-400">Based on AI analysis</p>
              </div>
            </div>

            <div className={`p-6 rounded-2xl bg-gradient-to-br ${selectedDept.color} bg-opacity-10 border border-white/10 mb-6`}>
              <div className="flex items-center gap-4 mb-4">
                <div className="text-4xl">{selectedDept.icon}</div>
                <div>
                  <h4 className="text-2xl font-bold text-white">{selectedDept.name}</h4>
                  <p className="text-gray-300">{selectedDept.description}</p>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="bg-black/20 rounded-xl p-3">
                  <div className="text-gray-400">Staff Available</div>
                  <div className="text-white font-semibold text-lg">{selectedDept.staff}</div>
                </div>
                <div className="bg-black/20 rounded-xl p-3">
                  <div className="text-gray-400">Avg Response</div>
                  <div className="text-white font-semibold text-lg">{selectedDept.avgResponseTime}</div>
                </div>
              </div>

              <button
                onClick={() => setSelectedDepartment(selectedDept.id)}
                className="w-full mt-4 bg-white/10 hover:bg-white/20 text-white rounded-xl p-3 transition-all border border-white/20 flex items-center justify-center gap-2"
              >
                View Department Details
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Analysis Details */}
          <div>
            <div className="flex items-center gap-3 mb-6">
              <div className="p-3 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl">
                <Star className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-xl font-semibold text-white">Analysis Insights</h3>
                <p className="text-gray-400">AI-powered understanding</p>
              </div>
            </div>

            <div className="space-y-4">
              <div className="bg-white/5 rounded-2xl p-4 border border-white/10">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-gray-400">Confidence Score</span>
                  <span className="text-white font-semibold">{Math.round((routing?.confidence || 0.95) * 100)}%</span>
                </div>
                <div className="w-full bg-white/10 rounded-full h-2">
                  <motion.div 
                    className="bg-gradient-to-r from-green-500 to-emerald-500 h-2 rounded-full"
                    initial={{ width: 0 }}
                    animate={{ width: `${Math.round((routing?.confidence || 0.95) * 100)}%` }}
                    transition={{ duration: 1, delay: 0.5 }}
                  />
                </div>
              </div>

              <div className="bg-white/5 rounded-2xl p-4 border border-white/10">
                <div className="flex items-center justify-between">
                  <span className="text-gray-400">Priority Level</span>
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${getPriorityColor(analysis?.priority || 'Medium')}`}>
                    {analysis?.priority || 'Medium'}
                  </span>
                </div>
              </div>

              <div className="bg-white/5 rounded-2xl p-4 border border-white/10">
                <div className="flex items-center justify-between">
                  <span className="text-gray-400">Processing Time</span>
                  <span className="text-white font-semibold">0.8s</span>
                </div>
              </div>

              <div className="bg-white/5 rounded-2xl p-4 border border-white/10">
                <div className="text-gray-400 mb-2">Key Topics Detected</div>
                <div className="flex flex-wrap gap-2">
                  {(analysis?.topics || ['Technical Issue', 'Account Problem']).map((topic: string, index: number) => (
                    <span 
                      key={index}
                      className="px-2 py-1 bg-blue-500/20 text-blue-400 rounded-lg text-sm"
                    >
                      {topic}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Performance Comparison Toggle */}
      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="text-center mb-8"
      >
        <button
          onClick={() => setShowComparison(!showComparison)}
          className="inline-flex items-center gap-3 px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-2xl hover:from-blue-700 hover:to-purple-700 transition-all shadow-lg"
        >
          <TrendingUp className="w-5 h-5" />
          {showComparison ? 'Hide' : 'Show'} Performance Comparison
        </button>
      </motion.div>

      {/* Performance Comparison */}
      <AnimatePresence>
        {showComparison && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-8"
          >
            <div className="bg-white/5 backdrop-blur-xl rounded-3xl p-8 border border-white/10">
              <div className="text-center mb-8">
                <h3 className="text-2xl font-bold text-white mb-2">AI vs Traditional Routing</h3>
                <p className="text-gray-400">See the dramatic improvement in customer service metrics</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {[
                  { 
                    label: 'Average Routing Time', 
                    traditional: `${traditionalMetrics.averageTime}s`, 
                    ai: `${aiMetrics.averageTime}s`,
                    improvement: '-81%',
                    icon: Clock
                  },
                  { 
                    label: 'Routing Accuracy', 
                    traditional: `${traditionalMetrics.accuracy}%`, 
                    ai: `${aiMetrics.accuracy}%`,
                    improvement: '+38%',
                    icon: Target
                  },
                  { 
                    label: 'Customer Satisfaction', 
                    traditional: `${traditionalMetrics.customerSatisfaction}/5`, 
                    ai: `${aiMetrics.customerSatisfaction}/5`,
                    improvement: '+47%',
                    icon: Star
                  },
                  { 
                    label: 'Escalation Rate', 
                    traditional: `${traditionalMetrics.escalationRate}%`, 
                    ai: `${aiMetrics.escalationRate}%`,
                    improvement: '-80%',
                    icon: AlertTriangle
                  }
                ].map((metric, index) => {
                  const Icon = metric.icon;
                  return (
                    <motion.div
                      key={metric.label}
                      initial={{ opacity: 0, y: 30 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="bg-white/5 rounded-2xl p-6 border border-white/10"
                    >
                      <div className="flex items-center gap-3 mb-4">
                        <Icon className="w-5 h-5 text-purple-400" />
                        <h4 className="font-semibold text-white text-sm">{metric.label}</h4>
                      </div>
                      
                      <div className="space-y-3">
                        <div className="flex justify-between items-center">
                          <span className="text-gray-400 text-sm">Traditional</span>
                          <span className="text-red-400 font-semibold">{metric.traditional}</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-gray-400 text-sm">AI-Powered</span>
                          <span className="text-green-400 font-semibold">{metric.ai}</span>
                        </div>
                        <div className={`text-center py-2 px-3 rounded-lg ${
                          metric.improvement.startsWith('+') 
                            ? 'bg-green-500/20 text-green-400' 
                            : 'bg-blue-500/20 text-blue-400'
                        }`}>
                          <div className="flex items-center justify-center gap-1">
                            <TrendingUp className="w-4 h-4" />
                            <span className="font-bold text-sm">{metric.improvement}</span>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Action Buttons */}
      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="flex flex-col sm:flex-row gap-4 justify-center"
      >
        <button
          onClick={() => {
            onComplete();
            onNext();
          }}
          className="flex items-center justify-center gap-3 px-8 py-4 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-2xl hover:from-green-700 hover:to-emerald-700 transition-all shadow-lg font-medium"
        >
          <Award className="w-5 h-5" />
          Continue to Advanced Features
        </button>
        
        <button
          onClick={() => window.location.reload()}
          className="flex items-center justify-center gap-3 px-8 py-4 bg-white/10 text-white rounded-2xl hover:bg-white/20 transition-all border border-white/20 font-medium"
        >
          <Zap className="w-5 h-5" />
          Try Another Message
        </button>
      </motion.div>

      {/* Department Detail Modal */}
      {selectedDepartment && (
        <DepartmentDetailModal
          isOpen={!!selectedDepartment}
          onClose={() => setSelectedDepartment(null)}
          departmentKey={selectedDepartment}
        />
      )}
    </div>
  );
}