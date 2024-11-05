'use client'
// app/dashboard/page.tsx
import ParcelList from "@/app/components/ParcelList";
import { Typography } from "@mui/material";
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
            } finally {
                setLoading(false);
            }
        };

        fetchParcels();
    }, []);

    if (loading) return <p>Loading...</p>;
    if (error) return <p>{error}</p>;

    return (
        <GridLayout>
            <div className="flex flex-col gap-4">
                <Typography variant="h2" component="div">
                    Parcel Dashboard
                </Typography>
                <ParcelList parcels={parcels}/>
            </div>
        </GridLayout>
    );
};

export default DashboardPage;
