// app/api/parcels/route.ts
import { NextResponse } from 'next/server';
import { ENDPOINTS, CONTEXTS } from '../../shared/constants';
import { AgriParcel } from '../../shared/interfaces';



export async function GET() {
    try {

        const searchParams = {
            type: 'AgriParcel',
            limit: '10',
        }

        const ulrQuery = new URLSearchParams(searchParams).toString();

        const url = new URL(`${ENDPOINTS.API_BASE_URL}?${ulrQuery}`).toString();

        const response = await fetch(url, {
            headers: {
                'Link': CONTEXTS.AGRIFARM
            }
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data: AgriParcel[] = await response.json();

        return NextResponse.json(data);
    } catch (error) {
        console.error('Error fetching parcels:', error);
        return NextResponse.json({ error: 'Failed to fetch parcels' }, { status: 500 });
    }
}

