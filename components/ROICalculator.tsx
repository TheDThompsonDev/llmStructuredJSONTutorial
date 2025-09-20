'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Calculator, DollarSign, Clock, TrendingUp, Users, Zap, CheckCircle } from 'lucide-react';

interface ROIMetrics {
  monthlyTickets: number;
  avgManualProcessingTime: number; // minutes
  hourlyRate: number; // dollars
  currentAccuracy: number; // percentage
  aiProcessingTime: number; // minutes
  aiAccuracy: number; // percentage
  implementationCost: number; // dollars
}

interface ROIResults {
  timeSavingsPerMonth: number; // hours
  costSavingsPerMonth: number; // dollars
  costSavingsPerYear: number; // dollars
  accuracyImprovement: number; // percentage
  paybackPeriod: number; // months
  roi: number; // percentage
  ticketsProcessedPerHour: number;
  manualTicketsPerHour: number;
}

const DEFAULT_METRICS: ROIMetrics = {
  monthlyTickets: 10000,
  avgManualProcessingTime: 5,
  hourlyRate: 25,
  currentAccuracy: 85,
  aiProcessingTime: 0.1,
  aiAccuracy: 95,
  implementationCost: 50000
};

export default function ROICalculator() {
  const [metrics, setMetrics] = useState<ROIMetrics>(DEFAULT_METRICS);
  const [results, setResults] = useState<ROIResults | null>(null);
  const [animatedValues, setAnimatedValues] = useState<Partial<ROIResults>>({});

  const calculateROI = (inputMetrics: ROIMetrics): ROIResults => {
    const manualHoursPerMonth = (inputMetrics.monthlyTickets * inputMetrics.avgManualProcessingTime) / 60;
    const aiHoursPerMonth = (inputMetrics.monthlyTickets * inputMetrics.aiProcessingTime) / 60;
    
    const timeSavingsPerMonth = manualHoursPerMonth - aiHoursPerMonth;
    const costSavingsPerMonth = timeSavingsPerMonth * inputMetrics.hourlyRate;
    const costSavingsPerYear = costSavingsPerMonth * 12;
    
    const accuracyImprovement = inputMetrics.aiAccuracy - inputMetrics.currentAccuracy;
    const paybackPeriod = inputMetrics.implementationCost / costSavingsPerMonth;
    const roi = ((costSavingsPerYear - inputMetrics.implementationCost) / inputMetrics.implementationCost) * 100;
    
    const ticketsProcessedPerHour = 60 / inputMetrics.aiProcessingTime;
    const manualTicketsPerHour = 60 / inputMetrics.avgManualProcessingTime;

    return {
      timeSavingsPerMonth,
      costSavingsPerMonth,
      costSavingsPerYear,
      accuracyImprovement,
      paybackPeriod,
      roi,
      ticketsProcessedPerHour,
      manualTicketsPerHour
    };
  };

  useEffect(() => {
    const newResults = calculateROI(metrics);
    setResults(newResults);
    
    // Set values immediately
    setAnimatedValues(newResults);
  }, [metrics]);

  const updateMetric = (key: keyof ROIMetrics, value: number) => {
    setMetrics(prev => ({ ...prev, [key]: value }));
  };

  const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  const formatNumber = (num: number, decimals: number = 0): string => {
    return new Intl.NumberFormat('en-US', {
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals
    }).format(num);
  };

  return (
    <div className="w-full max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div className="glass-effect rounded-2xl p-6">
        <div className="text-center space-y-4">
          <h3 className="text-2xl font-bold gradient-text flex items-center justify-center gap-2">
            <Calculator className="w-8 h-8 text-green-600" />
            ROI Calculator
          </h3>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Calculate the return on investment for implementing AI-powered structured outputs in your customer service operations.
            Adjust the parameters below to see how much you could save.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Input Parameters */}
        <div className="glass-effect rounded-2xl p-6">
          <h4 className="text-lg font-semibold text-gray-800 mb-6 flex items-center gap-2">
            <Users className="w-6 h-6 text-blue-600" />
            Your Current Operations
          </h4>
          
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Monthly Ticket Volume
              </label>
              <input
                type="number"
                value={metrics.monthlyTickets}
                onChange={(e) => updateMetric('monthlyTickets', parseInt(e.target.value) || 0)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                min="0"
              />
              <p className="text-xs text-gray-500 mt-1">Number of customer service tickets per month</p>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Manual Processing Time (minutes)
              </label>
              <input
                type="number"
                value={metrics.avgManualProcessingTime}
                onChange={(e) => updateMetric('avgManualProcessingTime', parseFloat(e.target.value) || 0)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                min="0"
                step="0.1"
              />
              <p className="text-xs text-gray-500 mt-1">Average time to manually process one ticket</p>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Hourly Rate ($)
              </label>
              <input
                type="number"
                value={metrics.hourlyRate}
                onChange={(e) => updateMetric('hourlyRate', parseFloat(e.target.value) || 0)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                min="0"
                step="0.01"
              />
              <p className="text-xs text-gray-500 mt-1">Average hourly cost per support agent</p>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Current Accuracy (%)
              </label>
              <input
                type="number"
                value={metrics.currentAccuracy}
                onChange={(e) => updateMetric('currentAccuracy', parseFloat(e.target.value) || 0)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                min="0"
                max="100"
                step="1"
              />
              <p className="text-xs text-gray-500 mt-1">Current accuracy of ticket routing and classification</p>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Implementation Cost ($)
              </label>
              <input
                type="number"
                value={metrics.implementationCost}
                onChange={(e) => updateMetric('implementationCost', parseFloat(e.target.value) || 0)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                min="0"
                step="1000"
              />
              <p className="text-xs text-gray-500 mt-1">One-time cost for AI implementation</p>
            </div>
          </div>
        </div>

        {/* Results */}
        <div className="space-y-6">
          {/* Key Metrics */}
          {results && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="glass-effect rounded-2xl p-6"
            >
              <h4 className="text-lg font-semibold text-gray-800 mb-6 flex items-center gap-2">
                <TrendingUp className="w-6 h-6 text-green-600" />
                ROI Analysis
              </h4>
              
              <div className="grid grid-cols-2 gap-4">
                <motion.div
                  className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-4 border border-green-200"
                  whileHover={{ scale: 1.02 }}
                >
                  <div className="flex items-center gap-2 mb-2">
                    <DollarSign className="w-5 h-5 text-green-600" />
                    <span className="text-sm font-semibold text-green-800">Monthly Savings</span>
                  </div>
                  <div className="text-2xl font-bold text-green-900">
                    {formatCurrency(animatedValues.costSavingsPerMonth || 0)}
                  </div>
                </motion.div>

                <motion.div
                  className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-xl p-4 border border-blue-200"
                  whileHover={{ scale: 1.02 }}
                >
                  <div className="flex items-center gap-2 mb-2">
                    <Clock className="w-5 h-5 text-blue-600" />
                    <span className="text-sm font-semibold text-blue-800">Time Saved</span>
                  </div>
                  <div className="text-2xl font-bold text-blue-900">
                    {formatNumber(animatedValues.timeSavingsPerMonth || 0)} hrs/mo
                  </div>
                </motion.div>

                <motion.div
                  className="bg-gradient-to-br from-purple-50 to-violet-50 rounded-xl p-4 border border-purple-200"
                  whileHover={{ scale: 1.02 }}
                >
                  <div className="flex items-center gap-2 mb-2">
                    <TrendingUp className="w-5 h-5 text-purple-600" />
                    <span className="text-sm font-semibold text-purple-800">Annual ROI</span>
                  </div>
                  <div className="text-2xl font-bold text-purple-900">
                    {formatNumber(animatedValues.roi || 0, 0)}%
                  </div>
                </motion.div>

                <motion.div
                  className="bg-gradient-to-br from-orange-50 to-amber-50 rounded-xl p-4 border border-orange-200"
                  whileHover={{ scale: 1.02 }}
                >
                  <div className="flex items-center gap-2 mb-2">
                    <Zap className="w-5 h-5 text-orange-600" />
                    <span className="text-sm font-semibold text-orange-800">Payback Period</span>
                  </div>
                  <div className="text-2xl font-bold text-orange-900">
                    {formatNumber(animatedValues.paybackPeriod || 0, 1)} months
                  </div>
                </motion.div>
              </div>
            </motion.div>
          )}

          {/* Performance Comparison */}
          {results && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="glass-effect rounded-2xl p-6"
            >
              <h4 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                <Zap className="w-6 h-6 text-yellow-600" />
                Performance Comparison
              </h4>
              
              <div className="space-y-4">
                <div className="flex justify-between items-center py-3 border-b border-gray-200">
                  <span className="text-gray-700">Processing Speed</span>
                  <div className="text-right">
                    <div className="text-sm text-gray-500">Manual: {formatNumber(results.manualTicketsPerHour)} tickets/hour</div>
                    <div className="text-sm font-semibold text-green-600">AI: {formatNumber(results.ticketsProcessedPerHour)} tickets/hour</div>
                  </div>
                </div>
                
                <div className="flex justify-between items-center py-3 border-b border-gray-200">
                  <span className="text-gray-700">Accuracy</span>
                  <div className="text-right">
                    <div className="text-sm text-gray-500">Current: {metrics.currentAccuracy}%</div>
                    <div className="text-sm font-semibold text-green-600">With AI: {metrics.aiAccuracy}%</div>
                  </div>
                </div>
                
                <div className="flex justify-between items-center py-3 border-b border-gray-200">
                  <span className="text-gray-700">Annual Cost Savings</span>
                  <div className="text-green-600 font-bold text-lg">
                    {formatCurrency(results.costSavingsPerYear)}
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* Business Impact Summary */}
          {results && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="glass-effect rounded-2xl p-6"
            >
              <h4 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                <CheckCircle className="w-6 h-6 text-green-600" />
                Business Impact
              </h4>
              
              <div className="space-y-3 text-sm">
                <div className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                  <span>Save <strong>{formatNumber(results.timeSavingsPerMonth)} hours per month</strong> in manual processing time</span>
                </div>
                
                <div className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                  <span>Increase processing speed by <strong>{formatNumber((results.ticketsProcessedPerHour / results.manualTicketsPerHour - 1) * 100)}x</strong></span>
                </div>
                
                <div className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                  <span>Improve accuracy by <strong>{formatNumber(results.accuracyImprovement)} percentage points</strong></span>
                </div>
                
                <div className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                  <span>Break even in <strong>{formatNumber(results.paybackPeriod, 1)} months</strong> with {formatNumber(results.roi)}% annual ROI</span>
                </div>
                
                <div className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                  <span>Free up agents to focus on <strong>complex customer issues</strong> requiring human expertise</span>
                </div>
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
}