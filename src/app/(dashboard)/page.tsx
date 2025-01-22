import { Box, Typography } from "@mui/material";
import Image from "next/image";

export default function Home() {
    return (
        <Box display={"flex"} flexDirection={"column"} alignItems={"center"} gap={4}>
            <Image
                src="/images/Smart-droplets-logo.svg"
                alt="Smart Droplets logo"
                width={720}
                height={152}
                priority
            />
            <Typography variant="h4">
                Welcome to the Smart Droplets Dashboard!
            </Typography>
        </Box>
    );
}
