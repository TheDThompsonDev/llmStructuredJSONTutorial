'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ArrowLeft,
  MessageSquare,
  BrainCircuit,
  Database,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Loader2,
  FileJson,
  FileText,
  Zap,
  Clock,
  Target,
  Eye,
  Code2,
  Sparkles,
  TrendingUp,
  AlertCircle,
  PlayCircle,
  PauseCircle,
  RotateCcw,
  DollarSign,
  Users,
  Shield,
  Timer,
  Smile,
  BarChart3,
  Settings
} from 'lucide-react';
import Link from 'next/link';

interface ProcessingState {
  status: 'idle' | 'parsing' | 'analyzing' | 'structuring' | 'validating' | 'complete' | 'error';
  progress: number;
  details: string;
  stage: string;
}

interface StructuredResult {
  sentiment: string;
  priority: string;
  confidence: number;
  department: string;
  reply: string;
}

interface UnstructuredResult {
  rawOutput: string;
  errors: string[];
}

interface ProcessingResult {
  structured?: {
    type: 'structured';
    data: StructuredResult;
    processingTime: number;
    success: boolean;
  };
  unstructured?: {
    type: 'unstructured';
    data: UnstructuredResult;
    processingTime: number;
    success: boolean;
  };
}

interface ROIMetrics {
  messagesProcessed: number;
  timesSavedHours: number;
  employeeSatisfaction: number;
  accuracyImprovement: number;
  costSavings: number;
  negativeInteractionsBlocked: number;
  averageResponseTime: number;
  departmentRoutingAccuracy: number;
}

