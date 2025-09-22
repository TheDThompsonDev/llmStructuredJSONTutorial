'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Brain,
  Zap,
  TrendingUp,
  Shield,
  Globe,
  MessageSquare,
  BarChart3,
  Users,
  CheckCircle,
  ArrowRight,
  Play,
  Sparkles,
  Target,
  Clock,
  DollarSign,
  Award,
  Activity,
  Eye,
  Settings,
  ChevronRight,
  Star,
  Building,
  Cpu,
  Database,
  Upload,
  Route
} from 'lucide-react';
import Link from 'next/link';

const businessUseCases = [
  {
    id: 'customer-support',
    title: 'AI Customer Support',
    description: 'Intelligent message routing and sentiment analysis',
    icon: MessageSquare,
    color: 'from-blue-500 to-cyan-500',
    bgColor: 'bg-blue-500/10',
    textColor: 'text-blue-400',
    metrics: { accuracy: '94.2%', speedUp: '8x', satisfaction: '4.8/5' },
    features: ['Real-time routing', 'Sentiment analysis', 'Priority detection', 'Multi-department']
  },
  {
    id: 'data-processing',
    title: 'Enterprise Data Processing',
    description: 'Structured JSON extraction from unstructured data',
    icon: Database,
    color: 'from-purple-500 to-pink-500',
    bgColor: 'bg-purple-500/10',
    textColor: 'text-purple-400',
    metrics: { processed: '1M+/day', accuracy: '99.1%', latency: '120ms' },
    features: ['Batch processing', 'Schema validation', 'Error handling', 'API integration']
  },
  {
    id: 'business-intelligence',
    title: 'Business Intelligence',
    description: 'AI-powered insights and predictive analytics',
    icon: BarChart3,
    color: 'from-emerald-500 to-teal-500',
    bgColor: 'bg-emerald-500/10',
    textColor: 'text-emerald-400',
    metrics: { insights: '500+', roi: '340%', decisions: '2.3x faster' },
    features: ['Predictive modeling', 'ROI calculation', 'Trend analysis', 'Custom dashboards']
  },
  {
    id: 'content-moderation',
    title: 'Content Moderation',
    description: 'Automated content analysis and compliance',
    icon: Shield,
    color: 'from-orange-500 to-red-500',
    bgColor: 'bg-orange-500/10',
    textColor: 'text-orange-400',
    metrics: { coverage: '99.9%', speed: '50ms', languages: '25+' },
    features: ['Real-time scanning', 'Policy compliance', 'Multi-language', 'Custom rules']
  }
];

const testimonials = [
  {
    name: 'Sarah Chen',
    role: 'CTO, TechCorp',
    company: 'Fortune 500',
    image: '/api/placeholder/64/64',
    quote: 'Reduced our customer support response time by 80% while improving satisfaction scores.',
    rating: 5
  },
  {
    name: 'Michael Rodriguez',
    role: 'Head of Operations',
    company: 'DataFlow Inc',
    image: '/api/placeholder/64/64',
    quote: 'Processing millions of documents daily with 99% accuracy. Game-changing technology.',
    rating: 5
  },
  {
    name: 'Emily Johnson',
    role: 'VP Engineering',
    company: 'CloudScale',
    image: '/api/placeholder/64/64',
    quote: 'The ROI was immediate. Our team can focus on strategy instead of manual data processing.',
    rating: 5
  }
];

const stats = [
  { label: 'Messages Processed', value: '10M+', trend: '+127%' },
  { label: 'Enterprise Clients', value: '500+', trend: '+89%' },
  { label: 'Average ROI', value: '340%', trend: '+45%' },
  { label: 'Uptime SLA', value: '99.99%', trend: 'Consistent' }
];

