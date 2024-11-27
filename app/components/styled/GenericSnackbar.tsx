import React, { SetStateAction, useEffect, useState } from 'react';
import { Snackbar, Alert } from '@mui/material';

type SnackbarType = 'success' | 'error' | 'info';

interface GenericSnackbarProps {
    type: SnackbarType;
    message: string;
    open: boolean;
    setSnackbarState: React.Dispatch<SetStateAction<{ open: boolean; type: "success" | "error" | "info"; message: string; }>>
}

const GenericSnackbar: React.FC<GenericSnackbarProps> = ({ type, message, open, setSnackbarState }) => {
    const [isOpen, setIsOpen] = useState(open);

    const autoHideDuration = 6000;
    let closeTimeout: NodeJS.Timeout | null = null;

    useEffect(() => {
        if (open) {
            setIsOpen(true)
            closeTimeout = setTimeout(() => {
                setSnackbarState({ open: false, type: type, message: message })
            }, autoHideDuration);
        }
    }, [open]);

    const handleClose = (event?: React.SyntheticEvent | Event, reason?: string) => {
        if (reason === 'clickaway') return; // Do not close on clickaway if desired

        setSnackbarState({ open: false, type: type, message: message })
        setIsOpen(false);
        if (closeTimeout) {
            clearTimeout(closeTimeout);
            closeTimeout = null;
        }
    };

    return (
        <Snackbar open={isOpen} autoHideDuration={autoHideDuration}
            onClose={handleClose} anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}>
            <Alert onClose={handleClose} severity={type} variant="filled">
                {message}
            </Alert>
        </Snackbar>
    );
};

export default GenericSnackbar;