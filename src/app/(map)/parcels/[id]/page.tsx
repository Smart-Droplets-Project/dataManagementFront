import { AgriParcel } from '@/lib/interfaces';
import { ParcelDrawerProvider } from '@/contexts/ParcelDrawerContext';
import ParcelDrawer from '@/components/ParcelDrawer/ParcelDrawer';
import { Suspense } from 'react';
import Loading from './loading';
import ParcelMapWrapper from '@/components/ParcelMap/ParcelMapWrapper';

async function fetchParcels(): Promise<AgriParcel[]> {
  const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/parcels`, { cache: 'no-store' });
  return res.json();
}

export default async function ParcelPage({ params }: { params: { id: string } }) {
  const { id } = await Promise.resolve(params);
  const decodedId = decodeURIComponent(id)
  const parcels = await fetchParcels();
  debugger

  return (
    <Suspense fallback={<Loading />}>
      <ParcelDrawerProvider>
        <ParcelMapWrapper parcelList={parcels} selectedParcelId={decodedId} />
        <ParcelDrawer></ParcelDrawer>
      </ParcelDrawerProvider>
    </Suspense>
  );
}

