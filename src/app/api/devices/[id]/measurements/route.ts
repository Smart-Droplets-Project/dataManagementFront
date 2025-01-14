// app/api/devices/[id]/measurements/route.ts
import { NextResponse } from 'next/server';
import { ENDPOINTS, CONTEXTS } from '@/lib/constants';

export async function GET(request: Request, { params }: { params: { id: string }}) {
    try {
        
        const { searchParams: requestParams } = new URL(request.url);
        
        const limit = requestParams.get('limit') || '100';
        
        const limitNum = parseInt(limit);
        if (isNaN(limitNum) || limitNum <= 0) {
            return NextResponse.json(
                { error: 'Limit must be a positive number' },
                { status: 400 }
            );
        }

        const searchParams: any = {
            type: 'DeviceMeasurement',
            limit: limit,
        };

        const { id } = params;
        const deviceId = id;

        if (deviceId) {
            searchParams['q'] = `refDevice=="${deviceId}"`;
        }

        const urlQuery = new URLSearchParams(searchParams).toString();
        const url = new URL(`${ENDPOINTS.API_BASE_URL}?${urlQuery}`).toString();

        const response = await fetch(url, {
            headers: {
                'Link': CONTEXTS.DEVICE,
                'Content-Type': 'application/json'
            }
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        return NextResponse.json(data);

    } catch (error) {
        console.error('Error fetching measurements:', error);
        return NextResponse.json({ error: 'Failed to fetch measurements' }, { status: 500 });
    }
}
