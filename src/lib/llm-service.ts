import { openai, MODEL, LLMError, ValidationError, withRetry } from "./openai";
import { SupportZod, SupportJSONSchema, type Support } from "./schemas";

export interface ProcessingStep {
  step: 'analyzing' | 'classifying' | 'generating' | 'validating' | 'routing' | 'complete';
  message: string;
  data?: any;
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
  result: Support;
  processingSteps: ProcessingStep[];
  method: 'response_format' | 'tool_call';
  processingTime: number;
  confidence?: number;
}

// Enhanced service with real-time streaming
export class LLMService {
  private onProgress?: (step: ProcessingStep) => void;
  private metrics: PerformanceMetrics[] = [];
  
  constructor(onProgress?: (step: ProcessingStep) => void) {
    this.onProgress = onProgress;
  }
  
  private emit(step: ProcessingStep) {
    this.onProgress?.(step);
  }
  
  private recordMetrics(metric: PerformanceMetrics) {
    this.metrics.push(metric);
  }
  
  public getMetrics(): PerformanceMetrics[] {
    return [...this.metrics];
  }
  
  async classifyWithResponseFormat(text: string): Promise<LLMResult> {
    const startTime = Date.now();
    const processingSteps: ProcessingStep[] = [];
    
    try {
      // Step 1: Analyzing
      const step1 = { step: 'analyzing' as const, message: 'Initializing AI analysis...', progress: 10 };
      this.emit(step1);
      
      // Step 2: Classifying with real streaming
      const step2 = { step: 'classifying' as const, message: 'Streaming response from OpenAI...', progress: 30 };
      this.emit(step2);
      
      let accumulatedContent = '';
      let currentProgress = 30;
      
      const completion = await withRetry(async () => {
        return openai.chat.completions.create({
          model: MODEL,
          messages: [
            {
              role: "system",
              content: "You are a customer service AI that analyzes messages and routes them to appropriate departments. Classify sentiment, determine department, and draft a helpful reply. Also assess confidence and priority levels."
            },
            { role: "user", content: `Customer message: ${text}` }
          ],
          response_format: {
            type: "json_schema",
            json_schema: {
              name: "support_ticket",
              schema: SupportJSONSchema.definitions?.support || SupportJSONSchema
            }
          },
          stream: true
        });
      });
      
      // Step 3: Processing stream
      const step3 = { step: 'generating' as const, message: 'Processing streaming response...', progress: 50 };
      this.emit(step3);
      
      for await (const chunk of completion) {
        const delta = chunk.choices[0]?.delta?.content;
        if (delta) {
          accumulatedContent += delta;
          currentProgress = Math.min(80, 50 + (accumulatedContent.length / 10));
          
          this.emit({
            step: 'generating',
            message: `Received ${accumulatedContent.length} characters...`,
            progress: currentProgress
          });
        }
      }
      
      // Step 4: Validating
      const step4 = { step: 'validating' as const, message: 'Validating structured output...', progress: 85 };
      this.emit(step4);
      
      try {
        const obj = JSON.parse(accumulatedContent);
        const parsed = SupportZod.safeParse(obj);
        
        if (!parsed.success) {
          throw new ValidationError("Invalid response format", parsed.error);
        }
        
        // Step 5: Complete
        const step5 = {
          step: 'complete' as const,
          message: 'Processing complete!',
          progress: 100,
          data: parsed.data
        };
        this.emit(step5);
        
        const processingTime = Date.now() - startTime;
        
        // Record metrics
        this.recordMetrics({
          method: 'response_format',
          processingTime,
          success: true,
          timestamp: Date.now()
        });
        
        return {
          result: parsed.data as Support,
          processingSteps,
          method: 'response_format',
          processingTime,
          confidence: parsed.data.confidence
        };
        
      } catch (parseError) {
        throw new ValidationError("Failed to parse JSON response", parseError);
      }
      
    } catch (error) {
      // Record failed metrics
      this.recordMetrics({
        method: 'response_format',
        processingTime: Date.now() - startTime,
        success: false,
        timestamp: Date.now()
      });
      
      throw new LLMError(
        "Failed to classify message with response format",
        error,
        true
      );
    }
  }
  
