// app/api/agri-products

import { NextResponse } from "next/server";
import { ENDPOINTS, CONTEXTS } from "@/lib/constants";
import { AgriProductType } from "@/lib/interfaces";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function GET() {
    const session = await getServerSession(authOptions);

    const searchParams = {
        type: 'AgriProductType',
        limit: '100',
    }


    try {
        const ulrQuery = new URLSearchParams(searchParams).toString();

        const url = new URL(`${ENDPOINTS.API_BASE_URL}?${ulrQuery}`).toString();
        const response = await fetch(url, {
            headers: {
                'Link': CONTEXTS.AGRIFARM,
                Authorization: `Bearer ${session.user.accessToken}`
            }
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data: AgriProductType[] = await response.json();

        console.log("Products are", data)

        return NextResponse.json(data);

    } catch (err) {
        console.error('Error fetching agri products:', err);
        return NextResponse.json({ error: 'Failed to fetch agri products' }, { status: 500 });
    }
}