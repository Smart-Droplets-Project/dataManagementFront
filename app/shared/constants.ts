
export const ENDPOINTS = {
    API_BASE_URL: process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:1026/ngsi-ld/v1/entities"
};

export const CONTEXTS = {
    AGRIFARM: '<https://raw.githubusercontent.com/smart-data-models/dataModel.AgriFood/master/context.jsonld>',//; rel="http://www.w3.org/ns/json-ld#context"; type="application/ld+json"',
    DEVICE: '<https://raw.githubusercontent.com/smart-data-models/dataModel.Device/master/context.jsonld>'//; rel="http://www.w3.org/ns/json-ld#context"; type="application/ld+json"'
}