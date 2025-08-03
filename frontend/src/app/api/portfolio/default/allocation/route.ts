import { NextResponse } from 'next/server';

const DOTNET_API_URL = process.env.DOTNET_API_URL || 'http://localhost:5245/api';

export async function GET() {
    try {
        const response = await fetch(`${DOTNET_API_URL}/portfolio/default/allocation`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        });

        if (!response.ok) {
            console.error(`Failed to fetch allocation breakdown: ${response.status} ${response.statusText}`);
            return NextResponse.json(
                { error: `Failed to fetch allocation breakdown` },
                { status: response.status }
            );
        }

        const allocationData = await response.json();
        return NextResponse.json(allocationData);
    } catch (error) {
        console.error('Error fetching allocation breakdown:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}
