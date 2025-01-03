'use client'
// app/dashboard/page.tsx
import ParcelList from "@/app/components/ParcelList";
import { Skeleton, Typography } from "@mui/material";
import GridLayout from "../components/GridLayout";
import { useEffect, useState } from "react";
import { AgriParcel } from "../shared/interfaces";

const DashboardPage = () => {
    const [parcels, setParcels] = useState<AgriParcel[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchParcels = async () => {
            try {
                const res = await fetch('/api/parcels');
                const data = await res.json();
                setParcels(data);
            } catch (err) {
                setError('Failed to load parcels');
                console.log(err)
            } finally {
                setLoading(false);
            }
        };

        fetchParcels();
    }, []);

    const content = (
        <GridLayout>
            {
                error ? <p>{error}</p> :
                    <div className="flex flex-col gap-4">
                        <Typography variant="h2" component="div">
                            {loading ? <Skeleton sx={{transform: "none"}} /> : 'Parcel Dashboard'}
                        </Typography>
                        {loading ? <Skeleton sx={{transform: "none"}} height={300} /> : <ParcelList parcels={parcels} />}
                    </div>
            }
        </GridLayout>
    )

    return content;
};

export default DashboardPage;
