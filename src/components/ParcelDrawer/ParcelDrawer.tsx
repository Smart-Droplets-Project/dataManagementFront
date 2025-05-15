'use client'
import { Box, Drawer, Tab, Tabs, Typography } from "@mui/material";
import Grid from '@mui/material/Grid2';
import { useParcelDrawer } from "@/contexts/ParcelDrawerContext";
import ParcelDrawerMeasurementsTab from "@/components/ParcelDrawer/ParcelDrawerMeasurementsTab";
import ParcelDrawerOperationsTab from "@/components/ParcelDrawer/ParcelDrawerOperationsTab/ParcelDrawerOperationsTab";
import ParcelDrawerWeatherTab from "@/components/ParcelDrawer/ParcelDrawerWeatherTab";
import { useState } from "react";

function TabPanel({ children, value, index }: { children: React.ReactNode; value: number; index: number }) {
  return (
    <div hidden={value !== index}>
      {value === index && (
        <Box sx={{ marginTop: 4 }}>
          {children}
        </Box>
      )}
    </div>
  );
}

const ParcelDrawer = () => {
  const { selectedParcel, closeDrawer } = useParcelDrawer();
  const [tab, setTab] = useState(0);
  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTab(newValue);
  };

  const DrawerList = (
    <Box sx={{ minHeight: "50vh", maxHeight: "75vh" }} role="presentation" >
      <Grid padding={4} display={"flex"} flexDirection={"column"} justifyContent={"center"}>
        {
          <Grid container display={"flex"} flexDirection={{ xs: "column", md: "row" }} spacing={3}>
            {
              <>
                <Grid size={12}>
                  <Typography variant="h3" component="div">
                    {selectedParcel?.properties?.name}
                  </Typography>
                  <Typography variant="subtitle1" component="div">
                    Address: {selectedParcel?.properties?.address}
                  </Typography>
                </Grid>
                <Grid size={12}>
                  <Tabs value={tab} onChange={handleTabChange} variant="fullWidth">
                    <Tab label="Device Measurements" />
                    <Tab label="Parcel Operations" />
                    <Tab label="Parcel Weather" />
                  </Tabs>

                  {/* Tab Panels */}
                  <TabPanel value={tab} index={0}>
                    <ParcelDrawerMeasurementsTab selectedParcel={selectedParcel}></ParcelDrawerMeasurementsTab>
                  </TabPanel>
                  <TabPanel value={tab} index={1}>
                    <ParcelDrawerOperationsTab selectedParcel={selectedParcel}></ParcelDrawerOperationsTab>
                  </TabPanel>
                      <TabPanel value={tab} index={2}>
                    <ParcelDrawerWeatherTab selectedParcel={selectedParcel}></ParcelDrawerWeatherTab>
                  </TabPanel>
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
              borderTopRightRadius: "0.5rem",
              // backgroundColor: colors.other.lightgrey
            }
          }
        }>
        {DrawerList}
      </Drawer>
    </div>
  );
}



export default ParcelDrawer