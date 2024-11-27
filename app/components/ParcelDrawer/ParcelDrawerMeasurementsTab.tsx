import { Device, DeviceMeasurement, QuantumLeapTimeSeriesData } from "@/app/shared/interfaces";
import Grid from '@mui/material/Grid2';
import { FormControl, FormHelperText, InputLabel, MenuItem, Select, SelectChangeEvent, Skeleton } from "@mui/material";
import { useEffect, useState } from "react";
import MeasurementLineChart from "../MeasurementLineChart";

const ParcelDrawerMeasurementsTab = (props: { selectedParcel: GeoJSON.Feature | null }) => {
    const { selectedParcel } = props

    const [devices, setDevices] = useState<Device[] | null>(null);
    const [selectedDevice, setSelectedDevice] = useState<string>('');
    const handleSelectedDeviceChange = (event: SelectChangeEvent) => {
        setSelectedDevice(event.target.value as string);
    };

    const [deviceMeasurements, setDeviceMeasurements] = useState<DeviceMeasurement[] | null>(null);
    const [selectedDeviceMeasurement, setSelectedDeviceMeasurement] = useState<string>('');
    const handleSelectedDeviceMeasurementChange = (event: SelectChangeEvent) => {
        setSelectedDeviceMeasurement(event.target.value as string);
    };

    const [quantumLeapTimeSeriesData, setQuantumLeapTimeSeriesData] = useState<QuantumLeapTimeSeriesData | null>(null);

    const [loading, setLoading] = useState(true);
    const [loadingSelect, setLoadingSelect] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [errorSelect, setErrorSelect] = useState<string | null>(null);


    // On drawer open
    useEffect(() => {
        console.log(selectedParcel);
        setSelectedDevice('')
        setSelectedDeviceMeasurement('')
        setQuantumLeapTimeSeriesData(null)
        if (selectedParcel) {
            const fetchDevices = async (cropId: string | undefined) => {
                try {
                    const res = await fetch(`/api/crops/${cropId}/devices`);
                    const data = await res.json() as Device[];
                    setDevices(data);

                    console.log(data);

                } catch (err) {
                    setError('Failed to load devices');
                } finally {
                    setLoading(false)
                }

            }

            setLoading(true)
            fetchDevices(selectedParcel?.properties?.hasAgriCrop.id)
        }
    }, [selectedParcel])


    // On first (device property) select change
    useEffect(() => {
        setSelectedDeviceMeasurement('')
        setQuantumLeapTimeSeriesData(null)
        if (selectedDevice) {
            const fetchDeviceMeasurements = async (deviceId: string | undefined) => {
                try {
                    const res = await fetch(`/api/devices/${deviceId}/measurements`);
                    const data = await res.json() as DeviceMeasurement[];
                    setDeviceMeasurements(data);

                    console.log(data);

                } catch (err) {
                    setErrorSelect('Failed to load device measurements');
                } finally {
                    setLoadingSelect(false)
                }

            }

            setLoadingSelect(true)
            fetchDeviceMeasurements(selectedDevice)
        }
    }, [selectedDevice])

    // On second (device measurement) select change
    useEffect(() => {
        setQuantumLeapTimeSeriesData(null)
        if (selectedDeviceMeasurement) {
            const fetchQuantumLeapTimeSeriesData = async (deviceMeasurementId: string | undefined) => {
                try {
                    const res = await fetch(`/api/measurements/${deviceMeasurementId}`);
                    const data = await res.json() as QuantumLeapTimeSeriesData;
                    setQuantumLeapTimeSeriesData(data);

                    console.log(data);

                } catch (err) {
                    setErrorSelect('Failed to load QuantumLeap time series data');
                } finally {
                    setLoadingSelect(false)
                }

            }

            setLoadingSelect(true)
            fetchQuantumLeapTimeSeriesData(selectedDeviceMeasurement)
        }
    }, [selectedDeviceMeasurement])

    return (
        <>
            {
                loading ? <Skeleton height={"30vh"} width={"100%"} variant="rectangular"></Skeleton> :
                    error ? <p>{error}</p>
                        : !devices ? <p>No Measurements found</p>
                            :
                            <Grid container display={"flex"} marginBottom={2} flexDirection={{ xs: "column", md: "row" }} size={12} spacing={3}>
                                <Grid size={{ xs: 12, md: 4 }}>
                                    {/* Property */}
                                    <FormControl fullWidth>
                                        <InputLabel id="device-label">Property</InputLabel>
                                        <Select
                                            labelId="device-label"
                                            autoWidth
                                            value={selectedDevice}
                                            onChange={handleSelectedDeviceChange}
                                            label="Property"
                                            disabled={loadingSelect}
                                        >
                                            <MenuItem key="device-empty" value="">
                                                <em>Please select a property</em>
                                            </MenuItem>
                                            {
                                                devices?.map((device) => {
                                                    return <MenuItem key={device.id} value={device.id}>{device.controlledProperty?.value}</MenuItem>
                                                })
                                            }
                                        </Select>
                                    </FormControl>
                                </Grid>
                                <Grid size={{ xs: 12, md: 8 }}>
                                    {/* Device Measurement */}
                                    <FormControl fullWidth>
                                        <InputLabel id="device-measurement-label">Device Measurement</InputLabel>
                                        <Select
                                            labelId="device-measurement-label"
                                            autoWidth
                                            value={selectedDeviceMeasurement}
                                            onChange={handleSelectedDeviceMeasurementChange}
                                            label="Device Measurement"
                                            disabled={loadingSelect || !selectedDevice}
                                        >
                                            <MenuItem key="device-measurement-empty" value="">
                                                <em>Please select a device measurement</em>
                                            </MenuItem>
                                            {
                                                deviceMeasurements?.map((deviceMeasurement) => {
                                                    return <MenuItem key={deviceMeasurement.id} value={deviceMeasurement.id}>Date Observed: {formatDate(deviceMeasurement?.dateObserved?.value)}</MenuItem>
                                                })
                                            }
                                        </Select>
                                        {!selectedDevice && <FormHelperText>Please select a property first</FormHelperText>}
                                    </FormControl>
                                </Grid>
                            </Grid>
            }
            {
                !error && !loading && <Grid size={12}>
                    {
                        errorSelect ? <p>{errorSelect}</p>
                            : quantumLeapTimeSeriesData ? (
                                <MeasurementLineChart
                                    data={prepareChartData(quantumLeapTimeSeriesData)}
                                    title='Device Measurements Over Time'
                                    yAxisLabel='Measurement Value' />
                            ) :
                                "Select a property and a measurement to display a chart"
                    }
                </Grid>
            }
        </>
    )
}

const prepareChartData = (measurement: QuantumLeapTimeSeriesData) => {
    const dateObserved = measurement.attributes.find(attr => attr.attrName === "dateObserved");
    const numValue = measurement.attributes.find(attr => attr.attrName === "numValue");

    if (!dateObserved || !numValue) return [];

    return dateObserved.values.map((date, i) => ({
        date: String(date),
        value: Number(numValue.values[i]),
    }));
};

const formatDate = (isoDate: string): string => {
    const date = new Date(isoDate);
    return date.toLocaleString('en-GB', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false,
    });
};

export default ParcelDrawerMeasurementsTab