  async classifyWithTool(text: string): Promise<LLMResult> {
    const startTime = Date.now();
    const processingSteps: ProcessingStep[] = [];
    
    try {
      // Step 1: Analyzing
      const step1 = { step: 'analyzing' as const, message: 'Preparing tool call...', progress: 15 };
      this.emit(step1);
      
      // Step 2: Tool invocation with streaming
      const step2 = { step: 'classifying' as const, message: 'Invoking classification tool...', progress: 35 };
      this.emit(step2);
      
      const completion = await withRetry(async () => {
        return openai.chat.completions.create({
          model: MODEL,
          messages: [
            { role: "system", content: "Analyze customer messages and use the classification tool to provide structured output." },
            { role: "user", content: text }
          ],
          tools: [{
            type: "function",
            function: {
              name: "classifyMessage",
              description: "Classify customer support messages and generate responses with confidence scoring",
              strict: true,
              parameters: SupportJSONSchema.definitions?.support || SupportJSONSchema
            }
          }],
          tool_choice: { type: "function", function: { name: "classifyMessage" } },
          stream: true
        });
      });
      
      // Step 3: Processing tool stream
      const step3 = { step: 'generating' as const, message: 'Processing tool response stream...', progress: 55 };
      this.emit(step3);
      
      let toolCallAccumulator = '';
      let currentProgress = 55;
      
      for await (const chunk of completion) {
        const toolCall = chunk.choices[0]?.delta?.tool_calls?.[0];
        if (toolCall?.function?.arguments) {
          toolCallAccumulator += toolCall.function.arguments;
          currentProgress = Math.min(80, 55 + (toolCallAccumulator.length / 8));
          
          this.emit({
            step: 'generating',
            message: `Tool call arguments: ${toolCallAccumulator.length} chars...`,
            progress: currentProgress
          });
        }
      }
      
      // Step 4: Validating
      const step4 = { step: 'validating' as const, message: 'Validating tool output...', progress: 85 };
      this.emit(step4);
      
      if (!toolCallAccumulator) {
        throw new LLMError("No tool call arguments received", null, false);
      }
      
      try {
        const obj = JSON.parse(toolCallAccumulator);
        const parsed = SupportZod.safeParse(obj);
        
        if (!parsed.success) {
          throw new ValidationError("Invalid tool response", parsed.error);
        }
        
        // Step 5: Complete
        const step5 = {
          step: 'complete' as const,
          message: 'Tool processing complete!',
          progress: 100,
          data: parsed.data
        };
        this.emit(step5);
        
        const processingTime = Date.now() - startTime;
        
        // Record metrics
        this.recordMetrics({
          method: 'tool_call',
          processingTime,
          success: true,
          timestamp: Date.now()
        });
        
        return {
          result: parsed.data as Support,
          processingSteps: [], // Steps are streamed
          method: 'tool_call',
          processingTime,
          confidence: parsed.data.confidence
        };
        
      } catch (parseError) {
        throw new ValidationError("Failed to parse tool arguments", parseError);
      }
      
    } catch (error) {
      // Record failed metrics
      this.recordMetrics({
        method: 'tool_call',
        processingTime: Date.now() - startTime,
        success: false,
        timestamp: Date.now()
      });
      
      throw new LLMError(
        "Failed to classify message with tool calling",
        error,
        true
      );
    }
  }
  
