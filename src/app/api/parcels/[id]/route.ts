import { NextResponse } from "next/server";
import { ENDPOINTS, CONTEXTS } from "@/lib/constants";

export async function GET(request: Request, params: any) {

    const url = `${ENDPOINTS.API_BASE_URL}/${params.id}`;

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