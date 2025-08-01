import { NextRequest, NextResponse } from 'next/server';

const DOTNET_API_URL = process.env.DOTNET_API_URL || 'http://localhost:5245/api';

export async function POST(request: NextRequest) {
  try {
    const requestBody = await request.json();
    
    if (!requestBody.symbols || !Array.isArray(requestBody.symbols)) {
      return NextResponse.json(
        { error: 'Symbols array is required in request body' },
        { status: 400 }
      );
    }

    console.log(`Attempting to fetch batch quotes for symbols:`, requestBody.symbols, 'from:', `${DOTNET_API_URL}/stock/quotes`);
    
    const response = await fetch(`${DOTNET_API_URL}/stock/quotes`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestBody),
    });

    if (!response.ok) {
      console.error(`Failed to fetch from .NET API: ${response.status} - ${response.statusText}`);
      return NextResponse.json(
        { error: `Failed to fetch stock quotes: ${response.statusText}` },
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
