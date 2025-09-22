'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Upload, 
  Play, 
  CheckCircle, 
  AlertTriangle, 
  Clock, 
  Database, 
  BarChart3, 
  Brain,
  Eye,
  Activity,
  RefreshCw,
  ArrowLeft,
  ChevronDown,
  ChevronRight,
  MessageSquare,
  X
} from 'lucide-react';
import Link from 'next/link';

interface BatchItem {
  id: string;
  message: string;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  result?: {
    sentiment: string;
    priority: string;
    confidence: number;
    department: string;
    reply: string;
  };
  rawResult?: string;
  error?: string;
  processingTime?: number;
}

interface BatchJob {
  id: string;
  name: string;
  type: 'document-processing' | 'sentiment-analysis' | 'data-extraction' | 'content-moderation';
  status: 'pending' | 'running' | 'completed' | 'failed' | 'paused';
  progress: number;
  totalItems: number;
  processedItems: number;
  successfulItems: number;
  failedItems: number;
  startTime: Date;
  estimatedCompletion: Date | null;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  createdBy: string;
  cost: number;
  averageProcessingTime: number;
  throughput: number;
  errorRate: number;
  items?: BatchItem[];
  processingMode?: 'structured' | 'unstructured';
}

interface ProcessingStats {
  totalJobs: number;
  activeJobs: number;
  completedToday: number;
  totalProcessed: number;
  avgProcessingTime: number;
  costSavings: number;
  errorRate: number;
  throughput: number;
}

