import { Box, Drawer, FormControl, InputLabel, MenuItem, Select, SelectChangeEvent, Skeleton, Typography } from "@mui/material";
import Grid from '@mui/material/Grid2';
import { useParcelDrawer } from "./ParcelDrawerContext";
import { useEffect, useState } from "react";
import { Device, DeviceMeasurement } from "@/app/shared/interfaces";
import MeasurementLineChart from "../MeasurementLineChart";

const ParcelDrawer = () => {
  const { selectedParcel, closeDrawer } = useParcelDrawer();

  const [devices, setDevices] = useState<Device[] | null>(null);
  const [selectedDevice, setSelectedDevice] = useState<string>('');
  const handleSelectedDeviceChange = (event: SelectChangeEvent) => {
    setSelectedDevice(event.target.value as string);
  };

  const [deviceMeasurements, setDeviceMeasurements] = useState<DeviceMeasurement[] | null>(null);
  const [selectedDeviceMeasurements, setSelectedDeviceMeasurements] = useState<string>('');
  const handleSelectedDeviceMeasurementsChange = (event: SelectChangeEvent) => {
    setSelectedDeviceMeasurements(event.target.value as string);
  };

  // const [deviceMeasurements, setDeviceMeasurements] = useState<DeviceMeasurement[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [loadingSelect, setLoadingSelect] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // console.log(selectedParcel);

  // On drawer open
  useEffect(() => {
    console.log(selectedParcel);
    setSelectedDevice('')
    setSelectedDeviceMeasurements('')
    if (selectedParcel) {
      const fetchDevices = async (cropId: string | undefined) => {
        try {
          const res = await fetch(`/api/crops/${cropId}/devices`);
          const data = await res.json() as Device[];
          setDevices(data);

          console.log(data);

        } catch (err) {
          setError('Failed to load devices properties');
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
    setSelectedDeviceMeasurements('')
    if (selectedDevice) {
      const fetchDeviceMeasurements = async (deviceId: string | undefined) => {
        try {
          const res = await fetch(`/api/devices/${deviceId}/measurements`);
          const data = await res.json() as any;
          setDeviceMeasurements(data);

          console.log(data);

        } catch (err) {
          setError('Failed to load device measurements');
        } finally {
          setLoadingSelect(false)
        }

      }

      setLoadingSelect(true)
      fetchDeviceMeasurements(selectedDevice)
    }
  }, [selectedDevice])


  const DrawerList = (
    <Box sx={{ minHeight: "50vh", maxHeight: "75vh" }} role="presentation" >
      <Grid padding={4} display={"flex"} flexDirection={"column"} justifyContent={"center"}>
        {
          loading ? <Skeleton height={"50vh"} variant="rectangular"></Skeleton>
            : <Grid container display={"flex"} flexDirection={{ xs: "column", md: "row" }} spacing={3}>
              {
                error ? <p>{error}</p>
                  // : !deviceMeasurements ? <p>No Measurements found</p> TODO: add proper case
                  : <>
                    <Grid size={12}>
                      <Typography variant="h3" component="div">
                        {selectedParcel?.properties?.name}
                      </Typography>
                      <Typography variant="subtitle1" component="div">
                        Address: {selectedParcel?.properties?.address}
                      </Typography>
                    </Grid>
                    <Grid display={"flex"} flexDirection={{ xs: "column", md: "row" }} size={{ xs: 12, md: 2 }}>
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
                    <Grid size={{ xs: 12, md: 10 }}>
                      {deviceMeasurements && deviceMeasurements.length > 0 && (
                        <MeasurementLineChart
                          data={prepareChartData(deviceMeasurements)}
                          title='Device Measurements Over Time'
                          yAxisLabel='Measurement Value' />
                      )}
                    </Grid>
                  </>
              }
            </Grid>
        }
      </Grid>
    </Box>
  );

  return (
    <div>
      <Drawer open={!!selectedParcel} onClose={closeDrawer} anchor="bottom"
        sx={
          {
            "& .MuiDrawer-paper": {
              borderTopLeftRadius: "0.5rem",
              borderTopRightRadius: "0.5rem"
            }
          }
        }>
        {DrawerList}
      </Drawer>
    </div>
  );
}

const prepareChartData = (measurements: DeviceMeasurement[]) => {
  return measurements.map(measurement => ({
    date: measurement.dateObserved,
    value: measurement.numValue,
  }));
}

export default ParcelDrawer