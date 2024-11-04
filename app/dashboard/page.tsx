// app/dashboard/page.tsx
import ParcelList from "@/app/components/ParcelList";
import { Typography } from "@mui/material";
import GridLayout from "../components/GridLayout";

const DashboardPage = () => {
    return (
        <GridLayout>
            <div className="flex flex-col gap-4">
                <Typography variant="h2" component="div">
                    Parcel Dashboard
                </Typography>
                <ParcelList />
            </div>
        </GridLayout>
    );
};

export default DashboardPage;
