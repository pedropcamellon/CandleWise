import { NextResponse } from 'next/server';

const DOTNET_API_URL = process.env.DOTNET_API_URL || 'http://localhost:5245/api';

export async function POST(request: Request) {
    try {
        const body = await request.json();

        if (!body.symbols || !Array.isArray(body.symbols) || body.symbols.length === 0) {
            return NextResponse.json(
                { error: 'Symbols array is required and cannot be empty' },
                { status: 400 }
            );
        }

        const response = await fetch(`${DOTNET_API_URL}/stock/prices`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ symbols: body.symbols }),
        });

        if (!response.ok) {
            console.error(`Failed to fetch stock prices: ${response.status} ${response.statusText}`);

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
                { error: `Failed to fetch stock prices` },
                { status: response.status }
            );
        }

        const pricesData = await response.json();
        return NextResponse.json(pricesData);
    } catch (error) {
        console.error('Error fetching stock prices:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}
