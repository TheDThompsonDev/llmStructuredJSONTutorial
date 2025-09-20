'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Building2, 
  Users, 
  Shield, 
  Zap, 
  Globe,
  BarChart3,
  ArrowRight,
  CheckCircle,
  Star,
  Crown,
  Rocket,
  Award
} from 'lucide-react';
import BatchProcessor from '../BatchProcessor';
import ROICalculator from '../ROICalculator';

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

interface EnterpriseStepProps {
  data?: StepData;
  onComplete: () => void;
  onNext: () => void;
}

export default function EnterpriseStep({ data, onComplete, onNext }: EnterpriseStepProps) {
  const [selectedToolId, setSelectedToolId] = useState<string>('batch');
  const [showDemo, setShowDemo] = useState(false);

  const enterpriseTools = [
    {
      id: 'batch',
      title: 'Batch Processing',
      description: 'Process thousands of messages simultaneously',
      icon: Zap,
      color: 'from-blue-500 to-cyan-500',
      component: BatchProcessor
    },
    {
      id: 'roi',
      title: 'ROI Calculator',
      description: 'Calculate business impact and cost savings',
      icon: BarChart3,
      color: 'from-green-500 to-emerald-500',
      component: ROICalculator
    },
    {
      id: 'integration',
      title: 'API Integration',
      description: 'Seamless integration with existing systems',
      icon: Building2,
      color: 'from-orange-500 to-red-500',
      component: null
    }
  ];

  const benefits = [
    {
      icon: Shield,
      title: 'Enterprise Security',
      description: 'SOC 2 Type II compliance with end-to-end encryption',
      value: '99.99%',
      metric: 'Uptime SLA'
    },
    {
      icon: Users,
      title: 'Scalable Architecture',
      description: 'Handle millions of messages with auto-scaling infrastructure',
      value: '10M+',
      metric: 'Messages/day'
    },
    {
      icon: Globe,
      title: 'Global Deployment',
      description: 'Multi-region deployment with edge computing',
      value: '50+',
      metric: 'Languages'
    },
    {
      icon: Rocket,
      title: 'Lightning Performance',
      description: 'Sub-second response times with intelligent caching',
      value: '<500ms',
      metric: 'Avg Response'
    }
  ];

  const caseStudies = [
    {
      company: 'TechCorp Inc.',
      industry: 'Software',
      employees: '50,000+',
      improvement: '+340% efficiency',
      savings: '$2.3M annually',
      quote: 'Transformed our customer service operations completely.',
      logo: '🏢'
    },
    {
      company: 'GlobalBank',
      industry: 'Financial Services',
      employees: '100,000+',
      improvement: '+280% accuracy',
      savings: '$4.7M annually',
      quote: 'Reduced escalations by 85% in the first quarter.',
      logo: '🏦'
    },
    {
      company: 'MedHealth',
      industry: 'Healthcare',
      employees: '25,000+',
      improvement: '+450% speed',
      savings: '$1.8M annually',
      quote: 'Patient satisfaction scores increased dramatically.',
      logo: '🏥'
    }
  ];

  const selectedToolData = enterpriseTools.find(t => t.id === selectedToolId) || enterpriseTools[0];
  const SelectedComponent = selectedToolData.component;

  return (
    <div className="max-w-7xl mx-auto">
      {/* Header */}
      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-12"
      >
        <div className="inline-flex items-center gap-3 px-6 py-3 bg-gradient-to-r from-yellow-500/20 to-orange-500/20 rounded-full border border-white/20 backdrop-blur-sm mb-6">
          <Crown className="w-5 h-5 text-yellow-400" />
          <span className="text-white font-medium">Enterprise Solutions</span>
        </div>
        
        <h2 className="text-5xl font-bold text-white mb-6 bg-gradient-to-r from-yellow-400 via-orange-400 to-red-400 bg-clip-text text-transparent">
          Scale to Enterprise
        </h2>
        <p className="text-xl text-gray-300 max-w-4xl mx-auto leading-relaxed">
          Discover how Fortune 500 companies are revolutionizing their customer service operations with our enterprise-grade AI routing platform
        </p>
      </motion.div>

      {/* Enterprise Benefits */}
      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16"
      >
        {benefits.map((benefit, index) => {
          const Icon = benefit.icon;
          return (
            <motion.div
              key={benefit.title}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3 + index * 0.1 }}
              className="bg-white/5 backdrop-blur-xl rounded-2xl p-6 border border-white/10 hover:bg-white/10 transition-all group"
            >
              <div className="flex items-center justify-between mb-4">
                <Icon className="w-8 h-8 text-blue-400 group-hover:text-blue-300 transition-colors" />
                <div className="text-right">
                  <div className="text-2xl font-bold text-white">{benefit.value}</div>
                  <div className="text-xs text-gray-400">{benefit.metric}</div>
                </div>
              </div>
              
              <h3 className="text-lg font-semibold text-white mb-2">{benefit.title}</h3>
              <p className="text-gray-400 text-sm leading-relaxed">{benefit.description}</p>
            </motion.div>
          );
        })}
      </motion.div>

      {/* Enterprise Tools */}
      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="mb-16"
      >
        <div className="text-center mb-8">
          <h3 className="text-3xl font-bold text-white mb-4">Enterprise Tools & Capabilities</h3>
          <p className="text-gray-300 max-w-2xl mx-auto">
            Experience the full power of our enterprise platform with advanced tools designed for scale
          </p>
        </div>

        {/* Tool Selection */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {enterpriseTools.map((tool) => {
            const Icon = tool.icon;
            const isSelected = selectedToolId === tool.id;
            
            return (
              <motion.button
                key={tool.id}
                onClick={() => setSelectedToolId(tool.id)}
                className={`text-left p-6 rounded-2xl border transition-all ${
                  isSelected
                    ? `bg-gradient-to-br ${tool.color} bg-opacity-20 border-white/30 shadow-xl ring-2 ring-white/20`
                    : 'bg-white/5 border-white/10 hover:bg-white/10 hover:border-white/20'
                }`}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <div className={`p-3 rounded-xl mb-4 ${
                  isSelected 
                    ? `bg-gradient-to-r ${tool.color}` 
                    : 'bg-white/10'
                }`}>
                  <Icon className={`w-6 h-6 ${
                    isSelected ? 'text-white' : 'text-gray-400'
                  }`} />
                </div>
                
                <h4 className={`font-semibold mb-2 ${
                  isSelected ? 'text-white' : 'text-gray-300'
                }`}>
                  {tool.title}
                </h4>
                <p className={`text-sm ${
                  isSelected ? 'text-gray-200' : 'text-gray-400'
                }`}>
                  {tool.description}
                </p>
              </motion.button>
            );
          })}
        </div>

        {/* Tool Demo */}
        <AnimatePresence mode="wait">
          <motion.div
            key={selectedToolId}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -30 }}
            transition={{ duration: 0.3 }}
            className="bg-white/5 backdrop-blur-xl rounded-3xl p-8 border border-white/10 shadow-2xl"
          >
            {SelectedComponent && (
              <SelectedComponent />
            )}

            {!SelectedComponent && (
              <div className="text-center py-12">
                <selectedToolData.icon className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h4 className="text-xl font-semibold text-white mb-2">{selectedToolData.title}</h4>
                <p className="text-gray-300 mb-6">{selectedToolData.description}</p>
                <button className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all">
                  Contact Sales for Demo
                </button>
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </motion.div>

      {/* Case Studies */}
      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="mb-16"
      >
        <div className="text-center mb-8">
          <h3 className="text-3xl font-bold text-white mb-4">Trusted by Industry Leaders</h3>
          <p className="text-gray-300">See how companies like yours are transforming customer service</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {caseStudies.map((study, index) => (
            <motion.div
              key={study.company}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 + index * 0.1 }}
              className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl rounded-2xl p-6 border border-white/10"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="text-3xl">{study.logo}</div>
                <div>
                  <h4 className="font-bold text-white">{study.company}</h4>
                  <p className="text-sm text-gray-400">{study.industry} • {study.employees}</p>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div className="bg-black/20 rounded-xl p-3 text-center">
                  <div className="text-green-400 font-bold">{study.improvement}</div>
                  <div className="text-xs text-gray-400">Improvement</div>
                </div>
                <div className="bg-black/20 rounded-xl p-3 text-center">
                  <div className="text-blue-400 font-bold">{study.savings}</div>
                  <div className="text-xs text-gray-400">Cost Savings</div>
                </div>
              </div>
              
              <blockquote className="text-gray-300 text-sm italic border-l-2 border-purple-500 pl-3">
                "{study.quote}"
              </blockquote>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Final CTA */}
      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8 }}
        className="text-center bg-gradient-to-r from-purple-500/10 via-blue-500/10 to-cyan-500/10 rounded-3xl p-12 border border-white/10"
      >
        <Crown className="w-16 h-16 text-yellow-400 mx-auto mb-6" />
        <h3 className="text-3xl font-bold text-white mb-4">Ready to Transform Your Customer Service?</h3>
        <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
          Join thousands of companies already using AI-powered routing to deliver exceptional customer experiences at scale.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button
            onClick={() => {
              onComplete();
              window.location.reload();
            }}
            className="flex items-center justify-center gap-3 px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-2xl hover:from-purple-700 hover:to-pink-700 transition-all shadow-lg font-medium"
          >
            <Rocket className="w-5 h-5" />
            Start Your Demo
          </button>
          
          <button className="flex items-center justify-center gap-3 px-8 py-4 bg-white/10 text-white rounded-2xl hover:bg-white/20 transition-all border border-white/20 font-medium">
            <Building2 className="w-5 h-5" />
            Schedule Enterprise Consultation
          </button>
        </div>
        
        <div className="flex items-center justify-center gap-6 mt-8 text-sm text-gray-400">
          <div className="flex items-center gap-2">
            <CheckCircle className="w-4 h-4 text-green-400" />
            <span>30-day free trial</span>
          </div>
          <div className="flex items-center gap-2">
            <Shield className="w-4 h-4 text-blue-400" />
            <span>SOC 2 certified</span>
          </div>
          <div className="flex items-center gap-2">
            <Star className="w-4 h-4 text-yellow-400" />
            <span>24/7 enterprise support</span>
          </div>
        </div>
      </motion.div>
    </div>
  );
}