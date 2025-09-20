'use client';

export const PROCESSING_PHASES = [
  {
    name: 'Input Analysis',
    description: 'Parsing customer message and extracting key information',
    progress: 25
  },
  {
    name: 'AI Processing',
    description: 'Large Language Model analyzes sentiment and intent',
    progress: 50
  },
  {
    name: 'Data Structuring',
    description: 'Converting unstructured text into organized JSON format',
    progress: 75
  },
  {
    name: 'Validation',
    description: 'Schema validation ensures data integrity and consistency',
    progress: 100
  }
];

export const EXAMPLE_MESSAGES = [
  "My order hasn't arrived yet and it's been 2 weeks!",
  "The product I received was damaged. Need a replacement.",
  "Great service! The delivery was super fast this time.",
  "I can't figure out how to place an order on your website",
  "The quality of this product is terrible, very disappointed",
  "Where can I track my shipping status?",
  "Thank you so much for the excellent customer support!",
  "This is completely off-topic, but do you sell cars?"
];

export const PROCESSING_STATUSES = {
  IDLE: 'idle',
  PARSING: 'parsing',
  ANALYZING: 'analyzing',
  STRUCTURING: 'structuring',
  VALIDATING: 'validating',
  COMPLETE: 'complete',
  ERROR: 'error'
} as const;