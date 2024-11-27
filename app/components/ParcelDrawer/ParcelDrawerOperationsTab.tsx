import { AgriProductType } from "@/app/shared/interfaces";
import Grid from '@mui/material/Grid2';
import { Alert, Button, CircularProgress, FormControl, FormHelperText, InputLabel, MenuItem, Select, SelectChangeEvent, Skeleton, Snackbar, TextField } from "@mui/material";
import { useEffect, useState } from "react";
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import GenericSnackbar from "../styled/GenericSnackbar";

const parcelOperationTypesHardcoded = [
    "fertilizer"
]

const ParcelDrawerOperationsTab = (props: { selectedParcel: GeoJSON.Feature | null }) => {
    const { selectedParcel } = props;

    const [agriProducts, setAgriProducts] = useState<AgriProductType[] | null>(null);
    const [selectedAgriProduct, setSelectedAgriProduct] = useState<string>('');
    const handleSelectedAgriProductChange = (event: SelectChangeEvent) => {
        setSelectedAgriProduct(event.target.value as string);
    };

    const [parcelOperationTypes, setParcelOperationTypes] = useState<string[] | null>(null);
    const [selectedOperationType, setSelectedOperationType] = useState<string>('');
    const handleSelectedOperationTypeChange = (event: SelectChangeEvent) => {
        setSelectedOperationType(event.target.value as string);
    };

    const [quantity, setQuantity] = useState<number | ''>('');

    const handleQauntityChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const inputValue = event.target.value === '' ? '' : Number(event.target.value); // Convert to number or keep empty
        setQuantity(inputValue);
    };

    const [loading, setLoading] = useState(true);
    const [loadingSelect, setLoadingSelect] = useState(false);
    const [loadingSubmit, setLoadingSubmit] = useState(false);

    const [error, setError] = useState<string | null>(null);
    const [errorSelect, setErrorSelect] = useState<string | null>(null);

    const [snackbarState, setSnackbarState] = useState({
        open: false,
        type: 'info' as 'success' | 'error' | 'info',
        message: '',
    });

    const handleOpenSnackbar = (type: 'success' | 'error' | 'info', message: string) => {
        setSnackbarState({ open: true, type, message });
    };


    // On drawer open
    useEffect(() => {
        console.log(selectedParcel);
        setSelectedAgriProduct('')
        setSelectedOperationType('')
        setQuantity('')
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

    // On first (agri product) select change
    useEffect(() => {
        setSelectedOperationType('')
        setQuantity('')
        if (selectedAgriProduct) {
            const fetchOperationTypes = async () => {
                try {
                    await new Promise((resolve) => setTimeout(resolve, 500)); // TODO: change simulation to backend call when implemented
                    const data = parcelOperationTypesHardcoded
                    setParcelOperationTypes(data);

                    console.log(data);

                } catch (err) {
                    setErrorSelect('Failed to load parcel operation types');
                } finally {
                    setLoadingSelect(false)
                }

            }

            setLoadingSelect(true)
            fetchOperationTypes()
        }
    }, [selectedAgriProduct])

    useEffect(() => {
        setQuantity('')
    }, [selectedOperationType])

    const handleSubmit = async () => {
        setLoadingSubmit(true);
        try {
            const queryParams = new URLSearchParams({
                parcel_id: selectedParcel?.properties?.id,
                agri_product: selectedAgriProduct,
                operation_type: selectedOperationType,
                quantity: String(quantity)
            })

            const res = await fetch(`/api/parcel-operations?${queryParams}`, {
                method: 'POST'
            });

            if (res.ok) {
                handleOpenSnackbar("success", "Successfully added operation")
            } else {
                const data = await res.json();
                handleOpenSnackbar("error", data.error)
            }

        } catch (error) {
            setError("Error occurred during operation addition")
            console.log("error");

        } finally {
            setLoadingSubmit(false);
        }
    }

    return (
        <>
            {
                loading ? <Skeleton height={"30vh"} width={"100%"} variant="rectangular"></Skeleton> :
                    error ? <p>{error}</p>
                        : !agriProducts ? <p>No agri products found</p>
                            :
                            <Grid container display={"flex"} flexDirection={{ xs: "column", md: "row" }} size={12} spacing={3}>
                                <Grid size={{ xs: 12, md: 4 }}>
                                    {/* Agri Products */}
                                    <FormControl fullWidth>
                                        <InputLabel id="agri-products-label">Agri Products</InputLabel>
                                        <Select
                                            labelId="agri-products-label"
                                            autoWidth
                                            value={selectedAgriProduct}
                                            onChange={handleSelectedAgriProductChange}
                                            label="Agri Products"
                                            disabled={loadingSelect}
                                        >
                                            <MenuItem key="agri-product-empty" value="">
                                                <em>Please select an agri product</em>
                                            </MenuItem>
                                            {
                                                agriProducts?.map((agriProduct) => {
                                                    return <MenuItem key={agriProduct.id} value={agriProduct.id}>{agriProduct.name?.value}</MenuItem>
                                                })
                                            }
                                        </Select>
                                    </FormControl>
                                </Grid>

                                <Grid size={{ xs: 12, md: 4 }}>
                                    {/* Operation Types */}
                                    <FormControl fullWidth>
                                        <InputLabel id="operation-types-label">Operation Types</InputLabel>
                                        <Select
                                            labelId="operation-types-label"
                                            autoWidth
                                            value={selectedOperationType}
                                            onChange={handleSelectedOperationTypeChange}
                                            label="Operation Types"
                                            disabled={loadingSelect || !selectedAgriProduct}
                                        >
                                            <MenuItem key="operation-types-empty" value="">
                                                <em>Please select an operation type</em>
                                            </MenuItem>
                                            {
                                                parcelOperationTypes?.map((parcelOperationType) => {
                                                    return <MenuItem key={parcelOperationType} value={parcelOperationType}>{parcelOperationType}</MenuItem>
                                                })
                                            }
                                        </Select>
                                        {!selectedAgriProduct && <FormHelperText>Please select an agri product first</FormHelperText>}
                                    </FormControl>
                                </Grid>

                                <Grid size={{ xs: 12, md: 3 }}>
                                    {/* Operation Types */}
                                    <FormControl fullWidth>
                                        <TextField
                                            label="Quantity"
                                            type="number"
                                            value={quantity} // Bind the state variable
                                            onChange={handleQauntityChange} // Update state on change
                                            variant="outlined"
                                            disabled={loadingSelect || !selectedOperationType}
                                        />
                                        <FormHelperText>In kilograms</FormHelperText>
                                    </FormControl>
                                </Grid>
                                <Grid size={{ xs: 12, md: 1 }}>
                                    <Button
                                        disabled={loadingSelect || !selectedAgriProduct || !selectedOperationType || !quantity}
                                        startIcon={loadingSubmit ? <CircularProgress size={20} sx={{ color: 'black' }} /> : <ArrowUpwardIcon />}
                                        onClick={handleSubmit}
                                        size="large" variant='contained' color='secondary'>
                                        Submit
                                    </Button>
                                </Grid>
                            </Grid>
            }
            <GenericSnackbar
                type={snackbarState.type}
                message={snackbarState.message}
                open={snackbarState.open}
                setSnackbarState={setSnackbarState}>
            </GenericSnackbar>
        </>
    )
}

export default ParcelDrawerOperationsTab;