  // Unstructured processing - regular chat completion without schema
  async processUnstructured(text: string): Promise<{
    rawOutput: string;
    processingTime: number;
    errors: string[];
  }> {
    const startTime = Date.now();
    
    try {
      // Step 1: Analyzing
      this.emit({ step: 'analyzing', message: 'Starting unstructured analysis...', progress: 20 });
      
      // Step 2: Processing without schema
      this.emit({ step: 'classifying', message: 'Processing without structure constraints...', progress: 60 });
      
      const completion = await withRetry(async () => {
        return openai.chat.completions.create({
          model: MODEL,
          messages: [
            {
              role: "system",
              content: "You are a customer service AI. Analyze the customer message and provide insights about sentiment, priority, department routing, and a suggested response. Respond in natural language format."
            },
            { role: "user", content: `Customer message: ${text}` }
          ],
          stream: false
        });
      });

      this.emit({ step: 'complete', message: 'Unstructured processing complete', progress: 100 });
      
      const processingTime = Date.now() - startTime;
      const rawOutput = completion.choices[0]?.message?.content || '';
      
      // Identify common issues with unstructured responses
      const errors: string[] = [];
      if (!rawOutput.toLowerCase().includes('sentiment')) {
        errors.push('Sentiment analysis missing or unclear');
      }
      if (!rawOutput.toLowerCase().includes('priority') && !rawOutput.toLowerCase().includes('urgent')) {
        errors.push('Priority level not clearly specified');
      }
      if (!rawOutput.toLowerCase().includes('department')) {
        errors.push('Department routing unclear');
      }
      if (rawOutput.length < 50) {
        errors.push('Response too brief, lacks detail');
      }
      
      return {
        rawOutput,
        processingTime,
        errors
      };
      
    } catch (error) {
      this.emit({ step: 'complete', message: 'Unstructured processing failed', progress: 100 });
      
      return {
        rawOutput: 'Failed to process message',
        processingTime: Date.now() - startTime,
        errors: ['LLM request failed', 'Unable to process unstructured request']
      };
    }
  }
  
  // Comparison method for structured vs unstructured
  public async compareStructuredVsUnstructured(text: string): Promise<{
    structured: {
      data: Support;
      processingTime: number;
      success: boolean;
    };
    unstructured: {
      rawOutput: string;
      processingTime: number;
      errors: string[];
    };
  }> {
    const [structuredResult, unstructuredResult] = await Promise.allSettled([
      this.classifyWithResponseFormat(text),
      this.processUnstructured(text)
    ]);
    
    const structured = structuredResult.status === 'fulfilled'
      ? {
          data: structuredResult.value.result,
          processingTime: structuredResult.value.processingTime,
          success: true
        }
      : {
          data: {} as Support,
          processingTime: 0,
          success: false
        };
    
    const unstructured = unstructuredResult.status === 'fulfilled'
      ? unstructuredResult.value
      : {
          rawOutput: 'Processing failed',
          processingTime: 0,
          errors: ['Failed to process unstructured request']
        };
    
    return {
      structured,
      unstructured
    };
  }
  
  // Utility for comparison metrics
  public async compareMethodsParallel(text: string): Promise<{
    responseFormat: LLMResult;
    toolCall: LLMResult;
    comparison: {
      fasterMethod: 'response_format' | 'tool_call';
      timeDifference: number;
      confidenceDifference?: number;
    };
  }> {
    const [responseFormat, toolCall] = await Promise.allSettled([
      this.classifyWithResponseFormat(text),
      this.classifyWithTool(text)
    ]);
    
    if (responseFormat.status === 'rejected' && toolCall.status === 'rejected') {
      throw new Error('Both methods failed');
    }
    
    if (responseFormat.status === 'rejected') {
      throw new Error('Response format method failed: ' + responseFormat.reason);
    }
    
    if (toolCall.status === 'rejected') {
      throw new Error('Tool call method failed: ' + toolCall.reason);
    }
    
    const rf = responseFormat.value;
    const tc = toolCall.value;
    
    const fasterMethod = rf.processingTime < tc.processingTime ? 'response_format' : 'tool_call';
    const timeDifference = Math.abs(rf.processingTime - tc.processingTime);
    const confidenceDifference = rf.confidence && tc.confidence
      ? Math.abs(rf.confidence - tc.confidence)
      : undefined;
    
    return {
      responseFormat: rf,
      toolCall: tc,
      comparison: {
        fasterMethod,
        timeDifference,
        confidenceDifference
      }
    };
  }
}