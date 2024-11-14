import { Box, Drawer, Skeleton } from "@mui/material";
import Grid from '@mui/material/Grid2';
import { useParcelDrawer } from "./ParcelDrawerContext";
import { useEffect, useState } from "react";
import { Device, DeviceMeasurement } from "@/app/shared/interfaces";
import MeasurementLineChart from "../MeasurementLineChart";

const ParcelDrawer = () => {
  const { selectedParcel, closeDrawer } = useParcelDrawer();

  const [device, setDevice] = useState<Device | null>(null);
  const [deviceMeasurements, setDeviceMeasurements] = useState<DeviceMeasurement[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  console.log(selectedParcel);

  const isParcelDrawerOpen = Boolean(selectedParcel)

  useEffect(() => {
    console.log(isParcelDrawerOpen);
    if (isParcelDrawerOpen) {
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

          console.log(data);


          if (data.id) {
            fetchDeviceMeasurements(data.id);
          } else {
            setDeviceMeasurements(null);
            setLoading(false);
          }

        } catch (err) {
          setError('Failed to load device details');
        }

      }

      setLoading(true)
      fetchDevice(selectedParcel?.properties?.hasAgriCrop.id)
    }
  }, [isParcelDrawerOpen])


  const DrawerList = (
    <Box sx={{ minHeight: 300 }} role="presentation" >
      <Grid padding={4} display={"flex"} flexDirection={"column"} justifyContent={"center"}>
        {
          loading ?
            <Skeleton height={300} variant="rectangular"></Skeleton> :
            error
              ? <p>{error}</p> :
              !deviceMeasurements
                ? <p>No Measurements found</p> :
                <>
                  {deviceMeasurements && deviceMeasurements.length > 0 && (
                    <MeasurementLineChart
                      data={prepareChartData(deviceMeasurements)}
                      title='Device Measurements Over Time'
                      yAxisLabel='Measurement Value' />
                  )}
                </>
        }
      </Grid>
    </Box>
  );

  return (
    <div>
      <Drawer open={isParcelDrawerOpen} onClose={closeDrawer} anchor="bottom"
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