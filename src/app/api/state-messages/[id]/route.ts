import { NextResponse } from "next/server";
import { ENDPOINTS, CONTEXTS } from "@/lib/constants";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function GET(request: Request, props: { params: Promise<{ id: string }> }) {
    const session = await getServerSession(authOptions);

    const params = await props.params;
    const id = params.id;

    const url = `${ENDPOINTS.API_BASE_URL}/${id}`;

    const res = await fetch(url, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Link': CONTEXTS.AUTONOMOUSMOBILEROBOT,
            Authorization: `Bearer ${session.user.accessToken}`
        },
    });

    if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
    }

    const data = await res.json();

    return NextResponse.json(data);



}