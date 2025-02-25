'use client'

import { ParcelDrawerProvider } from '@/contexts/ParcelDrawerContext';
import ParcelDrawer from '@/components/ParcelDrawer/ParcelDrawer';
import { AgriParcel, StateMessage } from '@/lib/interfaces';
import dynamic from 'next/dynamic';
import { useEffect, useState } from 'react';
const ParcelMap = dynamic(() => import('@/components/ParcelMap/ParcelMap'), { ssr: false });

interface ParcelMapProps {
    parcelList: AgriParcel[];
    selectedParcelId?: string;
}

const ParcelMapWrapper: React.FC<ParcelMapProps> = ({ parcelList, selectedParcelId }) => {
    const [tractorStateMessages, setTractorStateMessages] = useState<StateMessage[]>([]);

    useEffect(() => {
        const fetchTractorStateMessages = async () => {
            const res = await fetch('/api/state-messages');
            const data = await res.json() as StateMessage[];
            setTractorStateMessages(data);
        };

        fetchTractorStateMessages();
        const fetchTractorStateMessagesInterval = setInterval(fetchTractorStateMessages, 5000);

        return () => clearInterval(fetchTractorStateMessagesInterval);
    }, [])

    return (
        <ParcelDrawerProvider>
            <ParcelMap parcelList={parcelList} selectedParcelId={selectedParcelId} tractorStateMessages={tractorStateMessages} />
            <ParcelDrawer></ParcelDrawer>
        </ParcelDrawerProvider>
    );
}

export default ParcelMapWrapper;