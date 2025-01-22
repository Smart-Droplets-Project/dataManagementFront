import { AgriProductType } from "@/lib/interfaces";
import Grid from '@mui/material/Grid2';
import { Button, Card, CardContent, CircularProgress, FormControl, FormHelperText, InputLabel, MenuItem, Select, SelectChangeEvent, TextField, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import GenericSnackbar from "@/components/GenericSnackbar";
import dayjs, { Dayjs } from "dayjs";
import { DatePicker } from "@mui/x-date-pickers";

const parcelOperationTypesHardcoded = [
    "fertilizer"
]

const OperationAdditionSection = (props: { agriProducts: AgriProductType[], selectedParcelId: string }) => {
    const { agriProducts, selectedParcelId } = props
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
        const inputValue = event.target.value === '' ? '' : Number(event.target.value);
        setQuantity(inputValue);
    };

    const [date, setDate] = useState<Dayjs | null>(dayjs('2024-3-10'));


    const [loadingSelect, setLoadingSelect] = useState(false);
    const [loadingSubmit, setLoadingSubmit] = useState(false);

    const [, setError] = useState<string | null>(null);
    const [, setErrorSelect] = useState<string | null>(null);

    const [snackbarState, setSnackbarState] = useState({
        open: false,
        type: 'info' as 'success' | 'error' | 'info',
        message: '',
    });

    const handleOpenSnackbar = (type: 'success' | 'error' | 'info', message: string) => {
        setSnackbarState({ open: true, type, message });
    };

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
                    console.log(err)
                } finally {
                    setLoadingSelect(false)
                }

            }

            setLoadingSelect(true)
            fetchOperationTypes()
        }
    }, [selectedAgriProduct])

    // On second (operation types) select change
    useEffect(() => {
        setQuantity('')
    }, [selectedOperationType])

    const handleSubmit = async () => {
        setLoadingSubmit(true);
        try {
            const queryParams = new URLSearchParams({
                parcel_id: selectedParcelId,
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
            console.log(error);

        } finally {
            setLoadingSubmit(false);
        }
    }

    return (
        <>
            <Card variant="outlined">
                <CardContent sx={{ display: "flex", flexDirection: "column", gap: "4" }}>
                    <Typography marginBottom={3} variant="h5" component="div">
                        Operation Addition
                    </Typography>
                    <Grid container display={"flex"} flexDirection={{ xs: "column", md: "row" }} size={12} spacing={3}>
                        <Grid size={{ xs: 12, md: 3, lg: 4 }}>
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

                        <Grid size={{ xs: 12, md: 3, lg: 4 }}>
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

                        <Grid size={{ xs: 12, md: 3, lg: 4 }}>
                            {/* Quantity */}
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
                        <Grid size={{ xs: 12, md: 3, lg: 4 }}>
                            {/* Date */}
                            <FormControl fullWidth>
                                <DatePicker
                                    label="Date"
                                    value={date}
                                    onChange={(newValue: any) => setDate(newValue)}
                                />
                            </FormControl>
                        </Grid>
                        <Grid size={{ xs: 12, md: 3, lg: 4 }}>
                            <Button
                                disabled={loadingSelect || !selectedAgriProduct || !selectedOperationType || !quantity}
                                startIcon={loadingSubmit ? <CircularProgress size={20} sx={{ color: 'black' }} /> : <ArrowUpwardIcon />}
                                onClick={handleSubmit}
                                size="large" variant='contained' color='secondary'>
                                Submit
                            </Button>
                        </Grid>
                    </Grid>
                </CardContent>
            </Card>
            <GenericSnackbar
                type={snackbarState.type}
                message={snackbarState.message}
                open={snackbarState.open}
                setSnackbarState={setSnackbarState}>
            </GenericSnackbar>
        </>
    )
}

export default OperationAdditionSection;