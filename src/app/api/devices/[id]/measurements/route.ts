// app/api/devices/[id]/measurements/route.ts
import { NextResponse } from 'next/server';
import { ENDPOINTS, CONTEXTS } from '@/lib/constants';
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function GET(request: Request, props: { params: Promise<{ id: string }> }) {
    const session = await getServerSession(authOptions);

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

        const params = await props.params;
        const deviceId = params.id;

        if (deviceId) {
            searchParams['q'] = `refDevice=="${deviceId}"`;
        }

        const urlQuery = new URLSearchParams(searchParams).toString();
        const url = new URL(`${ENDPOINTS.API_BASE_URL}?${urlQuery}`).toString();

        const response = await fetch(url, {
            headers: {
                'Link': CONTEXTS.DEVICE,
                'Content-Type': 'application/json',
                Authorization: `Bearer ${session.user.accessToken}`
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
