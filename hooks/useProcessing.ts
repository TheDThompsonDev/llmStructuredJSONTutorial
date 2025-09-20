'use client';

import { useState, useCallback } from 'react';
import { ProcessingState, ProcessingResult, StructuredResult } from '@/types/api.types';
import { ROIMetrics } from '@/types/metrics.types';

interface UseProcessingReturn {
  message: string;
  setMessage: (message: string) => void;
  isProcessing: boolean;
  currentPhase: number;
  structuredState: ProcessingState;
  unstructuredState: ProcessingState;
  results: ProcessingResult | null;
  showComparison: boolean;
  processingMode: 'structured' | 'unstructured';
  setProcessingMode: (mode: 'structured' | 'unstructured') => void;
  roiMetrics: ROIMetrics;
  handleProcessing: () => Promise<void>;
  resetDemo: () => void;
}

export const useProcessing = (): UseProcessingReturn => {
  const [message, setMessage] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [currentPhase, setCurrentPhase] = useState(0);
  const [structuredState, setStructuredState] = useState<ProcessingState>({
    status: 'idle', progress: 0, details: 'Ready to process', stage: 'Waiting'
  });
  const [unstructuredState, setUnstructuredState] = useState<ProcessingState>({
    status: 'idle', progress: 0, details: 'Ready to process', stage: 'Waiting'
  });
  const [results, setResults] = useState<ProcessingResult | null>(null);
  const [showComparison, setShowComparison] = useState(false);
  const [processingMode, setProcessingMode] = useState<'structured' | 'unstructured'>('structured');
  const [roiMetrics, setRoiMetrics] = useState<ROIMetrics>({
    messagesProcessed: 0,
    timesSavedHours: 0,
    employeeSatisfaction: 75,
    accuracyImprovement: 0,
    costSavings: 0,
    negativeInteractionsBlocked: 0,
    averageResponseTime: 0,
    departmentRoutingAccuracy: 0
  });

  const updateROIMetrics = useCallback((messageData: StructuredResult, aiProcessingTime: number) => {
    setRoiMetrics(prev => {
      const newMessagesProcessed = prev.messagesProcessed + 1;
      const humanTriageTimeSeconds = 240;
      const aiProcessingTimeSeconds = aiProcessingTime / 1000;
      const timesSavedSeconds = Math.max(0, humanTriageTimeSeconds - aiProcessingTimeSeconds);
      const timesSavedHours = timesSavedSeconds / 3600;
      const costPerHourHuman = 18;
      const costSavingsPerMessage = timesSavedHours * costPerHourHuman;
      const negativeBlocked = messageData.sentiment === 'negative' ? 1 : 0;
      const satisfactionImprovement = negativeBlocked * 0.5;
      const routingAccuracy = messageData.confidence;
      const cumulativeAccuracy = ((prev.departmentRoutingAccuracy * prev.messagesProcessed) + routingAccuracy) / newMessagesProcessed;
      
      return {
        messagesProcessed: newMessagesProcessed,
        timesSavedHours: prev.timesSavedHours + timesSavedHours,
        employeeSatisfaction: Math.min(100, prev.employeeSatisfaction + satisfactionImprovement),
        accuracyImprovement: ((aiProcessingTimeSeconds / humanTriageTimeSeconds) * 100),
        costSavings: prev.costSavings + costSavingsPerMessage,
        negativeInteractionsBlocked: prev.negativeInteractionsBlocked + negativeBlocked,
        averageResponseTime: aiProcessingTimeSeconds,
        departmentRoutingAccuracy: cumulativeAccuracy
      };
    });
  }, []);

  const simulateProcessingStages = async (isStructured: boolean) => {
    const stages = [
      { stage: 'Input Analysis', progress: 25, details: 'Parsing customer message and extracting key information', delay: 800 },
      { stage: 'AI Processing', progress: 50, details: 'Large Language Model analyzes sentiment and intent', delay: 1200 },
      { stage: 'Data Structuring', progress: 75, details: 'Converting unstructured text into organized JSON format', delay: 600 },
      { stage: 'Validation', progress: 90, details: 'Schema validation ensures data integrity and consistency', delay: 400 }
    ];

    for (const stageInfo of stages) {
      await new Promise(resolve => setTimeout(resolve, stageInfo.delay));
      
      if (isStructured) {
        const statusMap = {
          'Input Analysis': 'parsing',
          'AI Processing': 'analyzing',
          'Data Structuring': 'structuring',
          'Validation': 'validating'
        } as const;
        
        setStructuredState({
          status: statusMap[stageInfo.stage as keyof typeof statusMap] || 'analyzing',
          progress: stageInfo.progress,
          details: stageInfo.details,
          stage: stageInfo.stage
        });
      } else {
        const statusMap = {
          'Input Analysis': 'parsing',
          'AI Processing': 'analyzing',
          'Response Generation': 'structuring',
          'Final Review': 'validating'
        } as const;
        
        const modifiedStage = stageInfo.stage.replace('Data Structuring', 'Response Generation').replace('Validation', 'Final Review');
        
        setUnstructuredState({
          status: statusMap[modifiedStage as keyof typeof statusMap] || 'analyzing',
          progress: stageInfo.progress,
          details: stageInfo.details.replace('JSON format', 'natural language response'),
          stage: modifiedStage
        });
      }
    }
  };

  const handleProcessing = useCallback(async () => {
    if (!message) return;
    
    setIsProcessing(true);
    setResults(null);
    setCurrentPhase(0);
    setShowComparison(false);
    
    if (processingMode === 'structured') {
      setStructuredState({ status: 'idle', progress: 0, details: 'Starting structured processing...', stage: 'Initializing' });
      setUnstructuredState({ status: 'idle', progress: 0, details: 'Ready to process', stage: 'Waiting' });
    } else {
      setStructuredState({ status: 'idle', progress: 0, details: 'Ready to process', stage: 'Waiting' });
      setUnstructuredState({ status: 'idle', progress: 0, details: 'Starting unstructured processing...', stage: 'Initializing' });
    }

    try {
      if (processingMode === 'structured') {
        simulateProcessingStages(true);
      } else {
        simulateProcessingStages(false);
      }

      const endpoint = processingMode === 'structured' ? '/api/process' : '/api/process-raw';
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message })
      });

      if (!response.ok) {
        throw new Error('Processing failed');
      }

      const result = await response.json();
      
      await new Promise(resolve => setTimeout(resolve, 3500));
      
      if (processingMode === 'structured') {
        setResults({
          structured: {
            type: 'structured',
            data: result.data,
            processingTime: result.processingTime,
            success: true
          }
        });
        setStructuredState({ status: 'complete', progress: 100, details: 'Processing complete', stage: 'Complete' });
        updateROIMetrics(result.data, result.processingTime);
      } else {
        setResults({
          unstructured: {
            type: 'unstructured',
            data: {
              rawOutput: result.rawOutput,
              errors: []
            },
            processingTime: result.processingTime,
            success: true
          }
        });
        setUnstructuredState({ status: 'complete', progress: 100, details: 'Processing complete', stage: 'Complete' });
      }
      
      setIsProcessing(false);
      setTimeout(() => setShowComparison(true), 1000);
    } catch (error) {
      console.error('Processing error:', error);
      if (processingMode === 'structured') {
        setStructuredState({ status: 'error', progress: 100, details: 'Processing failed', stage: 'Error' });
      } else {
        setUnstructuredState({ status: 'error', progress: 100, details: 'Processing failed', stage: 'Error' });
      }
      setIsProcessing(false);
    }
  }, [message, processingMode, updateROIMetrics]);

  const resetDemo = useCallback(() => {
    setMessage('');
    setResults(null);
    setCurrentPhase(0);
    setShowComparison(false);
    setStructuredState({ status: 'idle', progress: 0, details: 'Ready to process', stage: 'Waiting' });
    setUnstructuredState({ status: 'idle', progress: 0, details: 'Ready to process', stage: 'Waiting' });
  }, []);

  return {
    message,
    setMessage,
    isProcessing,
    currentPhase,
    structuredState,
    unstructuredState,
    results,
    showComparison,
    processingMode,
    setProcessingMode,
    roiMetrics,
    handleProcessing,
    resetDemo
  };
};