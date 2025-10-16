import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_GEMINI_API_KEY || '');

// Allow streaming responses up to 60 seconds
export const maxDuration = 60;

export async function POST(req: NextRequest) {
  try {
    const { messages } = await req.json();

    // Use Gemini 2.5 Pro - the most capable model with advanced reasoning
    const model = genAI.getGenerativeModel({ 
      model: 'gemini-2.5-pro',
    });

    // Build conversation context
    const conversationHistory = messages
      .map((msg: { role: string; content: string }) => 
        `${msg.role === 'user' ? 'User' : 'Assistant'}: ${msg.content}`
      )
      .join('\n');

    const prompt = `You are a helpful assistant for school students aged 10-16 creating biography presentations in Armenian. 
You should ask clarifying questions to understand what presentation they want to create.
Ask about: the person's life aspects to focus on (art, science, personal life, etc.), 
the number of slides (suggest 5-10), and the depth of content.

After gathering enough information, respond with a JSON object containing the slides.
The response should be in this exact format when you have enough information:
SLIDES_JSON:
{
  "slides": [
    {
      "id": "1",
      "title": "Slide title in Armenian",
      "content": "Detailed content in Armenian",
      "imageSearchTerm": "relevant search term in English",
      "location": { "name": "City Name", "lat": 40.1811, "lng": 44.5136 } // optional, only if relevant
    }
  ]
}

Current conversation:
${conversationHistory}

Respond in Armenian. If you need more information, ask a question. If you have enough information, generate the slides JSON.`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    // Check if response contains slides JSON
    if (text.includes('SLIDES_JSON:')) {
      const jsonMatch = text.match(/SLIDES_JSON:\s*(\{[\s\S]*\})/);
      if (jsonMatch) {
        const slidesData = JSON.parse(jsonMatch[1]);
        return NextResponse.json({ 
          message: text.split('SLIDES_JSON:')[0].trim(),
          slides: slidesData.slides,
          complete: true
        });
      }
    }

    return NextResponse.json({ 
      message: text,
      complete: false
    });
  } catch (error) {
    console.error('Chat API error:', error);
    return NextResponse.json(
      { error: 'Failed to process request' },
      { status: 500 }
    );
  }
}
