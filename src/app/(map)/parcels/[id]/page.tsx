import { ParcelDrawerProvider } from '@/contexts/ParcelDrawerContext';
import ParcelDrawer from '@/components/ParcelDrawer/ParcelDrawer';
import { Suspense } from 'react';
import Loading from './loading';
import ParcelMapWrapper from '@/components/ParcelMap/ParcelMapWrapper';
import { fetchParcels } from '@/lib/fetch/fetchParcels';

export default async function ParcelPage(props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  const id = params.id;
  const decodedId = decodeURIComponent(id);
  const parcels = await fetchParcels();

  return (
    <Suspense fallback={<Loading />}>
      <ParcelDrawerProvider>
        <ParcelMapWrapper parcelList={parcels} selectedParcelId={decodedId} />
        <ParcelDrawer></ParcelDrawer>
      </ParcelDrawerProvider>
    </Suspense>
  );
}

