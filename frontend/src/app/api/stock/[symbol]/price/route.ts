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
                { error: 'Stock symbol is required' },
                { status: 400 }
            );
        }

        const response = await fetch(`${DOTNET_API_URL}/stock/${symbol}/price`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        });

        if (!response.ok) {
            console.error(`Failed to fetch price for ${symbol}: ${response.status} ${response.statusText}`);
            
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
                { error: `Failed to fetch price for ${symbol}` },
                { status: response.status }
            );
        }

        const priceData = await response.json();

        return NextResponse.json(priceData);
    } catch (error) {
        console.error(`Error fetching price for stock:`, error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}
