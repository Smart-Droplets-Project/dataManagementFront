import { NextResponse } from 'next/server';
import { ENDPOINTS, CONTEXTS } from '@/lib/constants';

export async function GET() {
    try {
        const searchParams = {
            type: 'StateMessage',
            limit: '10',
        };

        const urlQuery = new URLSearchParams(searchParams).toString();
        const url = new URL(`${ENDPOINTS.API_BASE_URL}?${urlQuery}`).toString();

        const response = await fetch(url, {
            headers: {
                Link: CONTEXTS.AUTONOMOUSMOBILEROBOT,
            },
            cache: 'no-store'
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        //TODO: revert to return response when database is populated
        return NextResponse.json([
            {
                id: "Robot:Mega_rover:01",
                type: "StateMessage",
                commandTime: "2019-06-07T08:39:40.064+09:00",
                mode: "navi",
                errors: [],
                pose: {
                    geographicPoint: {
                        latitude: 55.123464,
                        longitude: 23.909437,
                        altitude: -0.002
                    },
                    orientation3D: {
                        roll: -0.001,
                        pitch: 0.012,
                        yaw: 1.581
                    }
                },
                destination: {
                    geographicPoint: {
                        latitude: 3.411,
                        longitude: 2.81,
                        altitude: 0.0
                    },
                    orientation3D: {
                        roll: 0.0,
                        pitch: 0.0,
                        yaw: 1.571
                    }
                },
                accuracy: {
                    covariance: [
                        0.1,
                        0.0,
                        0.0,
                        0.0,
                        0.0,
                        0.0,
                        0.0,
                        0.1,
                        0.0,
                        0.0,
                        0.0,
                        0.0,
                        0.0,
                        0.0,
                        1.7976931348623157e308,
                        0.0,
                        0.0,
                        0.0,
                        0.0,
                        0.0,
                        0.0,
                        1.7976931348623157e308,
                        0.0,
                        0.0,
                        0.0,
                        0.0,
                        0.0,
                        0.0,
                        1.7976931348623157e308,
                        0.0,
                        0.0,
                        0.0,
                        0.0,
                        0.0,
                        0.0,
                        0.05
                    ]
                },
                battery: {
                    remainingPercentage: 75.4
                }
            },
            {
                id: "Robot:Mega_rover:02",
                type: "StateMessage",
                commandTime: "2019-06-07T08:39:40.064+09:00",
                mode: "navi",
                errors: [],
                pose: {
                    geographicPoint: {
                        latitude: 55.124474,
                        longitude: 23.914437,
                        altitude: -0.002
                    },
                    orientation3D: {
                        roll: -0.001,
                        pitch: 0.012,
                        yaw: 1.581
                    }
                },
                destination: {
                    geographicPoint: {
                        latitude: 3.411,
                        longitude: 2.81,
                        altitude: 0.0
                    },
                    orientation3D: {
                        roll: 0.0,
                        pitch: 0.0,
                        yaw: 1.571
                    }
                },
                accuracy: {
                    covariance: [
                        0.1,
                        0.0,
                        0.0,
                        0.0,
                        0.0,
                        0.0,
                        0.0,
                        0.1,
                        0.0,
                        0.0,
                        0.0,
                        0.0,
                        0.0,
                        0.0,
                        1.7976931348623157e308,
                        0.0,
                        0.0,
                        0.0,
                        0.0,
                        0.0,
                        0.0,
                        1.7976931348623157e308,
                        0.0,
                        0.0,
                        0.0,
                        0.0,
                        0.0,
                        0.0,
                        1.7976931348623157e308,
                        0.0,
                        0.0,
                        0.0,
                        0.0,
                        0.0,
                        0.0,
                        0.05
                    ]
                },
                battery: {
                    remainingPercentage: 75.4
                }
            }
        ]);
    } catch (error) {
        console.error('Error fetching state messages:', error);
        return NextResponse.json({ error: 'Failed to fetch state messages' }, { status: 500 });
    }
}