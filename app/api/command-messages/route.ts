// app/api/command-messages/route.ts

import { NextResponse } from "next/server";
import { CONTEXTS, ENDPOINTS } from "../../shared/constants";
import { CommandMessage } from "../../shared/interfaces";

export async function GET() {
    

    const searchParams = {
        type: 'CommandMessage',
        limit: '100',
    }

    const ulrQuery = new URLSearchParams(searchParams).toString();

    const url = new URL(`${ENDPOINTS.API_BASE_URL}?${ulrQuery}`).toString();

    try {

        const response = await fetch(url, {
            headers: {
                'Link': CONTEXTS.AUTONOMOUSMOBILEROBOT
            }
        });
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data: CommandMessage[] = await response.json();

        return NextResponse.json(data);

    } catch (error) {
        console.error('Error fetching parcels:', error);
        return NextResponse.json({ error: 'Failed to fetch parcels' }, { status: 500 });
    }
}