'use client'

import { AgriParcel } from '@/lib/interfaces';
import dynamic from 'next/dynamic';
const ParcelMap = dynamic(() => import('@/components/ParcelMap/ParcelMap'), { ssr: false });

interface ParcelMapProps {
    parcelList: AgriParcel[];
    selectedParcelId: string;
}

const ParcelMapWrapper: React.FC<ParcelMapProps> = ({ parcelList, selectedParcelId }) => {
    return (<ParcelMap parcelList={parcelList} selectedParcelId={selectedParcelId} />);
}

export default ParcelMapWrapper;