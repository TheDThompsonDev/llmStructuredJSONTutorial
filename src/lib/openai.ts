import 'dotenv/config';
import OpenAI from "openai";

export const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY!
});

export const MODEL = process.env.OPENAI_MODEL ?? "gpt-4o-2024-08-06";

export class LLMError extends Error {
  constructor(
    message: string,
    public cause?: unknown,
    public retryable = false
  ) {
    super(message);
    this.name = 'LLMError';
  }
}

export class ValidationError extends Error {
  constructor(message: string, public details: unknown) {
    super(message);
    this.name = 'ValidationError';
  }
}

export async function withRetry<T>(
  operation: () => Promise<T>,
  maxRetries = 3,
  delay = 1000
): Promise<T> {
  let lastError: Error | undefined;
  
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      return await operation();
    } catch (error) {
      lastError = error as Error;
      
      if (error instanceof ValidationError ||
          (error instanceof LLMError && !error.retryable)) {
        throw error;
      }
      
      if (attempt === maxRetries) break;
      
      // Exponential backoff
      await new Promise(resolve => setTimeout(resolve, delay * attempt));
    }
  }
  
  throw new LLMError(
    `Operation failed after ${maxRetries} attempts`,
    lastError || new Error('Unknown error'),
    false
  );
}