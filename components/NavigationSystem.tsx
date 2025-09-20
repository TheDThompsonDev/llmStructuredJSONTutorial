'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronRight, ChevronLeft, Check, Lock } from 'lucide-react';

export interface NavigationStep {
  id: string;
  title: string;
  description: string;
  icon: React.ComponentType<any>;
  component: React.ComponentType<any>;
  color: string;
  gradient: string;
  requiresCompletion?: boolean;
}

interface NavigationSystemProps {
  steps: NavigationStep[];
  onStepChange?: (stepId: string) => void;
  data?: any;
}

export default function NavigationSystem({ steps, onStepChange, data }: NavigationSystemProps) {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [completedSteps, setCompletedSteps] = useState<string[]>([]);

  const currentStep = steps[currentStepIndex];

  const navigateToStep = (index: number) => {
    if (index >= 0 && index < steps.length) {
      // Check if step requires completion of previous steps
      if (steps[index].requiresCompletion && index > 0) {
        const previousStepId = steps[index - 1].id;
        if (!completedSteps.includes(previousStepId)) {
          return; // Don't allow navigation to locked step
        }
      }
      
      setCurrentStepIndex(index);
      onStepChange?.(steps[index].id);
    }
  };

  const markStepComplete = (stepId: string) => {
    if (!completedSteps.includes(stepId)) {
      setCompletedSteps(prev => [...prev, stepId]);
    }
  };

  const nextStep = () => {
    if (currentStepIndex < steps.length - 1) {
      markStepComplete(currentStep.id);
      navigateToStep(currentStepIndex + 1);
    }
  };

  const prevStep = () => {
    if (currentStepIndex > 0) {
      navigateToStep(currentStepIndex - 1);
    }
  };

  const isStepAccessible = (index: number) => {
    if (index <= currentStepIndex) return true;
    if (!steps[index].requiresCompletion) return true;
    return index > 0 && completedSteps.includes(steps[index - 1].id);
  };

  const getStepStatus = (index: number, stepId: string) => {
    if (completedSteps.includes(stepId)) return 'completed';
    if (index === currentStepIndex) return 'active';
    if (isStepAccessible(index)) return 'available';
    return 'locked';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Navigation Header */}
      <div className="sticky top-0 z-50 bg-black/20 backdrop-blur-xl border-b border-white/10">
        <div className="container mx-auto px-6 py-4">
          {/* Progress Steps */}
          <div className="flex items-center justify-center space-x-2 md:space-x-4 overflow-x-auto pb-2">
            {steps.map((step, index) => {
              const Icon = step.icon;
              const status = getStepStatus(index, step.id);
              
              return (
                <motion.button
                  key={step.id}
                  onClick={() => navigateToStep(index)}
                  disabled={status === 'locked'}
                  className={`flex items-center gap-2 px-3 py-2 rounded-full text-sm font-medium transition-all whitespace-nowrap ${
                    status === 'active' 
                      ? `bg-gradient-to-r ${step.gradient} text-white shadow-lg shadow-purple-500/30`
                      : status === 'completed'
                        ? 'bg-green-500/20 text-green-400 border border-green-500/30'
                        : status === 'available'
                          ? 'bg-white/10 text-gray-300 hover:bg-white/20 border border-white/20'
                          : 'bg-gray-800/50 text-gray-500 cursor-not-allowed border border-gray-700'
                  }`}
                  whileHover={status !== 'locked' ? { scale: 1.05 } : {}}
                  whileTap={status !== 'locked' ? { scale: 0.95 } : {}}
                >
                  <div className="w-5 h-5 flex items-center justify-center">
                    {status === 'completed' ? (
                      <Check className="w-4 h-4" />
                    ) : status === 'locked' ? (
                      <Lock className="w-4 h-4" />
                    ) : (
                      <Icon className="w-4 h-4" />
                    )}
                  </div>
                  <span className="hidden sm:inline">{step.title}</span>
                </motion.button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="container mx-auto px-6 py-8">
        {/* Step Header */}
        <motion.div 
          key={currentStep.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <div className={`inline-flex items-center gap-3 px-6 py-3 rounded-2xl bg-gradient-to-r ${currentStep.gradient} text-white shadow-2xl mb-4`}>
            <currentStep.icon className="w-6 h-6" />
            <h1 className="text-xl font-bold">{currentStep.title}</h1>
          </div>
          <p className="text-gray-300 text-lg max-w-2xl mx-auto">
            {currentStep.description}
          </p>
        </motion.div>

        {/* Step Content */}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep.id}
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            transition={{ duration: 0.3 }}
            className="mb-8"
          >
            <currentStep.component 
              data={data}
              onComplete={() => markStepComplete(currentStep.id)}
              onNext={nextStep}
            />
          </motion.div>
        </AnimatePresence>

        {/* Navigation Controls */}
        <div className="flex justify-between items-center mt-8">
          <motion.button
            onClick={prevStep}
            disabled={currentStepIndex === 0}
            className="flex items-center gap-2 px-6 py-3 bg-white/10 text-white rounded-xl hover:bg-white/20 disabled:opacity-50 disabled:cursor-not-allowed transition-all backdrop-blur-sm border border-white/20"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <ChevronLeft className="w-5 h-5" />
            Previous
          </motion.button>

          <div className="text-center text-gray-400">
            Step {currentStepIndex + 1} of {steps.length}
          </div>

          <motion.button
            onClick={nextStep}
            disabled={currentStepIndex === steps.length - 1}
            className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl hover:from-blue-700 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Next
            <ChevronRight className="w-5 h-5" />
          </motion.button>
        </div>
      </div>

      {/* Background Effects */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-pink-500/5 rounded-full blur-3xl animate-pulse delay-2000"></div>
      </div>
    </div>
  );
}