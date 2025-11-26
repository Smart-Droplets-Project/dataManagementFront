import { Device, DeviceMeasurement } from "@/lib/interfaces";
import Grid from '@mui/material/Grid2';
import { Skeleton } from "@mui/material";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import Image from "next/image";

import { List, useDynamicRowHeight, type RowComponentProps } from "react-window";

type RowProps = {
    images: {
        lai: string[];
        rbg: string[];
    };
};

function RowComponent({ index, images, style }: RowComponentProps<RowProps>) {
    const url1 = images.lai[index];
    const url2 = images.rbg[index];

    return (
        <div style={style}>
            <Grid display={'flex'} flexDirection={'row'} size={12} marginBottom={2}>
                <Grid size={6} display={'flex'} justifyContent={'center'} alignItems={'center'}>
                    <Image
                        src={url1}
                        alt="Experiment image 1"
                        width={200}
                        height={200}
                        priority
                    />
                </Grid>
                <Grid size={6} display={'flex'} justifyContent={'center'} alignItems={'center'}>
                    <Image
                        src={url2}
                        alt="Experiment image 1"
                        width={200}
                        height={200}
                        priority
                    />
                </Grid>
            </Grid>
        </div>
    );
}

const ParcelDrawerImagesTab = (props: { selectedParcel: GeoJSON.Feature | null }) => {
    const { selectedParcel } = props;

    const [loading, setLoading] = useState(true);

    const [error, setError] = useState<string | null>(null);

    const [devices, setDevices] = useState<Device[] | null>(null);
    const [laiDeviceMeasurements, setLAIDeviceMeasurements] = useState<DeviceMeasurement[] | null>(null);
    const [rgbDeviceMeasurements, setRGBDeviceMeasurements] = useState<DeviceMeasurement[] | null>(null);

    const [imageProps, setImageProps] = useState<RowProps>({ images: { lai: [], rbg: [] } });


    // On drawer open
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

    useEffect(() => {
        if (laiDeviceMeasurements && rgbDeviceMeasurements) {
            const laiUrls = laiDeviceMeasurements.map((item: any) => item.alternateName.value);
            const rgbUrls = rgbDeviceMeasurements.map((item: any) => item.alternateName.value);
            setImageProps({
                images: {
                    lai: laiUrls,
                    rbg: rgbUrls
                }
            });
        }
    }, [laiDeviceMeasurements, rgbDeviceMeasurements]);

    const rowHeight = useDynamicRowHeight({
        defaultRowHeight: 250
    });

    return (
        <>
            {
                loading ? <Skeleton height={"30vh"} width={"100%"} variant="rectangular"></Skeleton> :
                    error ? <p>{error}</p>

                        : !(laiDeviceMeasurements && rgbDeviceMeasurements) ? <p>images fetching error</p>
                            : <List<RowProps>
                                rowComponent={RowComponent}
                                rowCount={laiDeviceMeasurements.length}
                                rowHeight={rowHeight}
                                rowProps={imageProps}
                            />
            }
        </>
    )
}

export default ParcelDrawerImagesTab;