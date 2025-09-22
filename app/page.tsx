'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  MessageSquare, 
  Zap, 
  Database, 
  Code2,
  CheckCircle,
  XCircle,
  ArrowRight,
  PlayCircle,
  Sparkles,
  BrainCircuit,
  FileJson,
  AlertTriangle,
  Clock,
  Target,
  TrendingUp
} from 'lucide-react';
import Link from 'next/link';

export default function HomePage() {
  const [message, setMessage] = useState('');
  const [currentStep, setCurrentStep] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);

  const exampleMessage = "I ordered a laptop 3 days ago (order #12345) and it still hasn't shipped. I need it urgently for my presentation tomorrow morning. This is extremely frustrating and unprofessional. Please help me track it down immediately!";

  const processingSteps = [
    {
      title: "Raw Input",
      description: "Customer message arrives",
      icon: MessageSquare,
      color: "text-sage-700",
      bg: "bg-sage-50"
    },
    {
      title: "LLM Analysis", 
      description: "AI processes the content",
      icon: BrainCircuit,
      color: "text-teal-400",
      bg: "bg-sky-50"
    },
    {
      title: "JSON Structuring",
      description: "Data gets organized",
      icon: Database,
      color: "text-teal-400", 
      bg: "bg-teal-400/10"
    },
    {
      title: "Validation",
      description: "Schema ensures accuracy",
      icon: CheckCircle,
      color: "text-emerald-600",
      bg: "bg-emerald-50"
    }
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentStep((prev) => (prev + 1) % processingSteps.length);
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  const handleTryExample = () => {
    setMessage(exampleMessage);
    setIsAnimating(true);
    setIsAnimating(false);
  };

  const handleProcessMessage = () => {
    if (message.trim()) {
      window.location.href = `/dashboard?message=${encodeURIComponent(message)}`;
    }
  };

  return (
    <div className="min-h-screen bg-sage-gradient">
      <header className="glass border-b border-teal-400/20">
        <div className="container-sage py-4">
          <div className="flex items-center justify-between">
            <motion.div 
              className="flex items-center gap-3"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
            >
              <div className="w-10 h-10 bg-teal-gradient rounded-xl flex items-center justify-center shadow-sage">
                <FileJson className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-sage-primary">LLM Structured JSON</h1>
                <p className="text-sm text-sage-secondary">Advanced AI Processing Platform</p>
              </div>
            </motion.div>

            <nav className="hidden md:flex items-center gap-6">
              <Link 
                href="/dashboard" 
                className="text-sage-secondary hover:text-teal-primary transition-colors"
              >
                Dashboard
              </Link>
            </nav>
          </div>
        </div>
      </header>

      <section className="py-20">
        <div className="container-sage">
          <div className="text-center mb-16">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-teal-400/10 rounded-full mb-6">
                <Sparkles className="w-4 h-4 text-teal-primary" />
                <span className="text-sm font-medium text-teal-primary">Revolutionary AI Processing</span>
              </div>
              
              <h1 className="text-5xl md:text-7xl font-bold text-sage-primary mb-6 leading-tight">
                Transform
                <span className="block text-teal-primary">Unstructured Data</span>
                Into Perfect JSON
              </h1>
              
              <p className="text-xl text-sage-secondary max-w-3xl mx-auto leading-relaxed">
                Experience the power of structured JSON processing. See how schema validation 
                transforms messy customer messages into perfectly organized, actionable data.
              </p>
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="mb-20"
          >
            <div className="bg-white rounded-3xl shadow-sage-lg p-8 max-w-5xl mx-auto">
              <h2 className="text-2xl font-bold text-sage-primary mb-8 text-center">
                Real-Time Processing Pipeline
              </h2>
              
              <div className="grid md:grid-cols-4 gap-6">
                {processingSteps.map((step, index) => (
                  <motion.div
                    key={index}
                    className={`relative p-6 rounded-2xl border-2 transition-all duration-500 ${
                      currentStep === index 
                        ? `border-teal-400 ${step.bg} animate-pulse-glow` 
                        : 'border-slate-300/30 bg-sage-50/30'
                    }`}
                    animate={{
                      scale: currentStep === index ? 1.05 : 1,
                      opacity: currentStep >= index ? 1 : 0.6
                    }}
                  >
                    <div className="text-center">
                      <div className={`inline-flex items-center justify-center w-12 h-12 rounded-xl mb-4 ${
                        currentStep === index ? step.bg : 'bg-sage-50'
                      }`}>
                        <step.icon className={`w-6 h-6 ${
                          currentStep === index ? step.color : 'text-sage-700/50'
                        }`} />
                      </div>
                      
                      <h3 className={`font-semibold mb-2 ${
                        currentStep === index ? 'text-sage-primary' : 'text-sage-secondary'
                      }`}>
                        {step.title}
                      </h3>
                      
                      <p className={`text-sm ${
                        currentStep === index ? 'text-sage-secondary' : 'text-sage-700/50'
                      }`}>
                        {step.description}
                      </p>
                    </div>

                    {index < processingSteps.length - 1 && (
                      <div className="hidden md:block absolute top-1/2 -right-3 transform -translate-y-1/2">
                        <ArrowRight className={`w-5 h-5 ${
                          currentStep > index ? 'text-teal-primary' : 'text-sage-700/30'
                        }`} />
                      </div>
                    )}
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="grid lg:grid-cols-2 gap-12 mb-20"
          >
            <div className="glass rounded-3xl p-8 hover-lift">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-sky-gradient rounded-xl flex items-center justify-center">
                  <MessageSquare className="w-6 h-6 text-sage-700" />
                </div>
                <h3 className="text-2xl font-bold text-sage-primary">Try It Live</h3>
              </div>

              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-sage-secondary mb-2">
                    Customer Message
                  </label>
                  <motion.textarea
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Enter a customer message to see the magic happen..."
                    className="w-full h-32 p-4 border-2 border-sage-700/20 rounded-xl focus:border-teal-400 focus:outline-none transition-colors bg-white/50 text-sage-primary placeholder:text-sage-700/40 resize-none"
                    animate={isAnimating ? { scale: [1, 1.02, 1] } : {}}
                    transition={{ duration: 0.3 }}
                  />
                </div>

                <div className="flex flex-col sm:flex-row gap-3">
                  <button
                    onClick={handleTryExample}
                    className="px-6 py-3 border-2 border-teal-400 text-teal-primary rounded-xl hover:bg-teal-400 hover:text-white transition-all font-medium"
                  >
                    Try Example
                  </button>
                  
                  <button
                    onClick={handleProcessMessage}
                    disabled={!message.trim()}
                    className="flex-1 px-6 py-3 bg-teal-gradient text-white rounded-xl hover:shadow-sage-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed font-semibold flex items-center justify-center gap-2"
                  >
                    <PlayCircle className="w-5 h-5" />
                    Process & Compare
                  </button>
                </div>
              </div>
            </div>

            <div className="glass rounded-3xl p-8 hover-lift">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-teal-gradient rounded-xl flex items-center justify-center">
                  <Database className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-sage-primary">Structured Output</h3>
              </div>

              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-emerald-50 p-3 rounded-lg border border-emerald-200">
                    <div className="text-xs text-emerald-700 mb-1">Sentiment</div>
                    <div className="font-semibold text-emerald-800">Negative</div>
                  </div>
                  <div className="bg-red-50 p-3 rounded-lg border border-red-200">
                    <div className="text-xs text-red-700 mb-1">Priority</div>
                    <div className="font-semibold text-red-800">High</div>
                  </div>
                  <div className="bg-blue-50 p-3 rounded-lg border border-blue-200">
                    <div className="text-xs text-blue-700 mb-1">Department</div>
                    <div className="font-semibold text-blue-800">Shipping</div>
                  </div>
                  <div className="bg-purple-50 p-3 rounded-lg border border-purple-200">
                    <div className="text-xs text-purple-700 mb-1">Confidence</div>
                    <div className="font-semibold text-purple-800">94.2%</div>
                  </div>
                </div>

                <div className="code-structured p-4 rounded-lg">
                  <div className="text-xs text-sage-secondary mb-2">JSON Response:</div>
                  <pre className="text-sm text-sage-primary font-mono">
{`{
  "sentiment": "negative",
  "priority": "high", 
  "department": "shipping_and_delivery",
  "confidence": 0.942
}`}
                  </pre>
                </div>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1.2 }}
            className="text-center"
          >
            <div className="glass rounded-3xl p-12 max-w-3xl mx-auto">
              <h2 className="text-3xl font-bold text-sage-primary mb-6">
                Ready to Transform Your Data Processing?
              </h2>
              <p className="text-lg text-sage-secondary mb-8">
                See the difference structured JSON processing makes in real-time. 
                Experience the future of AI-powered data extraction.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link 
                  href="/dashboard"
                  className="px-8 py-4 bg-teal-gradient text-white rounded-xl font-semibold hover:shadow-sage-lg transition-all flex items-center justify-center gap-2"
                >
                  <Database className="w-5 h-5" />
                  <span>Live Dashboard</span>
                </Link>
                
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
