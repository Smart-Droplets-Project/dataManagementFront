'use client'
import { createElement, useEffect, useRef } from 'react';
import ReactDOM from 'react-dom/client';
import ReactDOMServer from "react-dom/server";

import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

import { createGridOverPolygon } from '@/utils/geojson';
import { useParcelDrawer } from '@/contexts/ParcelDrawerContext';
import { colors } from '../../theme/colors';
import { AgriParcel, StateMessage } from '@/lib/interfaces';
import { Paper, Typography } from '@mui/material';

import AgricultureTwoToneIcon from '@mui/icons-material/AgricultureTwoTone';

interface ParcelMapProps {
    parcelList: AgriParcel[];
    selectedParcelId?: string;
    tractorStateMessages?: StateMessage[];
}

const gridSizeOptions = [
    { label: '25x25', value: 0.025 },
    { label: '10x10', value: 0.01 },
    { label: '5x5', value: 0.005 },
];

const tractorIcon = L.divIcon({
    className: "leaflet-tractor-icon",
    html: ReactDOMServer.renderToStaticMarkup(
        <AgricultureTwoToneIcon style={{ fontSize: "24px" }} />
    ),
    iconSize: [32, 32],
    iconAnchor: [16, 32],
    popupAnchor: [0, -32],
});

class GeoJSONFeatureInfoControl extends L.Control {
    private _content: HTMLDivElement;
    private _reactRoot: HTMLDivElement;
    private _root: ReactDOM.Root | null = null;

    constructor(options?: L.ControlOptions) {
        super(options);
        this._content = document.createElement('div');
        this._reactRoot = document.createElement('div');
    }

    onAdd(): HTMLDivElement {
        this._content.className = 'leaflet-control';
        this._content.appendChild(this._reactRoot);

        // Initialize React rendering using createRoot (for React 18)
        if (!this._root) {
            this._root = ReactDOM.createRoot(this._reactRoot);
        }

        // Initial content when no feature is selected
        this.updateContent(null);

        return this._content;
    }

    updateContent(feature: GeoJSON.Feature | null): void {
        const newContent = feature
            ? this.createFeatureContent(feature)
            : this.createDefaultContent();

        // Only update React content if it's different from previous one
        if (this._root) {
            this._root.render(newContent);
        }
    }

    private createFeatureContent(feature: GeoJSON.Feature): React.ReactElement {
        return createElement(
            Paper,
            { sx: { padding: 2, backgroundColor: 'white', borderRadius: 2, boxShadow: 2 } },
            createElement(
                Typography,
                { variant: 'h6', fontWeight: 'bold' },
                feature.properties?.name
            ),
            createElement(
                Typography,
                { color: 'text.secondary' },
                `Address: ${feature.properties?.address}`
            )
        );
    }

    private createDefaultContent(): React.ReactElement {
        return createElement(
            Paper,
            { sx: { padding: 2, backgroundColor: 'white', borderRadius: 2, boxShadow: 2 } },
            createElement(
                Typography,
                { color: 'text.secondary' },
                'Click on a feature to see its details'
            )
        );
    }

    onFeatureClick(feature: GeoJSON.Feature): void {
        this.updateContent(feature);
    }
}

const extractFeaturePolygon = (parcel: AgriParcel) => {

    const features = parcel.location?.value.features;

    const geoJson = features && features.find(feature => feature.geometry.type === 'Polygon')

    const retval = {
        type: 'Feature',
        properties: {
            id: parcel.id,
            name: parcel.name?.value || "This parcel has no name",
            address: parcel.address?.value || "Unknown",
            hasAgriCrop: {
                id: parcel.hasAgriCrop?.object || null
            },
            hasAgriSoil: {
                id: parcel.hasAgriSoil?.object || null
            }
        },
        geometry: geoJson?.geometry
    };

    // if (!retval) return null;

    return retval as GeoJSON.Feature;
}


const ParcelMap: React.FC<ParcelMapProps> = ({ parcelList, selectedParcelId, tractorStateMessages }) => {
    const { openDrawer } = useParcelDrawer();

    const mapRef = useRef<HTMLDivElement>(null);
    const mapInstanceRef = useRef<L.Map | null>(null);
    const markerGroupRef = useRef<L.LayerGroup | null>(null);

    const geoJsonList: GeoJSON.Feature[] = [];

    parcelList.forEach((p: AgriParcel) => {
        geoJsonList.push(extractFeaturePolygon(p))
    });

    // const [gridSize, setGridSize] = useState(gridSizeOptions[0]);

    // const handleGridSizeChange = (event: SelectChangeEvent) => {
    //     setGridSize(event.target.value as string);
    // };

    const gridSize = gridSizeOptions[0].value

    useEffect(() => {
        if (typeof window !== 'undefined') {
            if (mapRef.current && !mapInstanceRef.current) {
                // Initialize the map
                mapInstanceRef.current = L.map(mapRef.current, { renderer: L.svg({ padding: 1000 }) }).setView([0, 0], 2);
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
                                const layer = e.target;

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
                                            geoJSONFeatureControl.onFeatureClick(e.target.feature)
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
                const fitBoundsToId = (id: string | undefined) => {
                    let feature = geoJsonList.find(polygon => polygon?.properties?.id === id);
                    if (!feature) {
                        feature = geoJsonList[0];
                    }
                    const bounds = L.geoJSON(feature).getBounds();
                    if (mapInstanceRef.current)
                        mapInstanceRef.current.fitBounds(bounds);
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
        }
    }, []);

    useEffect(() => {
        if (typeof window !== 'undefined') {
            if (!mapInstanceRef.current) return;

            if (markerGroupRef.current) {
                mapInstanceRef.current.removeLayer(markerGroupRef.current);
            }
            const newGroup = L.layerGroup();

            if (tractorStateMessages && tractorStateMessages.length) {
                tractorStateMessages.forEach((sm) => {
                    const { latitude, longitude } = sm.pose.geographicPoint;
                    const marker = L.marker([latitude, longitude], {
                        icon: tractorIcon
                    }).bindPopup
                        (
                            ReactDOMServer.renderToStaticMarkup(
                                <Typography variant="body1" style={{ fontSize: "16px", fontFamily: "Roboto, Helvetica, Arial, sans-serif", textAlign: "center" }}>
                                    Marker ID: {sm.id}
                                </Typography>
                            ),
                            {
                                closeButton: false
                            }
                        )
                    marker.on("mouseover", function () {
                        marker.openPopup();
                    });
                    marker.on("mouseout", function () {
                        marker.closePopup();
                    });
                    marker.addTo(newGroup);
                });
            }

            newGroup.addTo(mapInstanceRef.current);
            markerGroupRef.current = newGroup;
        }
    }, [tractorStateMessages])

    return (
        <div ref={mapRef} style={{ flex: 1, border: 0 }}></div>
    );
};

export default ParcelMap;
