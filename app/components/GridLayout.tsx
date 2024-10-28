import { LayoutProps } from '@/.next/types/app/layout';
import Grid from '@mui/material/Grid2';


const GridLayout = (props: LayoutProps) => {
    return (
        <Grid container spacing={3}>
            <Grid size={{ xs: 0, md: 'grow' }}>
                <div></div>
            </Grid>
            <Grid size={6}>
                {props.children}
            </Grid>
            <Grid size={{ xs: 0, md: 'grow' }}>
                <div></div>
            </Grid>
        </Grid>
    );
};

export default GridLayout;