import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const { searchTerm } = await req.json();

    if (!searchTerm) {
      return NextResponse.json(
        { error: 'Search term is required' },
        { status: 400 }
      );
    }

    const response = await fetch('https://google.serper.dev/images', {
      method: 'POST',
      headers: {
        'X-API-KEY': process.env.SERPER_API_KEY || '',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        q: searchTerm,
        num: 10,
      }),
    });

    if (!response.ok) {
      throw new Error('Serper API request failed');
    }

    const data = await response.json();
    
    const images = data.images?.map((img: any) => ({
      url: img.imageUrl,
      title: img.title,
      source: img.link,
    })) || [];

    return NextResponse.json({ images });
  } catch (error) {
    console.error('Serper API error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch images' },
      { status: 500 }
    );
  }
}
