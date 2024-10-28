// app/components/Navbar.tsx
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';

const pages = [
    { text: "Home", link: "/" },
    { text: "Dashboard", link: "/dashboard" },
]

const Navbar = () => {
    return (
        <Box sx={{ flexGrow: 1 }}>
            <AppBar position="static">
                <Toolbar>
                    <Box sx={{ flexGrow: 1, display: { /*xs: 'none', */ md: 'flex' }, gap: "1.2em" }}>
                        {
                            pages.map((page) => {
                                return <Button key={page.text} variant='contained' href={page.link}>
                                    <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                                        {page.text}
                                    </Typography>
                                </Button>
                            })
                        }
                    </Box>
                </Toolbar>
            </AppBar>
        </Box>
        // <nav style={{ padding: '1rem', backgroundColor: '#333', color: '#fff' }}>
        //     <ul style={{ display: 'flex', listStyle: 'none' }}>
        //         <li style={{ marginRight: '1rem' }}>
        //             <Link href="/" style={{ color: '#fff', textDecoration: 'none' }}>Home</Link>
        //         </li>
        //         <li style={{ marginRight: '1rem' }}>
        //             <Link href="/dashboard" style={{ color: '#fff', textDecoration: 'none' }}>Dashboard</Link>
        //         </li>
        //     </ul>
        // </nav>
    );
};

export default Navbar;
