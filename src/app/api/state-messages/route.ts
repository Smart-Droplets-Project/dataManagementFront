import { NextResponse } from 'next/server';
import { ENDPOINTS, CONTEXTS } from '@/lib/constants';

export async function GET() {
    try {
        const searchParams = {
            type: 'StateMessage',
            limit: '10',
        };

        const urlQuery = new URLSearchParams(searchParams).toString();
        const url = new URL(`${ENDPOINTS.API_BASE_URL}?${urlQuery}`).toString();

        const response = await fetch(url, {
            headers: {
                Link: CONTEXTS.AUTONOMOUSMOBILEROBOT,
            },
            cache: 'no-store'
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        //TODO: revert to return response when database is populated
        return NextResponse.json(response);
    } catch (error) {
        console.error('Error fetching state messages:', error);
        return NextResponse.json({ error: 'Failed to fetch state messages' }, { status: 500 });
    }
}