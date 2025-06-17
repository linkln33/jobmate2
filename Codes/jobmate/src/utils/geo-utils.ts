/**
 * Utility functions for geographical calculations
 */

/**
 * Calculate the distance between two points on Earth using the Haversine formula
 * @param lat1 Latitude of point 1 in decimal degrees
 * @param lng1 Longitude of point 1 in decimal degrees
 * @param lat2 Latitude of point 2 in decimal degrees
 * @param lng2 Longitude of point 2 in decimal degrees
 * @returns Distance in kilometers
 */
export function calculateDistance(
  lat1: number,
  lng1: number,
  lat2: number,
  lng2: number
): number {
  // Earth's radius in kilometers
  const EARTH_RADIUS_KM = 6371;
  
  // Convert latitude and longitude from degrees to radians
  const dLat = toRadians(lat2 - lat1);
  const dLng = toRadians(lng2 - lng1);
  
  // Haversine formula
  const a = 
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRadians(lat1)) * Math.cos(toRadians(lat2)) * 
    Math.sin(dLng / 2) * Math.sin(dLng / 2);
    
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = EARTH_RADIUS_KM * c;
  
  return distance;
}

/**
 * Convert degrees to radians
 * @param degrees Angle in degrees
 * @returns Angle in radians
 */
function toRadians(degrees: number): number {
  return degrees * (Math.PI / 180);
}

/**
 * Get a bounding box around a point with a specified radius
 * @param lat Center latitude
 * @param lng Center longitude
 * @param radiusKm Radius in kilometers
 * @returns Bounding box as [minLat, minLng, maxLat, maxLng]
 */
export function getBoundingBox(
  lat: number,
  lng: number,
  radiusKm: number
): [number, number, number, number] {
  // Earth's radius in kilometers
  const EARTH_RADIUS_KM = 6371;
  
  // Angular distance in radians
  const radDist = radiusKm / EARTH_RADIUS_KM;
  
  const radLat = toRadians(lat);
  const radLng = toRadians(lng);
  
  const minLat = radLat - radDist;
  const maxLat = radLat + radDist;
  
  // Calculate longitude bounds
  // Compensate for degrees longitude getting smaller with increasing latitude
  let deltaLng: number;
  if (minLat > -Math.PI/2 && maxLat < Math.PI/2) {
    const deltaLngLat = Math.asin(Math.sin(radDist) / Math.cos(radLat));
    deltaLng = deltaLngLat;
  } else {
    // Edge case near the poles
    deltaLng = Math.PI;
  }
  
  const minLng = radLng - deltaLng;
  const maxLng = radLng + deltaLng;
  
  // Convert back to degrees
  return [
    toDegrees(minLat),
    toDegrees(minLng),
    toDegrees(maxLat),
    toDegrees(maxLng)
  ];
}

/**
 * Convert radians to degrees
 * @param radians Angle in radians
 * @returns Angle in degrees
 */
function toDegrees(radians: number): number {
  return radians * (180 / Math.PI);
}
