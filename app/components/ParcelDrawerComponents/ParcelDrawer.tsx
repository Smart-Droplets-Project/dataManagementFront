import { Box, Button, Divider, Drawer, List, ListItem, ListItemButton, ListItemIcon, ListItemText } from "@mui/material";
import InboxIcon from '@mui/icons-material/MoveToInbox';
import MailIcon from '@mui/icons-material/Mail';
import { useParcelDrawer } from "./ParcelDrawerContext";

const ParcelDrawer = () => {
  const { selectedParcel, closeDrawer } = useParcelDrawer();

  console.log(selectedParcel);

  const isParcelDrawerOpen = Boolean(selectedParcel)


  const DrawerList = (
    <Box sx={{ width: 250 }} role="presentation" >
      <List>
        {['Inbox', 'Starred', 'Send email', 'Drafts'].map((text, index) => (
          <ListItem key={text} disablePadding>
            <ListItemButton>
              <ListItemIcon>
                {index % 2 === 0 ? <InboxIcon /> : <MailIcon />}
              </ListItemIcon>
              <ListItemText primary={text} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
      <Divider />
      <List>
        {['All mail', 'Trash', 'Spam'].map((text, index) => (
          <ListItem key={text} disablePadding>
            <ListItemButton>
              <ListItemIcon>
                {index % 2 === 0 ? <InboxIcon /> : <MailIcon />}
              </ListItemIcon>
              <ListItemText primary={text} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Box>
  );

  return (
    <div>
      <Drawer open={isParcelDrawerOpen} onClose={closeDrawer} anchor="bottom"
        sx={
          {
            "& .MuiPaper-root": {
              borderTopLeftRadius: "0.5rem",
              borderTopRightRadius: "0.5rem"
            }
          }
        }>
        {DrawerList}
      </Drawer>
    </div>
  );
}

export default ParcelDrawer