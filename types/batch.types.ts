'use client';

import { StructuredResult } from './api.types';

export interface BatchItem {
  id: string;
  message: string;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  result?: StructuredResult;
  rawResult?: string;
  error?: string;
  processingTime?: number;
}

export interface BatchJob {
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

export interface ProcessingStats {
  totalJobs: number;
  activeJobs: number;
  completedToday: number;
  totalProcessed: number;
  avgProcessingTime: number;
  costSavings: number;
  errorRate: number;
  throughput: number;
}