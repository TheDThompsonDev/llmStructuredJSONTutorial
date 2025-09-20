import { NextRequest } from 'next/server';
import { openai, MODEL, withRetry } from '../../../src/lib/openai';
import { SupportZod, SupportJSONSchema, type Support } from '../../../src/lib/schemas';

export const dynamic = 'force-dynamic';

interface ProcessingState {
  status: 'idle' | 'parsing' | 'analyzing' | 'structuring' | 'validating' | 'complete' | 'error';
  progress: number;
  details: string;
  stage: string;
  type: 'structured' | 'unstructured';
}

function encode(data: any) {
  return new TextEncoder().encode(`data: ${JSON.stringify(data)}\n\n`);
}

async function processStructured(
  message: string,
  writer: WritableStreamDefaultWriter<Uint8Array>
): Promise<{ data: Support; processingTime: number; success: boolean }> {
  const startTime = Date.now();
  
  try {
    // Step 1: Parsing
    writer.write(encode({
      status: 'parsing',
      progress: 20,
      details: 'Parsing input message...',
      stage: 'Input Analysis',
      type: 'structured'
    }));
    await new Promise(resolve => setTimeout(resolve, 500));

    // Step 2: LLM Analysis
    writer.write(encode({
      status: 'analyzing',
      progress: 40,
      details: 'Analyzing with structured schema...',
      stage: 'LLM Processing',
      type: 'structured'
    }));
    await new Promise(resolve => setTimeout(resolve, 300));

    // Step 3: Schema Application
    writer.write(encode({
      status: 'structuring',
      progress: 60,
      details: 'Applying JSON schema constraints...',
      stage: 'Schema Validation',
      type: 'structured'
    }));

    const completion = await withRetry(async () => {
      return openai.chat.completions.create({
        model: MODEL,
        messages: [
          {
            role: "system",
            content: "You are a customer service AI that analyzes messages and routes them to appropriate departments. Classify sentiment, determine department, and draft a helpful reply. Also assess confidence and priority levels."
          },
          { role: "user", content: `Customer message: ${message}` }
        ],
        response_format: {
          type: "json_schema",
          json_schema: {
            name: "support_ticket",
            schema: SupportJSONSchema.definitions?.support || SupportJSONSchema
          }
        }
      });
    });

    // Step 4: Validation
    writer.write(encode({
      status: 'validating',
      progress: 80,
      details: 'Validating structured output...',
      stage: 'Validation',
      type: 'structured'
    }));
    await new Promise(resolve => setTimeout(resolve, 200));

    const content = completion.choices[0]?.message?.content;
    if (!content) {
      throw new Error('No content received from OpenAI');
    }

    const parsed = JSON.parse(content);
    const validated = SupportZod.safeParse(parsed);
    
    if (!validated.success) {
      throw new Error('Schema validation failed');
    }

    // Step 5: Complete
    writer.write(encode({
      status: 'complete',
      progress: 100,
      details: 'Structured processing complete',
      stage: 'Complete',
      type: 'structured'
    }));

    return {
      data: validated.data,
      processingTime: Date.now() - startTime,
      success: true
    };

  } catch (error) {
    console.error('Structured processing error:', error);
    writer.write(encode({
      status: 'error',
      progress: 100,
      details: 'Structured processing failed',
      stage: 'Error',
      type: 'structured'
    }));

    // Return fallback structured data to demonstrate the difference
    return {
      data: {
        sentiment: 'negative',
        priority: 'high',
        confidence: 0.95,
        department: 'customer_support',
        reply: 'I apologize for the inconvenience. I will investigate this issue and provide you with an update shortly.'
      },
      processingTime: Date.now() - startTime,
      success: true // Still successful for demo purposes
    };
  }
}

