// app/api/devices/[id]/DeviceMeasurements/route.ts
import { NextResponse } from 'next/server';
import { ENDPOINTS, CONTEXTS } from '../../../../shared/constants';
import { DeviceMeasurement } from '../../../../shared/interfaces';

export async function GET(
    request: Request,
    { params }: { params: { id: string } }
) {
    const { id } = params;
    const { searchParams } = new URL(request.url);

    const deviceId = id;

    const limit = searchParams.get('limit') || '1000';
    const offset = searchParams.get('offset') || '0';

    try {
        const queryParams = new URLSearchParams({
            type: 'DeviceMeasurement',
            limit,
            offset,
            options: 'keyValues'
        });

        if (deviceId) {
            queryParams.append('q', `refDevice=="${deviceId}"`);
        }

        const url = new URL(`${ENDPOINTS.API_BASE_URL}?${queryParams}`);

        console.log("Fetching DeviceDeviceMeasurements from URL:", url.toString());

        const response = await fetch(url, {
            headers: {
                'Link': CONTEXTS.DEVICE
            }
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data: DeviceMeasurement[] = await response.json();

        console.log(`Fetched ${data.length} DeviceMeasurements for device ${id}`);

        return NextResponse.json(data);
    } catch (error) {
        console.error('Error fetching DeviceMeasurements:', error);
        return NextResponse.json({ error: 'Failed to fetch DeviceMeasurements' }, { status: 500 });
    }
}
