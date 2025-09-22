import { NextRequest, NextResponse } from 'next/server';
import { openai, MODEL } from '../../../src/lib/openai';
import { SupportJSONSchema, SupportZod, safeJson, ApiError, ApiSuccess } from '../../../src/lib/schemas';

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
          schema: SupportJSONSchema
        }
      },
      temperature: 0.3
    });

    const processingTime = Date.now() - startTime;
    
    const content = completion.choices[0]?.message?.content;
    if (!content) {
      const errorResponse: ApiError = {
        success: false,
        error: 'No response from OpenAI',
        details: 'OpenAI returned empty content'
      };
      return NextResponse.json(errorResponse, { status: 500 });
    }

    const jsonResult = safeJson(content);
    if (!jsonResult.ok) {
      const errorResponse: ApiError = {
        success: false,
        error: 'Invalid JSON response from LLM',
        details: jsonResult.error
      };
      return NextResponse.json(errorResponse, { status: 500 });
    }

    const validated = SupportZod.safeParse(jsonResult.data);
    if (!validated.success) {
      const errorResponse: ApiError = {
        success: false,
        error: 'Schema validation failed',
        details: 'Response does not match expected schema',
        issues: validated.error.issues.map(issue => ({
          path: issue.path,
          message: issue.message,
          code: issue.code
        }))
      };
      return NextResponse.json(errorResponse, { status: 422 });
    }

    const successResponse: ApiSuccess = {
      success: true,
      data: validated.data,
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