'use client';

export interface ProcessingState {
  status: 'idle' | 'parsing' | 'analyzing' | 'structuring' | 'validating' | 'complete' | 'error';
  progress: number;
  details: string;
  stage: string;
}

export interface StructuredResult {
  sentiment: 'positive' | 'negative' | 'neutral';
  priority: 'low' | 'medium' | 'high';
  confidence: number;
  department: 'customer_support' | 'online_ordering' | 'product_quality' | 'shipping_and_delivery' | 'other_off_topic';
  reply: string;
}

export interface UnstructuredResult {
  rawOutput: string;
  errors: string[];
}

export interface ProcessingResult {
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

export interface ProcessingStep {
  step: 'analyzing' | 'classifying' | 'generating' | 'validating' | 'routing' | 'complete';
  message: string;
  data?: unknown;
  progress?: number;
  timestamp?: number;
}

export interface PerformanceMetrics {
  method: 'response_format' | 'tool_call';
  processingTime: number;
  tokenUsage?: {
    prompt_tokens: number;
    completion_tokens: number;
    total_tokens: number;
  };
  success: boolean;
  timestamp: number;
}

export interface LLMResult {
  result: StructuredResult;
  processingSteps: ProcessingStep[];
  method: 'response_format' | 'tool_call';
  processingTime: number;
  confidence?: number;
}