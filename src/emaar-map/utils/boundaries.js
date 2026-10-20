// Loads the real border (polygon) of each project.
// Order for each project:
//   1. your own file  public/boundaries/<id>.geojson   (draw it on geojson.io)
//   2. OpenStreetMap  via Nominatim, searched by name (project.boundaryQueries)
//   3. OpenStreetMap  via Overpass: the smallest land-use area that contains the project point
//   4. nothing found  -> AreaLayer falls back to a circle
// Results are cached in localStorage so they are only downloaded once.

const CACHE_KEY = "emaar-boundaries-v1";
const MAX_DISTANCE_KM = 30; // ignore OSM results too far from the project (wrong place)

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

const readCache = () => {
  try { return JSON.parse(localStorage.getItem(CACHE_KEY)) || {}; } catch { return {}; }
};
const writeCache = (cache) => {
  try { localStorage.setItem(CACHE_KEY, JSON.stringify(cache)); } catch { /* storage full: ignore */ }
};

// Finds the first Polygon / MultiPolygon inside any GeoJSON shape.
function firstPolygon(json) {
  if (!json) return null;
  if (json.type === "FeatureCollection") {
    for (const f of json.features || []) {
      const g = firstPolygon(f);
      if (g) return g;
    }
    return null;
  }
  if (json.type === "Feature") return firstPolygon(json.geometry);
  if (json.type === "Polygon" || json.type === "MultiPolygon") return json;
  return null;
}

function distanceKm([lat1, lng1], lat2, lng2) {
  const toRad = (d) => (d * Math.PI) / 180;
  const dLat = toRad(lat2 - lat1);
  const dLng = toRad(lng2 - lng1);
  const a = Math.sin(dLat / 2) ** 2 + Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLng / 2) ** 2;
  return 6371 * 2 * Math.asin(Math.sqrt(a));
}

async function fromFile(project) {
  try {
    const path = project.id === "cairogate"
      ? "/cairo_gate.geojson"
      : `/boundaries/${project.id}.geojson`;
    const res = await fetch(path);
    if (!res.ok) return null;
    return firstPolygon(await res.json()); // a missing file returns HTML, which fails here
  } catch {
    return null;
  }
}

async function searchNominatim(query, project) {
  try {
    const url =
      "https://nominatim.openstreetmap.org/search?format=jsonv2&limit=5&polygon_geojson=1&q=" +
      encodeURIComponent(query);
    const res = await fetch(url, { headers: { Accept: "application/json" } });
    if (!res.ok) return null;
    const results = await res.json();
    const hit = results.find(
      (r) =>
        r.geojson &&
        (r.geojson.type === "Polygon" || r.geojson.type === "MultiPolygon") &&
        distanceKm(project.pos, Number(r.lat), Number(r.lon)) < MAX_DISTANCE_KM
    );
    return hit ? hit.geojson : null;
  } catch {
    return null;
  }
}

// Tries each search text in project.boundaryQueries (English and Arabic names)
// until OpenStreetMap returns a polygon near the project.
async function fromNominatim(project) {
  const queries = project.boundaryQueries || (project.boundaryQuery ? [project.boundaryQuery] : []);
  for (const q of queries) {
    const geometry = await searchNominatim(q, project);
    await sleep(1100); // Nominatim allows about 1 request per second
    if (geometry) return geometry;
  }
  return null;
}

// ---- Overpass: find the area polygon that contains the project's point ----
const MIN_AREA_KM2 = 0.3; // ignore tiny plots inside the compound
const MAX_AREA_KM2 = 80;  // ignore huge areas (whole districts)

export function ringAreaKm2(ring) {
  // ring = [[lng, lat], ...]. Shoelace formula on a local flat projection.
  const lat0 = ring.reduce((s, p) => s + p[1], 0) / ring.length;
  const kx = 111.32 * Math.cos((lat0 * Math.PI) / 180); // km per degree of longitude
  const ky = 110.57;                                    // km per degree of latitude
  let sum = 0;
  for (let i = 0; i < ring.length - 1; i++) {
    sum += ring[i][0] * kx * ring[i + 1][1] * ky - ring[i + 1][0] * kx * ring[i][1] * ky;
  }
  return Math.abs(sum) / 2;
}

// Picks the smallest closed way whose area is between MIN and MAX.
export function pickBestWay(elements) {
  const candidates = [];
  for (const el of elements || []) {
    if (el.type !== "way" || !el.geometry || el.geometry.length < 4) continue;
    const ring = el.geometry.map((g) => [g.lon, g.lat]);
    const first = ring[0];
    const last = ring[ring.length - 1];
    if (first[0] !== last[0] || first[1] !== last[1]) continue; // not closed
    const area = ringAreaKm2(ring);
    if (area >= MIN_AREA_KM2 && area <= MAX_AREA_KM2) candidates.push({ ring, area });
  }
  candidates.sort((a, b) => a.area - b.area);
  return candidates.length ? { type: "Polygon", coordinates: [candidates[0].ring] } : null;
}

async function fromOverpass(project) {
  const [lat, lng] = project.pos;
  const query = `[out:json][timeout:25];
is_in(${lat},${lng})->.a;
(
  way(pivot.a)["landuse"~"^(residential|commercial|retail|resort|construction)$"];
  way(pivot.a)["leisure"~"^(resort|golf_course)$"];
  way(pivot.a)["place"~"^(neighbourhood|suburb|quarter)$"];
);
out geom;`;
  try {
    const res = await fetch("https://overpass-api.de/api/interpreter", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: "data=" + encodeURIComponent(query),
    });
    if (!res.ok) {
      console.warn(`[boundaries] ${project.id}: Overpass answered HTTP ${res.status}`);
      return null;
    }
    const json = await res.json();
    const found = (json.elements || []).map((el) => {
      const ring = (el.geometry || []).map((g) => [g.lon, g.lat]);
      const area = ring.length > 3 ? ringAreaKm2(ring).toFixed(2) + " km2" : "n/a";
      return `${el.type} ${el.tags?.name || el.tags?.["name:en"] || "(no name)"} [${area}]`;
    });
    console.info(`[boundaries] ${project.id}: Overpass returned ${found.length} area(s)`, found);
    return pickBestWay(json.elements);
  } catch (error) {
    console.warn(`[boundaries] ${project.id}: Overpass request failed`, error);
    return null;
  }
}

// Calls onFound(id, geometry) as soon as each border is ready.
export async function loadBoundaries(projects, onFound, isCancelled = () => false) {
  const cache = readCache();
  for (const p of projects) {
    if (isCancelled()) return;
    // These bundled polygons are fixed project outlines. Uptown's file was
    // recovered from its original v1 cache; Cairo Gate uses its supplied GeoJSON.
    const preferLocalFile = p.id === "uptown" || p.id === "cairogate";
    if (cache[p.id] && !preferLocalFile) {
      onFound(p.id, cache[p.id]);
      continue;
    }
    let source = "your file";
    let geometry = await fromFile(p);
    if (!geometry && cache[p.id]) geometry = cache[p.id];
    if (!geometry) {
      source = "Nominatim";
      geometry = await fromNominatim(p);
    }
    if (!geometry) {
      source = "Overpass";
      geometry = await fromOverpass(p);
      await sleep(1100);
    }
    console.info(`[boundaries] ${p.id}: ${geometry ? "border found via " + source : "no border found, using circle"}`);
    if (geometry && !isCancelled()) {
      cache[p.id] = geometry;
      writeCache(cache);
      onFound(p.id, geometry);
    }
  }
}
