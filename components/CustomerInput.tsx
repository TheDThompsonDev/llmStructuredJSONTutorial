'use client';

import { useState } from 'react';
import { Send, MessageCircle, Sparkles } from 'lucide-react';

interface CustomerInputProps {
  onSubmit: (message: string, method: 'response_format' | 'tool_call' | 'compare') => void;
  isProcessing: boolean;
}

const EXAMPLE_MESSAGES = [
  "My order hasn't arrived yet and it's been 2 weeks!",
  "The product I received was damaged. Need a replacement.",
  "Great service! The delivery was super fast this time.",
  "I can't figure out how to place an order on your website",
  "The quality of this product is terrible, very disappointed",
  "Where can I track my shipping status?",
  "Thank you so much for the excellent customer support!",
  "This is completely off-topic, but do you sell cars?"
];

export default function CustomerInput({ onSubmit, isProcessing }: CustomerInputProps) {
  const [message, setMessage] = useState('');
  const [selectedMethod, setSelectedMethod] = useState<'response_format' | 'tool_call' | 'compare'>('response_format');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim() && !isProcessing) {
      onSubmit(message.trim(), selectedMethod);
      setMessage('');
    }
  };

  const useExample = (example: string) => {
    setMessage(example);
  };

  return (
    <div className="w-full max-w-2xl mx-auto">
      <div className="glass-effect rounded-2xl p-6 space-y-6">
        <div className="text-center space-y-2">
          <div className="flex items-center justify-center gap-2 text-2xl font-bold gradient-text">
            <MessageCircle className="w-8 h-8 text-blue-600" />
            Customer Message
          </div>
          <p className="text-gray-600">
            Enter a customer service message to see AI-powered routing and response generation
          </p>
        </div>

        <div className="space-y-3">
          <label className="block text-sm font-semibold text-gray-700">
            Processing Method
          </label>
          <div className="grid grid-cols-3 gap-3">
            <button
              type="button"
              onClick={() => setSelectedMethod('response_format')}
              className={`p-3 rounded-lg border-2 transition-all text-left ${
                selectedMethod === 'response_format'
                  ? 'border-blue-500 bg-blue-50 text-blue-900'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <div className="font-semibold">Response Format</div>
              <div className="text-xs text-gray-500">JSON Schema structured output</div>
            </button>
            <button
              type="button"
              onClick={() => setSelectedMethod('tool_call')}
              className={`p-3 rounded-lg border-2 transition-all text-left ${
                selectedMethod === 'tool_call'
                  ? 'border-blue-500 bg-blue-50 text-blue-900'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <div className="font-semibold">Tool Calling</div>
              <div className="text-xs text-gray-500">Function-based structured output</div>
            </button>
            <button
              type="button"
              onClick={() => setSelectedMethod('compare')}
              className={`p-3 rounded-lg border-2 transition-all text-left ${
                selectedMethod === 'compare'
                  ? 'border-purple-500 bg-purple-50 text-purple-900'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <div className="font-semibold">Compare Both</div>
              <div className="text-xs text-gray-500">Side-by-side performance test</div>
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <label className="block text-sm font-semibold text-gray-700">
              Customer Message
            </label>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Enter customer message here..."
              className="w-full p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
              rows={4}
              disabled={isProcessing}
            />
          </div>
          
          <button
            type="submit"
            disabled={!message.trim() || isProcessing}
            className="w-full py-3 px-6 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-lg hover:from-blue-700 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center justify-center gap-2"
          >
            {isProcessing ? (
              <>
                <Sparkles className="w-5 h-5 animate-spin" />
                Processing...
              </>
            ) : (
              <>
                <Send className="w-5 h-5" />
                Process Message
              </>
            )}
          </button>
        </form>

        <div className="space-y-3">
          <label className="block text-sm font-semibold text-gray-700">
            Or try these examples:
          </label>
          <div className="grid grid-cols-1 gap-2 max-h-48 overflow-y-auto">
            {EXAMPLE_MESSAGES.map((example, index) => (
              <button
                key={index}
                onClick={() => useExample(example)}
                disabled={isProcessing}
                className="text-left p-3 text-sm bg-gray-50 hover:bg-gray-100 rounded-lg border border-gray-200 hover:border-gray-300 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                "{example}"
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}