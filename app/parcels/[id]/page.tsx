'use client'
import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { AgriParcel, Device, DeviceMeasurement } from '../../shared/interfaces';
import ParcelMap from '../../components/ParcelMap';
import MeasurementLineChart from '../../components/MeasurementLineChart';

export default function ParcelPage() {
  const { id } = useParams();
  const [parcel, setParcel] = useState<AgriParcel | null>(null);

  const [device, setDevice] = useState<Device | null>(null);
  const [deviceMeasurements, setDeviceMeasurements] = useState<DeviceMeasurement[] | null>(null);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {

    const fetchDeviceMeasurements = async (deviceId: string | undefined) => {

        try {

            const res = await fetch(`/api/devices/${deviceId}/measurements`);
            const data = await res.json() as DeviceMeasurement[];
            
            console.log("DeviceMeasurements are:", data);  

            setDeviceMeasurements(data);

        } catch (err) {
            setError('Failed to load device measurements');
        } finally {
            setLoading(false);
        }

    }

    const fetchDevice = async (cropId: string | undefined) => {

        try {

            const res = await fetch(`/api/crops/${cropId}/devices`);
            const data = await res.json() as Device;
            setDevice(data);

            if (data.id) {
                fetchDeviceMeasurements(data.id)
            }

        } catch (err) {
            setError('Failed to load device details');
        } finally {
            setLoading(false);
        }

    }

    const fetchParcel = async () => {
      try {
        const res = await fetch(`/api/parcels/${id}`);
        const data = await res.json() as AgriParcel;
        console.log("Got:", data)
        setParcel(data);

        fetchDevice(data.hasAgriCrop?.object)
      } catch (err) {
        setError('Failed to load parcel details');
      } finally {
        setLoading(false);
      }
    };

    fetchParcel();
  }, [id]);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;
  if (!parcel) return <p>Parcel not found</p>;

  const parcelPolygon = extractFeaturePolygon(parcel);

  return (
    <div>
      <h1>{parcel.name?.value}</h1>
      <p>Address: {parcel.address?.value || "Unknown"}</p>
      {parcelPolygon && <ParcelMap geoJson={parcelPolygon} />}
      { deviceMeasurements && deviceMeasurements.length > 0 && (
        <MeasurementLineChart
            data={prepareChartData(deviceMeasurements)}
            title='Device Measurements Over Time'
            yAxisLabel='Measurement Value' />
      )}
    </div>
  );
}


const prepareChartData = (measurements: DeviceMeasurement[]) => {
    return measurements.map(measurement => ({
        date: measurement.dateObserved,
        value: measurement.numValue,
    }));
}

const extractFeaturePolygon = (parcel: AgriParcel) => {

    const features = parcel.location?.value.features;

    const geoJson = features && features.find(feature => feature.geometry.type === 'Polygon') 

    const retval = geoJson?.geometry;

    if (!retval) return null;

    return retval as GeoJSON.Polygon;
}