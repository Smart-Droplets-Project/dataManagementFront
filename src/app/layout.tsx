import "./globals.css";
import type { Metadata } from "next";

import { AppRouterCacheProvider } from '@mui/material-nextjs/v15-appRouter';

import { NextAppProvider } from '@toolpad/core/nextjs';

import { theme } from "@/theme/theme";
import { Branding, Navigation } from "@toolpad/core";

import HomeIcon from '@mui/icons-material/Home';
import TableChartIcon from '@mui/icons-material/TableChart';
import ClientLocalizationProvider from "@/utils/ClientLocalizationProvider";


export const metadata: Metadata = {
  title: "Smart Droplets Dashboard",
};

const NAVIGATION: Navigation = [
  {
    segment: '',
    title: 'Home',
    icon: <HomeIcon />,
  },
  {
    kind: 'header',
    title: 'Parcels',
  },
  {
    segment: 'parcels',
    title: 'Parcel Overview',
    icon: <TableChartIcon />,
    pattern: 'parcels{/:id}*'

  }
];

const BRANDING: Branding = {
  title: "Smart Droplets Dashboard",
  logo: null
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <AppRouterCacheProvider options={{ enableCssLayer: true }}>
          <ClientLocalizationProvider>
            <NextAppProvider navigation={NAVIGATION} theme={theme} branding={BRANDING}>
              {children}
            </NextAppProvider>
          </ClientLocalizationProvider>
        </AppRouterCacheProvider>
      </body>
    </html>
  );
}
