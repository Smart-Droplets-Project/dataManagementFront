// app/api/parcel-operations/route.ts

import { NextResponse } from "next/server";
import { CONTEXTS, ENDPOINTS } from "@/lib/constants";
import { randomUUID } from "crypto";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";


function stripAngleBracketsFromLink(link: string) {

    const anglesRegExp = new RegExp(/^<|>$/, 'g');

    return link.replaceAll(anglesRegExp, '');
}

export async function POST(
    request: Request,
) {
    const session = await getServerSession(authOptions);

    const { searchParams } = new URL(request.url);

    const parcel_id = searchParams.get('parcel_id');
    const operation_type = searchParams.get('operation_type');
    const agri_product = searchParams.get('agri_product');
    const quantity = searchParams.get('quantity');

    if (!parcel_id || !operation_type || !agri_product || !quantity) {
        return NextResponse.json({ error: 'Missing required parameters' }, { status: 400 });
    }

    try {

        const body = {
            id: `urn:ngsi-ld:AgriParcelOperation:${randomUUID()}-id`,
            type: 'AgriParcelOperation',
            hasAgriParcel: {
                type: 'Relationship',
                object: [parcel_id]
            },
            operationType: {
                type: 'Property',
                value: operation_type
            },
            hasAgriProduct: {
                type: 'Relationship',
                object: [agri_product]
            },
            quantity: {
                type: 'Property',
                value: quantity
            },
            "@context": [
                stripAngleBracketsFromLink(CONTEXTS.CORE),
                stripAngleBracketsFromLink(CONTEXTS.AGRIFARM)
            ]
        }

        const response = await fetch(`${ENDPOINTS.API_BASE_URL}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/ld+json',
                Authorization: `Bearer ${session.user.accessToken}`
            },
            body: JSON.stringify(body),
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        return new NextResponse(null, { status: 200 });

    } catch (error) {
        console.error('Error posting new Command Message:', error);
        return NextResponse.json({ error: 'Failed to fetch parcels' }, { status: 500 });
    }
}