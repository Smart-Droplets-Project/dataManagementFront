// app/components/ParcelMap.tsx
'use client'

import { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { createGridOverPolygon } from '../utils/geojson';

interface ParcelMapProps {
    geoJson: GeoJSON.Polygon;
    gridSize: string;
}


const ParcelMap: React.FC<ParcelMapProps> = ({ geoJson, gridSize }) => {
    const mapRef = useRef<HTMLDivElement>(null);
    const mapInstanceRef = useRef<L.Map | null>(null);

    useEffect(() => {
        if (mapRef.current && !mapInstanceRef.current) {
            // Initialize the map
            mapInstanceRef.current = L.map(mapRef.current).setView([0, 0], 2);

            // Add OpenStreetMap tile layer
            L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                attribution: '© OpenStreetMap contributors'
            }).addTo(mapInstanceRef.current);
        }

        if (mapInstanceRef.current) {
            // Clear existing layers
            mapInstanceRef.current.eachLayer((layer) => {
                if (layer instanceof L.GeoJSON) {
                    mapInstanceRef.current?.removeLayer(layer);
                }
            });

            // Add GeoJSON layer
            const geoJsonLayer = L.geoJSON(geoJson, {
                style: {
                    color: '#ff7800',
                    weight: 5,
                    opacity: 0.65
                }
            }).addTo(mapInstanceRef.current);


            // Create and add the grid
            const grid = createGridOverPolygon(geoJson, Number(gridSize));
            L.geoJSON(grid, {
                style: {
                    color: '#000000',
                    weight: 1,
                    opacity: 0.25
                }
            }).addTo(mapInstanceRef.current);

            // Fit the map to the GeoJSON bounds
            mapInstanceRef.current.fitBounds(geoJsonLayer.getBounds());
        }

        // Cleanup function
        return () => {
            if (mapInstanceRef.current) {
                mapInstanceRef.current.remove();
                mapInstanceRef.current = null;
            }
        };
    }, [geoJson, Number(gridSize)]);


    return (
        <div className="w-full flex-grow">
            <div ref={mapRef} className="w-full h-full"></div>
        </div>
    );;
};

export default ParcelMap;
