import { AgriProductType } from "@/app/shared/interfaces";
import Grid from '@mui/material/Grid2';
import { Skeleton } from "@mui/material";
import { useEffect, useState } from "react";
import OperationAdditionSection from "./OperationAdditionSection";


const ParcelDrawerOperationsTab = (props: { selectedParcel: GeoJSON.Feature | null }) => {
    const { selectedParcel } = props;

    const [agriProducts, setAgriProducts] = useState<AgriProductType[] | null>(null);

    const [loading, setLoading] = useState(true);

    const [error, setError] = useState<string | null>(null);




    // On drawer open
    useEffect(() => {
        console.log(selectedParcel);
        if (selectedParcel) {
            const fetchAgriProducts = async () => {
                try {
                    const res = await fetch(`/api/agri-products`);
                    const data = await res.json() as AgriProductType[];
                    setAgriProducts(data);

                    console.log(data);

                } catch (err) {
                    console.log("error");

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
                        : !agriProducts ? <p>No agri products found</p>
                            :
                            <OperationAdditionSection
                                agriProducts={agriProducts}
                                selectedParcelId={selectedParcel?.properties?.id}>
                            </OperationAdditionSection>
            }
        </>
    )
}

export default ParcelDrawerOperationsTab;