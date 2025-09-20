'use client';

export interface ROIMetrics {
  messagesProcessed: number;
  timesSavedHours: number;
  employeeSatisfaction: number;
  accuracyImprovement: number;
  costSavings: number;
  negativeInteractionsBlocked: number;
  averageResponseTime: number;
  departmentRoutingAccuracy: number;
}

export interface ProcessingPhase {
  name: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  color: string;
  progress: number;
}