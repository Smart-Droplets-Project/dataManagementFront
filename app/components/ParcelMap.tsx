// app/components/ParcelMap.tsx
import { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { createGridOverPolygon } from '../utils/geojson';
import { useParcelDrawer } from './ParcelDrawerComponents/ParcelDrawerContext';

interface ParcelMapProps {
    geoJsonList: GeoJSON.Feature[];
    selectedParcelId: string;
    gridSize: string;
}

class GeoJSONFeatureInfoControl extends L.Control {
    private _content: HTMLDivElement;

    constructor(options?: L.ControlOptions) {
        super(options);
        this._content = document.createElement('div'); // Initialize content container
    }

    onAdd(): HTMLDivElement {
        this._content.className = 'geojson-feature-info p-4 bg-white shadow-lg rounded';
        this._content.innerHTML = `<p class="text-gray-500">Click on a parcel to see details.</p>`;
        return this._content;
    }

    updateContent(feature: GeoJSON.Feature): void {
        this._content.innerHTML = feature
            ? `<h6 class="text-lg font-bold">${feature.properties?.name}</h6>
           <pre class="text-sm">Address: ${feature.properties?.address}</pre>`
            : `<p class="text-gray-500">Click on a feature to see details.</p>`;
    }
}


const ParcelMap: React.FC<ParcelMapProps> = ({ geoJsonList, selectedParcelId, gridSize }) => {
    const { openDrawer } = useParcelDrawer();

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


            const geoJSONFeatureControl = new GeoJSONFeatureInfoControl({ position: 'topright' });
            if (mapInstanceRef.current) { 
                mapInstanceRef.current.addControl(geoJSONFeatureControl);
            }

            // Create and add the grid
            // geoJsonList.forEach(geoJson => {
            //     if (mapInstanceRef.current) {
            //         const grid = createGridOverPolygon(geoJson.geometry as GeoJSON.Polygon, Number(gridSize));
            //         L.geoJSON(grid, {
            //             style: {
            //                 color: '#000000',
            //                 weight: 1,
            //                 opacity: 0.25,
            //             }
            //         }).addTo(mapInstanceRef.current);
            //     }
            // });

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
                            // console.log(e.target);
                            if (mapInstanceRef.current) {
                                mapInstanceRef.current.fitBounds(e.target.getBounds())
                                openDrawer(e.target.feature as GeoJSON.Feature);
                                geoJSONFeatureControl.updateContent(e.target.feature)
                            }
                        }
                    });
                }
            }).addTo(mapInstanceRef.current);


            // Fit the map to the GeoJSON bounds
            // mapInstanceRef.current.fitBounds(geoJsonLayer.getBounds()); // TODO: This makes an animation from the complete bounds to the selected parcel bounds 

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

    // useEffect(() => {
    //     geoJsonList.forEach(geoJson => {
    //             if (mapInstanceRef.current) {
    //                 if (geoJson.properties?.id === selectedParcelId) {
    //                     const grid = createGridOverPolygon(geoJson.geometry as GeoJSON.Polygon, Number(gridSize));
    //                     L.geoJSON(grid, {
    //                         style: {
    //                             color: '#000000',
    //                             weight: 1,
    //                             opacity: 0.25,
    //                         }
    //                     }).addTo(mapInstanceRef.current);
    //                 }
    //             }
    //         });
    // }, [selectedParcelId])


    return (
        <div className="w-full flex-grow">
            <div ref={mapRef} className="w-full h-full"></div>
        </div>
    );
};

export default ParcelMap;
