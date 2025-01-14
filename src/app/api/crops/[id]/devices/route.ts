// app/api/devices/route.ts
import { NextResponse } from 'next/server';
import { ENDPOINTS, CONTEXTS } from '@/lib/constants';
import { Device } from '@/lib/interfaces';

export async function GET(request: Request, { params }: { params: { id: string }}) {
    try {
        const searchParams: any = {
            type: 'Device',
            limit: '100',
        };

        const { id } = await Promise.resolve(params);
        const cropId = id;

        if (cropId) {
            searchParams['q'] = `controlledAsset=="${cropId}"`;
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

        const data: Device[] = await response.json();

        return NextResponse.json(data);
    } catch (error) {
        console.error('Error fetching devices:', error);
        return NextResponse.json({ error: 'Failed to fetch devices' }, { status: 500 });
    }
}
