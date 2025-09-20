import { NextRequest } from 'next/server';
import { LLMService } from '../../../src/lib/llm-service';

export const dynamic = 'force-dynamic';

function iteratorToStream(iterator: any) {
  return new ReadableStream({
    async pull(controller) {
      const { value, done } = await iterator.next();

      if (done) {
        controller.close();
      } else {
        controller.enqueue(value);
      }
    },
  });
}

function encode(data: any) {
  return new TextEncoder().encode(`data: ${JSON.stringify(data)}\n\n`);
}

export async function POST(request: NextRequest) {
  try {
    const { message } = await request.json();

    if (!message) {
      return new Response('Message is required', { status: 400 });
    }

    const stream = new TransformStream();
    const writer = stream.writable.getWriter();

    const llmService = new LLMService((progress) => {
      writer.write(encode(progress));
    });

    (async () => {
      try {
        const result = await llmService.classifyWithResponseFormat(message);
        writer.write(encode({ status: 'final', data: result }));
      } catch (error) {
        console.error('LLM processing error:', error);
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