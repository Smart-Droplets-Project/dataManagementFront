'use client'

import { Box, Typography } from '@mui/material'
import { useEffect } from 'react'

export default function Error({
    error,
}: {
    error: Error & { digest?: string }
}) {
    useEffect(() => {
        // Log the error to an error reporting service
        console.error(error)
    }, [error])

    return (
        <Box display={"flex"} justifyContent={"center"} marginTop={2}>
            <Typography variant='body1'>Failed to load map</Typography>
        </Box>
    )
}