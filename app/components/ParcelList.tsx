'use client'
// app/components/ParcelList.tsx
import { useEffect, useState } from 'react';
import Link from 'next/link';
import styles from './ParcelList.module.css';
import { AgriParcel } from '../shared/interfaces';

// interface Parcel {
//   id: string;
//   name: string;
//   location: string;
// }

const ParcelCard = ({ parcel }: { parcel: AgriParcel }) => (
    <Link href={`/parcels/${parcel.id}`} className={styles.cardLink}>
        <div className={styles.card}>
            <h3 className={styles.cardTitle}>{parcel.name?.value || parcel.alternateName?.value}</h3>
            <p className={styles.cardContent}>Address: {parcel.address?.value || "Unknown"}</p>
        </div>
    </Link>
);



const ParcelList = () => {
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
        <div className={styles.cardGrid}>
            {parcels.map(parcel => (
                <ParcelCard key={parcel.id} parcel={parcel} />
            ))}
        </div>
    );
};

export default ParcelList;
