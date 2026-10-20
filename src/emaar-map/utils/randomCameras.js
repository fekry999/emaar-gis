// Generate camera markers only at coordinates contained by the project's
// Polygon / MultiPolygon boundary. GeoJSON coordinates are [longitude, latitude].
export const CAMERA_COUNT = 12;
export const FLIGHT_MS = 1200;

function polygonParts(geometry) {
  if (geometry?.type === "Polygon") return [geometry.coordinates];
  if (geometry?.type === "MultiPolygon") return geometry.coordinates;
  return [];
}

function pointInRing(lng, lat, ring) {
  let inside = false;
  for (let i = 0, j = ring.length - 1; i < ring.length; j = i++) {
    const [xi, yi] = ring[i];
    const [xj, yj] = ring[j];
    const crosses = (yi > lat) !== (yj > lat) &&
      lng < ((xj - xi) * (lat - yi)) / (yj - yi) + xi;
    if (crosses) inside = !inside;
  }
  return inside;
}

function inPolygon(lng, lat, rings) {
  // Ring 0 is the exterior; later rings are holes.
  return rings.length > 0 && pointInRing(lng, lat, rings[0]) &&
    !rings.slice(1).some((hole) => pointInRing(lng, lat, hole));
}

function bounds(ring) {
  return ring.reduce((b, [lng, lat]) => ({
    minLng: Math.min(b.minLng, lng), maxLng: Math.max(b.maxLng, lng),
    minLat: Math.min(b.minLat, lat), maxLat: Math.max(b.maxLat, lat),
  }), { minLng: Infinity, maxLng: -Infinity, minLat: Infinity, maxLat: -Infinity });
}

export function randomCameras(project, geometry) {
  if (project.cameras === false || !geometry) return [];

  const parts = polygonParts(geometry).filter((rings) => rings?.[0]?.length >= 4);
  if (!parts.length) return [];

  // Sample each polygon independently so distant MultiPolygon components do
  // not leave most random attempts in empty space. A cap also handles narrow,
  // irregular boundaries without ever falling back to an outside point.
  const candidates = [];
  for (const rings of parts) {
    const box = bounds(rings[0]);
    if (Number.isFinite(box.minLng) && box.maxLng > box.minLng && box.maxLat > box.minLat) {
      candidates.push({ rings, box, area: (box.maxLng - box.minLng) * (box.maxLat - box.minLat) });
    }
  }
  if (!candidates.length) return [];

  const totalArea = candidates.reduce((sum, item) => sum + item.area, 0);
  const cameras = [];
  let attempts = 0;
  while (cameras.length < CAMERA_COUNT && attempts < CAMERA_COUNT * 250) {
    attempts++;
    let pick = Math.random() * totalArea;
    let candidate = candidates[candidates.length - 1];
    for (const item of candidates) {
      pick -= item.area;
      if (pick <= 0) { candidate = item; break; }
    }
    const { box, rings } = candidate;
    const lng = box.minLng + Math.random() * (box.maxLng - box.minLng);
    const lat = box.minLat + Math.random() * (box.maxLat - box.minLat);
    if (!inPolygon(lng, lat, rings)) continue;
    const i = cameras.length;
    cameras.push({
      id: `${project.id}-${i}-${Math.random()}`,
      lat,
      lng,
      rot: Math.round(Math.random() * 80 - 40),
      delay: FLIGHT_MS + i * 140,
    });
  }
  return cameras;
}
