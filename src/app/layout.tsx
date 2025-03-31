import "./globals.css";
import type { Metadata } from "next";

import { AppRouterCacheProvider } from '@mui/material-nextjs/v15-appRouter';

import { NextAppProvider } from '@toolpad/core/nextjs';

import { theme } from "@/theme/theme";
import { Branding, Navigation } from "@toolpad/core";

import HomeIcon from '@mui/icons-material/Home';
import TableChartIcon from '@mui/icons-material/TableChart';
import AgricultureIcon from '@mui/icons-material/Agriculture';
import RouteIcon from '@mui/icons-material/Route';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import MapIcon from '@mui/icons-material/Map';

import ClientLocalizationProvider from "@/utils/ClientLocalizationProvider";
import AuthProvider from "@/utils/AuthProvider";
import { Suspense } from "react";


export const metadata: Metadata = {
  title: "Smart Droplets Dashboard",
};

const NAVIGATION: Navigation = [
  {
    kind: 'header',
    title: 'Dashboard',
  },
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
  },
  // {
  //   kind: 'divider'
  // },
  {
    kind: 'header',
    title: 'Tractors',
  },
  {
    segment: 'tractor-management',
    title: 'Tractor Management',
    icon: <AgricultureIcon />,
  },
  {
    segment: 'tractors',
    title: 'Tractor Tracking',
    icon: <MapIcon />,
  },
  {
    kind: 'header',
    title: 'Simulations',
  },
  {
    segment: 'simulation-results',
    title: 'Simulation Results',
    icon: <RouteIcon />,
  },
  {
    segment: 'export-simulation-results',
    title: 'Export Simulation Results',
    icon: <FileDownloadIcon />,
  },
];

const BRANDING: Branding = {
  title: "",
  logo: <img src='/images/Smart-droplets-logo.svg' alt="" />
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
            <Suspense>
              <NextAppProvider navigation={NAVIGATION} theme={theme} branding={BRANDING}>
                <AuthProvider>
                  {children}
                </AuthProvider>
              </NextAppProvider>
            </Suspense>
          </ClientLocalizationProvider>
        </AppRouterCacheProvider>
      </body>
    </html>
  );
}
