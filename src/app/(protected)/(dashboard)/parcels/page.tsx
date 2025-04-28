import { Box } from "@mui/material";
import { Suspense } from "react";
import Loading from "./loading";
import ParcelList from "@/components/ParcelList";
import { fetchParcels } from "@/lib/fetch/fetchParcels";

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
