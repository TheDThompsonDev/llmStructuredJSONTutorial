'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Play, 
  Pause, 
  RotateCcw, 
  CheckCircle, 
  Brain,
  MessageSquare,
  Database,
  BarChart3,
  Shield,
  Zap,
  Clock,
  Target,
  TrendingUp,
  Users,
  ArrowRight,
  Settings,
  Eye,
  Activity,
  Cpu,
  AlertTriangle,
  ThumbsUp,
  ThumbsDown,
  Star,
  DollarSign
} from 'lucide-react';
import Link from 'next/link';

interface DemoStep {
  id: string;
  title: string;
  description: string;
  input: string;
  expectedOutput: any;
  processingTime: number;
  icon: any;
  color: string;
}

const demoScenarios = {
  'customer-support': {
    title: 'AI Customer Support',
    description: 'Intelligent message routing with sentiment analysis',
    icon: MessageSquare,
    color: 'from-blue-500 to-cyan-500',
    steps: [
      {
        id: 'billing-complaint',
        title: 'Billing Complaint',
        description: 'High priority negative sentiment requiring immediate attention',
        input: "I'm absolutely furious! You charged my credit card twice this month for my subscription. This is the third time this has happened and I want a full refund immediately!",
        expectedOutput: {
          sentiment: 'negative',
          priority: 'high',
          department: 'Billing Support',
          topics: ['billing', 'refund', 'complaint'],
          confidence: 0.94,
          urgency: 'immediate',
          suggestedResponse: 'Escalate to senior billing specialist for immediate resolution'
        },
        processingTime: 850,
        icon: AlertTriangle,
        color: 'text-red-400'
      },
      {
        id: 'feature-request',
        title: 'Feature Request',
        description: 'Positive feedback with product enhancement suggestion',
        input: "I love using your platform! The AI processing is incredibly fast. Would it be possible to add batch processing for larger datasets? This would be amazing for our enterprise needs.",
        expectedOutput: {
          sentiment: 'positive',
          priority: 'medium',
          department: 'Product Team',
          topics: ['feature request', 'batch processing', 'enterprise'],
          confidence: 0.91,
          urgency: 'normal',
          suggestedResponse: 'Forward to product team for feature evaluation'
        },
        processingTime: 720,
        icon: Star,
        color: 'text-yellow-400'
      },
      {
        id: 'technical-issue',
        title: 'Technical Issue',
        description: 'Technical problem requiring specialized support',
        input: "The API is returning 500 errors when I try to process documents larger than 2MB. I've checked my authentication and rate limits are fine. Can someone help debug this?",
        expectedOutput: {
          sentiment: 'neutral',
          priority: 'high',
          department: 'Technical Support',
          topics: ['API', 'error', 'debugging', 'file size'],
          confidence: 0.89,
          urgency: 'high',
          suggestedResponse: 'Route to Level 2 technical support with API expertise'
        },
        processingTime: 920,
        icon: Settings,
        color: 'text-blue-400'
      }
    ]
  },
  'data-processing': {
    title: 'Enterprise Data Processing',
    description: 'Structured JSON extraction from unstructured data',
    icon: Database,
    color: 'from-purple-500 to-pink-500',
    steps: [
      {
        id: 'invoice-extraction',
        title: 'Invoice Processing',
        description: 'Extract structured data from invoice text',
        input: "INVOICE #INV-2024-001\nBill To: Acme Corporation\n123 Business Ave\nDate: March 15, 2024\nDue Date: April 14, 2024\n\nServices:\n- AI Processing License (Annual): $24,000.00\n- Technical Support: $3,600.00\n- Training Sessions: $1,200.00\n\nSubtotal: $28,800.00\nTax (8.5%): $2,448.00\nTotal: $31,248.00",
        expectedOutput: {
          invoiceNumber: 'INV-2024-001',
          billTo: {
            company: 'Acme Corporation',
            address: '123 Business Ave'
          },
          dates: {
            issued: '2024-03-15',
            due: '2024-04-14'
          },
          lineItems: [
            { description: 'AI Processing License (Annual)', amount: 24000.00 },
            { description: 'Technical Support', amount: 3600.00 },
            { description: 'Training Sessions', amount: 1200.00 }
          ],
          totals: {
            subtotal: 28800.00,
            tax: 2448.00,
            taxRate: 0.085,
            total: 31248.00
          },
          currency: 'USD',
          status: 'pending'
        },
        processingTime: 1200,
        icon: DollarSign,
        color: 'text-green-400'
      },
      {
        id: 'contract-analysis',
        title: 'Contract Analysis',
        description: 'Extract key terms and obligations from legal documents',
        input: "SOFTWARE LICENSE AGREEMENT\n\nThis agreement grants Licensee the right to use the AI Processing Platform for a term of 36 months beginning January 1, 2024. Monthly fee is $2,500 with automatic renewal unless cancelled with 30 days notice. Licensee may process up to 1M transactions monthly. Support includes 24/7 technical assistance and quarterly business reviews.",
        expectedOutput: {
          documentType: 'Software License Agreement',
          parties: {
            licensor: 'AI Processing Platform',
            licensee: 'Client Company'
          },
          terms: {
            duration: '36 months',
            startDate: '2024-01-01',
            monthlyFee: 2500,
            currency: 'USD',
            autoRenewal: true,
            noticePeriod: '30 days'
          },
          limits: {
            monthlyTransactions: 1000000
          },
          services: [
            '24/7 technical assistance',
            'quarterly business reviews'
          ],
          keyObligations: [
            'Monthly payment due',
            'Usage within transaction limits',
            'Notice required for cancellation'
          ]
        },
        processingTime: 1450,
        icon: Shield,
        color: 'text-purple-400'
      }
    ]
  },
  'business-intelligence': {
    title: 'Business Intelligence',
    description: 'AI-powered insights and predictive analytics',
    icon: BarChart3,
    color: 'from-emerald-500 to-teal-500',
    steps: [
      {
        id: 'sales-analysis',
        title: 'Sales Performance Analysis',
        description: 'Analyze sales data and predict future trends',
        input: "Q1 Sales Report: Total revenue $2.4M (up 23% YoY). Enterprise clients: 45 new acquisitions. Top performing regions: West Coast (38% growth), Northeast (29% growth). Churn rate: 3.2% (down from 4.1%). Customer acquisition cost: $1,200 (improved from $1,450). Average deal size: $48K. Pipeline value: $8.9M for Q2.",
        expectedOutput: {
          performance: {
            revenue: 2400000,
            growth: 0.23,
            period: 'Q1 2024'
          },
          customers: {
            newEnterpriseClients: 45,
            churnRate: 0.032,
            acquisitionCost: 1200,
            averageDealSize: 48000
          },
          regional: [
            { region: 'West Coast', growth: 0.38 },
            { region: 'Northeast', growth: 0.29 }
          ],
          pipeline: {
            value: 8900000,
            period: 'Q2 2024'
          },
          insights: [
            'Strong YoY growth indicates healthy market demand',
            'Improved churn rate suggests better customer satisfaction',
            'Reduced CAC indicates more efficient sales process'
          ],
          predictions: {
            q2Revenue: 2640000,
            confidence: 0.87
          }
        },
        processingTime: 1100,
        icon: TrendingUp,
        color: 'text-emerald-400'
      },
      {
        id: 'roi-calculation',
        title: 'ROI Impact Analysis',
        description: 'Calculate return on investment for AI implementation',
        input: "Pre-AI: Manual processing 500 documents/day, 4 FTE staff @ $65K/year, 2.3% error rate, avg processing time 8 minutes. Post-AI: Processing 2,500 documents/day, 1 FTE staff, 0.3% error rate, avg processing time 45 seconds. AI platform cost: $60K/year. Training cost: $15K one-time.",
        expectedOutput: {
          preAI: {
            documentsPerDay: 500,
            staffCount: 4,
            staffCostPerYear: 260000,
            errorRate: 0.023,
            processingTimeMinutes: 8
          },
          postAI: {
            documentsPerDay: 2500,
            staffCount: 1,
            staffCostPerYear: 65000,
            errorRate: 0.003,
            processingTimeSeconds: 45
          },
          costs: {
            aiPlatform: 60000,
            training: 15000,
            totalFirstYear: 75000
          },
          savings: {
            laborSavings: 195000,
            efficiencyGain: 5.0,
            errorReduction: 0.02,
            netSavings: 120000
          },
          roi: {
            firstYear: 1.6,
            threeYear: 4.25,
            paybackMonths: 7.5
          },
          metrics: {
            productivityIncrease: '400%',
            costReduction: '54%',
            errorReduction: '87%'
          }
        },
        processingTime: 950,
        icon: DollarSign,
        color: 'text-green-400'
      }
    ]
  }
};

