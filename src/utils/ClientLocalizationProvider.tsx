'use client'

import { LocalizationProvider } from '@mui/x-date-pickers'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'

interface ClientLocalizationProviderProps {
  children: React.ReactNode
}

export default function ClientLocalizationProvider({
  children
}: ClientLocalizationProviderProps) {
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      {children}
    </LocalizationProvider>
  )
}