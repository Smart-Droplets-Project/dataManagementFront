import { AgriProductType, CommandMessage } from "@/app/shared/interfaces";
import Grid from '@mui/material/Grid2';
import { Skeleton } from "@mui/material";
import { useEffect, useState } from "react";
import OperationAdditionSection from "./OperationAdditionSection";
import CommandMessageSection from "./CommandMessageSection";


const ParcelDrawerOperationsTab = (props: { selectedParcel: GeoJSON.Feature | null }) => {
    const { selectedParcel } = props;

    const [agriProducts, setAgriProducts] = useState<AgriProductType[] | null>(null);
    const [commandMessages, setCommandMessages] = useState<CommandMessage[] | null>(null);

    const [loading, setLoading] = useState(true);

    const [error, setError] = useState<string | null>(null);




    // On drawer open
    useEffect(() => {
        console.log(selectedParcel);
        if (selectedParcel) {
            const fetchAgriProducts = async () => {
                try {
                    const [res1, res2] = await Promise.all([
                        fetch(`/api/agri-products`),
                        fetch(`/api/command-messages`),

                    ]);
                    const data1 = await res1.json() as AgriProductType[];
                    const data2 = await res2.json() as CommandMessage[];
                    setAgriProducts(data1);
                    setCommandMessages(data2);

                    console.log(data1);
                    console.log(data2);

                } catch (err) {
                    console.log(err);

                    setError('Failed to load agri products');
                } finally {
                    setLoading(false)
                }

            }

            setLoading(true)
            fetchAgriProducts()
        }
    }, [selectedParcel])

    return (
        <>
            {
                loading ? <Skeleton height={"30vh"} width={"100%"} variant="rectangular"></Skeleton> :
                    error ? <p>{error}</p>
                        : !agriProducts || !commandMessages ? <p>Agri products and/or command messages fetching error</p>
                            :
                            <Grid container display={"flex"} flexDirection={"column"} size={12} spacing={3}>
                                <Grid size={12}>
                                    <OperationAdditionSection
                                        agriProducts={agriProducts}
                                        selectedParcelId={selectedParcel?.properties?.id}>
                                    </OperationAdditionSection>
                                </Grid>
                                <Grid size={12}>
                                    <CommandMessageSection 
                                        commandMessages={commandMessages}>
                                    </CommandMessageSection>
                                </Grid>
                            </Grid>
            }
        </>
    )
}

export default ParcelDrawerOperationsTab;