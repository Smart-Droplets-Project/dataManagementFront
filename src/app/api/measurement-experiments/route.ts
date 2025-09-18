// app/api/measurement-experiments

import { NextResponse } from "next/server";
// import { ENDPOINTS, CONTEXTS } from "@/lib/constants";
import { MeasurementExperiment } from "@/lib/interfaces";
// import { getServerSession } from "next-auth";
// import { authOptions } from "@/lib/auth";

export async function GET() {
    // const session = await getServerSession(authOptions);

    // const searchParams = {
    //     type: 'MeasurementExperiment',
    //     limit: '100',
    // }

    const mockMeasurementExperiments: MeasurementExperiment[] = [
        { id: "exp-001", name: "Soil pH Analysis" },
        { id: "exp-002", name: "Crop Yield vs. Fertilizer Type" },
        { id: "exp-003", name: "Water Retention in Sandy Loam" },
        { id: "exp-004", name: "Pest Resistance in Genetically Modified Corn" },
        { id: "exp-005", name: "Photosynthesis Rate Under LED Lighting" },
        { id: "exp-006", name: "Nitrogen Fixation in Legumes" },
        { id: "exp-007", name: "Seed Germination Temperature Study" },
        { id: "exp-008", name: "Herbicide Efficacy on Broadleaf Weeds" },
        { id: "exp-009", name: "Fungal Growth Inhibition Test" },
        { id: "exp-010", name: "Fruit Ripening and Ethylene Gas" },
    ];

    try {
        // const ulrQuery = new URLSearchParams(searchParams).toString();

        // const url = new URL(`${ENDPOINTS.API_BASE_URL}?${ulrQuery}`).toString();
        // const response = await fetch(url, {
        //     headers: {
        //         'Link': CONTEXTS.AGRIFARM,
        //         Authorization: `Bearer ${session.user.accessToken}`
        //     }
        // });

        // if (!response.ok) {
        //     throw new Error(`HTTP error! status: ${response.status}`);
        // }

        // const data: MeasurementExperiment[] = await response.json();

        const data: MeasurementExperiment[] = mockMeasurementExperiments;

        console.log("Products are", data)

        return NextResponse.json(data);

    } catch (err) {
        console.error('Error fetching measurement experiments:', err);
        return NextResponse.json({ error: 'Failed to fetch measurement experiments' }, { status: 500 });
    }
}