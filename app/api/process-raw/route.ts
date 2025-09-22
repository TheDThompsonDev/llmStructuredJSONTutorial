import { NextRequest, NextResponse } from 'next/server';
import { openai, MODEL } from '../../../src/lib/openai';
import { ApiError, ApiSuccess, safeJson } from '../../../src/lib/schemas';

const SYSTEM_PROMPT = `You are a helpful customer service AI. Provide a polite and empathetic response to the customer's message.

Analyze the message and determine the sentiment, department, and priority.

Wrap the final customer-ready message in [REPLY]...[/REPLY] tags. Do not add other content inside the tags.`;


export async function POST(request: NextRequest) {
  try {
    const { message } = await request.json();

    if (!message) {
      const errorResponse: ApiError = {
        success: false,
        error: 'Message is required'
      };
      return NextResponse.json(errorResponse, { status: 400 });
    }


    const startTime = Date.now();

    const completion = await openai.chat.completions.create({
      model: MODEL,
      messages: [
        {
          role: "system",
          content: SYSTEM_PROMPT
        },
        {
          role: "user",
          content: `Customer message: "${message}"`
        }
      ],
      temperature: 0.7,
      max_tokens: 400
    });

    const processingTime = Date.now() - startTime;
    
    const rawOutput = completion.choices[0]?.message?.content;
    
    
    if (!rawOutput) {
      const errorResponse: ApiError = {
        success: false,
        error: 'No response from OpenAI',
        details: 'OpenAI returned empty content'
      };
      return NextResponse.json(errorResponse, { status: 500 });
    }

    const successResponse: ApiSuccess = {
      success: true,
      data: {
        rawOutput: rawOutput
      },
      processingTime
    };
    return NextResponse.json(successResponse);

  } catch (error) {
    console.error('Processing error:', error);
    const errorResponse: ApiError = {
      success: false,
      error: 'Failed to process message',
      details: error instanceof Error ? error.message : 'Unknown error'
    };
    return NextResponse.json(errorResponse, { status: 500 });
  }
}
