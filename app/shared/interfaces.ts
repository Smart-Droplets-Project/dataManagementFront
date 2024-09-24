export interface AgriParcel {
    id: string;
    type: string;
    name?: {
        type: string;
        value: string;
    };
    address?: {
        type: string;
        value: string;
    }
    alternateName?: {
        type: string;
        value: string;
    },
    hasAgriCrop?: {
        type: string;
        object: string;
    }
    location?: {
        type: string;
        value: {
            type: string;
            features: [
                {
                    // type: string;
                    // coordinates: any;
                    geometry: {
                        type: string;
                        coordinates: any;
                    }
                }
            ]
        };
    };
}

export interface Device {
    id: string;
    type: string;
    controlledAsset?: {
        type: string;
        value: string;
    };
    controlledProperty?: {
        type: string
        value: string;
    };
}

export interface DeviceMeasurement {
    id: string;
    type: string;
    numValue: number
    refDevice: string;
    dateObserved: string;
}
