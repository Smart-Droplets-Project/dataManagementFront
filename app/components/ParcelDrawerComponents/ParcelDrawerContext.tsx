import { createContext, useContext, useState } from "react";

interface ParcelDrawerContextProps {
    isParcelDrawerOpen: boolean;
    openDrawer: () => void;
    closeDrawer: () => void;
}

const ParcelDrawerContext = createContext<ParcelDrawerContextProps | undefined>(undefined);

export const ParcelDrawerProvider = ({ children }: { children: React.ReactNode }) => {
    const [isParcelDrawerOpen, setParcelDrawerOpen] = useState(false);

    const openDrawer = () => setParcelDrawerOpen(true);
    const closeDrawer = () => setParcelDrawerOpen(false);

    return (
        <ParcelDrawerContext.Provider value={{ isParcelDrawerOpen, openDrawer, closeDrawer }}>
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