export default function LandingPage() {
  const [activeUseCase, setActiveUseCase] = useState(businessUseCases[0]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % testimonials.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const handleDemo = () => {
    setIsPlaying(true);
    setIsPlaying(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-gray-900 to-slate-800 text-white overflow-hidden">
      <div className="absolute inset-0 opacity-30">
        <div className="absolute top-10 left-10 w-72 h-72 bg-blue-500/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute top-1/2 right-20 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute bottom-20 left-1/3 w-80 h-80 bg-emerald-500/20 rounded-full blur-3xl animate-pulse delay-2000"></div>
      </div>

      <nav className="relative z-10 bg-black/20 backdrop-blur-xl border-b border-white/10">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl">
                <Brain className="w-6 h-6" />
              </div>
              <span className="text-xl font-bold">AI Processing Platform</span>
            </div>
            
            <div className="hidden md:flex items-center gap-8">
              <motion.a
                href="#features"
                className="text-gray-300 hover:text-white transition-all duration-300 relative group"
                whileHover={{ y: -1 }}
              >
                Features
                <div className="absolute bottom-0 left-0 w-0 h-0.5 bg-blue-400 group-hover:w-full transition-all duration-300"></div>
              </motion.a>
              
              <motion.a
                href="#usecases"
                className="text-gray-300 hover:text-white transition-all duration-300 relative group"
                whileHover={{ y: -1 }}
              >
                Use Cases
                <div className="absolute bottom-0 left-0 w-0 h-0.5 bg-purple-400 group-hover:w-full transition-all duration-300"></div>
              </motion.a>
              
              <motion.a
                href="#testimonials"
                className="text-gray-300 hover:text-white transition-all duration-300 relative group"
                whileHover={{ y: -1 }}
              >
                Testimonials
                <div className="absolute bottom-0 left-0 w-0 h-0.5 bg-emerald-400 group-hover:w-full transition-all duration-300"></div>
              </motion.a>

              <div className="relative group">
                <motion.button
                  className="text-gray-300 hover:text-white transition-all duration-300 flex items-center gap-1"
                  whileHover={{ y: -1 }}
                >
                  Explore
                  <ChevronRight className="w-4 h-4 rotate-90 group-hover:rotate-180 transition-transform duration-300" />
                </motion.button>
                
                <motion.div
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  whileInView={{ opacity: 0, y: 10, scale: 0.95 }}
                  className="absolute top-full right-0 mt-2 w-64 bg-gray-800/95 backdrop-blur-xl border border-gray-600 rounded-xl shadow-2xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300"
                >
                  <div className="p-2">
                    <Link href="/demo" className="flex items-center gap-3 p-3 rounded-lg hover:bg-blue-500/20 transition-colors group">
                      <Play className="w-5 h-5 text-blue-400" />
                      <div>
                        <div className="font-semibold text-white">Interactive Demo</div>
                        <div className="text-xs text-gray-400">Try our AI processing live</div>
                      </div>
                    </Link>
                    
                    
                    <Link href="/batch" className="flex items-center gap-3 p-3 rounded-lg hover:bg-purple-500/20 transition-colors group">
                      <Upload className="w-5 h-5 text-purple-400" />
                      <div>
                        <div className="font-semibold text-white">Batch Processing</div>
                        <div className="text-xs text-gray-400">Enterprise-scale operations</div>
                      </div>
                    </Link>
                    
                    <Link href="/routing" className="flex items-center gap-3 p-3 rounded-lg hover:bg-pink-500/20 transition-colors group">
                      <Route className="w-5 h-5 text-pink-400" />
                      <div>
                        <div className="font-semibold text-white">Message Routing</div>
                        <div className="text-xs text-gray-400">AI-powered department routing</div>
                      </div>
                    </Link>
                  </div>
                </motion.div>
              </div>

              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.98 }}
              >
                <Link
                  href="/dashboard"
                  className="px-4 py-2 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 rounded-lg transition-all duration-300 font-semibold shadow-lg hover:shadow-xl"
                >
                  View Dashboard
                </Link>
              </motion.div>
            </div>
          </div>
        </div>
      </nav>

      <section className="relative z-10 container mx-auto px-6 py-20">
        <div className="text-center max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="mb-8"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-500/20 border border-blue-500/30 rounded-full mb-6">
              <Sparkles className="w-4 h-4 text-blue-400" />
              <span className="text-blue-300 text-sm font-medium">Enterprise AI Processing Platform</span>
            </div>
            
            <h1 className="text-6xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-blue-400 via-purple-400 to-emerald-400 bg-clip-text text-transparent leading-tight">
              Transform Data Into
              <br />
              Business Intelligence
            </h1>
            
            <p className="text-xl md:text-2xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
              Leverage cutting-edge AI to process unstructured data, extract meaningful insights, 
              and automate decision-making across your enterprise operations.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12"
          >
            <motion.div
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.98 }}
              className="relative group"
            >
              <Link
                href="/demo"
                className="group px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 rounded-xl text-lg font-semibold transition-all shadow-2xl flex items-center gap-2 relative overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
                <Play className="w-5 h-5 group-hover:animate-pulse relative z-10" />
                <span className="relative z-10">Start Interactive Demo</span>
              </Link>
              <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl opacity-0 group-hover:opacity-20 transition-opacity duration-300 -z-10"></div>
            </motion.div>
            
            <motion.div
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.98 }}
              className="relative group"
            >
              <button
                onClick={handleDemo}
                className="group px-8 py-4 border-2 border-gray-600 hover:border-white/50 rounded-xl text-lg font-semibold transition-all flex items-center gap-2 relative overflow-hidden bg-transparent hover:bg-gradient-to-r hover:from-blue-500/10 hover:to-purple-500/10"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-purple-500/20 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left"></div>
                <Eye className={`w-5 h-5 transition-all duration-300 relative z-10 ${isPlaying ? 'animate-spin text-blue-400' : 'group-hover:scale-110 group-hover:text-blue-400'}`} />
                <span className="relative z-10 transition-colors duration-300 group-hover:text-white">
                  {isPlaying ? 'Processing...' : 'Watch in Action'}
                </span>
              </button>
              <div className="absolute -inset-1 bg-gradient-to-r from-blue-400/20 to-purple-400/20 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10 blur-sm"></div>
            </motion.div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="grid grid-cols-2 md:grid-cols-4 gap-8"
          >
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-3xl font-bold text-white mb-2">{stat.value}</div>
                <div className="text-gray-400 mb-1">{stat.label}</div>
                <div className="text-sm text-emerald-400">{stat.trend}</div>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      <section id="usecases" className="relative z-10 py-20 bg-black/20">
        <div className="container mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="text-5xl font-bold mb-6">Powerful Use Cases</h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Discover how our AI processing platform transforms businesses across industries
            </p>
          </motion.div>

          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-4">
              {businessUseCases.map((useCase, index) => {
                const Icon = useCase.icon;
                const isActive = activeUseCase.id === useCase.id;
                
                return (
                  <motion.div
                    key={useCase.id}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    whileHover={{ scale: 1.02, x: 4 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setActiveUseCase(useCase)}
                    className={`group p-6 rounded-2xl border-2 transition-all cursor-pointer relative overflow-hidden ${
                      isActive
                        ? `border-blue-500 ${useCase.bgColor} shadow-2xl`
                        : 'border-gray-700 bg-gray-800/50 hover:border-gray-600'
                    }`}
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    
                    <div className="flex items-start gap-4 relative z-10">
                      <motion.div
                        className={`p-3 rounded-xl bg-gradient-to-r ${useCase.color}`}
                        whileHover={{ rotate: 5, scale: 1.1 }}
                        transition={{ type: "spring", stiffness: 400, damping: 10 }}
                      >
                        <Icon className="w-6 h-6" />
                      </motion.div>
                      
                      <div className="flex-1">
                        <h3 className="text-xl font-bold mb-2 group-hover:text-white transition-colors">{useCase.title}</h3>
                        <p className="text-gray-400 mb-4 group-hover:text-gray-300 transition-colors">{useCase.description}</p>
                        
                        <motion.div
                          className="flex items-center gap-4 text-sm"
                          initial={{ opacity: 0.8 }}
                          whileHover={{ opacity: 1 }}
                        >
                          {Object.entries(useCase.metrics).map(([key, value], metricIndex) => (
                            <motion.div
                              key={key}
                              className="flex items-center gap-1"
                              initial={{ scale: 0.9 }}
                              whileHover={{ scale: 1.05 }}
                              transition={{ delay: metricIndex * 0.1 }}
                            >
                              <div className={`w-2 h-2 rounded-full ${useCase.textColor.replace('text-', 'bg-')} group-hover:animate-pulse`}></div>
                              <span className="text-gray-300 group-hover:text-white transition-colors font-medium">{value}</span>
                            </motion.div>
                          ))}
                        </motion.div>
                      </div>
                      
                      <motion.div
                        animate={{ rotate: isActive ? 90 : 0 }}
                        transition={{ type: "spring", stiffness: 200, damping: 15 }}
                        className="text-gray-400 group-hover:text-white transition-colors"
                      >
                        <ChevronRight className="w-5 h-5" />
                      </motion.div>
                    </div>

                    <AnimatePresence>
                      {!isActive && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          whileHover={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.3 }}
                          className="overflow-hidden mt-4 pt-4 border-t border-gray-600"
                        >
                          <div className="flex flex-wrap gap-2">
                            {useCase.features.slice(0, 2).map((feature, featureIndex) => (
                              <motion.span
                                key={featureIndex}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: featureIndex * 0.1 }}
                                className="px-2 py-1 bg-gray-700/50 rounded-full text-xs text-gray-300"
                              >
                                {feature}
                              </motion.span>
                            ))}
                            <span className="px-2 py-1 bg-blue-500/20 rounded-full text-xs text-blue-400">
                              +{useCase.features.length - 2} more
                            </span>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                );
              })}
            </div>

            <motion.div
              key={activeUseCase.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-xl rounded-3xl p-8 border border-gray-700"
            >
              <div className="flex items-center gap-4 mb-6">
                <div className={`p-4 rounded-2xl bg-gradient-to-r ${activeUseCase.color}`}>
                  <activeUseCase.icon className="w-8 h-8" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold">{activeUseCase.title}</h3>
                  <p className="text-gray-400">{activeUseCase.description}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-6 mb-8">
                {Object.entries(activeUseCase.metrics).map(([key, value]) => (
                  <div key={key} className="text-center p-4 bg-black/30 rounded-xl">
                    <div className="text-2xl font-bold mb-1">{value}</div>
                    <div className="text-sm text-gray-400 capitalize">{key.replace(/([A-Z])/g, ' $1')}</div>
                  </div>
                ))}
              </div>

              <div className="space-y-3 mb-8">
                {activeUseCase.features.map((feature, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-emerald-400" />
                    <span className="text-gray-300">{feature}</span>
                  </div>
                ))}
              </div>

              <Link
                href={`/demo?usecase=${activeUseCase.id}`}
                className="w-full px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 rounded-xl font-semibold transition-all transform hover:scale-105 flex items-center justify-center gap-2"
              >
                Try {activeUseCase.title} Demo
                <ArrowRight className="w-5 h-5" />
              </Link>
            </motion.div>
          </div>
        </div>
      </section>

      <section id="testimonials" className="relative z-10 py-20">
        <div className="container mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="text-5xl font-bold mb-6">Trusted by Industry Leaders</h2>
            <p className="text-xl text-gray-300">See what our enterprise clients say about our platform</p>
          </motion.div>

          <div className="max-w-4xl mx-auto">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentSlide}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.5 }}
                className="text-center"
              >
                <div className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-xl rounded-3xl p-12 border border-gray-700 mb-8">
                  <div className="flex justify-center mb-6">
                    {[...Array(testimonials[currentSlide].rating)].map((_, i) => (
                      <Star key={i} className="w-6 h-6 text-yellow-400 fill-current" />
                    ))}
                  </div>
                  
                  <blockquote className="text-2xl font-light mb-8 text-gray-200 leading-relaxed">
                    "{testimonials[currentSlide].quote}"
                  </blockquote>
                  
                  <div className="flex items-center justify-center gap-4">
                    <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-xl font-bold">
                      {testimonials[currentSlide].name.split(' ').map(n => n[0]).join('')}
                    </div>
                    <div className="text-left">
                      <div className="font-semibold text-lg">{testimonials[currentSlide].name}</div>
                      <div className="text-gray-400">{testimonials[currentSlide].role}</div>
                      <div className="text-sm text-gray-500">{testimonials[currentSlide].company}</div>
                    </div>
                  </div>
                </div>

                <div className="flex justify-center gap-3">
                  {testimonials.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentSlide(index)}
                      className={`w-3 h-3 rounded-full transition-all ${
                        index === currentSlide ? 'bg-blue-500' : 'bg-gray-600 hover:bg-gray-500'
                      }`}
                    />
                  ))}
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </section>

      <section className="relative z-10 py-20 bg-gradient-to-r from-blue-600/20 to-purple-600/20">
        <div className="container mx-auto px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-5xl font-bold mb-6">Ready to Transform Your Business?</h2>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto mb-12">
              Join hundreds of enterprise clients using our AI platform to process millions of data points daily
            </p>
            
            <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
              <Link
                href="/demo"
                className="px-12 py-4 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 rounded-xl text-xl font-semibold transition-all transform hover:scale-105 shadow-2xl flex items-center gap-3"
              >
                <Play className="w-6 h-6" />
                Start Free Demo
              </Link>
              
              <Link
                href="/dashboard"
                className="px-12 py-4 border-2 border-gray-600 hover:border-white/50 rounded-xl text-xl font-semibold transition-all transform hover:scale-105 flex items-center gap-3"
              >
                <Activity className="w-6 h-6" />
                View Live Dashboard
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      <footer className="relative z-10 bg-black/40 backdrop-blur-xl border-t border-white/10 py-12">
        <div className="container mx-auto px-6">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl">
                  <Brain className="w-5 h-5" />
                </div>
                <span className="text-lg font-bold">AI Processing Platform</span>
              </div>
              <p className="text-gray-400">
                Enterprise-grade AI processing for the modern business
              </p>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Product</h4>
              <div className="space-y-2">
                <a href="#" className="block text-gray-400 hover:text-white transition-colors">Features</a>
                <a href="#" className="block text-gray-400 hover:text-white transition-colors">API Docs</a>
                <a href="#" className="block text-gray-400 hover:text-white transition-colors">Integrations</a>
              </div>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Company</h4>
              <div className="space-y-2">
                <a href="#" className="block text-gray-400 hover:text-white transition-colors">About</a>
                <a href="#" className="block text-gray-400 hover:text-white transition-colors">Careers</a>
                <a href="#" className="block text-gray-400 hover:text-white transition-colors">Contact</a>
              </div>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Resources</h4>
              <div className="space-y-2">
                <a href="#" className="block text-gray-400 hover:text-white transition-colors">Blog</a>
                <a href="#" className="block text-gray-400 hover:text-white transition-colors">Support</a>
                <a href="#" className="block text-gray-400 hover:text-white transition-colors">Status</a>
              </div>
            </div>
          </div>
          
          <div className="border-t border-white/10 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2024 AI Processing Platform. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}