import { CommandMessage } from "@/app/shared/interfaces";
import { Card, CardContent, Divider, IconButton, List, ListItem, ListItemText, Tooltip, Typography } from "@mui/material";
import DownloadIcon from '@mui/icons-material/Download';
import { Fragment } from "react";

const CommandMessageSection = (props: { commandMessages: CommandMessage[] }) => {
    const { commandMessages } = props

    const handleDownload = ((jsonData: CommandMessage) => {
        const blob = new Blob([JSON.stringify(jsonData.waypoints.value, null, 2)], { type: "application/json" });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = `prescription_map_${jsonData.commandTime.value}.geojson`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
    });

    return (
        <Card variant="outlined">
            <CardContent sx={{ display: "flex", flexDirection: "column", gap: "4" }}>
                <Typography marginBottom={3} variant="h5" component="div">
                    Command Messages
                </Typography>
                <List dense={false}>
                    {
                        commandMessages.map((cm: CommandMessage, index, arr) => {
                            return <Fragment key={cm.id}>
                                <ListItem secondaryAction={
                                    <Tooltip title="Download GeoJSON" arrow placement="top">
                                        <IconButton onClick={() => handleDownload(cm)} edge="end">
                                            <DownloadIcon />
                                        </IconButton>
                                    </Tooltip>
                                }>
                                    <ListItemText primary={cm.command.value} secondary={cm.commandTime.value} />
                                </ListItem>
                                {arr.length - 1 !== index && <Divider variant="fullWidth" component="li" />}
                            </Fragment>
                        })
                    }
                </List>
            </CardContent>
        </Card>
    )
}

export default CommandMessageSection;