import { AgriParcel } from '@/lib/interfaces';

export function validateGeoJsonFormat(input: AgriParcel['location']): boolean {
    if (!input || typeof input !== "object") return false;
  
    if (input.type !== "Property" || typeof input.value !== "object") return false;
  
    const value = input.value;
    if (value.type !== "FeatureCollection" || !Array.isArray(value.features)) return false;
  
    for (const feature of value.features) {
      if (
        !feature ||
        feature.type !== "Feature" ||
        typeof feature.properties !== "object" ||
        typeof feature.geometry !== "object"
      ) {
        return false;
      }
  
      const geometry = feature.geometry;
      if (!["Point", "Polygon"].includes(geometry.type)) return false;
      if (!Array.isArray(geometry.coordinates)) return false;
  
      // For Polygon, expect coordinates to be an array of linear rings
      if (geometry.type === "Polygon") {
        if (!Array.isArray(geometry.coordinates[0])) return false;
      }
    }
  
    return true;
  }
  