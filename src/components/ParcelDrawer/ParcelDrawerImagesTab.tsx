import { MeasurementExperiment } from "@/lib/interfaces";
import Grid from '@mui/material/Grid2';
import { Accordion, AccordionDetails, AccordionSummary, Skeleton, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import Image from "next/image";


const ParcelDrawerImagesTab = (props: { selectedParcel: GeoJSON.Feature | null }) => {
    const { selectedParcel } = props;

    const [measurementExperiments, setMeasurementExperiments] = useState<MeasurementExperiment[] | null>(null);

    const [loading, setLoading] = useState(true);

    const [error, setError] = useState<string | null>(null);




    // On drawer open
    useEffect(() => {
        console.log(selectedParcel);
        if (selectedParcel) {
            const fetchMeasurementExperiments = async () => {
                try {
                    const [res1] = await Promise.all([
                        fetch(`/api/measurement-experiments`),

                    ]);
                    const data1 = await res1.json() as MeasurementExperiment[];
                    setMeasurementExperiments(data1);

                    console.log(data1);

                } catch (err) {
                    console.log(err);

                    setError('Failed to load agri products');
                } finally {
                    setLoading(false)
                }

            }

            setLoading(true)
            fetchMeasurementExperiments();
        }
    }, [selectedParcel])

    return (
        <>
            {
                loading ? <Skeleton height={"30vh"} width={"100%"} variant="rectangular"></Skeleton> :
                    error ? <p>{error}</p>
                        : !measurementExperiments ? <p>Measurement experiments fetching error</p>
                            :
                            <Grid container display={"flex"} flexDirection={"column"} size={12} spacing={3}>
                                {
                                    measurementExperiments.map(m => {
                                        return (
                                            <Grid key={"grid-accordion-" + m.id} size={12}>
                                                <Accordion>
                                                    <AccordionSummary
                                                        expandIcon={<ExpandMoreIcon />}
                                                    >
                                                        <Typography component="span">{m.name}</Typography>
                                                    </AccordionSummary>
                                                    <AccordionDetails>
                                                        <Grid size={12} display={'flex'} flexDirection={'row'}>
                                                            <Grid size={6} display={'flex'} justifyContent={'center'} alignItems={'center'}>
                                                                <Image
                                                                    src="/images/Smart-droplets-logo.svg"
                                                                    alt="Experiment image 1"
                                                                    width={200}
                                                                    height={200}
                                                                    priority
                                                                />
                                                            </Grid>
                                                            <Grid size={6} display={'flex'} justifyContent={'center'} alignItems={'center'}>
                                                                <Image
                                                                    src="/images/Smart-droplets-logo.svg"
                                                                    alt="Experiment image 2"
                                                                    width={200}
                                                                    height={200}
                                                                    priority
                                                                />
                                                            </Grid>
                                                        </Grid>
                                                    </AccordionDetails>
                                                </Accordion>
                                            </Grid>
                                        )
                                    })
                                }
                            </Grid>
            }
        </>
    )
}

export default ParcelDrawerImagesTab;