export default function InteractiveDemo() {
  const [selectedScenario, setSelectedScenario] = useState('customer-support');
  const [currentStep, setCurrentStep] = useState(0);
  const [isProcessing, setIsProcessing] = useState(false);
  const [processedData, setProcessedData] = useState<any>(null);
  const [progress, setProgress] = useState(0);
  const [showResults, setShowResults] = useState(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const scenario = demoScenarios[selectedScenario as keyof typeof demoScenarios];
  const step = scenario.steps[currentStep];

  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  const runDemo = async () => {
    setIsProcessing(true);
    setProgress(0);
    setShowResults(false);
    setProcessedData(null);

    // Simulate processing with progress updates
    const totalTime = step.processingTime;
    const updateInterval = totalTime / 100;

    intervalRef.current = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          if (intervalRef.current) clearInterval(intervalRef.current);
          return 100;
        }
        return prev + 1;
      });
    }, updateInterval);

    // Process immediately
    setProcessedData(step.expectedOutput);
    setIsProcessing(false);
    setShowResults(true);
    if (intervalRef.current) clearInterval(intervalRef.current);
  };

  const resetDemo = () => {
    setIsProcessing(false);
    setProgress(0);
    setShowResults(false);
    setProcessedData(null);
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
  };

  const nextStep = () => {
    if (currentStep < scenario.steps.length - 1) {
      setCurrentStep(currentStep + 1);
      resetDemo();
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
      resetDemo();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-gray-900 to-slate-800 text-white">
      {/* Navigation */}
      <nav className="bg-black/20 backdrop-blur-xl border-b border-white/10">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center gap-3">
              <div className="p-2 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl">
                <Brain className="w-6 h-6" />
              </div>
              <span className="text-xl font-bold">AI Processing Platform</span>
            </Link>
            
            <div className="flex items-center gap-4">
              <Link href="/dashboard" className="text-gray-300 hover:text-white transition-colors">
                Dashboard
              </Link>
              <Link href="/" className="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors">
                Back to Home
              </Link>
            </div>
          </div>
        </div>
      </nav>

      <div className="container mx-auto px-6 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-blue-400 via-purple-400 to-emerald-400 bg-clip-text text-transparent">
              Interactive AI Processing Demo
            </h1>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Experience our AI capabilities across different business use cases with real-time processing demonstrations
            </p>
          </motion.div>
        </div>

        {/* Scenario Selector */}
        <div className="flex flex-wrap justify-center gap-4 mb-12">
          {Object.entries(demoScenarios).map(([key, scenario]) => {
            const Icon = scenario.icon;
            const isActive = selectedScenario === key;
            
            return (
              <motion.button
                key={key}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                onClick={() => {
                  setSelectedScenario(key);
                  setCurrentStep(0);
                  resetDemo();
                }}
                className={`flex items-center gap-3 px-6 py-3 rounded-xl transition-all transform hover:scale-105 ${
                  isActive
                    ? `bg-gradient-to-r ${scenario.color} shadow-xl`
                    : 'bg-gray-800 hover:bg-gray-700 border border-gray-600'
                }`}
              >
                <Icon className="w-5 h-5" />
                <span className="font-semibold">{scenario.title}</span>
              </motion.button>
            );
          })}
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Input Section */}
          <motion.div
            key={selectedScenario}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="bg-gray-800/50 backdrop-blur-xl rounded-2xl p-6 border border-gray-700"
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold flex items-center gap-3">
                <scenario.icon className="w-6 h-6" />
                {scenario.title}
              </h2>
              
              <div className="flex items-center gap-2">
                <button
                  onClick={prevStep}
                  disabled={currentStep === 0}
                  className="p-2 bg-gray-700 hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg transition-colors"
                >
                  ←
                </button>
                <span className="text-sm text-gray-400">
                  {currentStep + 1} / {scenario.steps.length}
                </span>
                <button
                  onClick={nextStep}
                  disabled={currentStep === scenario.steps.length - 1}
                  className="p-2 bg-gray-700 hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg transition-colors"
                >
                  →
                </button>
              </div>
            </div>

            {/* Current Step Info */}
            <div className="mb-6">
              <div className="flex items-center gap-3 mb-3">
                <step.icon className={`w-5 h-5 ${step.color}`} />
                <h3 className="text-xl font-semibold">{step.title}</h3>
              </div>
              <p className="text-gray-400">{step.description}</p>
            </div>

            {/* Input Text */}
            <div className="mb-6">
              <label className="block text-sm font-semibold text-gray-300 mb-3">
                Input Data:
              </label>
              <div className="bg-black/30 rounded-xl p-4 border border-gray-600">
                <pre className="text-sm text-gray-300 whitespace-pre-wrap font-mono leading-relaxed">
                  {step.input}
                </pre>
              </div>
            </div>

            {/* Controls */}
            <div className="flex items-center gap-4">
              <button
                onClick={runDemo}
                disabled={isProcessing}
                className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 disabled:opacity-50 rounded-xl font-semibold transition-all transform hover:scale-105"
              >
                {isProcessing ? (
                  <>
                    <Cpu className="w-5 h-5 animate-spin" />
                    Processing...
                  </>
                ) : (
                  <>
                    <Play className="w-5 h-5" />
                    Run Demo
                  </>
                )}
              </button>
              
              <button
                onClick={resetDemo}
                className="flex items-center gap-2 px-4 py-3 bg-gray-700 hover:bg-gray-600 rounded-xl transition-colors"
              >
                <RotateCcw className="w-4 h-4" />
                Reset
              </button>

              {showResults && (
                <div className="flex items-center gap-2 text-green-400">
                  <CheckCircle className="w-5 h-5" />
                  <span className="font-semibold">Completed</span>
                </div>
              )}
            </div>

            {/* Progress Bar */}
            {isProcessing && (
              <div className="mt-6">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-gray-400">Processing...</span>
                  <span className="text-sm text-gray-400">{progress}%</span>
                </div>
                <div className="w-full bg-gray-700 rounded-full h-3">
                  <div 
                    className="bg-gradient-to-r from-blue-500 to-purple-500 h-3 rounded-full transition-all duration-100"
                    style={{ width: `${progress}%` }}
                  />
                </div>
                <div className="text-xs text-gray-500 mt-1">
                  Processing time: {step.processingTime}ms
                </div>
              </div>
            )}
          </motion.div>

          {/* Output Section */}
          <motion.div
            key={`${selectedScenario}-${currentStep}`}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="bg-gray-800/50 backdrop-blur-xl rounded-2xl p-6 border border-gray-700"
          >
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-3">
              <Eye className="w-6 h-6 text-green-400" />
              Processing Results
            </h2>

            {!showResults ? (
              <div className="text-center py-12 text-gray-500">
                <Brain className="w-16 h-16 mx-auto mb-4 opacity-50" />
                <p>Click "Run Demo" to see AI processing results</p>
              </div>
            ) : (
              <AnimatePresence>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                  className="space-y-4"
                >
                  <div className="bg-black/30 rounded-xl p-4 border border-gray-600">
                    <div className="text-xs text-gray-400 mb-2">STRUCTURED OUTPUT</div>
                    <pre className="text-sm text-green-400 whitespace-pre-wrap font-mono leading-relaxed max-h-96 overflow-y-auto">
                      {JSON.stringify(processedData, null, 2)}
                    </pre>
                  </div>

                  {/* Key Metrics */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-blue-500/20 rounded-xl p-4 border border-blue-500/30">
                      <div className="text-blue-400 text-sm font-semibold">Processing Time</div>
                      <div className="text-2xl font-bold">{step.processingTime}ms</div>
                    </div>
                    <div className="bg-green-500/20 rounded-xl p-4 border border-green-500/30">
                      <div className="text-green-400 text-sm font-semibold">Confidence</div>
                      <div className="text-2xl font-bold">
                        {processedData?.confidence ? `${Math.round(processedData.confidence * 100)}%` : '94%'}
                      </div>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-3 pt-4">
                    <Link
                      href="/dashboard"
                      className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors text-sm"
                    >
                      <Activity className="w-4 h-4" />
                      View Dashboard
                    </Link>
                    <button
                      onClick={() => navigator.clipboard.writeText(JSON.stringify(processedData, null, 2))}
                      className="flex items-center gap-2 px-4 py-2 bg-gray-600 hover:bg-gray-500 rounded-lg transition-colors text-sm"
                    >
                      Copy JSON
                    </button>
                  </div>
                </motion.div>
              </AnimatePresence>
            )}
          </motion.div>
        </div>

        {/* Features Showcase */}
        <div className="mt-16 grid md:grid-cols-3 gap-8">
          <div className="bg-gradient-to-br from-blue-500/20 to-cyan-500/20 rounded-2xl p-6 border border-blue-500/30">
            <Zap className="w-8 h-8 text-blue-400 mb-4" />
            <h3 className="text-xl font-bold mb-3">Lightning Fast</h3>
            <p className="text-gray-300">
              Process complex data structures in milliseconds with our optimized AI models
            </p>
          </div>

          <div className="bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-2xl p-6 border border-purple-500/30">
            <Target className="w-8 h-8 text-purple-400 mb-4" />
            <h3 className="text-xl font-bold mb-3">High Accuracy</h3>
            <p className="text-gray-300">
              Achieve 94%+ accuracy rates across different data types and use cases
            </p>
          </div>

          <div className="bg-gradient-to-br from-emerald-500/20 to-teal-500/20 rounded-2xl p-6 border border-emerald-500/30">
            <Shield className="w-8 h-8 text-emerald-400 mb-4" />
            <h3 className="text-xl font-bold mb-3">Enterprise Ready</h3>
            <p className="text-gray-300">
              Built for scale with enterprise-grade security and reliability
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}