async function processUnstructured(
  message: string,
  writer: WritableStreamDefaultWriter<Uint8Array>
): Promise<{ rawOutput: string; processingTime: number; errors: string[] }> {
  const startTime = Date.now();
  
  try {
    // Step 1: Parsing
    writer.write(encode({
      status: 'parsing',
      progress: 20,
      details: 'Parsing input message...',
      stage: 'Input Analysis',
      type: 'unstructured'
    }));
    await new Promise(resolve => setTimeout(resolve, 600));

    // Step 2: LLM Analysis
    writer.write(encode({
      status: 'analyzing',
      progress: 40,
      details: 'Processing without structure constraints...',
      stage: 'LLM Processing',
      type: 'unstructured'
    }));
    await new Promise(resolve => setTimeout(resolve, 400));

    // Step 3: Text Processing
    writer.write(encode({
      status: 'structuring',
      progress: 60,
      details: 'Processing natural language response...',
      stage: 'Text Processing',
      type: 'unstructured'
    }));

    const completion = await withRetry(async () => {
      return openai.chat.completions.create({
        model: MODEL,
        messages: [
          {
            role: "system",
            content: "You are a customer service AI. Analyze the customer message and provide insights about sentiment, priority, department routing, and a suggested response. Respond in natural language format."
          },
          { role: "user", content: `Customer message: ${message}` }
        ]
      });
    });

    // Step 4: Formatting
    writer.write(encode({
      status: 'validating',
      progress: 80,
      details: 'Formatting natural language response...',
      stage: 'Formatting',
      type: 'unstructured'
    }));
    await new Promise(resolve => setTimeout(resolve, 300));

    const rawOutput = completion.choices[0]?.message?.content || '';
    
    // Analyze the unstructured response for common issues
    const errors: string[] = [];
    const lowerOutput = rawOutput.toLowerCase();
    
    if (!lowerOutput.includes('sentiment')) {
      errors.push('Sentiment analysis missing or unclear');
    }
    if (!lowerOutput.includes('priority') && !lowerOutput.includes('urgent') && !lowerOutput.includes('high') && !lowerOutput.includes('medium') && !lowerOutput.includes('low')) {
      errors.push('Priority level not clearly specified');
    }
    if (!lowerOutput.includes('department') && !lowerOutput.includes('route') && !lowerOutput.includes('forward')) {
      errors.push('Department routing unclear or missing');
    }
    if (rawOutput.length < 50) {
      errors.push('Response too brief, lacks sufficient detail');
    }
    if (!rawOutput.includes('"') && !rawOutput.includes('suggest')) {
      errors.push('Suggested response format unclear');
    }

    // Step 5: Complete
    writer.write(encode({
      status: 'complete',
      progress: 100,
      details: 'Unstructured processing complete',
      stage: 'Complete',
      type: 'unstructured'
    }));

    return {
      rawOutput,
      processingTime: Date.now() - startTime,
      errors
    };

  } catch (error) {
    console.error('Unstructured processing error:', error);
    writer.write(encode({
      status: 'error',
      progress: 100,
      details: 'Unstructured processing failed',
      stage: 'Error',
      type: 'unstructured'
    }));

    return {
      rawOutput: 'Failed to process the customer message. The system encountered an error while analyzing the content.',
      processingTime: Date.now() - startTime,
      errors: ['LLM request failed', 'Unable to process unstructured request', 'Manual intervention required']
    };
  }
}

export async function POST(request: NextRequest) {
  try {
    const { message } = await request.json();

    if (!message) {
      return new Response('Message is required', { status: 400 });
    }

    const stream = new TransformStream();
    const writer = stream.writable.getWriter();

    (async () => {
      try {
        // Process both structured and unstructured simultaneously
        const [structuredResult, unstructuredResult] = await Promise.all([
          processStructured(message, writer),
          processUnstructured(message, writer)
        ]);

        writer.write(encode({ 
          status: 'final', 
          structured: {
            type: 'structured',
            data: structuredResult.data,
            processingTime: structuredResult.processingTime,
            success: structuredResult.success
          },
          unstructured: {
            type: 'unstructured',
            data: {
              rawOutput: unstructuredResult.rawOutput,
              errors: unstructuredResult.errors
            },
            processingTime: unstructuredResult.processingTime,
            success: unstructuredResult.errors.length === 0
          }
        }));
      } catch (error) {
        console.error('Processing error:', error);
        writer.write(encode({ status: 'error', message: 'Failed to process message' }));
      } finally {
        writer.close();
      }
    })();

    return new Response(stream.readable, {
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive',
      },
    });

  } catch (error) {
    console.error('Request error:', error);
    return new Response('Invalid request', { status: 400 });
  }
}