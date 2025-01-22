import { Box } from "@mui/material";
import { Suspense } from "react";
import Loading from "./loading";
import ParcelList from "@/components/ParcelList";
import { AgriParcel } from "@/lib/interfaces";

async function fetchParcels(): Promise<AgriParcel[]> {
    const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/parcels`, { cache: 'no-store' });
    return res.json();
}

export default async function Home() {
    const parcels = await fetchParcels();

    return (
        <Suspense fallback={<Loading />}>
            <Box display={"flex"} flexDirection={"column"} alignItems={"center"} gap={4}>
                <ParcelList parcels={parcels}></ParcelList>
            </Box>
        </Suspense>
    );
}
