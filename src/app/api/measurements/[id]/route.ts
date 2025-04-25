
import { ENDPOINTS } from '@/lib/constants'
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

const QUANTUMLEAP_URL = ENDPOINTS.QUANTUMLEAP_URL;

export async function GET(
    request: Request,
    props: { params: Promise<{ id: string }> }
) {
    const session = await getServerSession(authOptions);

    const params = await props.params;
    const id = params.id;
    const { searchParams } = new URL(request.url);
    const limit = searchParams.get('limit');
    const fromDate = searchParams.get('fromDate');
    const toDate = searchParams.get('toDate');

    if (!id) {
        return new Response(JSON.stringify({ error: 'DeviceMeasurement ID is required' }), {
            status: 400,
            headers: { 'Content-Type': 'application/json' },
        });
    }

    const url = new URL(`${QUANTUMLEAP_URL}/entities/${id}`);
    url.searchParams.append('type', 'DeviceMeasurement');

    if (fromDate) {
        url.searchParams.append('fromDate', fromDate);
    }

    if (toDate) {
        url.searchParams.append('toDate', toDate);
    }

    if (limit) {
        url.searchParams.append('limit', limit);
    }

    try {

        const response = await fetch(url.toString(), {
            headers: {
                'Accept': 'application/json',
                'Fiware-ServicePath': '/',
                Authorization: `Bearer ${session.user.accessToken}`
            }
        });

        if (!response.ok) {
            throw new Error(`QuantumLeap request failed with status: ${response.status}`);
        }

        const data = await response.json();

        console.log(data)

        return new Response(JSON.stringify(data), {
            status: 200,
            headers: { 'Content-Type': 'application/json' },
        });

    } catch (error) {
        console.error('Error fetching data from QuantumLeap:', error);
        return new Response(JSON.stringify({ error: 'Error fetching data from QuantumLeap' }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' },
        });
    }
}
