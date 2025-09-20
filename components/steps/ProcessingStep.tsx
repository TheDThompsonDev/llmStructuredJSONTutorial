'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Brain, Zap, Target, Clock, CheckCircle } from 'lucide-react';

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

interface ProcessingStepProps {
  data?: StepData;
  onComplete: () => void;
  onNext: () => void;
}

export default function ProcessingStep({ data, onComplete, onNext }: ProcessingStepProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [isComplete, setIsComplete] = useState(false);
  const [processingResult, setProcessingResult] = useState<ProcessingResult | null>(null);

  const processingSteps = [
    {
      id: 'analyze',
      title: 'Analyzing Message',
      description: 'AI is reading and understanding the customer message context',
      icon: Brain,
      color: 'from-blue-500 to-cyan-500',
      duration: 2000
    },
    {
      id: 'categorize',
      title: 'Categorizing Intent',
      description: 'Identifying the type of inquiry and urgency level',
      icon: Target,
      color: 'from-purple-500 to-pink-500',
      duration: 1500
    },
    {
      id: 'route',
      title: 'Determining Route',
      description: 'Selecting optimal department based on message analysis',
      icon: Zap,
      color: 'from-green-500 to-emerald-500',
      duration: 1000
    },
    {
      id: 'complete',
      title: 'Processing Complete',
      description: 'Message has been successfully analyzed and routed',
      icon: CheckCircle,
      color: 'from-emerald-500 to-green-500',
      duration: 500
    }
  ];

  useEffect(() => {
    const processMessage = async () => {
      for (let i = 0; i < processingSteps.length; i++) {
        setCurrentStep(i);
        
        // Simulate API call for the actual processing step
        if (i === 1) {
          try {
            const response = await fetch('/api/process', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ message: data?.message || '' })
            });
            
            if (response.ok) {
              const result = await response.json();
              setProcessingResult(result);
              
              // Store result in data context
              if (data) {
                data.result = result;
              }
            }
          } catch (error) {
            console.error('Processing error:', error);
          }
        }
        
      }
      
      setIsComplete(true);
      
      // Auto-advance immediately after processing
      onComplete();
      onNext();
    };

    processMessage();
  }, [data, onComplete, onNext]);

  return (
    <div className="max-w-4xl mx-auto">
      {/* Processing Header */}
      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-12"
      >
        <div className="inline-flex items-center gap-3 px-6 py-3 bg-gradient-to-r from-orange-500/20 to-red-500/20 rounded-full border border-white/20 backdrop-blur-sm mb-6">
          <Brain className="w-5 h-5 text-orange-400" />
          <span className="text-white font-medium">AI Processing Engine</span>
        </div>
        
        <h2 className="text-4xl font-bold text-white mb-4">
          Processing Your Message
        </h2>
        <p className="text-xl text-gray-300 max-w-2xl mx-auto">
          Watch our AI analyze and route your message in real-time
        </p>
      </motion.div>

      {/* Message Display */}
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white/5 backdrop-blur-xl rounded-3xl p-8 border border-white/10 shadow-2xl mb-12"
      >
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center flex-shrink-0">
            <span className="text-white font-semibold text-lg">C</span>
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <h3 className="text-white font-semibold">Customer Message</h3>
              <span className="text-xs bg-blue-500/20 text-blue-400 px-2 py-1 rounded-full">
                {new Date(data?.timestamp || Date.now()).toLocaleTimeString()}
              </span>
            </div>
            <p className="text-gray-300 leading-relaxed">
              {data?.message || 'No message provided'}
            </p>
          </div>
        </div>
      </motion.div>

      {/* Processing Steps */}
      <div className="space-y-6">
        {processingSteps.map((step, index) => {
          const Icon = step.icon;
          const isActive = currentStep === index;
          const isCompleted = currentStep > index;
          const isPending = currentStep < index;

          return (
            <motion.div
              key={step.id}
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.2 }}
              className={`relative flex items-center gap-6 p-6 rounded-2xl border transition-all ${
                isActive 
                  ? 'bg-white/10 border-white/30 shadow-xl'
                  : isCompleted 
                    ? 'bg-green-500/10 border-green-500/30'
                    : 'bg-white/5 border-white/10'
              }`}
            >
              {/* Step Icon */}
              <div className={`w-16 h-16 rounded-2xl flex items-center justify-center relative ${
                isActive 
                  ? `bg-gradient-to-r ${step.color}` 
                  : isCompleted 
                    ? 'bg-green-500/20'
                    : 'bg-white/10'
              }`}>
                <Icon className={`w-8 h-8 ${
                  isActive 
                    ? 'text-white' 
                    : isCompleted 
                      ? 'text-green-400' 
                      : 'text-gray-400'
                }`} />
                
                {/* Active indicator */}
                {isActive && (
                  <motion.div
                    className="absolute inset-0 rounded-2xl border-2 border-white/50"
                    animate={{ 
                      scale: [1, 1.1, 1],
                      opacity: [0.5, 1, 0.5]
                    }}
                    transition={{ 
                      duration: 1.5, 
                      repeat: Infinity 
                    }}
                  />
                )}
              </div>

              {/* Step Content */}
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <h3 className={`text-xl font-semibold ${
                    isActive ? 'text-white' : isCompleted ? 'text-green-400' : 'text-gray-400'
                  }`}>
                    {step.title}
                  </h3>
                  
                  {isActive && (
                    <div className="flex gap-1">
                      {[0, 1, 2].map((i) => (
                        <motion.div
                          key={i}
                          className="w-2 h-2 bg-white rounded-full"
                          animate={{ 
                            opacity: [0.3, 1, 0.3],
                            scale: [0.8, 1, 0.8]
                          }}
                          transition={{ 
                            duration: 1.2, 
                            repeat: Infinity, 
                            delay: i * 0.2 
                          }}
                        />
                      ))}
                    </div>
                  )}
                </div>
                
                <p className={`${
                  isActive ? 'text-gray-300' : isCompleted ? 'text-green-300' : 'text-gray-500'
                }`}>
                  {step.description}
                </p>

                {/* Progress bar for active step */}
                {isActive && (
                  <motion.div
                    className="mt-3 h-1 bg-white/20 rounded-full overflow-hidden"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                  >
                    <motion.div
                      className={`h-full bg-gradient-to-r ${step.color} rounded-full`}
                      initial={{ width: '0%' }}
                      animate={{ width: '100%' }}
                      transition={{ duration: step.duration / 1000, ease: 'easeInOut' }}
                    />
                  </motion.div>
                )}
              </div>

              {/* Status indicator */}
              <div className="flex items-center">
                {isCompleted && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center"
                  >
                    <CheckCircle className="w-4 h-4 text-white" />
                  </motion.div>
                )}
                
                {isActive && (
                  <div className="w-6 h-6">
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  </div>
                )}
                
                {isPending && (
                  <div className="w-6 h-6 bg-gray-600 rounded-full flex items-center justify-center">
                    <Clock className="w-4 h-4 text-gray-400" />
                  </div>
                )}
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Processing Stats */}
      <AnimatePresence>
        {processingResult && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6"
          >
            <div className="bg-blue-500/10 backdrop-blur-xl rounded-2xl p-6 border border-blue-500/20">
              <h4 className="text-blue-400 font-semibold mb-2">Department</h4>
              <p className="text-white text-2xl font-bold">
                {processingResult.routing?.department || 'Technical Support'}
              </p>
            </div>
            
            <div className="bg-purple-500/10 backdrop-blur-xl rounded-2xl p-6 border border-purple-500/20">
              <h4 className="text-purple-400 font-semibold mb-2">Confidence</h4>
              <p className="text-white text-2xl font-bold">
                {Math.round((processingResult.routing?.confidence || 0.95) * 100)}%
              </p>
            </div>
            
            <div className="bg-green-500/10 backdrop-blur-xl rounded-2xl p-6 border border-green-500/20">
              <h4 className="text-green-400 font-semibold mb-2">Priority</h4>
              <p className="text-white text-2xl font-bold">
                {processingResult.analysis?.priority || 'Medium'}
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}