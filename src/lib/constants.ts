
const NGSI_ENTITY_QUERY_PATH = "ngsi-ld/v1/entities";

export const ENDPOINTS = {
    // API_BASE_URL: process.env.NEXT_PUBLIC_API_BASE_URL || `http://localhost:1026/${NGSI_ENTITY_QUERY_PATH}`,
    API_BASE_URL: `${process.env.ORION_CB_BASE_URL}/${NGSI_ENTITY_QUERY_PATH}` || `http://localhost:1026/${NGSI_ENTITY_QUERY_PATH}`,
    QUANTUMLEAP_URL: process.env.QUANTUMLEAP_URL ? `${process.env.QUANTUMLEAP_URL}/v2` : 'http://localhost:8668/v2'
};

export const CONTEXTS = {
    AGRIFARM: '<https://raw.githubusercontent.com/smart-data-models/dataModel.AgriFood/master/context.jsonld>',//; rel="http://www.w3.org/ns/json-ld#context"; type="application/ld+json"',
    CORE: '<https://uri.etsi.org/ngsi-ld/v1/ngsi-ld-core-context.jsonld>',
    DEVICE: '<https://raw.githubusercontent.com/smart-data-models/dataModel.Device/master/context.jsonld>',//; rel="http://www.w3.org/ns/json-ld#context"; type="application/ld+json"'
    AUTONOMOUSMOBILEROBOT: '<https://raw.githubusercontent.com/smart-data-models/dataModel.AutonomousMobileRobot/master/context.jsonld>'
}