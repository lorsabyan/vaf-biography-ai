import { google } from '@ai-sdk/google';
import { streamText, convertToCoreMessages } from 'ai';

// Allow streaming responses up to 60 seconds
export const maxDuration = 60;

export async function POST(req: Request) {
  const { messages } = await req.json();

  const result = streamText({
    model: google('gemini-2.5-pro'),
    messages: convertToCoreMessages(messages),
    temperature: 0.7,
  });

  return result.toTextStreamResponse();
}
