import Grid from '@mui/material/Grid2';

export default function AuthenticationPagesLayout(props: { children: React.ReactNode }) {

    return (
        <Grid container padding={4} height={"100vh"} display={"flex"} alignItems={"center"} spacing={{ xs: 0, sm: 0, md: 3 }}>
            <Grid size={{ xs: 0, sm: 0, md: 'grow' }}>
                <div></div>
            </Grid>
            <Grid container size={{ xs: 12, sm: 12, md: 6 }}>
                {props.children}
            </Grid>
            <Grid size={{ xs: 0, sm: 0, md: 'grow' }}>
                <div></div>
            </Grid>
        </Grid>
    );
};