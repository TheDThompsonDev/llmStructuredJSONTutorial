'use client';

import { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { Upload, Download, Play, Pause, BarChart3, FileText, CheckCircle, AlertCircle, Clock } from 'lucide-react';

interface BatchResult {
  id: string;
  message: string;
  result?: {
    sentiment: 'positive' | 'neutral' | 'negative';
    department: string;
    reply: string;
    confidence?: number;
    priority?: 'low' | 'medium' | 'high';
  };
  processingTime?: number;
  error?: string;
  status: 'pending' | 'processing' | 'completed' | 'failed';
}

interface BatchProcessorProps {
  onBatchComplete?: (results: BatchResult[]) => void;
}

const SAMPLE_MESSAGES = [
  "My order hasn't arrived yet and it's been 2 weeks!",
  "The product I received was damaged. Need a replacement.",
  "Great service! The delivery was super fast this time.",
  "I can't figure out how to place an order on your website",
  "The quality of this product is terrible, very disappointed",
  "Where can I track my shipping status?",
  "Thank you so much for the excellent customer support!",
  "This is completely off-topic, but do you sell cars?",
  "I need to change my delivery address urgently",
  "The discount code isn't working at checkout"
];

export default function BatchProcessor({ onBatchComplete }: BatchProcessorProps) {
  const [batchData, setBatchData] = useState<BatchResult[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [processingSpeed, setProcessingSpeed] = useState<'normal' | 'fast' | 'demo'>('demo');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && file.type === 'text/csv') {
      setUploadedFile(file);
      // Parse CSV (simplified - in real app would use proper CSV parser)
      const reader = new FileReader();
      reader.onload = (e) => {
        const text = e.target?.result as string;
        const lines = text.split('\n').filter(line => line.trim());
        const messages = lines.slice(1); // Skip header
        
        const batch: BatchResult[] = messages.map((message, index) => ({
          id: `batch-${index + 1}`,
          message: message.replace(/[",]/g, ''), // Simple cleanup
          status: 'pending' as const
        }));
        
        setBatchData(batch);
      };
      reader.readAsText(file);
    }
  };

  const loadSampleData = () => {
    const batch: BatchResult[] = SAMPLE_MESSAGES.map((message, index) => ({
      id: `sample-${index + 1}`,
      message,
      status: 'pending' as const
    }));
    setBatchData(batch);
    setUploadedFile(null);
  };

  const processBatch = async () => {
    if (batchData.length === 0) return;
    
    setIsProcessing(true);
    setIsPaused(false);
    
    const delay = 0; // Remove artificial delays
    
    for (let i = currentIndex; i < batchData.length; i++) {
      if (isPaused) break;
      
      setCurrentIndex(i);
      
      // Update status to processing
      setBatchData(prev => prev.map((item, index) => 
        index === i ? { ...item, status: 'processing' as const } : item
      ));
      
      try {
        // Process immediately without delay
        
        if (isPaused) break;
        
        // Mock result generation
        const mockResult = generateMockResult(batchData[i].message);
        
        setBatchData(prev => prev.map((item, index) => 
          index === i ? { 
            ...item, 
            result: mockResult.result, 
            processingTime: mockResult.processingTime,
            status: 'completed' as const 
          } : item
        ));
        
      } catch (error) {
        setBatchData(prev => prev.map((item, index) => 
          index === i ? { 
            ...item, 
            error: 'Processing failed', 
            status: 'failed' as const 
          } : item
        ));
      }
    }
    
    if (currentIndex >= batchData.length - 1) {
      setIsProcessing(false);
      onBatchComplete?.(batchData);
    }
  };

  const generateMockResult = (message: string) => {
    const sentiments: Array<'positive' | 'neutral' | 'negative'> = ['positive', 'neutral', 'negative'];
    const departments = ['customer_support', 'online_ordering', 'product_quality', 'shipping_and_delivery', 'other_off_topic'];
    const priorities: Array<'low' | 'medium' | 'high'> = ['low', 'medium', 'high'];
    
    // Smart classification based on keywords
    let sentiment: 'positive' | 'neutral' | 'negative' = 'neutral';
    let department = 'customer_support';
    
    if (message.toLowerCase().includes('great') || message.toLowerCase().includes('thank')) {
      sentiment = 'positive';
    } else if (message.toLowerCase().includes('terrible') || message.toLowerCase().includes('damaged') || message.toLowerCase().includes('disappointed')) {
      sentiment = 'negative';
    }
    
    if (message.toLowerCase().includes('order') || message.toLowerCase().includes('checkout')) {
      department = 'online_ordering';
    } else if (message.toLowerCase().includes('damaged') || message.toLowerCase().includes('quality')) {
      department = 'product_quality';
    } else if (message.toLowerCase().includes('delivery') || message.toLowerCase().includes('shipping') || message.toLowerCase().includes('track')) {
      department = 'shipping_and_delivery';
    } else if (message.toLowerCase().includes('off-topic') || message.toLowerCase().includes('cars')) {
      department = 'other_off_topic';
    }
    
    return {
      result: {
        sentiment,
        department,
        reply: `Thank you for your message. We'll address your ${sentiment === 'negative' ? 'concern' : 'inquiry'} promptly.`,
        confidence: Math.random() * 0.3 + 0.7, // 70-100%
        priority: priorities[Math.floor(Math.random() * priorities.length)]
      },
      processingTime: Math.floor(Math.random() * 2000) + 500 // 500-2500ms
    };
  };

  const pauseProcessing = () => {
    setIsPaused(true);
    setIsProcessing(false);
  };

  const resumeProcessing = () => {
    setIsPaused(false);
    processBatch();
  };

  const resetBatch = () => {
    setIsProcessing(false);
    setIsPaused(false);
    setCurrentIndex(0);
    setBatchData(prev => prev.map(item => ({ ...item, status: 'pending' as const, result: undefined, error: undefined })));
  };

  const downloadResults = () => {
    const csvContent = [
      'ID,Message,Sentiment,Department,Reply,Confidence,Priority,Processing Time,Status',
      ...batchData.map(item => [
        item.id,
        `"${item.message}"`,
        item.result?.sentiment || '',
        item.result?.department || '',
        `"${item.result?.reply || ''}"`,
        item.result?.confidence ? Math.round(item.result.confidence * 100) + '%' : '',
        item.result?.priority || '',
        item.processingTime ? item.processingTime + 'ms' : '',
        item.status
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'batch_results.csv';
    a.click();
    URL.revokeObjectURL(url);
  };

  const completedCount = batchData.filter(item => item.status === 'completed').length;
  const failedCount = batchData.filter(item => item.status === 'failed').length;
  const progressPercent = batchData.length > 0 ? (completedCount / batchData.length) * 100 : 0;

  return (
    <div className="w-full max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div className="glass-effect rounded-2xl p-6">
        <div className="text-center space-y-4">
          <h3 className="text-2xl font-bold gradient-text flex items-center justify-center gap-2">
            <BarChart3 className="w-8 h-8 text-purple-600" />
            Batch Processing Demo
          </h3>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Process multiple customer messages in bulk to demonstrate scalability and performance. 
            Upload a CSV file or use sample data to test batch processing capabilities.
          </p>
        </div>
      </div>

      {/* Controls */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Upload Section */}
        <div className="glass-effect rounded-2xl p-6">
          <h4 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
            <Upload className="w-6 h-6 text-blue-600" />
            Data Input
          </h4>
          
          <div className="space-y-4">
            <div>
              <input
                ref={fileInputRef}
                type="file"
                accept=".csv"
                onChange={handleFileUpload}
                className="hidden"
              />
              <button
                onClick={() => fileInputRef.current?.click()}
                className="w-full p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-colors text-center"
              >
                <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                <div className="text-sm text-gray-600">
                  Upload CSV file or drop here
                </div>
              </button>
            </div>
            
            <div className="text-center">
              <span className="text-sm text-gray-500">or</span>
            </div>
            
            <button
              onClick={loadSampleData}
              className="w-full py-3 px-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all"
            >
              Load Sample Data ({SAMPLE_MESSAGES.length} messages)
            </button>
            
            {uploadedFile && (
              <div className="text-sm text-green-600 bg-green-50 p-2 rounded">
                ✓ Loaded: {uploadedFile.name}
              </div>
            )}
          </div>
        </div>

        {/* Processing Controls */}
        <div className="glass-effect rounded-2xl p-6">
          <h4 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
            <Play className="w-6 h-6 text-green-600" />
            Processing Control
          </h4>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Processing Speed
              </label>
              <select
                value={processingSpeed}
                onChange={(e) => setProcessingSpeed(e.target.value as any)}
                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="demo">Demo (800ms/message)</option>
                <option value="fast">Fast (100ms/message)</option>
                <option value="normal">Normal (2s/message)</option>
              </select>
            </div>
            
            <div className="flex gap-2">
              {!isProcessing && !isPaused ? (
                <button
                  onClick={processBatch}
                  disabled={batchData.length === 0}
                  className="flex-1 py-2 px-4 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  <Play className="w-4 h-4" />
                  Start
                </button>
              ) : isProcessing ? (
                <button
                  onClick={pauseProcessing}
                  className="flex-1 py-2 px-4 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 flex items-center justify-center gap-2"
                >
                  <Pause className="w-4 h-4" />
                  Pause
                </button>
              ) : (
                <button
                  onClick={resumeProcessing}
                  className="flex-1 py-2 px-4 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center justify-center gap-2"
                >
                  <Play className="w-4 h-4" />
                  Resume
                </button>
              )}
              
              <button
                onClick={resetBatch}
                className="py-2 px-4 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
              >
                Reset
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Progress Overview */}
      {batchData.length > 0 && (
        <div className="glass-effect rounded-2xl p-6">
          <div className="flex items-center justify-between mb-4">
            <h4 className="text-lg font-semibold text-gray-800">Processing Progress</h4>
            <div className="text-sm text-gray-600">
              {completedCount + failedCount} / {batchData.length} processed
            </div>
          </div>
          
          <div className="space-y-4">
            {/* Progress Bar */}
            <div className="w-full bg-gray-200 rounded-full h-3">
              <motion.div
                className="bg-gradient-to-r from-green-500 to-blue-500 h-3 rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${progressPercent}%` }}
                transition={{ duration: 0.3 }}
              />
            </div>
            
            {/* Statistics */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-gray-800">{batchData.length}</div>
                <div className="text-sm text-gray-600">Total</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">{completedCount}</div>
                <div className="text-sm text-gray-600">Completed</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-red-600">{failedCount}</div>
                <div className="text-sm text-gray-600">Failed</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">{Math.round(progressPercent)}%</div>
                <div className="text-sm text-gray-600">Progress</div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Results Table */}
      {batchData.length > 0 && (
        <div className="glass-effect rounded-2xl p-6">
          <div className="flex items-center justify-between mb-4">
            <h4 className="text-lg font-semibold text-gray-800">Batch Results</h4>
            {completedCount > 0 && (
              <button
                onClick={downloadResults}
                className="flex items-center gap-2 py-2 px-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                <Download className="w-4 h-4" />
                Download CSV
              </button>
            )}
          </div>
          
          <div className="max-h-96 overflow-y-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 sticky top-0">
                <tr>
                  <th className="text-left p-3 font-semibold">Status</th>
                  <th className="text-left p-3 font-semibold">Message</th>
                  <th className="text-left p-3 font-semibold">Department</th>
                  <th className="text-left p-3 font-semibold">Sentiment</th>
                  <th className="text-left p-3 font-semibold">Time</th>
                </tr>
              </thead>
              <tbody>
                {batchData.map((item, index) => (
                  <tr key={item.id} className={`border-t ${index === currentIndex && isProcessing ? 'bg-blue-50' : ''}`}>
                    <td className="p-3">
                      {item.status === 'completed' && <CheckCircle className="w-5 h-5 text-green-600" />}
                      {item.status === 'processing' && <Clock className="w-5 h-5 text-blue-600 animate-spin" />}
                      {item.status === 'failed' && <AlertCircle className="w-5 h-5 text-red-600" />}
                      {item.status === 'pending' && <Clock className="w-5 h-5 text-gray-400" />}
                    </td>
                    <td className="p-3 max-w-xs truncate">{item.message}</td>
                    <td className="p-3">{item.result?.department?.replace('_', ' ') || '-'}</td>
                    <td className="p-3">
                      {item.result?.sentiment && (
                        <span className={`px-2 py-1 rounded-full text-xs ${
                          item.result.sentiment === 'positive' ? 'bg-green-100 text-green-800' :
                          item.result.sentiment === 'negative' ? 'bg-red-100 text-red-800' :
                          'bg-yellow-100 text-yellow-800'
                        }`}>
                          {item.result.sentiment}
                        </span>
                      )}
                    </td>
                    <td className="p-3">{item.processingTime ? `${item.processingTime}ms` : '-'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}