'use client'
// app/components/ParcelList.tsx
import { Fragment, useEffect, useState } from 'react';
import Link from 'next/link';
import styles from './ParcelList.module.css';
import { AgriParcel } from '../shared/interfaces';
import { Box, Button, Collapse, IconButton, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from '@mui/material';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import Grid from '@mui/material/Grid2';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';

// interface Parcel {
//   id: string;
//   name: string;
//   location: string;
// }

const ParcelCard = ({ parcel }: { parcel: AgriParcel }) => (
    <Link href={`/parcels/${parcel.id}`} className={styles.cardLink}>
        <div className={styles.card}>
            <h3 className={styles.cardTitle}>{parcel.name?.value || parcel.alternateName?.value}</h3>
            <p className={styles.cardContent}>Address: {parcel.address?.value || "Unknown"}</p>
        </div>
    </Link>
);

function Row(props: { row: AgriParcel }) {
    const { row } = props;
    const [open, setOpen] = useState(false);

    return (
        <Fragment>
            <TableRow>
                <TableCell sx={{ borderBottom: 'none' }}>
                    <IconButton
                        aria-label="expand row"
                        size="small"
                        onClick={() => setOpen(!open)}
                    >
                        {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
                    </IconButton>
                </TableCell>
                <TableCell sx={{ borderBottom: 'none' }} component="th" scope="row">{row.name?.value}</TableCell>
                <TableCell sx={{ borderBottom: 'none' }}>{row.address?.value}</TableCell>
                <TableCell sx={{ borderBottom: 'none' }}>{row.area?.value}</TableCell>
            </TableRow>
            <TableRow>
                <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
                    <Collapse in={open} timeout="auto" unmountOnExit>
                        <Grid container spacing={3}>
                            <Grid size={6}>

                                <Box sx={{ margin: 1 }}>
                                    <Typography variant="h5" gutterBottom component="div">
                                        Description
                                    </Typography>
                                    <Typography variant="body1" gutterBottom component="div" sx={{ wordWrap: 'break-word' }}>
                                        {row.description?.value}
                                    </Typography>
                                    <Typography variant="h5" gutterBottom component="div">
                                        Location
                                    </Typography>
                                    <Typography variant="body1" gutterBottom component="div" sx={{ wordWrap: 'break-word' }}>
                                        WIP
                                    </Typography>
                                    {/* <Table size="small">
                                <TableHead>
                                    <TableRow>
                                        <TableCell>Date</TableCell>
                                        <TableCell>Customer</TableCell>
                                        <TableCell align="right">Amount</TableCell>
                                        <TableCell align="right">Total price ($)</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {row.history.map((historyRow) => (
                                        <TableRow key={historyRow.date}>
                                            <TableCell component="th" scope="row">
                                                {historyRow.date}
                                            </TableCell>
                                            <TableCell>{historyRow.customerId}</TableCell>
                                            <TableCell align="right">{historyRow.amount}</TableCell>
                                            <TableCell align="right">
                                                {Math.round(historyRow.amount * row.price * 100) / 100}
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table> */}
                                </Box>
                            </Grid>
                            <Grid size={6}>
                                <Typography variant="h5" gutterBottom component="div">
                                    Actions
                                </Typography>
                                <Button variant='contained' href={`/parcels/${row.id}`} color='secondary'>
                                    <Typography variant='body1'>
                                        View Parcel
                                    </Typography>
                                </Button>
                            </Grid>
                        </Grid>
                    </Collapse>
                </TableCell>
            </TableRow>
        </Fragment>
    );
}



const ParcelList = () => {
    const [parcels, setParcels] = useState<AgriParcel[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchParcels = async () => {
            try {
                const res = await fetch('/api/parcels');
                const data = await res.json();
                setParcels(data);
            } catch (err) {
                setError('Failed to load parcels');
            } finally {
                setLoading(false);
            }
        };

        fetchParcels();
    }, []);

    if (loading) return <p>Loading...</p>;
    if (error) return <p>{error}</p>;

    return (
        <TableContainer component={Paper}>
            <Table aria-label="collapsible table">
                <TableHead>
                    <TableRow >
                        <TableCell />
                        <TableCell>Name</TableCell>
                        <TableCell>Address</TableCell>
                        <TableCell>Area</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {parcels.map((parcel) => (
                        <Row key={parcel.id} row={parcel} />
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
    );
};

export default ParcelList;
