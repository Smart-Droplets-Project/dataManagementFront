'use client'

import { createContext, useContext, useState } from "react";

interface ParcelDrawerContextProps {
    selectedParcel: GeoJSON.Feature | null;
    openDrawer: (feature: GeoJSON.Feature) => void;
    closeDrawer: () => void;
}

const ParcelDrawerContext = createContext<ParcelDrawerContextProps | undefined>(undefined);

export const ParcelDrawerProvider = ({ children }: { children: React.ReactNode }) => {
    const [selectedParcel, setSelectedParcel] = useState<GeoJSON.Feature | null>(null);

    const openDrawer = (feature: GeoJSON.Feature) => {
        setSelectedParcel(feature);
    }

    const closeDrawer = () => {
        setSelectedParcel(null);
    }


    return (
        <ParcelDrawerContext.Provider value={{ selectedParcel, openDrawer, closeDrawer }}>
            {children}
        </ParcelDrawerContext.Provider>
    );
};

export const useParcelDrawer = (): ParcelDrawerContextProps => {
    const context = useContext(ParcelDrawerContext);
    if (!context)
        throw new Error('useParcelDrawer must be used within a ParcelDrawerProvider');
    return context;
};