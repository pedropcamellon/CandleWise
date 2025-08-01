import { NextRequest, NextResponse } from 'next/server';

const DOTNET_API_URL = process.env.DOTNET_API_URL || 'http://localhost:5245/api';

export async function GET(
  request: NextRequest,
  { params }: { params: { symbol: string } }
) {
  try {
    const { symbol } = params;
    
    if (!symbol) {
      return NextResponse.json(
        { error: 'Symbol parameter is required' },
        { status: 400 }
      );
    }

    console.log(`Attempting to fetch quote for ${symbol} from:`, `${DOTNET_API_URL}/stock/${symbol}/quote`);
    
    const response = await fetch(`${DOTNET_API_URL}/stock/${symbol}/quote`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      console.error(`Failed to fetch from .NET API: ${response.status} - ${response.statusText}`);
      return NextResponse.json(
        { error: `Failed to fetch stock quote: ${response.statusText}` },
        { status: response.status }
      );
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error proxying to .NET API:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
