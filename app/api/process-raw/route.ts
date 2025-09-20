import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const MODEL = "gpt-4o-2024-08-06";

const SYSTEM_PROMPT = 'Be helpful and concise to our customer. A customer is coming to you with a problem that we need to respond to. Can you create the response to their input message.';


export async function POST(request: NextRequest) {
  try {
    const { message } = await request.json();

    if (!message) {
      return NextResponse.json({ error: 'Message is required' }, { status: 400 });
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
          content: `Analyze this customer message and suggest fields {sentiment, department, priority, reply}:\n${message}`
        }
      ],
      temperature: 0.7,
      max_tokens: 400
    });

    const processingTime = Date.now() - startTime;
    
    const rawOutput = completion.choices[0]?.message?.content;
    
    
    if (!rawOutput) {
      throw new Error('No response from OpenAI');
    }


    return NextResponse.json({
      rawOutput,
      processingTime,
      success: true
    });

  } catch (error) {
    console.error('Processing error:', error);
    return NextResponse.json(
      { 
        error: 'Failed to process message',
        details: error instanceof Error ? error.message : 'Unknown error'
      }, 
      { status: 500 }
    );
  }
}
