import { NextResponse } from "next/server";
import { ENDPOINTS, CONTEXTS } from "@/lib/constants";

export async function GET(request: Request, props: { params: Promise<{ id: string }> }) {

    const params = await props.params;
    const id = params.id;

    const url = `${ENDPOINTS.API_BASE_URL}/${id}`;

    const res = await fetch(url, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Link': CONTEXTS.AGRIFARM
        },
    });

    if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
    }

    const data = await res.json();

    return NextResponse.json(data);



}