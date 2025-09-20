'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Send, Sparkles, MessageCircle, User } from 'lucide-react';

interface StepData {
  message?: string;
  timestamp?: string;
}

interface InputStepProps {
  data?: StepData;
  onComplete: () => void;
  onNext: () => void;
}

export default function InputStep({ data, onComplete, onNext }: InputStepProps) {
  const [message, setMessage] = useState(data?.message || '');
  const [selectedExample, setSelectedExample] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const examples = [
    {
      id: 'billing',
      title: 'Billing Issue',
      message: 'I was charged twice for my subscription last month. Can you help me get a refund?',
      category: 'Financial',
      urgency: 'Medium'
    },
    {
      id: 'technical',
      title: 'Technical Problem',
      message: 'The app keeps crashing when I try to upload files. This is really frustrating!',
      category: 'Technical',
      urgency: 'High'
    },
    {
      id: 'general',
      title: 'General Inquiry',
      message: 'Hi! I\'m interested in upgrading my plan. What options do you have available?',
      category: 'Sales',
      urgency: 'Low'
    },
    {
      id: 'complaint',
      title: 'Service Complaint',
      message: 'I\'ve been waiting for 3 days for support to respond to my ticket. This is unacceptable service!',
      category: 'Escalation',
      urgency: 'High'
    }
  ];

  const handleSubmit = async () => {
    if (!message.trim()) return;
    
    setIsProcessing(true);
    
    // Store the message in the data context
    if (data) {
      data.message = message;
      data.timestamp = new Date().toISOString();
    }
    
    onComplete();
    onNext();
  };

  const selectExample = (example: typeof examples[0]) => {
    setMessage(example.message);
    setSelectedExample(example.id);
  };

  return (
    <div className="max-w-4xl mx-auto">
      {/* Hero Section */}
      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-12"
      >
        <div className="inline-flex items-center gap-3 px-6 py-3 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-full border border-white/20 backdrop-blur-sm mb-6">
          <Sparkles className="w-5 h-5 text-yellow-400" />
          <span className="text-white font-medium">AI-Powered Customer Service Routing</span>
        </div>
        
        <h2 className="text-4xl font-bold text-white mb-4 bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
          Experience Intelligent Message Routing
        </h2>
        <p className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
          Watch as our AI analyzes customer messages in real-time, automatically routing them to the right department with precision and context awareness.
        </p>
      </motion.div>

      {/* Input Section */}
      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-white/5 backdrop-blur-xl rounded-3xl p-8 border border-white/10 shadow-2xl mb-8"
      >
        <div className="flex items-center gap-3 mb-6">
          <div className="p-3 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl">
            <MessageCircle className="w-6 h-6 text-white" />
          </div>
          <div>
            <h3 className="text-xl font-semibold text-white">Customer Message</h3>
            <p className="text-gray-400">Enter a customer service message to analyze</p>
          </div>
        </div>

        <div className="space-y-6">
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Type your customer service message here..."
            className="w-full h-32 bg-white/5 border border-white/20 rounded-2xl p-4 text-white placeholder-gray-400 resize-none focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
          />

          <div className="flex justify-end">
            <motion.button
              onClick={handleSubmit}
              disabled={!message.trim() || isProcessing}
              className="flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-2xl hover:from-blue-700 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg font-medium"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              {isProcessing ? (
                <>
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Processing...
                </>
              ) : (
                <>
                  <Send className="w-5 h-5" />
                  Analyze Message
                </>
              )}
            </motion.button>
          </div>
        </div>
      </motion.div>

      {/* Example Messages */}
      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="mb-8"
      >
        <div className="flex items-center gap-3 mb-6">
          <User className="w-6 h-6 text-purple-400" />
          <h3 className="text-xl font-semibold text-white">Try These Examples</h3>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {examples.map((example, index) => (
            <motion.button
              key={example.id}
              onClick={() => selectExample(example)}
              className={`text-left p-6 rounded-2xl border transition-all ${
                selectedExample === example.id
                  ? 'bg-purple-500/20 border-purple-500/50'
                  : 'bg-white/5 border-white/10 hover:bg-white/10'
              }`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 + index * 0.1 }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-semibold text-white">{example.title}</h4>
                <div className="flex gap-2">
                  <span className={`px-2 py-1 text-xs rounded-full ${
                    example.urgency === 'High' ? 'bg-red-500/20 text-red-400' :
                    example.urgency === 'Medium' ? 'bg-yellow-500/20 text-yellow-400' :
                    'bg-green-500/20 text-green-400'
                  }`}>
                    {example.urgency}
                  </span>
                  <span className="px-2 py-1 text-xs rounded-full bg-blue-500/20 text-blue-400">
                    {example.category}
                  </span>
                </div>
              </div>
              <p className="text-gray-300 text-sm leading-relaxed">{example.message}</p>
            </motion.button>
          ))}
        </div>
      </motion.div>

      {/* Features Preview */}
      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="grid grid-cols-1 md:grid-cols-3 gap-6"
      >
        <div className="bg-gradient-to-br from-blue-500/10 to-purple-500/10 rounded-2xl p-6 border border-white/10">
          <div className="w-12 h-12 bg-blue-500/20 rounded-xl flex items-center justify-center mb-4">
            <Sparkles className="w-6 h-6 text-blue-400" />
          </div>
          <h4 className="text-lg font-semibold text-white mb-2">Real-time Analysis</h4>
          <p className="text-gray-400">Watch AI process and categorize messages instantly with streaming responses.</p>
        </div>

        <div className="bg-gradient-to-br from-purple-500/10 to-pink-500/10 rounded-2xl p-6 border border-white/10">
          <div className="w-12 h-12 bg-purple-500/20 rounded-xl flex items-center justify-center mb-4">
            <MessageCircle className="w-6 h-6 text-purple-400" />
          </div>
          <h4 className="text-lg font-semibold text-white mb-2">Smart Routing</h4>
          <p className="text-gray-400">Automatically route to the most appropriate department with confidence scores.</p>
        </div>

        <div className="bg-gradient-to-br from-pink-500/10 to-red-500/10 rounded-2xl p-6 border border-white/10">
          <div className="w-12 h-12 bg-pink-500/20 rounded-xl flex items-center justify-center mb-4">
            <User className="w-6 h-6 text-pink-400" />
          </div>
          <h4 className="text-lg font-semibold text-white mb-2">Performance Insights</h4>
          <p className="text-gray-400">Compare traditional vs AI routing with detailed metrics and ROI analysis.</p>
        </div>
      </motion.div>
    </div>
  );
}