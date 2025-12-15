import { NextResponse } from "next/server";
import { ENDPOINTS, CONTEXTS } from "@/lib/constants";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function GET( request: Request, { params }: { params: { id: string } }) {

    const session = await getServerSession(authOptions);

    const { id } = params;
    const { searchParams } = new URL(request.url);
    const date = searchParams.get("date");

    if (!id || !date) {
    return NextResponse.json(
        { error: "Both `id` and `date` are required" },
        { status: 400 }
    );
    }

    const orionUrl = `${ENDPOINTS.API_BASE_URL}/urn:ngsi-ld:WeatherForecast:${id}:${date}`;

    const response = await fetch(orionUrl, {
        headers: {
                    'Content-Type': 'application/json',
                    'Link': CONTEXTS.WEATHERFORECAST,
                    Authorization: `Bearer ${session.user.accessToken}`
                },
    });

    if (!response.ok) {
        throw new Error(`Orion request failed: ${response.status}`);
    }

    const data = await response.json();
    return NextResponse.json(data);
}