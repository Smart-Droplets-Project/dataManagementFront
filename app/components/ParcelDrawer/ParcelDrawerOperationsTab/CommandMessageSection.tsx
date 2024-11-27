import { CommandMessage } from "@/app/shared/interfaces";
import { Card, CardContent, List, ListItem, ListItemText, Typography } from "@mui/material";

const CommandMessageSection = (props: { commandMessages: CommandMessage[] }) => {
    const { commandMessages } = props

    return (
        <Card variant="outlined">
            <CardContent sx={{ display: "flex", flexDirection: "column", gap: "4" }}>
                <Typography marginBottom={3} variant="h5" component="div">
                    Command Messages
                </Typography>
                <List dense={false}>
                    {
                        commandMessages.map((cm: CommandMessage) => {
                            return <ListItem key={cm.id}>
                                <ListItemText primary={cm.command.value} secondary={cm.commandTime.value} />

                            </ListItem>
                        })
                    }
                </List>
            </CardContent>
        </Card>
    )
}

export default CommandMessageSection;