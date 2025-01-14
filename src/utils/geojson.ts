import * as turf from '@turf/turf';

export function createGridOverPolygon(polygon: GeoJSON.Polygon, cellSide = 0.025) {
  // Step 1: Find the bounding box of the polygon
  const bbox = turf.bbox(polygon);

  // Step 2: Create a grid of 25x25 meter squares
  const grid = turf.squareGrid(bbox, cellSide);

  // Step 3: Filter grid squares to only those that intersect with the polygon
  const intersectingCells = grid.features.filter(cell => 
    turf.booleanIntersects(cell, polygon)
  );

  // Return the intersecting cells as a FeatureCollection
  return turf.featureCollection(intersectingCells);
}
