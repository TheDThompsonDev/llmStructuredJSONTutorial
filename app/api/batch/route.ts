import { NextRequest, NextResponse } from 'next/server';
import { openai, MODEL } from '../../../src/lib/openai';
import { SupportZod } from '../../../src/lib/schemas';

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
  type: string;
  status: 'pending' | 'running' | 'completed' | 'failed';
  progress: number;
  totalItems: number;
  processedItems: number;
  successfulItems: number;
  failedItems: number;
  startTime: Date;
  estimatedCompletion: Date | null;
  items: BatchItem[];
  cost: number;
  processingMode: 'structured' | 'unstructured';
}

const batchJobs = new Map<string, BatchJob>();

function parseCSV(content: string): { messages: string[], errors: string[] } {
  const lines = content.split('\n').filter(line => line.trim());
  const messages: string[] = [];
  const errors: string[] = [];
  
  if (lines.length === 0) {
    return { messages, errors: ['CSV file appears to be empty'] };
  }
  
  const firstLine = lines[0].toLowerCase();
  const hasHeader = firstLine.includes('message') || firstLine.includes('text') || firstLine.includes('content');
  const startIndex = hasHeader ? 1 : 0;
  
  
  for (let i = startIndex; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line) continue;
    
    try {
      let message = '';
      
      if (line.includes(',')) {
        const columns = line.split(',').map(col => col.trim());
        message = columns[0];
      } else {
        message = line;
      }
      
      message = message.replace(/^"(.*)"$/, '$1').replace(/""/g, '"');
      
      if (message.length < 5) {
        errors.push(`Line ${i + 1}: Message too short (minimum 5 characters): "${message}"`);
        continue;
      }
      
      if (message.length > 1000) {
        errors.push(`Line ${i + 1}: Message too long (maximum 1000 characters), truncating`);
        message = message.substring(0, 1000);
      }
      
      messages.push(message);
    } catch (error) {
      errors.push(`Line ${i + 1}: Failed to parse line: "${line}"`);
    }
  }
  
  return { messages, errors };
}

