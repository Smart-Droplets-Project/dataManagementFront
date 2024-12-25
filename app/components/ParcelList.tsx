// app/components/ParcelList.tsx
import { Fragment, useState } from 'react';
import { AgriParcel } from '../shared/interfaces';
import { Box, Button, Collapse, IconButton, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from '@mui/material';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import Grid from '@mui/material/Grid2';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';

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
                                </Box>
                            </Grid>
                            <Grid size={6}>
                                <Box sx={{ margin: 1 }}>
                                    <Typography variant="h5" gutterBottom component="div">
                                        Actions
                                    </Typography>
                                    <Button variant='contained' href={`/parcels/${row.id}`} color='secondary'>
                                        <Typography variant='body1'>
                                            View Parcel
                                        </Typography>
                                    </Button>
                                </Box>
                            </Grid>
                            <Grid size={12}>
                                <Box sx={{ margin: 1 }}>

                                    <Typography variant="h5" gutterBottom component="div">
                                        Location
                                    </Typography>
                                    <Table size="small">
                                        <TableHead>
                                            <TableRow>
                                                <TableCell>Type</TableCell>
                                                <TableCell align='right'>Latitude</TableCell>
                                                <TableCell align='right'>Longitude</TableCell>
                                            </TableRow>
                                        </TableHead>
                                        <TableBody>
                                            {row.location?.value.features.map((feature, featureIndex) => {
                                                const { name } = feature.properties;
                                                const { coordinates } = feature.geometry;

                                                return !coordinates.length
                                                    ? <Fragment key={featureIndex}></Fragment>
                                                    : Array.isArray(coordinates[0])
                                                        ?
                                                        (coordinates[0] as number[][]).map((coordinate, coordIndex) => (
                                                            <TableRow key={`${featureIndex}-${coordIndex}`}>
                                                                <TableCell component="td" scope="row">{coordIndex == 0 && (name == "rows" ? "Parcel Rows" : "Parcel Borders")}</TableCell>
                                                                <TableCell component="td" align='right'>{coordinate[0]}</TableCell>
                                                                <TableCell component="td" align='right'>{coordinate[1]}</TableCell>
                                                            </TableRow>
                                                        ))
                                                        :
                                                        <TableRow key={featureIndex}>
                                                            <TableCell component="td" scope="row">Center</TableCell>
                                                            <TableCell align='right'>{coordinates[0]}</TableCell>
                                                            <TableCell align='right'>{coordinates[1]}</TableCell>
                                                        </TableRow>
                                            })}
                                        </TableBody>
                                    </Table>
                                </Box>
                            </Grid>
                        </Grid>
                    </Collapse>
                </TableCell>
            </TableRow>
        </Fragment>
    );
}



const ParcelList = (props: { parcels: AgriParcel[] }) => {
    const { parcels } = props;
    
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
