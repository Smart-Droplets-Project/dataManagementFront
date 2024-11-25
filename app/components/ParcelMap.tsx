// app/components/ParcelMap.tsx
import { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { createGridOverPolygon } from '../utils/geojson';
import { useParcelDrawer } from './ParcelDrawerComponents/ParcelDrawerContext';
import { colors } from '../theme/colors';

interface ParcelMapProps {
    geoJsonList: GeoJSON.Feature[];
    selectedParcelId: string;
}

const gridSizeOptions = [
    { label: '25x25', value: 0.025 },
    { label: '10x10', value: 0.01 },
    { label: '5x5', value: 0.005 },
];

class GeoJSONFeatureInfoControl extends L.Control {
    private _content: HTMLDivElement;

    constructor(options?: L.ControlOptions) {
        super(options);
        this._content = document.createElement('div'); // Initialize content container
    }

    onAdd(): HTMLDivElement {
        this._content.className = 'geojson-feature-info p-4 bg-white shadow-lg rounded';
        this._content.innerHTML =
            `
            <p class="text-gray-500">Click on a parcel to see its details.</p>
            <p class="text-gray-500">Double click on a parcel to show its grid.</p>
            `;
        return this._content;
    }

    updateContent(feature: GeoJSON.Feature): void {
        this._content.innerHTML = feature
            ? `<h6 class="text-lg font-bold">${feature.properties?.name}</h6>
           <pre class="text-sm">Address: ${feature.properties?.address}</pre>`
            : `<p class="text-gray-500">Click on a feature to see details.</p>`;
    }
}


const ParcelMap: React.FC<ParcelMapProps> = ({ geoJsonList, selectedParcelId }) => {
    const { openDrawer } = useParcelDrawer();

    const mapRef = useRef<HTMLDivElement>(null);
    const mapInstanceRef = useRef<L.Map | null>(null);

    // const [gridSize, setGridSize] = useState(gridSizeOptions[0]);

    // const handleGridSizeChange = (event: SelectChangeEvent) => {
    //     setGridSize(event.target.value as string);
    // };

    let gridSize = gridSizeOptions[0].value

    // console.log(gridSize);

    useEffect(() => {
        // console.log("useeffect");
        if (mapRef.current && !mapInstanceRef.current) {
            // Initialize the map
            mapInstanceRef.current = L.map(mapRef.current).setView([0, 0], 2);
            mapInstanceRef.current.doubleClickZoom.disable();

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

            let clickTimeout: NodeJS.Timeout | null = null;
            let activeGridLayer: L.Layer | null = null;

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
                                color: colors.primary.main,
                                dashArray: '',
                                fillOpacity: 0.7
                            });
                        },
                        mouseout: (e) => {
                            geoJsonLayer.resetStyle(e.target);
                        },
                        click: (e) => {
                            // A single click opens up the parcel drawer which has its details
                            if (clickTimeout) {
                                clearTimeout(clickTimeout); // If a second click occurs, clear the timeout.
                                clickTimeout = null; // Reset the timeout.
                            } else {
                                // Set a timeout to allow for a potential double-click
                                clickTimeout = setTimeout(() => {
                                    if (mapInstanceRef.current) {
                                        if (activeGridLayer) {
                                            mapInstanceRef.current.removeLayer(activeGridLayer);
                                            activeGridLayer = null;
                                        }
                                        mapInstanceRef.current.fitBounds(e.target.getBounds())
                                        openDrawer(e.target.feature as GeoJSON.Feature);
                                        geoJSONFeatureControl.updateContent(e.target.feature)
                                        clickTimeout = null; // Reset the timeout after execution
                                    }
                                }, 200);
                            }
                        },
                        dblclick: (e) => {
                            // A double click draws the target parcel's grid
                            if (clickTimeout) {
                                clearTimeout(clickTimeout); // Prevent single click from firing
                                clickTimeout = null;
                            }
                            if (mapInstanceRef.current) {
                                if (activeGridLayer) {
                                    mapInstanceRef.current.removeLayer(activeGridLayer);
                                    activeGridLayer = null;
                                }
                                mapInstanceRef.current.fitBounds(e.target.getBounds())
                                const grid = createGridOverPolygon(e.target.feature.geometry as GeoJSON.Polygon, Number(gridSize));
                                activeGridLayer = L.geoJSON(grid, {
                                    style: {
                                        interactive: false,
                                        color: '#000000',
                                        weight: 1,
                                        opacity: 0.25,
                                    }
                                }).addTo(mapInstanceRef.current);
                            }
                        }
                    });
                }
            }).addTo(mapInstanceRef.current);

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
    }, [geoJsonList]);

    return (
        <div className="w-full flex-grow">
            <div ref={mapRef} className="w-full h-full"></div>
        </div>
    );
};

export default ParcelMap;