async function processMessage(message: string, itemId: string, mode: 'structured' | 'unstructured'): Promise<{ result?: BatchItem['result'], rawResult?: string, processingTime: number }> {
  const startTime = Date.now();
  
  try {
    if (!message || message.trim().length === 0) {
      throw new Error('Empty message provided');
    }
    
    
    if (mode === 'structured') {
      // Structured processing with JSON schema
      const completion = await openai.chat.completions.create({
        model: MODEL,
        messages: [
          {
            role: 'system',
            content: `You are a customer service AI that analyzes customer messages and provides structured responses.
            Analyze the sentiment, priority, department routing, and generate an appropriate response.
            
            Be sure to:
            - Classify sentiment as positive, neutral, or negative
            - Set priority based on urgency (low, medium, high)
            - Route to appropriate department
            - Generate a helpful, professional response
            - Provide a confidence score (0-100)`
          },
          {
            role: 'user',
            content: message.trim()
          }
        ],
        response_format: {
          type: 'json_schema',
          json_schema: {
            name: 'customer_analysis',
            schema: {
              type: 'object',
              properties: {
                sentiment: {
                  type: 'string',
                  enum: ['positive', 'neutral', 'negative'],
                  description: 'Overall sentiment of the message'
                },
                priority: {
                  type: 'string',
                  enum: ['low', 'medium', 'high'],
                  description: 'Priority level based on urgency'
                },
                confidence: {
                  type: 'number',
                  minimum: 0,
                  maximum: 100,
                  description: 'Confidence score in percentage'
                },
                department: {
                  type: 'string',
                  enum: ['customer_support', 'online_ordering', 'product_quality', 'shipping_and_delivery', 'other_off_topic'],
                  description: 'Department to route the message to'
                },
                reply: {
                  type: 'string',
                  description: 'Polite, helpful response to the customer'
                }
              },
              required: ['sentiment', 'priority', 'confidence', 'department', 'reply'],
              additionalProperties: false
            }
          }
        },
        temperature: 0.1,
        max_tokens: 500
      });

      const result = completion.choices[0]?.message?.content;
      if (!result) {
        throw new Error('No response from AI model');
      }

      const parsed = JSON.parse(result);
      const processingTime = Date.now() - startTime;
      
      
      return {
        result: { ...parsed, processingTime },
        processingTime
      };
    } else {
      // Unstructured processing - natural language response
      const completion = await openai.chat.completions.create({
        model: MODEL,
        messages: [
          {
            role: 'system',
            content: `You are a customer service AI assistant. Analyze the customer message and provide a natural, conversational response that addresses their concern.

Write your response as if you're speaking directly to the customer. Include:
1. An acknowledgment of their sentiment/concern
2. What department would best handle their request
3. How urgent their issue seems
4. A helpful response to their specific question or concern

Write in a warm, professional, conversational tone. Do NOT use JSON format - respond naturally as a human customer service representative would.`
          },
          {
            role: 'user',
            content: message.trim()
          }
        ],
        temperature: 0.3,
        max_tokens: 500
      });

      const result = completion.choices[0]?.message?.content;
      if (!result) {
        throw new Error('No response from AI model');
      }

      const processingTime = Date.now() - startTime;
      
      return {
        rawResult: result,
        processingTime
      };
    }
  } catch (error) {
    console.error(`Error processing item ${itemId}:`, error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown processing error';
    throw new Error(`AI processing failed: ${errorMessage}`);
  }
}

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;
    const jobName = formData.get('jobName') as string || 'Batch Processing Job';
    const jobType = formData.get('jobType') as string || 'sentiment-analysis';
    const processingMode = (formData.get('processingMode') as string || 'structured') as 'structured' | 'unstructured';

    if (!file) {
      return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
    }

    if (!file.name.endsWith('.csv')) {
      return NextResponse.json({ error: 'Please upload a CSV file' }, { status: 400 });
    }

    const content = await file.text();
    const { messages, errors } = parseCSV(content);

    if (messages.length === 0) {
      return NextResponse.json({ 
        error: 'No valid messages found in CSV file',
        details: errors.length > 0 ? errors : ['CSV appears to be empty or formatted incorrectly'],
        expectedFormat: 'Each line should contain a customer message. Optionally include a header row with "message" or "text".'
      }, { status: 400 });
    }

    if (errors.length > 0) {
      console.warn(`CSV parsing warnings:`, errors);
    }

    const sampleMessages = messages.slice(0, 3);
    console.log('Sample messages to be processed:', sampleMessages);

    const jobId = `batch_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const items: BatchItem[] = messages.map((message, index) => ({
      id: `item_${index}`,
      message,
      status: 'pending'
    }));

    const batchJob: BatchJob = {
      id: jobId,
      name: jobName,
      type: jobType,
      status: 'pending',
      progress: 0,
      totalItems: items.length,
      processedItems: 0,
      successfulItems: 0,
      failedItems: 0,
      startTime: new Date(),
      estimatedCompletion: new Date(Date.now() + items.length * 3000),
      items,
      cost: 0,
      processingMode
    };

    batchJobs.set(jobId, batchJob);

    processJobInBackground(jobId);

    return NextResponse.json({
      success: true,
      jobId,
      message: `Created batch job with ${items.length} items (${processingMode} mode)`,
      warnings: errors.length > 0 ? errors : undefined,
      sampleMessages: messages.slice(0, 3),
      processingMode
    });

  } catch (error) {
    console.error('Batch processing error:', error);
    return NextResponse.json({ 
      error: 'Failed to process batch job',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const jobId = searchParams.get('jobId');

  if (jobId) {
    const job = batchJobs.get(jobId);
    if (!job) {
      return NextResponse.json({ error: 'Job not found' }, { status: 404 });
    }
    return NextResponse.json(job);
  } else {
    const allJobs = Array.from(batchJobs.values())
      .sort((a, b) => b.startTime.getTime() - a.startTime.getTime());
    return NextResponse.json(allJobs);
  }
}

async function processJobInBackground(jobId: string) {
  const job = batchJobs.get(jobId);
  if (!job) return;

  job.status = 'running';
  batchJobs.set(jobId, job);
  

  const costPerMessage = 0.02;
  
  for (let i = 0; i < job.items.length; i++) {
    const item = job.items[i];
    item.status = 'processing';
    
    try {
      const result = await processMessage(item.message, item.id, job.processingMode);
      
      if (job.processingMode === 'structured') {
        item.result = result.result;
      } else {
        item.rawResult = result.rawResult;
      }
      
      item.status = 'completed';
      item.processingTime = result.processingTime;
      job.successfulItems++;
      job.cost += costPerMessage;
      
    } catch (error) {
      console.error(`Failed to process item ${item.id}:`, error);
      item.status = 'failed';
      item.error = error instanceof Error ? error.message : 'Processing failed';
      job.failedItems++;
    }

    job.processedItems++;
    job.progress = (job.processedItems / job.totalItems) * 100;

    const remainingItems = job.totalItems - job.processedItems;
    const avgTimePerItem = (Date.now() - job.startTime.getTime()) / job.processedItems;
    job.estimatedCompletion = remainingItems > 0
      ? new Date(Date.now() + remainingItems * avgTimePerItem)
      : null;

    batchJobs.set(jobId, { ...job });

    await new Promise(resolve => setTimeout(resolve, 100));
  }

  job.status = 'completed';
  job.estimatedCompletion = null;
  batchJobs.set(jobId, { ...job });
  
}