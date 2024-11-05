// app/components/ParcelMap.tsx
import { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { createGridOverPolygon } from '../utils/geojson';

interface ParcelMapProps {
    geoJsonList: GeoJSON.Feature[];
    selectedParcelId: string;
    gridSize: string;
}


const ParcelMap: React.FC<ParcelMapProps> = ({ geoJsonList, selectedParcelId, gridSize }) => {
    console.log(geoJsonList);

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

            // Create and add the grid
            geoJsonList.forEach(geoJson => {
                if (mapInstanceRef.current) {
                    const grid = createGridOverPolygon(geoJson.geometry as GeoJSON.Polygon, Number(gridSize));
                    L.geoJSON(grid, {
                        style: {
                            color: '#000000',
                            weight: 1,
                            opacity: 0.25,
                        }
                    }).addTo(mapInstanceRef.current);
                }
            });

            // Add GeoJSON layer
            const geoJsonLayer = L.geoJSON(geoJsonList, {
                style: {
                    color: '#ff7800',
                    weight: 5,
                    opacity: 0.65
                },
                onEachFeature: (feature, layer) => {
                    layer.on({
                        mouseover: (e) => {
                            var layer = e.target;

                            layer.setStyle({
                                weight: 5,
                                color: '#1962ad', // TODO: change this to fetch color from colors file
                                dashArray: '',
                                fillOpacity: 0.7
                            });

                            layer.bringToFront();
                        },
                        mouseout: (e) => {
                            geoJsonLayer.resetStyle(e.target);
                        },
                        click: (e) => {
                            console.log(e.target);
                            if (mapInstanceRef.current)
                                mapInstanceRef.current.fitBounds(e.target.getBounds())
                        }
                    });
                }
            }).addTo(mapInstanceRef.current);


            // Fit the map to the GeoJSON bounds
            mapInstanceRef.current.fitBounds(geoJsonLayer.getBounds()); // TODO: This makes an animation from the complete bounds to the selected parcel bounds 

            // Function to fit bounds to a specific polygon by id
            const fitBoundsToId = (id: string) => {
                const feature = geoJsonList.find(polygon => polygon?.properties?.id === id);
                if (feature) {
                    const bounds = L.geoJSON(feature).getBounds();
                    if (mapInstanceRef.current)
                        mapInstanceRef.current.fitBounds(bounds);
                } else {
                    console.error(`Polygon with ID ${id} not found.`);
                }
            };

            fitBoundsToId(selectedParcelId);

        }

        // Cleanup function
        return () => {
            if (mapInstanceRef.current) {
                mapInstanceRef.current.remove();
                mapInstanceRef.current = null;
            }
        };
    }, [geoJsonList, Number(gridSize)]);


    return (
        <div className="w-full flex-grow">
            <div ref={mapRef} className="w-full h-full"></div>
        </div>
    );
};

export default ParcelMap;
