'use client';

import { useState, useEffect } from 'react';
import { Brain, CheckCircle, Clock, AlertCircle, Zap, Code, Database } from 'lucide-react';

interface ProcessingStep {
  step: 'analyzing' | 'classifying' | 'generating' | 'validating' | 'routing' | 'complete';
  message: string;
  data?: any;
  progress?: number;
}

interface ProcessingVisualizationProps {
  currentStep?: ProcessingStep;
  allSteps: ProcessingStep[];
  method: 'response_format' | 'tool_call' | null;
  isProcessing: boolean;
}

const STEP_CONFIGS = {
  analyzing: {
    icon: Brain,
    title: 'Analyzing',
    description: 'Understanding customer intent and context',
    color: 'text-blue-600',
    bgColor: 'bg-blue-100',
  },
  classifying: {
    icon: Database, 
    title: 'Classifying',
    description: 'Determining sentiment and routing department',
    color: 'text-purple-600',
    bgColor: 'bg-purple-100',
  },
  generating: {
    icon: Zap,
    title: 'Generating',
    description: 'Creating structured response and reply',
    color: 'text-yellow-600', 
    bgColor: 'bg-yellow-100',
  },
  validating: {
    icon: CheckCircle,
    title: 'Validating', 
    description: 'Ensuring output matches schema requirements',
    color: 'text-green-600',
    bgColor: 'bg-green-100',
  },
  routing: {
    icon: AlertCircle,
    title: 'Routing',
    description: 'Directing to appropriate department',
    color: 'text-indigo-600',
    bgColor: 'bg-indigo-100',
  },
  complete: {
    icon: CheckCircle,
    title: 'Complete',
    description: 'Processing finished successfully',
    color: 'text-green-600',
    bgColor: 'bg-green-100',
  },
};

export default function ProcessingVisualization({ 
  currentStep, 
  allSteps, 
  method, 
  isProcessing 
}: ProcessingVisualizationProps) {
  const [displayedSteps, setDisplayedSteps] = useState<ProcessingStep[]>([]);
  const [jsonOutput, setJsonOutput] = useState<string>('');

  useEffect(() => {
    if (allSteps.length > displayedSteps.length) {
      const newSteps = allSteps.slice(displayedSteps.length);
      setDisplayedSteps(newSteps);
    }
  }, [allSteps, displayedSteps.length]);

  useEffect(() => {
    if (currentStep?.step === 'complete' && currentStep.data) {
      const json = JSON.stringify(currentStep.data, null, 2);
      let currentIndex = 0;
      setJsonOutput('');
      
      const interval = setInterval(() => {
        if (currentIndex < json.length) {
          setJsonOutput(json.slice(0, currentIndex + 1));
          currentIndex++;
        } else {
          clearInterval(interval);
        }
      }, 20);
      
      return () => clearInterval(interval);
    }
  }, [currentStep]);

  const getStepStatus = (stepName: string): 'completed' | 'active' | 'pending' => {
    const completedSteps = displayedSteps.map(s => s.step);
    const currentStepName = currentStep?.step;
    
    if (completedSteps.includes(stepName as any)) {
      if (stepName === currentStepName) return 'active';
      return 'completed';
    }
    return 'pending';
  };

  if (!isProcessing && displayedSteps.length === 0) {
    return (
      <div className="w-full max-w-4xl mx-auto">
        <div className="glass-effect rounded-2xl p-8 text-center">
          <div className="w-24 h-24 mx-auto mb-4 rounded-full bg-gradient-to-br from-blue-100 to-purple-100 flex items-center justify-center">
            <Brain className="w-12 h-12 text-blue-600" />
          </div>
          <h3 className="text-xl font-semibold text-gray-800 mb-2">Ready to Process</h3>
          <p className="text-gray-600">Submit a customer message to see the AI processing in action</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-6xl mx-auto space-y-6">
      {method && (
        <div className="glass-effect rounded-xl p-4 text-center">
          <div className="flex items-center justify-center gap-2">
            <Code className="w-5 h-5 text-indigo-600" />
            <span className="font-semibold text-gray-800">
              Processing with: {method === 'response_format' ? 'Response Format' : 'Tool Calling'}
            </span>
          </div>
        </div>
      )}

      <div className="glass-effect rounded-2xl p-6">
        <div className="space-y-4">
          <h3 className="text-xl font-semibold text-gray-800 mb-6 flex items-center gap-2">
            <Brain className="w-6 h-6 text-blue-600" />
            Processing Pipeline
          </h3>
          
          <div className="space-y-3">
            {Object.entries(STEP_CONFIGS).map(([stepName, config]) => {
              const status = getStepStatus(stepName);
              const Icon = config.icon;
              const step = displayedSteps.find(s => s.step === stepName);
              const progress = step?.progress || 0;
              
              return (
                <div
                  key={stepName}
                  className={`processing-step ${status}`}
                >
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center ${config.bgColor}`}>
                    {status === 'active' ? (
                      <Icon className={`w-5 h-5 ${config.color} animate-pulse`} />
                    ) : status === 'completed' ? (
                      <CheckCircle className="w-5 h-5 text-green-600" />
                    ) : (
                      <Clock className="w-5 h-5 text-gray-400" />
                    )}
                  </div>
                  
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-semibold text-gray-800">{config.title}</h4>
                        <p className="text-sm text-gray-600">{config.description}</p>
                        {step && (
                          <p className="text-xs text-gray-500 mt-1">{step.message}</p>
                        )}
                      </div>
                      {status === 'active' && progress > 0 && (
                        <div className="text-right">
                          <div className="text-sm font-semibold text-blue-600">{progress}%</div>
                          <div className="w-24 h-2 bg-gray-200 rounded-full overflow-hidden">
                            <div 
                              className="h-full bg-blue-500 transition-all duration-300 ease-out"
                              style={{ width: `${progress}%` }}
                            />
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {jsonOutput && (
        <div className="glass-effect rounded-2xl p-6">
          <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
            <Code className="w-6 h-6 text-green-600" />
            Structured Output
          </h3>
          <div className="bg-gray-900 rounded-lg p-4 font-mono text-sm overflow-x-auto">
            <pre className="text-green-400 whitespace-pre-wrap">
              {jsonOutput}
              {jsonOutput.length > 0 && jsonOutput.length % 50 === 0 && (
                <span className="inline-block w-2 h-5 bg-green-400 animate-pulse ml-1" />
              )}
            </pre>
          </div>
        </div>
      )}
    </div>
  );
}