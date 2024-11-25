// app/components/Navbar.tsx
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import { NavButton } from './styled/NavButton';

const pages = [
    { text: "Home", link: "/" },
    { text: "Dashboard", link: "/dashboard" },
]

const Navbar = () => {
    return (
        <Box sx={{ zIndex: 1201 }}>
            <AppBar color='transparent' position="static">
                <Toolbar>
                    <Box sx={{ flexGrow: 1, display: { md: 'flex' }, gap: "1.2em" }}>
                        {
                            pages.map((page) => {
                                return <NavButton key={page.text} variant='text' href={page.link}>
                                    <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                                        {page.text}
                                    </Typography>
                                </NavButton>
                            })
                        }
                    </Box>
                </Toolbar>
            </AppBar>
        </Box>
    );
};

export default Navbar;
