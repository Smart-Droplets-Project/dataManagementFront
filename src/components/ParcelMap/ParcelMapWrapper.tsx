'use client'

import { ParcelDrawerProvider } from '@/contexts/ParcelDrawerContext';
import ParcelDrawer from '@/components/ParcelDrawer/ParcelDrawer';
import { AgriParcel } from '@/lib/interfaces';
import dynamic from 'next/dynamic';
const ParcelMap = dynamic(() => import('@/components/ParcelMap/ParcelMap'), { ssr: false });

interface ParcelMapProps {
    parcelList: AgriParcel[];
    selectedParcelId?: string;
}

const ParcelMapWrapper: React.FC<ParcelMapProps> = ({ parcelList, selectedParcelId }) => {
    return (
        <ParcelDrawerProvider>
            <ParcelMap parcelList={parcelList} selectedParcelId={selectedParcelId} />
            <ParcelDrawer></ParcelDrawer>
        </ParcelDrawerProvider>
    );
}

export default ParcelMapWrapper;