'use client'
import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { AgriParcel, Device, DeviceMeasurement } from '../../shared/interfaces';
import ParcelMap from '../../components/ParcelMap';
import { Card, CardContent, CardActions, Typography, Box, FormControl, InputLabel, Select, MenuItem, SelectChangeEvent } from '@mui/material';
import MeasurementLineChart from '../../components/MeasurementLineChart';
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

  const [selectedParcelId, setSelectedParcelId] = useState<string>(decodedId);

  const [gridSize, setGridSize] = useState('0.025');

  const handleGridSizeChange = (event: SelectChangeEvent) => {
    setGridSize(event.target.value as string);
  };

  // const [device, setDevice] = useState<Device | null>(null);
  // const [deviceMeasurements, setDeviceMeasurements] = useState<DeviceMeasurement[] | null>(null);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [parcelFeatureList, setParcelFeatureList] = useState<GeoJSON.Feature[]>([]);

  // let parcelFeatureList: GeoJSON.Feature[] = [];

  useEffect(() => {

    // const fetchDeviceMeasurements = async (deviceId: string | undefined) => {

    //   try {

    //     const res = await fetch(`/api/devices/${deviceId}/measurements`);
    //     const data = await res.json() as DeviceMeasurement[];

    //     console.log("DeviceMeasurements are:", data);

    //     setDeviceMeasurements(data);

    //   } catch (err) {
    //     setError('Failed to load device measurements');
    //   } finally {
    //     setLoading(false);
    //   }

    // }

    // const fetchDevice = async (cropId: string | undefined) => {

    //   try {

    //     const res = await fetch(`/api/crops/${cropId}/devices`);
    //     const data = await res.json() as Device;
    //     setDevice(data);

    //     if (data.id) {
    //       fetchDeviceMeasurements(data.id)
    //     }

    //   } catch (err) {
    //     setError('Failed to load device details');
    //   } finally {
    //     setLoading(false);
    //   }

    // }

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

    // let parcelFeatureList: GeoJSON.Feature[] = [];


    const fetchParcels = async () => {
      try {
        const res = await fetch('/api/parcels');
        const data = await res.json();
        setParcels(data);

        const selectedParcel = data.find((p: AgriParcel) => {
          return p.id === selectedParcelId
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

  useEffect(() => {
    if (parcels.length > 0 && selectedParcelId) {
      const selectedParcel = parcels.find(p => {
        return p.id === selectedParcelId
      });
      setParcel(selectedParcel)
    }
  }, [selectedParcelId]);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;
  if (!parcel) return <p>Parcel not found...</p>;

  return (
    <div className='relative flex flex-col flex-grow'>
      <div className='absolute top-4 right-4 z-[900]'>
        <Card sx={{ minWidth: 275 }}>
          <CardContent>
            <Typography variant='h6'>
              {parcel.name?.value}
            </Typography>
            <Typography variant="body1" component="div">
              Address: {parcel.address?.value || "Unknown"}
            </Typography>
          </CardContent>
          <CardActions>
            <Box sx={{ minWidth: 120 }}>
              <FormControl variant='filled' size='small' fullWidth>
                <InputLabel id="grid-size-label">Grid Size:</InputLabel>
                <Select
                  labelId="grid-size-label"
                  id="grid-size"
                  value={gridSize}
                  onChange={handleGridSizeChange}
                >
                  {gridSizeOptions.map(option => (
                    <MenuItem key={option.value} value={option.value}>{option.label}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Box>
          </CardActions>
        </Card>
      </div>
      <ParcelDrawerProvider>
        {parcelFeatureList && <ParcelMap geoJsonList={parcelFeatureList} setNewSelectedParcelId={setSelectedParcelId} selectedParcelId={selectedParcelId} gridSize={gridSize} />}
        <ParcelDrawer selectedParcelId={selectedParcelId}></ParcelDrawer>
      </ParcelDrawerProvider>
      {/* { deviceMeasurements && deviceMeasurements.length > 0 && (
        <MeasurementLineChart
            data={prepareChartData(deviceMeasurements)}
            title='Device Measurements Over Time'
            yAxisLabel='Measurement Value' />
      )} */}
    </div>
  );
}

// const prepareChartData = (measurements: DeviceMeasurement[]) => {
//   return measurements.map(measurement => ({
//     date: measurement.dateObserved,
//     value: measurement.numValue,
//   }));
// }

const extractFeaturePolygon = (parcel: AgriParcel) => {

  const features = parcel.location?.value.features;

  const geoJson = features && features.find(feature => feature.geometry.type === 'Polygon')

  const retval = {
    type: 'Feature',
    properties: {
      id: parcel.id
    },
    geometry: geoJson?.geometry
  };

  // if (!retval) return null;

  return retval as GeoJSON.Feature;
}