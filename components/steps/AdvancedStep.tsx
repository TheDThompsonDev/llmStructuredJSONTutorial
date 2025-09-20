'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  TrendingUp, 
  BarChart3, 
  Clock, 
  Target,
  Zap,
  Brain,
  Globe,
  Shield,
  Layers,
  Activity
} from 'lucide-react';
import PerformanceComparison from '../PerformanceComparison';

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

interface AdvancedStepProps {
  data?: StepData;
  onComplete: () => void;
  onNext: () => void;
}

export default function AdvancedStep({ data, onComplete, onNext }: AdvancedStepProps) {
  const [selectedFeature, setSelectedFeature] = useState<string>('performance');
  const [showDemo, setShowDemo] = useState(false);

  const features = [
    {
      id: 'performance',
      title: 'Performance Analytics',
      description: 'Real-time metrics and performance comparisons',
      icon: TrendingUp,
      color: 'from-blue-500 to-cyan-500',
      component: PerformanceComparison
    },
    {
      id: 'realtime',
      title: 'Real-time Processing',
      description: 'Instant message analysis with streaming responses',
      icon: Zap,
      color: 'from-yellow-500 to-orange-500',
      component: null
    },
    {
      id: 'multilingual',
      title: 'Multi-language Support',
      description: 'Support for 50+ languages with context preservation',
      icon: Globe,
      color: 'from-green-500 to-emerald-500',
      component: null
    },
    {
      id: 'security',
      title: 'Enterprise Security',
      description: 'SOC 2 compliant with end-to-end encryption',
      icon: Shield,
      color: 'from-purple-500 to-pink-500',
      component: null
    }
  ];

  const metrics = [
    {
      label: 'Processing Speed',
      value: '0.8s',
      change: '+300%',
      trend: 'up',
      description: 'Average message analysis time'
    },
    {
      label: 'Accuracy Rate',
      value: '94.2%',
      change: '+26%',
      trend: 'up',
      description: 'Correct department routing'
    },
    {
      label: 'Cost Savings',
      value: '$47K',
      change: '+156%',
      trend: 'up',
      description: 'Monthly operational savings'
    },
    {
      label: 'Customer Satisfaction',
      value: '4.8/5',
      change: '+0.9',
      trend: 'up',
      description: 'Average customer rating'
    }
  ];

  const selectedFeatureData = features.find(f => f.id === selectedFeature) || features[0];
  const FeatureComponent = selectedFeatureData.component;

  return (
    <div className="max-w-6xl mx-auto">
      {/* Header */}
      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-12"
      >
        <div className="inline-flex items-center gap-3 px-6 py-3 bg-gradient-to-r from-cyan-500/20 to-blue-500/20 rounded-full border border-white/20 backdrop-blur-sm mb-6">
          <Brain className="w-5 h-5 text-cyan-400" />
          <span className="text-white font-medium">Advanced AI Features</span>
        </div>
        
        <h2 className="text-4xl font-bold text-white mb-4 bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400 bg-clip-text text-transparent">
          Enterprise-Grade Intelligence
        </h2>
        <p className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
          Explore the advanced capabilities that make our AI routing system a game-changer for customer service operations
        </p>
      </motion.div>

      {/* Key Metrics Dashboard */}
      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12"
      >
        {metrics.map((metric, index) => (
          <motion.div
            key={metric.label}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3 + index * 0.1 }}
            className="bg-white/5 backdrop-blur-xl rounded-2xl p-6 border border-white/10 hover:bg-white/10 transition-all"
          >
            <div className="flex items-center justify-between mb-3">
              <div className={`p-2 rounded-lg ${
                metric.trend === 'up' ? 'bg-green-500/20' : 'bg-red-500/20'
              }`}>
                <Activity className={`w-4 h-4 ${
                  metric.trend === 'up' ? 'text-green-400' : 'text-red-400'
                }`} />
              </div>
              <span className={`text-sm font-semibold ${
                metric.trend === 'up' ? 'text-green-400' : 'text-red-400'
              }`}>
                {metric.change}
              </span>
            </div>
            
            <div className="text-3xl font-bold text-white mb-2">{metric.value}</div>
            <div className="text-gray-400 font-medium mb-1">{metric.label}</div>
            <div className="text-gray-500 text-sm">{metric.description}</div>
          </motion.div>
        ))}
      </motion.div>

      {/* Feature Selection */}
      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="mb-8"
      >
        <div className="flex items-center gap-3 mb-6">
          <Layers className="w-6 h-6 text-purple-400" />
          <h3 className="text-2xl font-semibold text-white">Advanced Features</h3>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {features.map((feature) => {
            const Icon = feature.icon;
            const isSelected = selectedFeature === feature.id;
            
            return (
              <motion.button
                key={feature.id}
                onClick={() => setSelectedFeature(feature.id)}
                className={`text-left p-6 rounded-2xl border transition-all ${
                  isSelected
                    ? `bg-gradient-to-br ${feature.color} bg-opacity-20 border-white/30 shadow-xl`
                    : 'bg-white/5 border-white/10 hover:bg-white/10'
                }`}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <div className={`p-3 rounded-xl mb-4 ${
                  isSelected 
                    ? `bg-gradient-to-r ${feature.color}` 
                    : 'bg-white/10'
                }`}>
                  <Icon className={`w-6 h-6 ${
                    isSelected ? 'text-white' : 'text-gray-400'
                  }`} />
                </div>
                
                <h4 className={`font-semibold mb-2 ${
                  isSelected ? 'text-white' : 'text-gray-300'
                }`}>
                  {feature.title}
                </h4>
                <p className={`text-sm ${
                  isSelected ? 'text-gray-200' : 'text-gray-400'
                }`}>
                  {feature.description}
                </p>
              </motion.button>
            );
          })}
        </div>
      </motion.div>

      {/* Feature Demo */}
      <AnimatePresence mode="wait">
        <motion.div
          key={selectedFeature}
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -30 }}
          transition={{ duration: 0.3 }}
          className="bg-white/5 backdrop-blur-xl rounded-3xl p-8 border border-white/10 shadow-2xl mb-8"
        >
          <div className="flex items-center gap-4 mb-8">
            <div className={`p-4 bg-gradient-to-r ${selectedFeatureData.color} rounded-2xl`}>
              <selectedFeatureData.icon className="w-8 h-8 text-white" />
            </div>
            <div>
              <h3 className="text-2xl font-bold text-white">{selectedFeatureData.title}</h3>
              <p className="text-gray-300">{selectedFeatureData.description}</p>
            </div>
          </div>

          {selectedFeature === 'performance' && FeatureComponent && (
            <FeatureComponent metrics={[]} currentComparison={undefined} />
          )}

          {selectedFeature === 'realtime' && (
            <div className="space-y-6">
              <div className="text-center">
                <h4 className="text-xl font-semibold text-white mb-4">Real-time Stream Processing</h4>
                <p className="text-gray-300 mb-6">Experience lightning-fast message analysis with streaming responses</p>
              </div>
              
              <div className="bg-black/20 rounded-2xl p-6 font-mono text-sm">
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                  <span className="text-green-400">STREAMING ACTIVE</span>
                </div>
                
                <div className="space-y-2 text-gray-300">
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-blue-400" />
                    <span>0.12s - Message received and tokenized</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Brain className="w-4 h-4 text-purple-400" />
                    <span>0.34s - Context analysis complete</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Target className="w-4 h-4 text-green-400" />
                    <span>0.67s - Department routing determined</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Zap className="w-4 h-4 text-yellow-400" />
                    <span>0.78s - Response generated and sent</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {selectedFeature === 'multilingual' && (
            <div className="space-y-6">
              <div className="text-center">
                <h4 className="text-xl font-semibold text-white mb-4">Multi-language Intelligence</h4>
                <p className="text-gray-300 mb-6">Process customer messages in any language while preserving context and nuance</p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[
                  { lang: 'Spanish', message: '¿Puedo obtener un reembolso?', dept: 'Billing', confidence: '96%' },
                  { lang: 'French', message: 'L\'application ne fonctionne pas', dept: 'Technical', confidence: '94%' },
                  { lang: 'German', message: 'Ich möchte mein Konto aktualisieren', dept: 'Sales', confidence: '92%' }
                ].map((example, index) => (
                  <div key={index} className="bg-black/20 rounded-2xl p-4">
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-purple-400 font-semibold">{example.lang}</span>
                      <span className="text-green-400 text-sm">{example.confidence}</span>
                    </div>
                    <p className="text-white text-sm mb-3">{example.message}</p>
                    <div className="text-gray-400 text-xs">→ Routed to {example.dept}</div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {selectedFeature === 'security' && (
            <div className="space-y-6">
              <div className="text-center">
                <h4 className="text-xl font-semibold text-white mb-4">Enterprise-Grade Security</h4>
                <p className="text-gray-300 mb-6">Bank-level security with comprehensive compliance and privacy protection</p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {[
                  { title: 'SOC 2 Type II', description: 'Certified compliance', icon: Shield },
                  { title: 'End-to-End Encryption', description: 'AES-256 encryption', icon: Shield },
                  { title: 'Zero Trust Architecture', description: 'Verified access only', icon: Shield },
                  { title: 'GDPR Compliant', description: 'Privacy by design', icon: Shield }
                ].map((item, index) => {
                  const Icon = item.icon;
                  return (
                    <div key={index} className="bg-purple-500/10 rounded-2xl p-4 border border-purple-500/20">
                      <Icon className="w-8 h-8 text-purple-400 mb-3" />
                      <h5 className="text-white font-semibold text-sm mb-2">{item.title}</h5>
                      <p className="text-gray-400 text-xs">{item.description}</p>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </motion.div>
      </AnimatePresence>

      {/* Action Button */}
      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="text-center"
      >
        <button
          onClick={() => {
            onComplete();
            onNext();
          }}
          className="inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-2xl hover:from-purple-700 hover:to-pink-700 transition-all shadow-lg font-medium"
        >
          <BarChart3 className="w-5 h-5" />
          Explore Enterprise Features
        </button>
      </motion.div>
    </div>
  );
}