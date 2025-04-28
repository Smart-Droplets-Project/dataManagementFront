'use client'
import { Divider, IconButton, ListItemIcon, ListItemText, MenuItem, MenuList, Paper, Popover, Tooltip } from "@mui/material";
import { useCallback, useState } from "react";

import MoreVertIcon from '@mui/icons-material/MoreVert';
import LogoutIcon from '@mui/icons-material/Logout';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';

import { signOut } from "next-auth/react";

const ToolbarActions = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [menuAnchorEl, setMenuAnchorEl] = useState<HTMLElement | null>(null);

    const toggleMenu = useCallback(
        (event: React.MouseEvent<HTMLElement>) => {
            setMenuAnchorEl(isMenuOpen ? null : event.currentTarget);
            setIsMenuOpen((previousIsMenuOpen) => !previousIsMenuOpen);
        },
        [isMenuOpen],
    );

    return (
        <>
            <Tooltip title="Settings" enterDelay={1000}>
                <div>
                    <IconButton type="button" aria-label="settings" onClick={toggleMenu}>
                        <MoreVertIcon />
                    </IconButton>
                </div>
            </Tooltip>
            <Popover
                open={isMenuOpen}
                anchorEl={menuAnchorEl}
                onClose={toggleMenu}
                anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'left',
                }}
                disableAutoFocus
            >

                <Paper sx={{ width: 200, maxWidth: '100%' }}>
                    <MenuList>
                        <MenuItem>
                            <ListItemIcon>
                                <AccountCircleIcon fontSize="small"/>
                            </ListItemIcon>
                            <ListItemText>Account</ListItemText>
                        </MenuItem>
                        <Divider />
                        <MenuItem onClick={() => signOut({ callbackUrl: "/login" })}>
                            <ListItemIcon>
                                <LogoutIcon fontSize="small" />
                            </ListItemIcon>
                            <ListItemText>Sign Out</ListItemText>
                        </MenuItem>
                    </MenuList>
                </Paper>
            </Popover>
        </>
    );
}

export default ToolbarActions;