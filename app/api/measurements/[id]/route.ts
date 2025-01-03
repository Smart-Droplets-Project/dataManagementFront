
const QUANTUMLEAP_URL = process.env.QUANTUMLEAP_URL || 'http://localhost:8668/v2';

export async function GET(
    request: Request,
    { params }: { params: { id: string } }
) {
    const { id } = params; 
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
                'Fiware-ServicePath': '/'
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
