import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const MODEL = "gpt-4o-2024-08-06";

const SYSTEM_PROMPT = `You are an expert customer service AI system designed for enterprise-level customer support automation.

Your role is to analyze incoming customer messages and extract structured information for automated routing and response generation.

For each message, you must:
1. Determine the emotional sentiment (positive, negative, or neutral)
2. Assess the urgency level (low, medium, or high priority)
3. Route to the appropriate department (customer_support, online_ordering, product_quality, shipping_and_delivery, or other_off_topic)
4. Generate a professional, empathetic response that addresses the customer's specific concerns
5. Provide a confidence score (0.0-1.0) indicating your certainty in the classification

Consider context clues, emotional language, specific keywords, and business impact when making classifications.

Your structured output will be used for:
- Automated ticket routing
- Priority queue management
- Response time SLA compliance
- Customer satisfaction tracking
- Business intelligence reporting`;

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
          content: `Customer message: "${message}"

Please analyze this message and provide the structured classification and response.`
        }
      ],
      response_format: {
        type: "json_schema",
        json_schema: {
          name: "customer_message_analysis",
          schema: {
            type: "object",
            properties: {
              sentiment: {
                type: "string",
                enum: ["positive", "negative", "neutral"],
                description: "Overall sentiment of the message"
              },
              priority: {
                type: "string",
                enum: ["low", "medium", "high"],
                description: "Urgency level of the customer request"
              },
              department: {
                type: "string",
                enum: ["customer_support", "online_ordering", "product_quality", "shipping_and_delivery", "other_off_topic"],
                description: "Most appropriate department to handle this request"
              },
              confidence: {
                type: "number",
                minimum: 0,
                maximum: 1,
                description: "Confidence level in the analysis (0-1)"
              },
              reply: {
                type: "string",
                description: "Professional suggested response to the customer"
              }
            },
            required: ["sentiment", "priority", "department", "confidence", "reply"],
            additionalProperties: false
          }
        }
      },
      temperature: 0.3
    });

    const processingTime = Date.now() - startTime;
    
    const content = completion.choices[0]?.message?.content;
    if (!content) {
      throw new Error('No response from OpenAI');
    }


    const parsedData = JSON.parse(content);


    return NextResponse.json({
      data: parsedData,
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