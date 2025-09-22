'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { AlertCircle, RefreshCw, Copy, CheckCircle } from 'lucide-react';

interface EnhancedErrorDisplayProps {
  error: string;
  onRetry?: () => void;
  onDismiss: () => void;
  retryable?: boolean;
  isRetrying?: boolean;
  attemptCount?: number;
}

export default function EnhancedErrorDisplay({
  error,
  onRetry,
  onDismiss,
  retryable = true,
  isRetrying = false,
  attemptCount = 1
}: EnhancedErrorDisplayProps) {
  const [copied, setCopied] = useState(false);

  const handleCopyError = async () => {
    try {
      await navigator.clipboard.writeText(error);
      setCopied(true);
      setCopied(false);
    } catch (err) {
      console.error('Failed to copy error:', err);
    }
  };

  const getErrorType = (error: string) => {
    if (error.toLowerCase().includes('network')) return 'Network Error';
    if (error.toLowerCase().includes('timeout')) return 'Timeout Error';
    if (error.toLowerCase().includes('rate limit')) return 'Rate Limit Error';
    if (error.toLowerCase().includes('validation')) return 'Validation Error';
    if (error.toLowerCase().includes('api key')) return 'Authentication Error';
    return 'Processing Error';
  };

  const getErrorIcon = (errorType: string) => {
    switch (errorType) {
      case 'Network Error':
        return '🌐';
      case 'Timeout Error':
        return '⏰';
      case 'Rate Limit Error':
        return '🚫';
      case 'Validation Error':
        return '⚠️';
      case 'Authentication Error':
        return '🔒';
      default:
        return '❌';
    }
  };

  const getRetryDelay = (attempt: number) => {
    return Math.min(1000 * Math.pow(2, attempt - 1), 30000);
  };

  const errorType = getErrorType(error);
  const errorIcon = getErrorIcon(errorType);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -20, scale: 0.95 }}
      className="max-w-2xl mx-auto"
    >
      <div className="glass-effect rounded-2xl p-6 border border-red-200 bg-gradient-to-r from-red-50 to-orange-50">
        <div className="space-y-4">
          <div className="flex items-start gap-3">
            <div className="text-2xl">{errorIcon}</div>
            <div className="flex-1">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-red-800">{errorType}</h3>
                {attemptCount > 1 && (
                  <span className="text-xs bg-red-100 text-red-600 px-2 py-1 rounded-full">
                    Attempt {attemptCount}
                  </span>
                )}
              </div>
              
              <div className="mt-2 bg-red-100 rounded-lg p-3 border border-red-200">
                <p className="text-red-700 text-sm font-mono">{error}</p>
              </div>
            </div>
          </div>

          <div className="bg-white bg-opacity-50 rounded-lg p-4">
            <h4 className="font-semibold text-gray-800 mb-2">Possible Solutions:</h4>
            <ul className="text-sm text-gray-700 space-y-1">
              {errorType === 'Network Error' && (
                <>
                  <li>• Check your internet connection</li>
                  <li>• Verify the OpenAI API is accessible</li>
                  <li>• Try again in a moment</li>
                </>
              )}
              {errorType === 'Rate Limit Error' && (
                <>
                  <li>• Wait a moment before retrying</li>
                  <li>• Check your OpenAI API usage limits</li>
                  <li>• Consider upgrading your API plan</li>
                </>
              )}
              {errorType === 'Authentication Error' && (
                <>
                  <li>• Verify your OpenAI API key is correct</li>
                  <li>• Check if your API key has expired</li>
                  <li>• Ensure the API key has proper permissions</li>
                </>
              )}
              {errorType === 'Validation Error' && (
                <>
                  <li>• The AI response didn't match expected format</li>
                  <li>• This usually resolves with a retry</li>
                  <li>• Try with a different message</li>
                </>
              )}
              {errorType === 'Timeout Error' && (
                <>
                  <li>• The request took too long to process</li>
                  <li>• Try with a shorter message</li>
                  <li>• Retry in a moment</li>
                </>
              )}
              {errorType === 'Processing Error' && (
                <>
                  <li>• An unexpected error occurred</li>
                  <li>• Try refreshing the page</li>
                  <li>• Contact support if the issue persists</li>
                </>
              )}
            </ul>
          </div>

          <div className="flex items-center gap-3">
            {retryable && onRetry && (
              <button
                onClick={onRetry}
                disabled={isRetrying}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
              >
                {isRetrying ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    Retrying...
                  </>
                ) : (
                  <>
                    <RefreshCw className="w-4 h-4" />
                    Retry {attemptCount > 1 ? `(${getRetryDelay(attemptCount)}ms delay)` : ''}
                  </>
                )}
              </button>
            )}
            
            <button
              onClick={handleCopyError}
              className="flex items-center gap-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-all"
            >
              {copied ? (
                <>
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  Copied!
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4" />
                  Copy Error
                </>
              )}
            </button>
            
            <button
              onClick={onDismiss}
              className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
            >
              Dismiss
            </button>
          </div>

          {attemptCount > 1 && (
            <div className="text-xs text-gray-600 bg-gray-100 rounded-lg p-3">
              <strong>Retry Strategy:</strong> Using exponential backoff. 
              Next attempt will wait {getRetryDelay(attemptCount)}ms before retrying.
              Maximum retry delay is 30 seconds.
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}