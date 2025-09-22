'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { BarChart3, Clock, CheckCircle, XCircle, Zap, TrendingUp, Target } from 'lucide-react';

interface PerformanceMetric {
  method: 'response_format' | 'tool_call';
  processingTime: number;
  tokenUsage?: {
    prompt_tokens: number;
    completion_tokens: number;
    total_tokens: number;
  };
  success: boolean;
  timestamp: number;
}

interface ComparisonData {
  responseFormat: {
    avgTime: number;
    successRate: number;
    totalRequests: number;
    avgConfidence?: number;
  };
  toolCall: {
    avgTime: number;
    successRate: number;
    totalRequests: number;
    avgConfidence?: number;
  };
  winner: 'response_format' | 'tool_call' | 'tie';
}

interface PerformanceComparisonProps {
  metrics: PerformanceMetric[];
  currentComparison?: {
    responseFormat: any;
    toolCall: any;
    comparison: {
      fasterMethod: 'response_format' | 'tool_call';
      timeDifference: number;
      confidenceDifference?: number;
    };
  };
}

export default function PerformanceComparison({ 
  metrics, 
  currentComparison 
}: PerformanceComparisonProps) {
  const [comparisonData, setComparisonData] = useState<ComparisonData | null>(null);
  const [selectedMetric, setSelectedMetric] = useState<'time' | 'success' | 'confidence'>('time');

  useEffect(() => {
    if (metrics.length === 0) return;

    const responseFormatMetrics = metrics.filter(m => m.method === 'response_format');
    const toolCallMetrics = metrics.filter(m => m.method === 'tool_call');

    const calculateStats = (methodMetrics: PerformanceMetric[]) => {
      if (methodMetrics.length === 0) return { avgTime: 0, successRate: 0, totalRequests: 0 };
      
      const successful = methodMetrics.filter(m => m.success);
      const avgTime = methodMetrics.reduce((sum, m) => sum + m.processingTime, 0) / methodMetrics.length;
      const successRate = (successful.length / methodMetrics.length) * 100;
      
      return {
        avgTime: Math.round(avgTime),
        successRate: Math.round(successRate * 100) / 100,
        totalRequests: methodMetrics.length
      };
    };

    const rfStats = calculateStats(responseFormatMetrics);
    const tcStats = calculateStats(toolCallMetrics);

    let winner: 'response_format' | 'tool_call' | 'tie' = 'tie';
    if (rfStats.avgTime !== tcStats.avgTime) {
      winner = rfStats.avgTime < tcStats.avgTime ? 'response_format' : 'tool_call';
    }

    setComparisonData({
      responseFormat: rfStats,
      toolCall: tcStats,
      winner
    });
  }, [metrics]);

  if (!comparisonData && !currentComparison) {
    return (
      <div className="w-full max-w-4xl mx-auto">
        <div className="glass-effect rounded-2xl p-8 text-center">
          <div className="w-24 h-24 mx-auto mb-4 rounded-full bg-gradient-to-br from-blue-100 to-green-100 flex items-center justify-center">
            <BarChart3 className="w-12 h-12 text-blue-600" />
          </div>
          <h3 className="text-xl font-semibold text-gray-800 mb-2">Performance Comparison</h3>
          <p className="text-gray-600">Process some messages to see performance metrics comparison</p>
        </div>
      </div>
    );
  }

  const getMethodColor = (method: 'response_format' | 'tool_call') => {
    return method === 'response_format' 
      ? 'from-blue-500 to-blue-600' 
      : 'from-purple-500 to-purple-600';
  };

  const getWinnerBadge = (method: 'response_format' | 'tool_call') => {
    if (!comparisonData) return null;
    
    const isWinner = comparisonData.winner === method;
    const isTie = comparisonData.winner === 'tie';
    
    if (isWinner) {
      return (
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="absolute -top-2 -right-2 w-8 h-8 bg-gradient-to-r from-yellow-400 to-yellow-500 rounded-full flex items-center justify-center shadow-lg"
        >
          <TrendingUp className="w-4 h-4 text-white" />
        </motion.div>
      );
    }
    
    if (isTie) {
      return (
        <div className="absolute -top-2 -right-2 w-8 h-8 bg-gray-400 rounded-full flex items-center justify-center shadow-lg">
          <Target className="w-4 h-4 text-white" />
        </div>
      );
    }
    
    return null;
  };

  return (
    <div className="w-full max-w-6xl mx-auto space-y-6">
      <div className="glass-effect rounded-2xl p-6">
        <div className="text-center space-y-4">
          <h3 className="text-2xl font-bold gradient-text flex items-center justify-center gap-2">
            <BarChart3 className="w-8 h-8 text-blue-600" />
            Performance Comparison
          </h3>
          <p className="text-gray-600">
            Real-time performance metrics comparing Response Format vs Tool Calling approaches
          </p>
        </div>
      </div>

      {currentComparison && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-effect rounded-2xl p-6"
        >
          <h4 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
            <Zap className="w-6 h-6 text-yellow-500" />
            Latest Comparison
          </h4>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-4 border border-blue-200">
              <div className="text-center">
                <h5 className="font-semibold text-blue-800">Response Format</h5>
                <div className="mt-2 space-y-1">
                  <div className="text-2xl font-bold text-blue-900">
                    {currentComparison.responseFormat.processingTime}ms
                  </div>
                  {currentComparison.responseFormat.confidence && (
                    <div className="text-sm text-blue-700">
                      Confidence: {Math.round(currentComparison.responseFormat.confidence * 100)}%
                    </div>
                  )}
                </div>
              </div>
            </div>
            
            <div className="flex items-center justify-center">
              <div className={`p-4 rounded-xl border-2 ${
                currentComparison.comparison.fasterMethod === 'response_format' 
                  ? 'border-blue-300 bg-blue-50' 
                  : 'border-purple-300 bg-purple-50'
              }`}>
                <div className="text-center">
                  <TrendingUp className={`w-8 h-8 mx-auto mb-2 ${
                    currentComparison.comparison.fasterMethod === 'response_format'
                      ? 'text-blue-600'
                      : 'text-purple-600'
                  }`} />
                  <div className="font-semibold text-gray-800">
                    {currentComparison.comparison.fasterMethod === 'response_format' ? 'Response Format' : 'Tool Calling'}
                  </div>
                  <div className="text-sm text-gray-600">
                    {currentComparison.comparison.timeDifference}ms faster
                  </div>
                </div>
              </div>
            </div>
            
            <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl p-4 border border-purple-200">
              <div className="text-center">
                <h5 className="font-semibold text-purple-800">Tool Calling</h5>
                <div className="mt-2 space-y-1">
                  <div className="text-2xl font-bold text-purple-900">
                    {currentComparison.toolCall.processingTime}ms
                  </div>
                  {currentComparison.toolCall.confidence && (
                    <div className="text-sm text-purple-700">
                      Confidence: {Math.round(currentComparison.toolCall.confidence * 100)}%
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      )}

      {comparisonData && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="glass-effect rounded-2xl p-6 relative"
          >
            {getWinnerBadge('response_format')}
            
            <div className="text-center space-y-4">
              <div className={`w-16 h-16 mx-auto rounded-2xl bg-gradient-to-br ${getMethodColor('response_format')} flex items-center justify-center`}>
                <BarChart3 className="w-8 h-8 text-white" />
              </div>
              
              <h4 className="text-xl font-bold text-gray-800">Response Format</h4>
              
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="bg-blue-50 rounded-lg p-3">
                  <div className="flex items-center justify-center gap-1 text-blue-600 mb-1">
                    <Clock className="w-4 h-4" />
                    <span className="font-semibold">Avg Time</span>
                  </div>
                  <div className="text-xl font-bold text-blue-800">
                    {comparisonData.responseFormat.avgTime}ms
                  </div>
                </div>
                
                <div className="bg-green-50 rounded-lg p-3">
                  <div className="flex items-center justify-center gap-1 text-green-600 mb-1">
                    <CheckCircle className="w-4 h-4" />
                    <span className="font-semibold">Success</span>
                  </div>
                  <div className="text-xl font-bold text-green-800">
                    {comparisonData.responseFormat.successRate}%
                  </div>
                </div>
              </div>
              
              <div className="text-gray-600 text-sm">
                Total requests: {comparisonData.responseFormat.totalRequests}
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="glass-effect rounded-2xl p-6 relative"
          >
            {getWinnerBadge('tool_call')}
            
            <div className="text-center space-y-4">
              <div className={`w-16 h-16 mx-auto rounded-2xl bg-gradient-to-br ${getMethodColor('tool_call')} flex items-center justify-center`}>
                <Zap className="w-8 h-8 text-white" />
              </div>
              
              <h4 className="text-xl font-bold text-gray-800">Tool Calling</h4>
              
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="bg-purple-50 rounded-lg p-3">
                  <div className="flex items-center justify-center gap-1 text-purple-600 mb-1">
                    <Clock className="w-4 h-4" />
                    <span className="font-semibold">Avg Time</span>
                  </div>
                  <div className="text-xl font-bold text-purple-800">
                    {comparisonData.toolCall.avgTime}ms
                  </div>
                </div>
                
                <div className="bg-green-50 rounded-lg p-3">
                  <div className="flex items-center justify-center gap-1 text-green-600 mb-1">
                    <CheckCircle className="w-4 h-4" />
                    <span className="font-semibold">Success</span>
                  </div>
                  <div className="text-xl font-bold text-green-800">
                    {comparisonData.toolCall.successRate}%
                  </div>
                </div>
              </div>
              
              <div className="text-gray-600 text-sm">
                Total requests: {comparisonData.toolCall.totalRequests}
              </div>
            </div>
          </motion.div>
        </div>
      )}

      {comparisonData && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="glass-effect rounded-2xl p-6"
        >
          <h4 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
            <Target className="w-6 h-6 text-indigo-600" />
            Performance Insights
          </h4>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="font-semibold text-gray-700 mb-2">Speed Winner</div>
              <div className={`text-lg font-bold ${
                comparisonData.winner === 'response_format' 
                  ? 'text-blue-600' 
                  : comparisonData.winner === 'tool_call'
                    ? 'text-purple-600'
                    : 'text-gray-600'
              }`}>
                {comparisonData.winner === 'tie' 
                  ? 'Tied Performance' 
                  : comparisonData.winner === 'response_format'
                    ? 'Response Format'
                    : 'Tool Calling'
                }
              </div>
            </div>
            
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="font-semibold text-gray-700 mb-2">Avg Speed Diff</div>
              <div className="text-lg font-bold text-gray-800">
                {Math.abs(comparisonData.responseFormat.avgTime - comparisonData.toolCall.avgTime)}ms
              </div>
            </div>
            
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="font-semibold text-gray-700 mb-2">Total Tests</div>
              <div className="text-lg font-bold text-gray-800">
                {comparisonData.responseFormat.totalRequests + comparisonData.toolCall.totalRequests}
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
}