const DashboardContent = () => {
  const searchParams = useSearchParams();
  const initialMessage = searchParams.get('message');

  const [message, setMessage] = useState(initialMessage || '');
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
  
  // Real-time ROI Metrics State - Starting from zero, building actual usage
  const [roiMetrics, setRoiMetrics] = useState<ROIMetrics>({
    messagesProcessed: 0,
    timesSavedHours: 0,
    employeeSatisfaction: 75, // Baseline employee satisfaction before AI
    accuracyImprovement: 0,
    costSavings: 0,
    negativeInteractionsBlocked: 0,
    averageResponseTime: 0,
    departmentRoutingAccuracy: 0
  });

  const processingPhases = [
    { 
      name: 'Input Analysis', 
      description: 'Parsing customer message and extracting key information',
      icon: MessageSquare,
      color: 'text-sage-700',
      progress: 25
    },
    { 
      name: 'AI Processing', 
      description: 'Large Language Model analyzes sentiment and intent',
      icon: BrainCircuit,
      color: 'text-teal-400',
      progress: 50
    },
    { 
      name: 'Data Structuring', 
      description: 'Converting unstructured text into organized JSON format',
      icon: Database,
      color: 'text-teal-400',
      progress: 75
    },
    { 
      name: 'Validation', 
      description: 'Schema validation ensures data integrity and consistency',
      icon: CheckCircle,
      color: 'text-emerald-600',
      progress: 100
    }
  ];

  useEffect(() => {
    if (initialMessage) {
      handleProcessing();
    }
  }, [initialMessage]);

  useEffect(() => {
    if (isProcessing) {
      const interval = setInterval(() => {
        setCurrentPhase(prev => {
          const maxProgress = Math.max(structuredState.progress, unstructuredState.progress);
          return Math.floor(maxProgress / 25);
        });
      }, 100);
      return () => clearInterval(interval);
    }
  }, [isProcessing, structuredState.progress, unstructuredState.progress]);

  // Update ROI metrics based on actual message processing with transparent calculations
  const updateROIMetrics = (messageData: StructuredResult, aiProcessingTime: number) => {
    setRoiMetrics(prev => {
      const newMessagesProcessed = prev.messagesProcessed + 1;
      
      // Transparent time calculation:
      // AI processes in ~2-3 seconds, human manual triage takes 3-5 minutes (average 4 minutes = 240 seconds)
      const humanTriageTimeSeconds = 240; // 4 minutes for manual sentiment analysis, department routing, and response
      const aiProcessingTimeSeconds = aiProcessingTime / 1000; // Convert ms to seconds
      const timesSavedSeconds = Math.max(0, humanTriageTimeSeconds - aiProcessingTimeSeconds);
      const timesSavedHours = timesSavedSeconds / 3600; // Convert to hours
      
      // Transparent cost calculation:
      // Average customer service rep salary: $18/hour (industry standard)
      const costPerHourHuman = 18;
      const costSavingsPerMessage = timesSavedHours * costPerHourHuman;
      
      // Employee satisfaction: Only improves when negative interactions are auto-handled
      const negativeBlocked = messageData.sentiment === 'negative' ? 1 : 0;
      const satisfactionImprovement = negativeBlocked * 0.5; // 0.5% per negative interaction blocked
      
      // Department routing accuracy: Based on AI confidence
      const routingAccuracy = messageData.confidence;
      const cumulativeAccuracy = ((prev.departmentRoutingAccuracy * prev.messagesProcessed) + routingAccuracy) / newMessagesProcessed;
      
      return {
        messagesProcessed: newMessagesProcessed,
        timesSavedHours: prev.timesSavedHours + timesSavedHours,
        employeeSatisfaction: Math.min(100, prev.employeeSatisfaction + satisfactionImprovement),
        accuracyImprovement: ((aiProcessingTimeSeconds / humanTriageTimeSeconds) * 100), // % improvement in speed
        costSavings: prev.costSavings + costSavingsPerMessage,
        negativeInteractionsBlocked: prev.negativeInteractionsBlocked + negativeBlocked,
        averageResponseTime: aiProcessingTimeSeconds,
        departmentRoutingAccuracy: cumulativeAccuracy
      };
    });
  };

  const handleProcessing = async () => {
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

    // Simulate processing stages
    const simulateProcessingStages = async (isStructured: boolean) => {
      const stages = [
        { stage: 'Input Analysis', progress: 25, details: 'Parsing customer message and extracting key information' },
        { stage: 'AI Processing', progress: 50, details: 'Large Language Model analyzes sentiment and intent' },
        { stage: 'Data Structuring', progress: 75, details: 'Converting unstructured text into organized JSON format' },
        { stage: 'Validation', progress: 90, details: 'Schema validation ensures data integrity and consistency' }
      ];

      for (const stageInfo of stages) {
        
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

    try {
      // Start processing stages simulation
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

      let result;
      if (processingMode === 'structured') {
        result = await response.json();
      } else {
        // Raw endpoint returns JSON with rawOutput and processingTime
        const rawResponse = await response.json();
        result = {
          rawOutput: rawResponse.rawOutput,
          processingTime: rawResponse.processingTime,
          errors: [
            'No structured data fields detected - manual extraction required',
            'Response requires manual parsing and interpretation',
            'No automatic routing information available',
            'Manual sentiment analysis required'
          ]
        };
      }
      
      
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
        
        // Update ROI metrics based on the processed message
        updateROIMetrics(result.data, result.processingTime);
      } else {
        setResults({
          unstructured: {
            type: 'unstructured',
            data: {
              rawOutput: result.rawOutput,
              errors: result.errors || []
            },
            processingTime: result.processingTime,
            success: true
          }
        });
        setUnstructuredState({ status: 'complete', progress: 100, details: 'Processing complete', stage: 'Complete' });
      }
      
      setIsProcessing(false);
      setShowComparison(true);
    } catch (error) {
      console.error('Processing error:', error);
      if (processingMode === 'structured') {
        setStructuredState({ status: 'error', progress: 100, details: 'Processing failed', stage: 'Error' });
      } else {
        setUnstructuredState({ status: 'error', progress: 100, details: 'Processing failed', stage: 'Error' });
      }
      setIsProcessing(false);
    }
  };

  const getStatusIcon = (status: string, isActive: boolean = false) => {
    switch (status) {
      case 'complete': return <CheckCircle className="w-6 h-6 text-emerald-600" />;
      case 'error': return <XCircle className="w-6 h-6 text-red-600" />;
      case 'parsing':
      case 'analyzing':
      case 'structuring':
      case 'validating': 
        return isActive ? <Loader2 className="w-6 h-6 text-teal-400 animate-spin" /> : <Clock className="w-6 h-6 text-sage-700/40" />;
      default: return <Clock className="w-6 h-6 text-sage-700/40" />;
    }
  };

  const resetDemo = () => {
    setMessage('');
    setResults(null);
    setCurrentPhase(0);
    setShowComparison(false);
    setStructuredState({ status: 'idle', progress: 0, details: 'Ready to process', stage: 'Waiting' });
    setUnstructuredState({ status: 'idle', progress: 0, details: 'Ready to process', stage: 'Waiting' });
  };

  return (
    <div className="min-h-screen bg-sage-gradient">
      {/* Header */}
      <header className="glass border-b border-teal-400/20">
        <div className="container-sage py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 bg-teal-gradient rounded-xl flex items-center justify-center shadow-sage">
                <Eye className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-sage-primary">Processing Dashboard</h1>
                <p className="text-sage-secondary">Real-time AI processing comparison</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Link
                href="/batch"
                className="px-4 py-2 border-2 border-sage-700/20 text-sage-secondary rounded-xl hover:border-teal-400 hover:text-teal-primary transition-all flex items-center gap-2"
              >
                <Database className="w-4 h-4" />
                <span>Batch</span>
              </Link>
              <Link
                href="/routing"
                className="px-4 py-2 border-2 border-sage-700/20 text-sage-secondary rounded-xl hover:border-teal-400 hover:text-teal-primary transition-all flex items-center gap-2"
              >
                <Target className="w-4 h-4" />
                <span>Routing</span>
              </Link>
              <button
                onClick={resetDemo}
                className="px-4 py-2 border-2 border-sage-700/20 text-sage-secondary rounded-xl hover:border-teal-400 hover:text-teal-primary transition-all flex items-center gap-2"
              >
                <RotateCcw className="w-4 h-4" />
                <span>Reset</span>
              </button>
              <Link
                href="/"
                className="px-4 py-2 border-2 border-sage-700/20 text-sage-secondary rounded-xl hover:border-teal-400 hover:text-teal-primary transition-all flex items-center gap-2"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Home</span>
              </Link>
            </div>
          </div>
        </div>
      </header>

      <div className="container-sage py-8 space-y-8">
        {/* Real-Time ROI Dashboard */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass rounded-3xl p-8 shadow-sage-lg"
        >
          <div className="flex items-center gap-3 mb-8">
            <div className="w-12 h-12 bg-emerald-gradient rounded-xl flex items-center justify-center shadow-sage">
              <DollarSign className="w-7 h-7 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-sage-primary">Real-Time ROI Dashboard</h2>
              <p className="text-sage-secondary">AI vs Human Triage Performance Metrics</p>
            </div>
          </div>

          <div className="grid lg:grid-cols-4 md:grid-cols-2 gap-6 mb-8">
            <div className="metric-card-primary p-6 rounded-2xl">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-blue-500/10 rounded-xl flex items-center justify-center">
                  <BarChart3 className="w-6 h-6 text-blue-500" />
                </div>
                <span className="text-sm text-blue-600 font-medium">
                  {roiMetrics.messagesProcessed > 0 ? `+${roiMetrics.messagesProcessed}` : 'Start processing'}
                </span>
              </div>
              <div className="text-3xl font-bold text-blue-700 mb-1">{roiMetrics.messagesProcessed}</div>
              <div className="text-sm text-blue-600">Messages Processed</div>
              <div className="text-xs text-blue-500 mt-2">
                {roiMetrics.messagesProcessed > 0 ? 'AI auto-triage vs manual sorting' : 'Process a message to see metrics'}
              </div>
            </div>

            <div className="metric-card-success p-6 rounded-2xl">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-emerald-500/10 rounded-xl flex items-center justify-center">
                  <Timer className="w-6 h-6 text-emerald-500" />
                </div>
                <span className="text-sm text-emerald-600 font-medium">
                  {roiMetrics.timesSavedHours > 0 ? `+${roiMetrics.timesSavedHours.toFixed(1)}h` : '0h saved'}
                </span>
              </div>
              <div className="text-3xl font-bold text-emerald-700 mb-1">
                {roiMetrics.timesSavedHours > 0 ? roiMetrics.timesSavedHours.toFixed(1) : '0'}h
              </div>
              <div className="text-sm text-emerald-600">Time Saved</div>
              <div className="text-xs text-emerald-500 mt-2">
                AI ~3s vs Human ~4min per message
              </div>
            </div>

            <div className="metric-card-warning p-6 rounded-2xl">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-orange-500/10 rounded-xl flex items-center justify-center">
                  <DollarSign className="w-6 h-6 text-orange-500" />
                </div>
                <span className="text-sm text-orange-600 font-medium">
                  {roiMetrics.costSavings > 0 ? `+$${roiMetrics.costSavings.toFixed(2)}` : '$0.00'}
                </span>
              </div>
              <div className="text-3xl font-bold text-orange-700 mb-1">
                ${roiMetrics.costSavings > 0 ? roiMetrics.costSavings.toFixed(2) : '0.00'}
              </div>
              <div className="text-sm text-orange-600">Cost Savings</div>
              <div className="text-xs text-orange-500 mt-2">
                Time saved × $18/hr agent cost
              </div>
            </div>

            <div className="metric-card-secondary p-6 rounded-2xl">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-purple-500/10 rounded-xl flex items-center justify-center">
                  <Shield className="w-6 h-6 text-purple-500" />
                </div>
                <span className="text-sm text-purple-600 font-medium">
                  {roiMetrics.negativeInteractionsBlocked > 0 ? `+${roiMetrics.negativeInteractionsBlocked}` : '0 blocked'}
                </span>
              </div>
              <div className="text-3xl font-bold text-purple-700 mb-1">{roiMetrics.negativeInteractionsBlocked}</div>
              <div className="text-sm text-purple-600">Negative Interactions Blocked</div>
              <div className="text-xs text-purple-500 mt-2">
                Protects employees from angry customers
              </div>
            </div>
          </div>

          <div className="grid lg:grid-cols-2 gap-8">
            <div className="glass-card-secondary p-6 rounded-2xl">
              <h3 className="text-lg font-semibold text-sage-primary mb-4 flex items-center gap-2">
                <Smile className="w-5 h-5 text-teal-400" />
                Employee Experience Impact
              </h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sage-secondary">Employee Satisfaction</span>
                  <div className="flex items-center gap-2">
                    <div className="w-24 h-2 bg-sage-50 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-emerald-400 rounded-full transition-all duration-1000"
                        style={{ width: `${roiMetrics.employeeSatisfaction}%` }}
                      />
                    </div>
                    <span className="text-sm font-semibold text-emerald-600">{roiMetrics.employeeSatisfaction.toFixed(1)}%</span>
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sage-secondary">Avg. Response Time</span>
                  <span className="text-sm font-semibold text-teal-primary">
                    {roiMetrics.averageResponseTime > 0 ? `${roiMetrics.averageResponseTime.toFixed(1)}s` : 'No data'}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sage-secondary">Routing Accuracy</span>
                  <div className="flex items-center gap-2">
                    <div className="w-24 h-2 bg-sage-50 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-teal-400 rounded-full transition-all duration-1000"
                        style={{ width: `${roiMetrics.departmentRoutingAccuracy}%` }}
                      />
                    </div>
                    <span className="text-sm font-semibold text-teal-primary">
                      {roiMetrics.departmentRoutingAccuracy > 0 ? `${roiMetrics.departmentRoutingAccuracy.toFixed(1)}%` : 'No data'}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="glass-card-secondary p-6 rounded-2xl">
              <h3 className="text-lg font-semibold text-sage-primary mb-4 flex items-center gap-2">
                <Users className="w-5 h-5 text-teal-400" />
                AI vs Human Comparison
              </h3>
              <div className="space-y-4">
                <div className="p-4 bg-emerald-50 rounded-xl border border-emerald-200">
                  <div className="text-sm text-emerald-800 mb-1">✓ AI Automated Triage</div>
                  <div className="text-xs text-emerald-600">~3 seconds: Instant sentiment analysis, department routing, priority assignment</div>
                </div>
                <div className="p-4 bg-red-50 rounded-xl border border-red-200">
                  <div className="text-sm text-red-800 mb-1">✗ Manual Human Triage</div>
                  <div className="text-xs text-red-600">~4 minutes: Read message, analyze sentiment, decide department, draft response</div>
                </div>
                <div className="text-center p-3 bg-teal-50 rounded-xl">
                  <div className="text-lg font-bold text-teal-700">{((roiMetrics.negativeInteractionsBlocked / roiMetrics.messagesProcessed) * 100).toFixed(1)}%</div>
                  <div className="text-xs text-teal-600">of negative interactions automatically handled</div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Message Input */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass rounded-3xl p-8 shadow-sage-lg"
        >
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 bg-sky-gradient rounded-xl flex items-center justify-center shadow-sage">
              <MessageSquare className="w-7 h-7 text-sage-700" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-sage-primary">Customer Message</h2>
              <p className="text-sage-secondary">Enter a message to see both processing methods in action</p>
            </div>
          </div>
          
          <div className="space-y-6">
            {/* Processing Mode Toggle */}
            <div className="flex items-center justify-center">
              <div className="flex bg-white/50 rounded-xl p-1 border border-sage-700/20">
                <button
                  onClick={() => setProcessingMode('structured')}
                  className={`px-4 py-2 rounded-lg font-medium transition-all flex items-center gap-2 ${
                    processingMode === 'structured'
                      ? 'bg-teal-gradient text-white shadow-sage'
                      : 'text-sage-secondary hover:text-sage-primary'
                  }`}
                >
                  <Settings className="w-4 h-4" />
                  🔧 Structured JSON
                </button>
                <button
                  onClick={() => setProcessingMode('unstructured')}
                  className={`px-4 py-2 rounded-lg font-medium transition-all flex items-center gap-2 ${
                    processingMode === 'unstructured'
                      ? 'bg-slate-400 text-white shadow-sage'
                      : 'text-sage-secondary hover:text-sage-primary'
                  }`}
                >
                  <FileText className="w-4 h-4" />
                  📝 Raw Response
                </button>
              </div>
            </div>

            <div className="grid lg:grid-cols-4 gap-6">
              <div className="lg:col-span-3">
                <textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Example: I'm really frustrated with my order #12345. It was supposed to arrive yesterday for my important meeting, but there's no update on tracking. This is unacceptable service!"
                  className="w-full h-24 p-4 border-2 border-sage-700/20 rounded-xl focus:border-teal-400 focus:outline-none transition-colors bg-white/50 text-sage-primary placeholder:text-sage-700/40 resize-none"
                  disabled={isProcessing}
                />
              </div>
              <div className="flex flex-col gap-3">
                <button
                  onClick={handleProcessing}
                  disabled={!message.trim() || isProcessing}
                  className="px-6 py-3 bg-teal-gradient text-white rounded-xl font-semibold hover:shadow-sage-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {isProcessing ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      <span>Processing...</span>
                    </>
                  ) : (
                    <>
                      <PlayCircle className="w-5 h-5" />
                      <span>Process</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Processing Pipeline Visualization */}
        {(isProcessing || results) && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="glass rounded-3xl p-8 shadow-sage-lg"
          >
            <div className="flex items-center gap-3 mb-8">
              <div className="w-12 h-12 bg-teal-gradient rounded-xl flex items-center justify-center shadow-sage">
                <Sparkles className="w-7 h-7 text-white" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-sage-primary">Processing Pipeline</h2>
                <p className="text-sage-secondary">Watch AI transform unstructured text into structured data</p>
              </div>
            </div>

            <div className="grid md:grid-cols-4 gap-6 mb-8">
              {processingPhases.map((phase, index) => (
                <motion.div
                  key={index}
                  className={`relative p-6 rounded-2xl border-2 transition-all duration-500 ${
                    currentPhase >= index 
                      ? 'border-teal-400 bg-teal-400/5 animate-pulse-glow' 
                      : 'border-sage-700/20 bg-white/30'
                  }`}
                  animate={{
                    scale: currentPhase === index ? 1.05 : 1,
                  }}
                >
                  <div className="text-center">
                    <div className={`inline-flex items-center justify-center w-14 h-14 rounded-xl mb-4 ${
                      currentPhase >= index ? 'bg-teal-400/10' : 'bg-sage-50/50'
                    }`}>
                      <phase.icon className={`w-7 h-7 ${
                        currentPhase >= index ? phase.color : 'text-sage-700/40'
                      }`} />
                    </div>
                    
                    <h3 className={`font-bold mb-2 ${
                      currentPhase >= index ? 'text-sage-primary' : 'text-sage-secondary'
                    }`}>
                      {phase.name}
                    </h3>
                    
                    <p className={`text-sm leading-relaxed ${
                      currentPhase >= index ? 'text-sage-secondary' : 'text-sage-700/50'
                    }`}>
                      {phase.description}
                    </p>

                    {currentPhase >= index && (
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: '100%' }}
                        transition={{ duration: 1, delay: 0.5 }}
                        className="mt-4 h-1 bg-teal-400 rounded-full"
                      />
                    )}
                  </div>

                  {index < processingPhases.length - 1 && (
                    <div className="hidden md:block absolute top-1/2 -right-3 transform -translate-y-1/2 z-10">
                      <motion.div
                        animate={{
                          color: currentPhase > index ? '#7eb6ad' : 'rgba(52, 75, 71, 0.3)'
                        }}
                      >
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                          <path 
                            d="M8 4l8 8-8 8" 
                            stroke="currentColor" 
                            strokeWidth="2" 
                            strokeLinecap="round" 
                            strokeLinejoin="round"
                          />
                        </svg>
                      </motion.div>
                    </div>
                  )}
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Processing Results */}
        {(isProcessing || results) && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="glass rounded-3xl shadow-sage-lg overflow-hidden"
          >
            {processingMode === 'structured' ? (
              <>
                <div className="bg-teal-400/10 p-6 border-b border-teal-400/20">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-teal-gradient rounded-xl flex items-center justify-center shadow-sage">
                        <Database className="w-7 h-7 text-white" />
                      </div>
                      <div>
                        <h3 className="text-xl font-bold text-sage-primary">🔧 Structured JSON Processing</h3>
                        <p className="text-sm text-sage-secondary">AI-powered data extraction with schema validation</p>
                      </div>
                    </div>
                    <div className="px-3 py-1 bg-emerald-gradient text-white text-xs rounded-full font-medium">
                      Recommended
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        {getStatusIcon(structuredState.status, true)}
                        <span className="font-semibold text-sage-primary">
                          {structuredState.stage}
                        </span>
                      </div>
                      <span className="text-sm font-medium text-sage-secondary">
                        {structuredState.progress}%
                      </span>
                    </div>
                    
                    <div className="w-full bg-sage-50/50 rounded-full h-3 overflow-hidden">
                      <motion.div
                        className="progress-structured h-3 rounded-full"
                        initial={{ width: 0 }}
                        animate={{ width: `${structuredState.progress}%` }}
                        transition={{ duration: 0.5 }}
                      />
                    </div>
                    
                    <p className="text-sm text-sage-secondary">{structuredState.details}</p>
                  </div>
                </div>

                <div className="p-6">
                  {results?.structured ? (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="space-y-6"
                    >
                      <div className="grid grid-cols-2 gap-4">
                        <div className="bg-emerald-50 p-4 rounded-xl border border-emerald-200">
                          <div className="text-xs text-emerald-700 mb-1 font-medium">Sentiment</div>
                          <div className="font-bold text-emerald-800 capitalize text-lg">
                            {results.structured.data.sentiment}
                          </div>
                        </div>
                        <div className="bg-red-50 p-4 rounded-xl border border-red-200">
                          <div className="text-xs text-red-700 mb-1 font-medium">Priority</div>
                          <div className="font-bold text-red-800 capitalize text-lg">
                            {results.structured.data.priority}
                          </div>
                        </div>
                        <div className="bg-blue-50 p-4 rounded-xl border border-blue-200">
                          <div className="text-xs text-blue-700 mb-1 font-medium">Department</div>
                          <div className="font-bold text-blue-800 text-lg">
                            {results.structured.data.department.replace('_', ' ')}
                          </div>
                        </div>
                        <div className="bg-purple-50 p-4 rounded-xl border border-purple-200">
                          <div className="text-xs text-purple-700 mb-1 font-medium">Confidence</div>
                          <div className="font-bold text-purple-800 text-lg">
                            {(results.structured.data.confidence * 100).toFixed(1)}%
                          </div>
                        </div>
                      </div>

                      <div>
                        <div className="text-sm text-sage-secondary mb-3 font-medium">Suggested Response:</div>
                        <div className="code-structured p-4 rounded-xl text-sm text-sage-primary leading-relaxed">
                          "{results.structured.data.reply}"
                        </div>
                      </div>

                      <div className="mt-4">
                        <div className="text-sm text-sage-secondary mb-2 font-medium">Complete JSON Structure:</div>
                        <div className="bg-gray-900 p-4 rounded-xl text-xs text-green-400 font-mono max-h-60 overflow-auto">
                          <pre>{JSON.stringify(results.structured.data, null, 2)}</pre>
                        </div>
                      </div>

                      <div className="flex items-center justify-between pt-4 border-t border-sage-700/10">
                        <div className="flex items-center gap-2">
                          <CheckCircle className="w-4 h-4 text-emerald-600" />
                          <span className="text-sm font-medium text-emerald-700">Schema Validated</span>
                        </div>
                        <span className="text-sm text-sage-secondary">
                          Processing Time: {results.structured.processingTime}ms
                        </span>
                      </div>
                    </motion.div>
                  ) : (
                    <div className="flex items-center justify-center h-48 text-sage-700/40">
                      <div className="text-center">
                        <Database className="w-16 h-16 mx-auto mb-3 opacity-50" />
                        <p className="text-lg font-medium">Processing...</p>
                        <p className="text-sm">Structuring your data with AI</p>
                      </div>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <>
                <div className="bg-slate-300/10 p-6 border-b border-slate-300/20">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-slate-400 rounded-xl flex items-center justify-center shadow-sage">
                        <FileText className="w-7 h-7 text-white" />
                      </div>
                      <div>
                        <h3 className="text-xl font-bold text-sage-primary">📝 Raw Response Processing</h3>
                        <p className="text-sm text-sage-secondary">What developers actually get without structured output</p>
                      </div>
                    </div>
                    <div className="px-3 py-1 bg-red-100 text-red-700 text-xs rounded-full font-medium border border-red-200">
                      ⚠️ Problematic Approach
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        {getStatusIcon(unstructuredState.status)}
                        <span className="font-semibold text-sage-primary">
                          {unstructuredState.stage}
                        </span>
                      </div>
                      <span className="text-sm font-medium text-sage-secondary">
                        {unstructuredState.progress}%
                      </span>
                    </div>
                    
                    <div className="w-full bg-sage-50/50 rounded-full h-3 overflow-hidden">
                      <motion.div
                        className="progress-unstructured h-3 rounded-full"
                        initial={{ width: 0 }}
                        animate={{ width: `${unstructuredState.progress}%` }}
                        transition={{ duration: 0.5 }}
                      />
                    </div>
                    
                    <p className="text-sm text-sage-secondary">{unstructuredState.details}</p>
                  </div>
                </div>

                <div className="p-6">
                  {results?.unstructured ? (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="space-y-6"
                    >
                      <div>
                        <div className="text-sm text-sage-secondary mb-3 font-medium">Raw LLM Response:</div>
                        <div className="code-unstructured p-4 rounded-xl text-sm text-sage-primary leading-relaxed whitespace-pre-wrap">
                          {results.unstructured.data.rawOutput}
                        </div>
                        
                        <div className="mt-4">
                          <div className="text-sm text-sage-secondary mb-2 font-medium">Developer Parsing Challenge:</div>
                          <div className="bg-gray-900 p-4 rounded-xl text-xs text-green-400 font-mono max-h-80 overflow-auto">
                            <pre className="text-yellow-300">{`// Real parsing code developers need to write:
`}</pre>
                            <pre className="text-white">{`function parseUnstructuredResponse(text) {
  const result = {};
  
  // Try to extract sentiment - unreliable!
  if (text.match(/happy|great|excellent|satisfied/i)) {
    result.sentiment = 'positive';
  } else if (text.match(/angry|terrible|awful|frustrated/i)) {
    result.sentiment = 'negative';
  } else {
    result.sentiment = 'unknown'; // 😞 Often unclear
  }
  
  // Try to determine priority - guesswork!
  if (text.match(/urgent|asap|immediately|emergency/i)) {
    result.priority = 'high';
  } else if (text.match(/when you can|no rush|sometime/i)) {
    result.priority = 'low';
  } else {
    result.priority = 'medium'; // 🤷‍♂️ Default guess
  }
  
  // Department routing - very error-prone!
  if (text.match(/order|purchase|buy|cart/i)) {
    result.department = 'ordering';
  } else if (text.match(/ship|deliver|track/i)) {
    result.department = 'shipping';
  } else {
    result.department = 'general'; // ❌ Often wrong
  }
  
  return result;
}

// Issues with this approach:
// • Breaks on edge cases ("not happy" -> positive) 
// • No confidence scoring
// • Inconsistent across different response styles
// • Requires constant rule updates
// • High maintenance overhead`}</pre>
                          </div>
                        </div>
                        
                        <div className="mt-4">
                          <div className="p-4 bg-amber-50 border-l-4 border-amber-400 rounded-lg">
                            <div className="flex items-start gap-3">
                              <AlertTriangle className="w-5 h-5 text-amber-600 mt-0.5 flex-shrink-0" />
                              <div>
                                <div className="font-semibold text-amber-800 mb-2">The Real Challenge</div>
                                <div className="text-sm text-amber-700">
                                  This natural language response would require manual parsing to extract structured data like sentiment, priority, and department routing. Developers would need to write complex regex patterns or use additional NLP processing to make this data actionable.
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center justify-between pt-4 border-t border-sage-700/10">
                        <div className="flex items-center gap-2">
                          <XCircle className="w-4 h-4 text-red-600" />
                          <span className="text-sm font-medium text-red-700">No Schema Validation</span>
                        </div>
                        <span className="text-sm text-sage-secondary">
                          Processing Time: {results.unstructured.processingTime}ms
                        </span>
                      </div>
                    </motion.div>
                  ) : (
                    <div className="flex items-center justify-center h-48 text-sage-700/40">
                      <div className="text-center">
                        <FileText className="w-16 h-16 mx-auto mb-3 opacity-50" />
                        <p className="text-lg font-medium">Processing...</p>
                        <p className="text-sm">Generating unstructured response</p>
                      </div>
                    </div>
                  )}
                </div>
              </>
            )}
          </motion.div>
        )}

        {/* Processing Summary */}
        <AnimatePresence>
          {showComparison && (results?.structured || results?.unstructured) && (
            <motion.div
              initial={{ opacity: 0, y: 40, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ delay: 0.8, duration: 0.6 }}
              className="glass rounded-3xl p-8 shadow-sage-lg"
            >
              <div className="text-center mb-8">
                <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-sage ${
                  processingMode === 'structured' ? 'bg-emerald-gradient' : 'bg-slate-400'
                }`}>
                  {processingMode === 'structured' ?
                    <TrendingUp className="w-8 h-8 text-white" /> :
                    <AlertTriangle className="w-8 h-8 text-white" />
                  }
                </div>
                <h2 className="text-3xl font-bold text-sage-primary mb-2">
                  {processingMode === 'structured' ? 'Structured Processing Complete' : 'Raw Response Generated'}
                </h2>
                <p className="text-lg text-sage-secondary">
                  {processingMode === 'structured' ?
                    'Your message has been processed with AI-powered structured data extraction' :
                    'Your message received a traditional unstructured LLM response'
                  }
                </p>
              </div>

              {processingMode === 'structured' ? (
                <div className="grid md:grid-cols-3 gap-8 mb-8">
                  <div className="text-center p-6 bg-emerald-50 rounded-2xl border border-emerald-200">
                    <div className="text-4xl font-bold text-emerald-600 mb-2">100%</div>
                    <div className="text-lg font-semibold text-emerald-800 mb-1">Data Accuracy</div>
                    <div className="text-sm text-emerald-700">Schema validation ensures perfect structure</div>
                  </div>
                  
                  <div className="text-center p-6 bg-blue-50 rounded-2xl border border-blue-200">
                    <div className="text-4xl font-bold text-blue-600 mb-2">
                      {results.structured ? `${results.structured.processingTime}ms` : '0ms'}
                    </div>
                    <div className="text-lg font-semibold text-blue-800 mb-1">Processing Time</div>
                    <div className="text-sm text-blue-700">Lightning fast AI analysis</div>
                  </div>
                  
                  <div className="text-center p-6 bg-purple-50 rounded-2xl border border-purple-200">
                    <div className="text-4xl font-bold text-purple-600 mb-2">0</div>
                    <div className="text-lg font-semibold text-purple-800 mb-1">Manual Errors</div>
                    <div className="text-sm text-purple-700">Automated validation prevents mistakes</div>
                  </div>
                </div>
              ) : (
                <div className="space-y-8 mb-8">
                  
                  <div className="flex justify-center">
                    <div className="text-center p-8 bg-orange-50 rounded-2xl border border-orange-200 max-w-sm">
                      <div className="text-5xl font-bold text-orange-600 mb-3">
                        {results.unstructured ? `${results.unstructured.processingTime}ms` : '0ms'}
                      </div>
                      <div className="text-xl font-semibold text-orange-800 mb-2">Processing Time</div>
                      <div className="text-sm text-orange-700">Raw LLM response generation time</div>
                    </div>
                  </div>
                </div>
              )}

              <div className="text-center space-y-4">
              
                <button
                  onClick={resetDemo}
                  className="px-8 py-4 bg-teal-gradient text-white rounded-xl font-semibold hover:shadow-sage-lg transition-all flex items-center justify-center gap-2 mx-auto"
                >
                  <RotateCcw className="w-5 h-5" />
                  <span>Try Another Message</span>
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

const DashboardPage = () => (
  <Suspense fallback={
    <div className="min-h-screen bg-sage-gradient flex items-center justify-center">
      <div className="glass rounded-2xl p-8 text-center">
        <Loader2 className="w-12 h-12 animate-spin text-teal-400 mx-auto mb-4" />
        <h2 className="text-xl font-semibold text-sage-primary">Loading Dashboard</h2>
        <p className="text-sage-secondary">Preparing processing environment...</p>
      </div>
    </div>
  }>
    <DashboardContent />
  </Suspense>
);

export default DashboardPage;