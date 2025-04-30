import { AgriParcel } from '@/lib/interfaces';

export function validateGeoJsonFormat(input: AgriParcel['location']): boolean {
  if (!input || typeof input !== "object") return false;

  if (input.type !== "Property" || typeof input.value !== "object") return false;

  const value = input.value;
  if (value.type !== "FeatureCollection" || !Array.isArray(value.features)) return false;

  const polygon = value.features.find(element => element.geometry.type === "Polygon");

  const coordinates = polygon?.geometry.coordinates;

  return Array.isArray(coordinates) 
    && Array.isArray(coordinates[0])
    && Array.isArray(coordinates[0][0]);
}