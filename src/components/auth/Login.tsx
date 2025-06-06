'use client';
import GenericSnackbar from "@/components/GenericSnackbar";
import { Box, Button, IconButton, InputAdornment, Link, TextField, Typography } from "@mui/material";
import Grid from '@mui/material/Grid2';
import { useState } from "react";


import LoginIcon from '@mui/icons-material/Login';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";

const Login = () => {
    const [credentials, setCredentials] = useState({ username: "", password: "" });
    const [showPassword, setShowPassword] = useState(false);

    const router = useRouter();

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setCredentials((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handleClickShowPassword = () => setShowPassword((show) => !show);

    const handleMouseDownPassword = (event: React.MouseEvent<HTMLButtonElement>) => {
        event.preventDefault();
    };

    const handleMouseUpPassword = (event: React.MouseEvent<HTMLButtonElement>) => {
        event.preventDefault();
    };

    const handleSubmit = async (event: React.MouseEvent<HTMLButtonElement>) => {
        event.preventDefault();

        const result = await signIn("credentials", {
            ...credentials,
            redirect: false,
        });

        if (result?.error) {
            handleOpenSnackbar("error", "Invalid username or password");
        } else {
            router.push("/");
        }
    };

    const [snackbarState, setSnackbarState] = useState({
        open: false,
        type: 'info' as 'success' | 'error' | 'info',
        message: '',
    });

    const handleOpenSnackbar = (type: 'success' | 'error' | 'info', message: string) => {
        setSnackbarState({ open: true, type, message });
    };


    return (
        <>
            <Grid container display={"flex"} justifyContent={"center"} size={12}>
                <Grid size={{ xs: 12, sm: 8, md: 8 }} alignItems={"center"} justifyContent={"center"} display={"flex"} flexDirection={"column"} gap={2}>
                    <img src='/images/Smart-droplets-logo.svg' alt="" width={200} />
                    <Typography variant="h6">Log In</Typography>
                    <TextField
                        fullWidth
                        label="Email"
                        name="username"
                        type="email"
                        value={credentials.username}
                        onChange={handleChange}
                        variant="outlined"
                    />
                    <TextField
                        fullWidth
                        label="Password"
                        name="password"
                        type={showPassword ? 'text' : 'password'}
                        value={credentials.password}
                        onChange={handleChange}
                        variant="outlined"
                        slotProps={{
                            input: {
                                endAdornment: <InputAdornment position="end">
                                    <IconButton
                                        aria-label={
                                            showPassword ? 'hide the password' : 'display the password'
                                        }
                                        onClick={handleClickShowPassword}
                                        onMouseDown={handleMouseDownPassword}
                                        onMouseUp={handleMouseUpPassword}
                                        edge="end"
                                    >
                                        {showPassword ? <VisibilityOff /> : <Visibility />}
                                    </IconButton>
                                </InputAdornment>
                            }
                        }}
                    />
                    <Button
                        fullWidth
                        startIcon={<LoginIcon />}
                        onClick={handleSubmit}
                        variant="contained">
                        Log in
                    </Button>
                    <Box display={"flex"}>
                        <Link textAlign={"center"} href="/register" underline="none">
                            {'Don\'t have an account yet? Register for free'}
                        </Link>
                    </Box>
                </Grid>
            </Grid>
            <GenericSnackbar
                type={snackbarState.type}
                message={snackbarState.message}
                open={snackbarState.open}
                setSnackbarState={setSnackbarState}
            />
        </>
    )
}

export default Login;