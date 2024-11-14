'use client'
import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { AgriParcel } from '../../shared/interfaces';
import ParcelMap from '../../components/ParcelMap';
import { SelectChangeEvent } from '@mui/material';
import { ParcelDrawerProvider } from '@/app/components/ParcelDrawerComponents/ParcelDrawerContext';
import ParcelDrawer from '@/app/components/ParcelDrawerComponents/ParcelDrawer';

const gridSizeOptions = [
  { label: '25x25', value: 0.025 },
  { label: '10x10', value: 0.01 },
  { label: '5x5', value: 0.005 },
];


export default function ParcelPage() {
  const { id } = useParams();
  const decodedId = Array.isArray(id) ? decodeURIComponent(id[0]) : decodeURIComponent(id)

  const [parcels, setParcels] = useState<AgriParcel[]>([]);
  const [parcel, setParcel] = useState<AgriParcel | null | undefined>(null);

  const [gridSize, setGridSize] = useState('0.025');

  const handleGridSizeChange = (event: SelectChangeEvent) => {
    setGridSize(event.target.value as string);
  };

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [parcelFeatureList, setParcelFeatureList] = useState<GeoJSON.Feature[]>([]);

  useEffect(() => {
    // const fetchParcel = async () => {
    //   try {
    //     const res = await fetch(`/api/parcels/${id}`);
    //     const data = await res.json() as AgriParcel;
    //     console.log("Got:", data)
    //     setParcel(data);

    //     // fetchDevice(data.hasAgriCrop?.object)
    //   } catch (err) {
    //     setError('Failed to load parcel details');
    //   } finally {
    //     setLoading(false);
    //   }
    // };

    // fetchParcel();

    const fetchParcels = async () => {
      try {
        const res = await fetch('/api/parcels');
        const data = await res.json();
        setParcels(data);

        const selectedParcel = data.find((p: AgriParcel) => {
          return p.id === decodedId
        });

        setParcel(selectedParcel)

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

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;
  if (!parcel) return <p>Parcel not found...</p>;

  return (
    <div className='relative flex flex-col flex-grow'>
      <ParcelDrawerProvider>
        {parcelFeatureList && <ParcelMap geoJsonList={parcelFeatureList} selectedParcelId={decodedId} gridSize={gridSize} />}
        <ParcelDrawer></ParcelDrawer>
      </ParcelDrawerProvider>
    </div>
  );
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