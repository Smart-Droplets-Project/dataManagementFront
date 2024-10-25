// app/dashboard/page.tsx
import ParcelList from "@/app/components/ParcelList";
import { Typography } from "@mui/material";

const DashboardPage = () => {
    return (
        <div className="flex flex-col gap-4">
            <Typography variant="h2" component="div">
                Parcel Dashboard
            </Typography>
            <ParcelList />
        </div>
    );
};

export default DashboardPage;
