import { NextResponse } from "next/server";
import { ENDPOINTS } from "../../../shared/constants";
import { CONTEXTS } from "../../../shared/constants";

export async function GET(request: Request, { params }: { params: { id: string } }) {

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