
const NGSI_ENTITY_QUERY_PATH = "ngsi-ld/v1/entities";



export const ENDPOINTS = {
    // API_BASE_URL: process.env.NEXT_PUBLIC_API_BASE_URL || `http://localhost:1026/${NGSI_ENTITY_QUERY_PATH}`,
    API_BASE_URL: process.env.ORION_CB_BASE_URL ? `${process.env.ORION_CB_BASE_URL}/${NGSI_ENTITY_QUERY_PATH}` : `http://api.smartdroplets.eu:4180/${NGSI_ENTITY_QUERY_PATH}`,
    QUANTUMLEAP_URL: process.env.QUANTUMLEAP_URL ? `${process.env.QUANTUMLEAP_URL}/v2` : 'http://api.smartdroplets.eu:4180/v2',
};

const REALM_NAME = "smart-droplets-realm";
const TOKEN_PATH = `realms/${REALM_NAME}/protocol/openid-connect/token`;

export const AUTH = {
    // KEYCLOAK_TOKEN_API_URL: "http://localhost:8080/realms/smart-droplets-realm/protocol/openid-connect/token",
    KEYCLOAK_TOKEN_API_URL: process.env.KEYCLOAK_TOKEN_API_URL ? `${process.env.KEYCLOAK_TOKEN_API_URL}/${TOKEN_PATH}` : `http://keycloak:8080/${TOKEN_PATH}`,
    KEYCLOAK_CLIENT_ID: process.env.KEYCLOAK_CLIENT_ID || "oauth2-proxy",
    KEYCLOAK_CLIENT_SECRET: process.env.KEYCLOAK_CLIENT_SECRET || "eW91ci1jbGllbnQtc2VjcmV0",
    NEXTAUTH_SECRET: "enEx/KgQ4mCKNR+3z1AIBT7uY5yyfOMjTftxqQPm/as="
}

export const CONTEXTS = {
    AGRIFARM: '<https://raw.githubusercontent.com/smart-data-models/dataModel.AgriFood/master/context.jsonld>; rel="http://www.w3.org/ns/json-ld#context"; type="application/ld+json"',
    CORE: '<https://uri.etsi.org/ngsi-ld/v1/ngsi-ld-core-context.jsonld>',
    DEVICE: '<https://raw.githubusercontent.com/smart-data-models/dataModel.Device/master/context.jsonld>; rel="http://www.w3.org/ns/json-ld#context"; type="application/ld+json"',
    AUTONOMOUSMOBILEROBOT: '<https://raw.githubusercontent.com/smart-data-models/dataModel.AutonomousMobileRobot/master/context.jsonld>; rel="http://www.w3.org/ns/json-ld#context"; type="application/ld+json"'
}