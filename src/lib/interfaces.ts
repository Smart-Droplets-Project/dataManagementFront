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
    },
    area?: {
        type: string;
        value: number;
    }
    description?: {
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
    },
    hasAgriSoil?: {
        type: string;
        object: string;
    }
    location?: {
        type: string;
        value: {
            type: string;
            features: [
                {
                    type: string;
                    geometry: {
                        type: string;
                        coordinates: number[] | number[][][];
                    }
                    properties: {
                        name: string;
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
    dateObserved: {
        type: string,
        value: string
    };
}

export interface QuantumLeapTimeSeriesData {
    attributes: [
        {
            attrName: string,
            values: string[] | number[],
        }
    ],
    entityId: string,
    entityType: string,
    index: string[]
}

export interface AgriProductType {
    id: string;
    type: string;
    name?: {
        type: string;
        value: string;
    };
    description?: {
        type: string;
        value: string;
    };
    alternateName?: {
        type: string;
        value: string;
    };
}


export interface CommandMessage {
    id: string,
    type: string,
    command: {
        type: "string",
        value: "string"
    },
    commandTime: {
        type: "string",
        value: "string"
    },
    waypoints: {
        type: "string",
        value: {
            name: string,
            type: string,
            features: any[]
        }
    }
}

export interface StateMessage {
    id: string,
    type: string,
    commandTime: string,
    mode: string,
    errors: any[],
    pose: {
        geographicPoint: {
            latitude: number,
            longitude: number,
            altitude: number
        },
        orientation3D: {
            roll: number,
            pitch: number,
            yaw: number
        }
    },
    destination: {
        geographicPoint: {
            latitude: number,
            longitude: number,
            altitude: number
        },
        orientation3D: {
            roll: number,
            pitch: number,
            yaw: number
        }
    },
    accuracy: {
        covariance: number[]
    },
    battery: {
        remainingPercentage: number
    }
}