import { NextResponse } from 'next/server';

const DOTNET_API_URL = process.env.DOTNET_API_URL || 'http://localhost:5245/api';

export async function GET() {
    try {
        const response = await fetch(`${DOTNET_API_URL}/portfolio/default`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        });

        if (!response.ok) {
            console.error(`Failed to fetch default portfolio: ${response.status} ${response.statusText}`);
            return NextResponse.json(
                { error: `Failed to fetch default portfolio` },
                { status: response.status }
            );
        }

        const portfolioData = await response.json();
        return NextResponse.json(portfolioData);
    } catch (error) {
        console.error('Error fetching default portfolio:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}
