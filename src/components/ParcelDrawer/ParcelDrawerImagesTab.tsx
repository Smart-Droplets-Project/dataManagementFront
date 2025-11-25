// import { Device, DeviceMeasurement, MeasurementExperiment } from "@/lib/interfaces";
import { Device, DeviceMeasurement } from "@/lib/interfaces";
import Grid from '@mui/material/Grid2';
// import { Accordion, AccordionDetails, AccordionSummary, Skeleton, Typography } from "@mui/material";
import { Skeleton } from "@mui/material";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
// import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import Image from "next/image";


const ParcelDrawerImagesTab = (props: { selectedParcel: GeoJSON.Feature | null }) => {
    const { selectedParcel } = props;

    // const [measurementExperiments, setMeasurementExperiments] = useState<MeasurementExperiment[] | null>(null);

    const [loading, setLoading] = useState(true);

    const [error, setError] = useState<string | null>(null);

    const [devices, setDevices] = useState<Device[] | null>(null);
    const [laiDeviceMeasurements, setLAIDeviceMeasurements] = useState<DeviceMeasurement[] | null>(null);
    const [rgbDeviceMeasurements, setRGBDeviceMeasurements] = useState<DeviceMeasurement[] | null>(null);



    // On drawer open
    // useEffect(() => {
    //     console.log(selectedParcel);
    //     if (selectedParcel) {
    //         const fetchMeasurementExperiments = async () => {
    //             try {
    //                 const [res1] = await Promise.all([
    //                     fetch(`/api/measurement-experiments`),

    //                 ]);
    //                 const data1 = await res1.json() as MeasurementExperiment[];
    //                 setMeasurementExperiments(data1);

    //                 console.log(data1);

    //             } catch (err) {
    //                 console.log(err);

    //                 setError('Failed to load agri products');
    //             } finally {
    //                 setLoading(false)
    //             }

    //         }

    //         setLoading(true)
    //         fetchMeasurementExperiments();
    //     }
    // }, [selectedParcel])

    useEffect(() => {
        console.log(selectedParcel);
        if (selectedParcel) {
            const fetchDevices = async (cropId: string | undefined) => {
                try {
                    const res = await fetch(`/api/crops/${cropId}/devices`);
                    const data = await res.json() as Device[];
                    setDevices(data);

                    console.log(data);

                } catch (err) {
                    setError('Failed to load devices');
                    console.log(err)
                }

            }

            setLoading(true)
            fetchDevices(selectedParcel?.properties?.hasAgriCrop.id)
        }
    }, [selectedParcel])

    useEffect(() => {
        if (devices) {
            const lai = devices.find(d => d.controlledProperty?.value === 'obs-lai_image')
            const rgb = devices.find(d => d.controlledProperty?.value === 'obs-rgb_image')
            console.log(lai, rgb);
            const fetchDeviceMeasurements = async (deviceId: string | undefined, f: Dispatch<SetStateAction<DeviceMeasurement[] | null>>) => {
                try {
                    const res = await fetch(`/api/devices/${deviceId}/measurements`);
                    const data = await res.json() as DeviceMeasurement[];
                    f(data);

                    console.log(data);

                } catch (err) {
                    setError('Failed to load devices');

                    console.log(err)
                } finally {
                    setLoading(false)
                }

            }
            setLoading(true)
            fetchDeviceMeasurements(lai?.id, setLAIDeviceMeasurements);
            fetchDeviceMeasurements(rgb?.id, setRGBDeviceMeasurements);
        }
    }, [devices])

    // useEffect(() => {
    //     if (laiDeviceMeasurements && rgbDeviceMeasurements) {
    //         console.log(laiDeviceMeasurements);
    //         console.log(rgbDeviceMeasurements);
    //     }
    // }, [laiDeviceMeasurements, rgbDeviceMeasurements])

    return (
        <>
            {
                loading ? <Skeleton height={"30vh"} width={"100%"} variant="rectangular"></Skeleton> :
                    error ? <p>{error}</p>
                        // : !measurementExperiments ? <p>Measurement experiments fetching error</p>
                        //     :
                        //     <Grid container display={"flex"} flexDirection={"column"} size={12} spacing={3}>
                        //         {
                        //             measurementExperiments.map(m => {
                        //                 return (
                        //                     <Grid key={"grid-accordion-" + m.id} size={12}>
                        //                         <Accordion>
                        //                             <AccordionSummary
                        //                                 expandIcon={<ExpandMoreIcon />}
                        //                             >
                        //                                 <Typography component="span">{m.name}</Typography>
                        //                             </AccordionSummary>
                        //                             <AccordionDetails>
                        //                                 <Grid size={12} display={'flex'} flexDirection={'row'}>
                        //                                     <Grid size={6} display={'flex'} justifyContent={'center'} alignItems={'center'}>
                        //                                         <Image
                        //                                             src="/images/Smart-droplets-logo.svg"
                        //                                             alt="Experiment image 1"
                        //                                             width={200}
                        //                                             height={200}
                        //                                             priority
                        //                                         />
                        //                                     </Grid>
                        //                                     <Grid size={6} display={'flex'} justifyContent={'center'} alignItems={'center'}>
                        //                                         <Image
                        //                                             src="/images/Smart-droplets-logo.svg"
                        //                                             alt="Experiment image 2"
                        //                                             width={200}
                        //                                             height={200}
                        //                                             priority
                        //                                         />
                        //                                     </Grid>
                        //                                 </Grid>
                        //                             </AccordionDetails>
                        //                         </Accordion>
                        //                     </Grid>
                        //                 )
                        //             })
                        //         }
                        //     </Grid>
                        : !(laiDeviceMeasurements && rgbDeviceMeasurements) ? <p>images fetching error</p>
                            : <Grid container display={"flex"} flexDirection={"column"} size={12} spacing={3}>
                                {
                                    laiDeviceMeasurements.map((m, index) => {
                                        return <Grid key={"grid-row-" + m.id} display={'flex'} flexDirection={'row'} size={12}>
                                            <Grid size={6} display={'flex'} justifyContent={'center'} alignItems={'center'}>
                                                <Image
                                                    src={m.alternateName.value}
                                                    alt="Experiment image 1"
                                                    width={200}
                                                    height={200}
                                                    priority
                                                />
                                            </Grid>
                                            <Grid size={6} display={'flex'} justifyContent={'center'} alignItems={'center'}>
                                                <Image
                                                    src={rgbDeviceMeasurements[index].alternateName.value}
                                                    alt="Experiment image 1"
                                                    width={200}
                                                    height={200}
                                                    priority
                                                />
                                            </Grid>
                                        </Grid>
                                    })
                                }
                            </Grid>
            }
        </>
    )
}

export default ParcelDrawerImagesTab;