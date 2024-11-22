'use client'
import { styled } from '@mui/material/styles';
import Button, { ButtonProps } from '@mui/material/Button';

export const NavButton = styled(Button)<ButtonProps>(({ theme }) => ({
    backgroundColor: 'black',
    color: 'white',
    borderRadius: theme.shape.borderRadius,
    '&:hover': {
        backgroundColor: '#333',
    },
    '&.MuiButton-outlined': {
        border: '2px solid black',
        backgroundColor: 'transparent',
        color: 'black',
        '&:hover': {
            borderColor: 'black',
            backgroundColor: 'rgba(0, 0, 0, 0.1)',
            color: 'white',
        },
    },
    '&.MuiButton-text': {
        backgroundColor: 'transparent',
        color: 'black',
        '&:hover': {
            backgroundColor: 'rgba(0, 0, 0, 0.1)',
        },
    },
}));