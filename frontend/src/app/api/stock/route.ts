import { NextResponse } from 'next/server';
import { Stock } from '../../../../../shared/types';

const DOTNET_API_URL = process.env.DOTNET_API_URL || 'http://localhost:5245/api';

export async function GET() {
  try {
    console.log('Attempting to fetch from:', `${DOTNET_API_URL}/stock`);
    const response = await fetch(`${DOTNET_API_URL}/stock`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        // Add any additional headers needed for the .NET API
      },
    });

    if (!response.ok) {
      console.error(`Failed to fetch from .NET API: ${response.status} ${response.statusText}`);

      // Handle specific error cases
      if (response.status === 400) {
        const errorData = await response.json().catch(() => ({}));
        if (errorData.error === 'API_CREDENTIALS_MISSING') {
          console.error('Alpaca API credentials missing:', errorData.message);
          return NextResponse.json(
            {
              error: 'API_CREDENTIALS_MISSING',
              message: errorData.message || 'Alpaca API credentials are not configured. Please add your API keys to the backend configuration.'
            },
            { status: 400 }
          );
        }
      }

      return NextResponse.json(
        { error: 'Failed to fetch stock data from backend' },
        { status: response.status }
      );
    }

    const stocks: Stock[] = await response.json();

    // You can transform the data here if needed
    return NextResponse.json(stocks);
  } catch (error) {
    console.error('Error proxying to .NET API:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
