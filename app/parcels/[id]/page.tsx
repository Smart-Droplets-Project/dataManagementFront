'use client'
import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { AgriParcel } from '../../shared/interfaces';
import ParcelMap from '../../components/ParcelMap';
import { SelectChangeEvent, Skeleton } from '@mui/material';
import { ParcelDrawerProvider } from '@/app/components/ParcelDrawer/ParcelDrawerContext';
import ParcelDrawer from '@/app/components/ParcelDrawer/ParcelDrawer';


export default function ParcelPage() {
  const { id } = useParams();
  const decodedId = Array.isArray(id) ? decodeURIComponent(id[0]) : decodeURIComponent(id)

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [parcelFeatureList, setParcelFeatureList] = useState<GeoJSON.Feature[]>([]);

  useEffect(() => {
    const fetchParcels = async () => {
      try {
        const res = await fetch('/api/parcels');
        const data = await res.json();

        const featureList: GeoJSON.Feature[] = []
        data.forEach((p: AgriParcel) => {
          featureList.push(extractFeaturePolygon(p))
        });
        setParcelFeatureList(featureList)

      } catch (err) {
        setError('Failed to load parcels');
      } finally {
        setLoading(false);
      }
    };

    fetchParcels();

  }, [decodedId]);

  const content = (
    <div className='flex flex-col flex-grow'>
      {
        error ? <p>{error}</p> :
        !parcelFeatureList ? <p>Parcel not found...</p> :
          loading ? <div className='p-8 flex flex-col flex-grow'><Skeleton sx={{transform: "none"}} height={"100%"} /></div> :
            <ParcelDrawerProvider>
              {parcelFeatureList && <ParcelMap geoJsonList={parcelFeatureList} selectedParcelId={decodedId} />}
              <ParcelDrawer></ParcelDrawer>
            </ParcelDrawerProvider>
      }
    </div>

  )

  return content;
}

const extractFeaturePolygon = (parcel: AgriParcel) => {

  const features = parcel.location?.value.features;

  const geoJson = features && features.find(feature => feature.geometry.type === 'Polygon')

  const retval = {
    type: 'Feature',
    properties: {
      id: parcel.id,
      name: parcel.name?.value || "This parcel has no name",
      address: parcel.address?.value || "Unknown",
      hasAgriCrop: {
        id: parcel.hasAgriCrop?.object || null
      },
      hasAgriSoil: {
        id: parcel.hasAgriSoil?.object || null
      }
    },
    geometry: geoJson?.geometry
  };

  // if (!retval) return null;

  return retval as GeoJSON.Feature;
}