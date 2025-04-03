import { Box, Skeleton } from "@mui/material";

export default function Loading() {
    return (
        <Box sx={{ padding: 3, height: "100%" }}>
            <Skeleton sx={{ transform: "none",  height: "100%" }} />
        </Box>
    );
}
