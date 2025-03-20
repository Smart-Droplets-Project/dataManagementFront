import { Suspense } from 'react';
import Loading from '../loading';
import ParcelMapWrapper from '@/components/ParcelMap/ParcelMapWrapper';
import { fetchParcels } from '@/lib/fetch/fetchParcels';

export default async function TractorsMapPage() {
  const parcels = await fetchParcels();

  return (
    <Suspense fallback={<Loading />}>
      <ParcelMapWrapper parcelList={parcels} />
    </Suspense>
  );
}

