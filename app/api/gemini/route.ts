import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_GEMINI_API_KEY || '');

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { messages, action, locationName } = body;

    // Use Gemini 2.5 Pro - the most capable model with advanced reasoning
    const model = genAI.getGenerativeModel({ 
      model: 'gemini-2.5-pro',
    });

    if (action === 'chat') {
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
    }

    if (action === 'getCoordinates') {
      if (!locationName) {
        return NextResponse.json({ error: 'Location name is required' }, { status: 400 });
      }
      
      const prompt = `Return ONLY a JSON object with the coordinates for ${locationName}. 
Format: {"lat": latitude, "lng": longitude}
Do not include any other text.`;

      const result = await model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();
      
      try {
        const coords = JSON.parse(text.replace(/```json\n?|\n?```/g, ''));
        return NextResponse.json(coords);
      } catch {
        return NextResponse.json({ error: 'Could not parse coordinates' }, { status: 400 });
      }
    }

    return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
  } catch (error) {
    console.error('Gemini API error:', error);
    return NextResponse.json(
      { error: 'Failed to process request' },
      { status: 500 }
    );
  }
}