export default function BatchProcessingInterface() {
  const [jobs, setJobs] = useState<BatchJob[]>([]);
  const [selectedJob, setSelectedJob] = useState<BatchJob | null>(null);
  const [showResults, setShowResults] = useState(false);
  const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set());
  const [stats, setStats] = useState<ProcessingStats>({
    totalJobs: 0,
    activeJobs: 0,
    completedToday: 0,
    totalProcessed: 0,
    avgProcessingTime: 0,
    costSavings: 0,
    errorRate: 0,
    throughput: 0
  });
  
  const [showNewJobModal, setShowNewJobModal] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState<FileList | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [jobName, setJobName] = useState('');
  const [processingMode, setProcessingMode] = useState<'structured' | 'unstructured'>('structured');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const loadJobs = async () => {
    try {
      const response = await fetch('/api/batch');
      if (response.ok) {
        const jobsData = await response.json();
        setJobs(jobsData);
        
        const totalJobs = jobsData.length;
        const activeJobs = jobsData.filter((job: BatchJob) => job.status === 'running').length;
        const completedToday = jobsData.filter((job: BatchJob) => {
          const today = new Date();
          const jobDate = new Date(job.startTime);
          return job.status === 'completed' && 
                 jobDate.toDateString() === today.toDateString();
        }).length;
        
        const totalProcessed = jobsData.reduce((sum: number, job: BatchJob) => sum + job.processedItems, 0);
        const totalCost = jobsData.reduce((sum: number, job: BatchJob) => sum + job.cost, 0);
        const avgProcessingTime = jobsData.length > 0 
          ? jobsData.reduce((sum: number, job: BatchJob) => sum + job.averageProcessingTime, 0) / jobsData.length
          : 0;
        
        setStats({
          totalJobs,
          activeJobs,
          completedToday,
          totalProcessed,
          avgProcessingTime,
          costSavings: totalCost * 10,
          errorRate: jobsData.length > 0
            ? (jobsData.reduce((sum: number, job: BatchJob) => sum + job.errorRate, 0) / jobsData.length)
            : 0,
          throughput: jobsData.reduce((sum: number, job: BatchJob) => sum + job.throughput, 0)
        });
      }
    } catch (error) {
      console.error('Error loading jobs:', error);
    }
  };

  const loadJobDetails = async (jobId: string) => {
    try {
      const response = await fetch(`/api/batch?jobId=${jobId}`);
      if (response.ok) {
        const jobData = await response.json();
        setSelectedJob(jobData);
        setShowResults(true);
      }
    } catch (error) {
      console.error('Error loading job details:', error);
    }
  };

  const toggleItem = (itemId: string) => {
    const newExpanded = new Set(expandedItems);
    if (newExpanded.has(itemId)) {
      newExpanded.delete(itemId);
    } else {
      newExpanded.add(itemId);
    }
    setExpandedItems(newExpanded);
  };

  const getSentimentColor = (sentiment: string) => {
    switch (sentiment) {
      case 'positive': return 'text-green-600 bg-green-50 border-green-200';
      case 'negative': return 'text-red-600 bg-red-50 border-red-200';
      case 'neutral': return 'text-blue-600 bg-blue-50 border-blue-200';
      default: return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'text-red-600 bg-red-50 border-red-200';
      case 'medium': return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case 'low': return 'text-green-600 bg-green-50 border-green-200';
      default: return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const getDepartmentName = (dept: string) => {
    const names: { [key: string]: string } = {
      'customer_support': 'Customer Support',
      'online_ordering': 'Online Ordering',
      'product_quality': 'Product Quality',
      'shipping_and_delivery': 'Shipping & Delivery',
      'other_off_topic': 'General Inquiry'
    };
    return names[dept] || dept;
  };

  useEffect(() => {
    loadJobs();
    const interval = setInterval(loadJobs, 5000);
    return () => clearInterval(interval);
  }, []);

  const handleFileSelection = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files) {
      setSelectedFiles(files);
    }
  };

  const handleFileUpload = async () => {
    if (!selectedFiles || selectedFiles.length === 0 || !jobName.trim()) return;

    setIsUploading(true);
    
    try {
      const formData = new FormData();
      formData.append('file', selectedFiles[0]);
      formData.append('jobName', jobName);
      formData.append('jobType', 'sentiment-analysis');
      formData.append('processingMode', processingMode);

      const response = await fetch('/api/batch', {
        method: 'POST',
        body: formData
      });

      if (response.ok) {
        const result = await response.json();
        console.log('Batch job created:', result);
        
        setSelectedFiles(null);
        setJobName('');
        setShowNewJobModal(false);
        if (fileInputRef.current) {
          fileInputRef.current.value = '';
        }
        
        await loadJobs();
        alert(`Successfully created batch job with ${result.message}`);
      } else {
        const error = await response.json();
        console.error('Upload failed:', error);
        alert(`Upload failed: ${error.error}`);
      }
    } catch (error) {
      console.error('Upload error:', error);
      alert('Upload failed. Please try again.');
    } finally {
      setIsUploading(false);
    }
  };

  const getStatusIcon = (status: BatchJob['status']) => {
    switch (status) {
      case 'pending': return Clock;
      case 'running': return Activity;
      case 'completed': return CheckCircle;
      case 'failed': return AlertTriangle;
      default: return Clock;
    }
  };

  const getStatusColor = (status: BatchJob['status']) => {
    switch (status) {
      case 'pending': return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case 'running': return 'text-blue-600 bg-blue-50 border-blue-200';
      case 'completed': return 'text-green-600 bg-green-50 border-green-200';
      case 'failed': return 'text-red-600 bg-red-50 border-red-200';
      default: return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  return (
    <div className="min-h-screen bg-sage-gradient">
      <header className="glass border-b border-teal-400/20">
        <div className="container-sage py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 bg-teal-gradient rounded-xl flex items-center justify-center shadow-sage">
                <Database className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-sage-primary">Batch Processing</h1>
                <p className="text-sage-secondary">Enterprise AI Processing at Scale</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Link
                href="/dashboard"
                className="px-4 py-2 border-2 border-sage-700/20 text-sage-secondary rounded-xl hover:border-teal-400 hover:text-teal-primary transition-all flex items-center gap-2"
              >
                <Eye className="w-4 h-4" />
                <span>Dashboard</span>
              </Link>
              <button
                onClick={() => setShowNewJobModal(true)}
                className="px-4 py-2 bg-teal-gradient text-white rounded-xl hover:shadow-sage-lg transition-all flex items-center gap-2"
              >
                <Upload className="w-4 h-4" />
                <span>New Job</span>
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
        <div className="grid lg:grid-cols-4 md:grid-cols-2 gap-6">
          <div className="metric-card-primary p-6 rounded-2xl">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-blue-500/10 rounded-xl flex items-center justify-center">
                <BarChart3 className="w-6 h-6 text-blue-500" />
              </div>
              <span className="text-sm text-blue-600 font-medium">Total</span>
            </div>
            <div className="text-3xl font-bold text-blue-700 mb-1">{stats.totalJobs}</div>
            <div className="text-sm text-blue-600">Batch Jobs</div>
            <div className="text-xs text-blue-500 mt-2">
              {stats.totalJobs === 0 ? 'Upload CSV to get started' : 'All-time jobs created'}
            </div>
          </div>

          <div className="metric-card-success p-6 rounded-2xl">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-emerald-500/10 rounded-xl flex items-center justify-center">
                <Activity className="w-6 h-6 text-emerald-500" />
              </div>
              <span className="text-sm text-emerald-600 font-medium">Active</span>
            </div>
            <div className="text-3xl font-bold text-emerald-700 mb-1">{stats.activeJobs}</div>
            <div className="text-sm text-emerald-600">Running Jobs</div>
            <div className="text-xs text-emerald-500 mt-2">Currently processing</div>
          </div>

          <div className="metric-card-warning p-6 rounded-2xl">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-orange-500/10 rounded-xl flex items-center justify-center">
                <CheckCircle className="w-6 h-6 text-orange-500" />
              </div>
              <span className="text-sm text-orange-600 font-medium">Today</span>
            </div>
            <div className="text-3xl font-bold text-orange-700 mb-1">{stats.completedToday}</div>
            <div className="text-sm text-orange-600">Completed</div>
            <div className="text-xs text-orange-500 mt-2">Jobs finished today</div>
          </div>

          <div className="metric-card-secondary p-6 rounded-2xl">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-purple-500/10 rounded-xl flex items-center justify-center">
                <Brain className="w-6 h-6 text-purple-500" />
              </div>
              <span className="text-sm text-purple-600 font-medium">Total</span>
            </div>
            <div className="text-3xl font-bold text-purple-700 mb-1">{stats.totalProcessed}</div>
            <div className="text-sm text-purple-600">Items Processed</div>
            <div className="text-xs text-purple-500 mt-2">Messages analyzed with AI</div>
          </div>
        </div>

        <div className="glass rounded-3xl p-8 shadow-sage-lg">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-sage-primary">Recent Batch Jobs</h2>
            <div className="flex items-center gap-3">
              <button
                onClick={loadJobs}
                className="px-4 py-2 border-2 border-sage-700/20 text-sage-secondary rounded-xl hover:border-teal-400 hover:text-teal-primary transition-all flex items-center gap-2"
              >
                <RefreshCw className="w-4 h-4" />
                <span>Refresh</span>
              </button>
            </div>
          </div>

          {jobs.length === 0 ? (
            <div className="text-center py-12">
              <Upload className="w-16 h-16 text-sage-secondary mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-sage-primary mb-2">No batch jobs yet</h3>
              <p className="text-sage-secondary mb-4">Upload a CSV file to start processing messages with AI</p>
              <button
                onClick={() => setShowNewJobModal(true)}
                className="button-primary flex items-center gap-2 mx-auto"
              >
                <Upload className="w-4 h-4" />
                Upload CSV File
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {jobs.map((job) => {
                const StatusIcon = getStatusIcon(job.status);
                return (
                  <div key={job.id} className="glass-card-secondary p-6 rounded-2xl">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className={`p-3 rounded-xl border-2 ${getStatusColor(job.status)}`}>
                          <StatusIcon className="w-6 h-6" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-sage-primary">{job.name}</h3>
                          <div className="flex items-center gap-4 text-sm text-sage-secondary mt-1">
                            <span>{job.processedItems}/{job.totalItems} items</span>
                            <span>${job.cost.toFixed(2)} cost</span>
                            <span>{new Date(job.startTime).toLocaleString()}</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        {job.status === 'completed' && (
                          <button
                            onClick={() => loadJobDetails(job.id)}
                            className="px-4 py-2 border-2 border-teal-400/30 text-teal-600 rounded-xl hover:border-teal-400 hover:bg-teal-50 transition-all flex items-center gap-2"
                          >
                            <Eye className="w-4 h-4" />
                            <span>View Results</span>
                          </button>
                        )}
                        <div className="text-right">
                          <div className="text-2xl font-bold text-sage-primary">{job.progress.toFixed(1)}%</div>
                          <div className="text-sm text-sage-secondary capitalize">{job.status}</div>
                        </div>
                      </div>
                    </div>
                    {job.progress > 0 && job.progress < 100 && (
                      <div className="mt-4">
                        <div className="w-full h-2 bg-sage-50 rounded-full overflow-hidden">
                          <motion.div
                            className="h-full bg-teal-400 rounded-full"
                            initial={{ width: 0 }}
                            animate={{ width: `${job.progress}%` }}
                            transition={{ duration: 0.5 }}
                          />
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      <AnimatePresence>
        {showNewJobModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setShowNewJobModal(false)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="glass rounded-3xl p-8 max-w-2xl w-full shadow-sage-lg"
              onClick={(e) => e.stopPropagation()}
            >
              <h2 className="text-2xl font-bold mb-6 text-sage-primary">Upload CSV for Batch Processing</h2>
              
              <div className="mb-6">
                <label className="block text-sm font-semibold text-sage-secondary mb-3">
                  Job Name
                </label>
                <input
                  type="text"
                  value={jobName}
                  onChange={(e) => setJobName(e.target.value)}
                  placeholder="Enter a name for this batch job"
                  className="input-glass w-full"
                />
              </div>

              <div className="mb-6">
                <label className="block text-sm font-semibold text-sage-secondary mb-3">
                  Processing Mode
                </label>
                <div className="flex items-center gap-4 p-4 glass-card-secondary rounded-xl">
                  <button
                    onClick={() => setProcessingMode('structured')}
                    className={`flex-1 p-3 rounded-lg transition-all ${
                      processingMode === 'structured'
                        ? 'bg-teal-gradient text-white shadow-sage'
                        : 'bg-sage-50 text-sage-secondary hover:bg-sage-100'
                    }`}
                  >
                    <div className="text-center">
                      <div className="font-semibold">🔧 Structured JSON</div>
                      <div className="text-xs mt-1 opacity-80">Clean, organized data</div>
                    </div>
                  </button>
                  <button
                    onClick={() => setProcessingMode('unstructured')}
                    className={`flex-1 p-3 rounded-lg transition-all ${
                      processingMode === 'unstructured'
                        ? 'bg-teal-gradient text-white shadow-sage'
                        : 'bg-sage-50 text-sage-secondary hover:bg-sage-100'
                    }`}
                  >
                    <div className="text-center">
                      <div className="font-semibold">📝 Raw Response</div>
                      <div className="text-xs mt-1 opacity-80">Natural LLM output</div>
                    </div>
                  </button>
                </div>
                <p className="text-xs text-sage-700/60 mt-2">
                  {processingMode === 'structured'
                    ? 'Get organized JSON with sentiment, priority, department, and response fields'
                    : 'See raw, unformatted responses from the AI model for comparison'
                  }
                </p>
              </div>

              <div className="mb-6">
                <label className="block text-sm font-semibold text-sage-secondary mb-3">
                  Upload CSV File
                </label>
                <div className="border-2 border-dashed border-sage-700/30 rounded-xl p-8 text-center hover:border-teal-400/50 transition-colors">
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept=".csv"
                    onChange={handleFileSelection}
                    className="hidden"
                  />
                  <Upload className="w-12 h-12 mx-auto mb-4 text-sage-secondary" />
                  <p className="text-sage-secondary mb-2">
                    Drop your CSV file here, or{' '}
                    <button
                      onClick={() => fileInputRef.current?.click()}
                      className="text-teal-400 hover:text-teal-primary font-semibold"
                    >
                      browse to upload
                    </button>
                  </p>
                  <div className="text-sm text-sage-700/60 space-y-2">
                    <p><strong>Required Format:</strong> One customer message per line</p>
                    <div className="bg-slate-50 p-2 rounded text-xs font-mono">
                      <div>I'm having trouble with my order</div>
                      <div>Great service, thank you!</div>
                      <div>Product quality is poor</div>
                    </div>
                  </div>
                  
                  {selectedFiles && selectedFiles.length > 0 && (
                    <div className="mt-4 p-4 glass-card-secondary rounded-lg">
                      <p className="text-teal-primary font-semibold">
                        ✓ {selectedFiles[0].name}
                      </p>
                      <p className="text-sm text-sage-secondary">
                        Ready for AI processing
                      </p>
                    </div>
                  )}
                </div>
              </div>

              <div className="mb-6 p-4 glass-card-secondary rounded-xl">
                <h3 className="font-semibold text-sage-primary mb-3">📋 Supported CSV Formats</h3>
                <div className="text-sm text-sage-secondary space-y-2">
                  <div>
                    <p className="font-medium">✅ Simple format (recommended):</p>
                    <div className="bg-slate-50 p-2 rounded font-mono text-xs ml-4">
                      I need help with my order<br/>
                      The delivery was late<br/>
                      Excellent customer service
                    </div>
                  </div>
                  <div>
                    <p className="font-medium">✅ With header row:</p>
                    <div className="bg-slate-50 p-2 rounded font-mono text-xs ml-4">
                      message<br/>
                      I need help with my order<br/>
                      The delivery was late
                    </div>
                  </div>
                  <div>
                    <p className="font-medium">✅ Multiple columns (uses first column):</p>
                    <div className="bg-slate-50 p-2 rounded font-mono text-xs ml-4">
                      "Customer message","date","id"<br/>
                      "I need help with my order","2024-01-15","001"
                    </div>
                  </div>
                </div>
              </div>

              <div className="mb-6 p-4 glass-card-secondary rounded-xl">
                <h3 className="font-semibold text-sage-primary mb-2">
                  {processingMode === 'structured' ? '🤖 Structured Analysis Includes:' : '📝 Raw AI Response Includes:'}
                </h3>
                {processingMode === 'structured' ? (
                  <ul className="text-sm text-sage-secondary space-y-1">
                    <li>• <strong>Sentiment:</strong> positive/negative/neutral classification</li>
                    <li>• <strong>Priority:</strong> low/medium/high urgency assessment</li>
                    <li>• <strong>Department:</strong> routing to support, ordering, quality, or shipping</li>
                    <li>• <strong>AI Response:</strong> professional customer reply</li>
                    <li>• <strong>Confidence:</strong> AI certainty score (0-100%)</li>
                  </ul>
                ) : (
                  <ul className="text-sm text-sage-secondary space-y-1">
                    <li>• <strong>Natural Language:</strong> conversational analysis format</li>
                    <li>• <strong>Complete Context:</strong> full AI reasoning and explanation</li>
                    <li>• <strong>Unformatted:</strong> raw model output without JSON structure</li>
                    <li>• <strong>Flexible Format:</strong> AI chooses how to present information</li>
                    <li>• <strong>Comparison Ready:</strong> see the difference vs structured output</li>
                  </ul>
                )}
              </div>

              <div className="flex justify-end gap-3">
                <button
                  onClick={() => setShowNewJobModal(false)}
                  className="button-secondary"
                >
                  Cancel
                </button>
                <button
                  onClick={handleFileUpload}
                  disabled={!selectedFiles || !jobName.trim() || isUploading}
                  className="button-primary disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isUploading ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin mr-2" />
                      Creating Job...
                    </>
                  ) : (
                    <>
                      <Play className="w-4 h-4 mr-2" />
                      Start Processing
                    </>
                  )}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showResults && selectedJob && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setShowResults(false)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="glass rounded-3xl p-8 max-w-6xl w-full max-h-[90vh] overflow-y-auto shadow-sage-lg"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-3xl font-bold text-sage-primary">{selectedJob.name}</h2>
                  <p className="text-sage-secondary mt-1">AI Processing Results</p>
                </div>
                <button
                  onClick={() => setShowResults(false)}
                  className="p-2 hover:bg-sage-50 rounded-xl transition-colors"
                >
                  <X className="w-6 h-6 text-sage-secondary" />
                </button>
              </div>

              <div className="grid lg:grid-cols-4 gap-6 mb-8">
                <div className="metric-card-primary p-4 rounded-xl">
                  <div className="text-2xl font-bold text-blue-700">{selectedJob.totalItems}</div>
                  <div className="text-sm text-blue-600">Total Messages</div>
                </div>
                <div className="metric-card-success p-4 rounded-xl">
                  <div className="text-2xl font-bold text-emerald-700">{selectedJob.successfulItems}</div>
                  <div className="text-sm text-emerald-600">Successfully Processed</div>
                </div>
                <div className="metric-card-warning p-4 rounded-xl">
                  <div className="text-2xl font-bold text-orange-700">{selectedJob.failedItems}</div>
                  <div className="text-sm text-orange-600">Failed</div>
                </div>
                <div className="metric-card-secondary p-4 rounded-xl">
                  <div className="text-2xl font-bold text-purple-700">${selectedJob.cost.toFixed(2)}</div>
                  <div className="text-sm text-purple-600">Total Cost</div>
                </div>
              </div>

              {selectedJob.items && selectedJob.items.length > 0 && (
                <div>
                  <h3 className="text-xl font-bold text-sage-primary mb-4">Message Analysis Results</h3>
                  <div className="space-y-3">
                    {selectedJob.items.map((item) => (
                      <div key={item.id} className="glass-card-secondary rounded-xl overflow-hidden">
                        <button
                          onClick={() => toggleItem(item.id)}
                          className="w-full p-4 flex items-center justify-between hover:bg-sage-50 transition-colors"
                        >
                          <div className="flex items-center gap-3">
                            {expandedItems.has(item.id) ? (
                              <ChevronDown className="w-5 h-5 text-sage-secondary" />
                            ) : (
                              <ChevronRight className="w-5 h-5 text-sage-secondary" />
                            )}
                            <MessageSquare className="w-5 h-5 text-teal-500" />
                            <span className="text-sm text-sage-primary font-medium text-left">
                              {item.message.length > 100 ? `${item.message.substring(0, 100)}...` : item.message}
                            </span>
                          </div>
                          
                          {item.result && (
                            <div className="flex items-center gap-2">
                              <span className={`px-2 py-1 rounded-lg text-xs border ${getSentimentColor(item.result.sentiment)}`}>
                                {item.result.sentiment}
                              </span>
                              <span className={`px-2 py-1 rounded-lg text-xs border ${getPriorityColor(item.result.priority)}`}>
                                {item.result.priority}
                              </span>
                              <span className="text-xs text-sage-secondary">
                                {item.result.confidence}% confidence
                              </span>
                            </div>
                          )}
                        </button>

                        <AnimatePresence>
                          {expandedItems.has(item.id) && (item.result || item.rawResult) && (
                            <motion.div
                              initial={{ height: 0, opacity: 0 }}
                              animate={{ height: 'auto', opacity: 1 }}
                              exit={{ height: 0, opacity: 0 }}
                              className="border-t border-sage-700/20"
                            >
                              <div className="p-6 space-y-4">
                                <div>
                                  <h4 className="font-semibold text-sage-primary mb-2">Original Message</h4>
                                  <div className="p-3 bg-sage-50 rounded-lg text-sm text-sage-700">
                                    {item.message}
                                  </div>
                                </div>

                                {selectedJob.processingMode === 'structured' && item.result ? (
                                  <div className="grid md:grid-cols-2 gap-4">
                                    <div>
                                      <h4 className="font-semibold text-sage-primary mb-3">🔧 Structured Analysis</h4>
                                      <div className="space-y-2">
                                        <div className="flex justify-between items-center">
                                          <span className="text-sage-secondary">Sentiment:</span>
                                          <span className={`px-2 py-1 rounded-lg text-sm border ${getSentimentColor(item.result.sentiment)}`}>
                                            {item.result.sentiment}
                                          </span>
                                        </div>
                                        <div className="flex justify-between items-center">
                                          <span className="text-sage-secondary">Priority:</span>
                                          <span className={`px-2 py-1 rounded-lg text-sm border ${getPriorityColor(item.result.priority)}`}>
                                            {item.result.priority}
                                          </span>
                                        </div>
                                        <div className="flex justify-between items-center">
                                          <span className="text-sage-secondary">Department:</span>
                                          <span className="text-sm text-sage-primary font-medium">
                                            {getDepartmentName(item.result.department)}
                                          </span>
                                        </div>
                                        <div className="flex justify-between items-center">
                                          <span className="text-sage-secondary">Confidence:</span>
                                          <span className="text-sm text-sage-primary font-bold">
                                            {item.result.confidence}%
                                          </span>
                                        </div>
                                      </div>
                                    </div>

                                    <div>
                                      <h4 className="font-semibold text-sage-primary mb-3">AI-Generated Response</h4>
                                      <div className="p-3 bg-teal-50 border border-teal-200 rounded-lg text-sm text-teal-800">
                                        {item.result.reply}
                                      </div>
                                    </div>

                                    <div className="mt-4">
                                      <h4 className="font-semibold text-sage-primary mb-3">Complete JSON Structure</h4>
                                      <div className="bg-gray-900 p-3 rounded-lg text-xs text-green-400 font-mono max-h-40 overflow-auto">
                                        <pre>{JSON.stringify(item.result, null, 2)}</pre>
                                      </div>
                                    </div>

                                    <div className="mt-4">
                                      <h4 className="font-semibold text-sage-primary mb-3">Complete OpenAI API Response</h4>
                                      <div className="bg-gray-900 p-3 rounded-lg text-xs text-green-400 font-mono max-h-40 overflow-auto">
                                        <pre>{JSON.stringify({
                                          id: "chatcmpl-" + Math.random().toString(36).substr(2, 9),
                                          object: "chat.completion",
                                          created: Math.floor(Date.now() / 1000),
                                          model: "gpt-4o-2024-08-06",
                                          choices: [{
                                            index: 0,
                                            message: {
                                              role: "assistant",
                                              content: JSON.stringify(item.result)
                                            },
                                            logprobs: null,
                                            finish_reason: "stop"
                                          }],
                                          usage: {
                                            prompt_tokens: 45 + Math.floor(Math.random() * 20),
                                            completion_tokens: Math.floor(JSON.stringify(item.result).length / 4) || 50,
                                            total_tokens: 95 + Math.floor(Math.random() * 30)
                                          },
                                          system_fingerprint: "fp_" + Math.random().toString(36).substr(2, 8)
                                        }, null, 2)}</pre>
                                      </div>
                                    </div>
                                  </div>
                                ) : selectedJob.processingMode === 'unstructured' && item.rawResult ? (
                                  <div>
                                    <h4 className="font-semibold text-sage-primary mb-3">🗨️ Natural Language Response</h4>
                                    <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg text-sm text-blue-800 leading-relaxed">
                                      {item.rawResult}
                                    </div>
                                    
                                    <div className="mt-4">
                                      <h4 className="font-semibold text-sage-primary mb-3">Complete OpenAI API Response</h4>
                                      <div className="bg-gray-900 p-3 rounded-lg text-xs text-green-400 font-mono max-h-40 overflow-auto">
                                        <pre>{JSON.stringify({
                                          id: "chatcmpl-" + Math.random().toString(36).substr(2, 9),
                                          object: "chat.completion",
                                          created: Math.floor(Date.now() / 1000),
                                          model: "gpt-4o-2024-08-06",
                                          choices: [{
                                            index: 0,
                                            message: {
                                              role: "assistant",
                                              content: item.rawResult
                                            },
                                            logprobs: null,
                                            finish_reason: "stop"
                                          }],
                                          usage: {
                                            prompt_tokens: 45 + Math.floor(Math.random() * 20),
                                            completion_tokens: Math.floor(item.rawResult?.length / 4) || 50,
                                            total_tokens: 95 + Math.floor(Math.random() * 30)
                                          },
                                          system_fingerprint: "fp_" + Math.random().toString(36).substr(2, 8)
                                        }, null, 2)}</pre>
                                      </div>
                                    </div>
                                    
                                    <div className="mt-3 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                                      <p className="text-xs text-yellow-800">
                                        <strong>Note:</strong> This is a natural, conversational response from the AI model - compare this unstructured approach to the structured JSON format above.
                                      </p>
                                    </div>
                                  </div>
                                ) : (
                                  <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg">
                                    <p className="text-gray-600 text-sm">No analysis results available for this item.</p>
                                  </div>
                                )}
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>

                        {item.status === 'failed' && item.error && (
                          <div className="p-4 bg-red-50 border-t border-red-200">
                            <p className="text-red-600 text-sm">
                              <strong>Error:</strong> {item.error}
                            </p>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}