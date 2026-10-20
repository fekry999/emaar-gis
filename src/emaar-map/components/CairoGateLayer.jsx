
import { useEffect, useState } from "react";
import { Source, Layer } from "react-map-gl/maplibre";

const GEOJSON_URL = "/cairo_gate.geojson";

const fillLayer = {
  id: "cairo-gate-fill",
  type: "fill",
  paint: {
    "fill-color": "#00D9FF",
    "fill-opacity": 0.18,
  },
};

const glowLayer = {
  id: "cairo-gate-glow",
  type: "line",
  paint: {
    "line-color": "#00D9FF",
    "line-width": 12,
    "line-opacity": 0.35,
    "line-blur": 6,
  },
};

const outlineLayer = {
  id: "cairo-gate-outline",
  type: "line",
  paint: {
    "line-color": "#00E5FF",
    "line-width": 2.5,
    "line-opacity": 1,
  },
};

const extrusionLayer = {
  id: "cairo-gate-3d",
  type: "fill-extrusion",
  paint: {
    "fill-extrusion-color": "#00D9FF",
    "fill-extrusion-height": 30,
    "fill-extrusion-base": 0,
    "fill-extrusion-opacity": 0.45,
  },
};

// extrude = true (3D map) raises the border into a 3D block; false (2D map) keeps it flat.
export default function CairoGateLayer({ extrude = false }) {
  const [geojson, setGeojson] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;

    fetch(GEOJSON_URL)
      .then((response) => {
        if (!response.ok) {
          throw new Error(
            `Failed to load GeoJSON: HTTP ${response.status}`
          );
        }
        return response.json();
      })
      .then((data) => {
        if (data.type !== "FeatureCollection" ||
            !Array.isArray(data.features)) {
          throw new Error("Invalid GeoJSON FeatureCollection.");
        }

        if (!cancelled) {
          setGeojson(data);
        }
      })
      .catch((err) => {
        if (!cancelled) {
          setError(err.message);
          console.error("Cairo Gate GeoJSON error:", err);
        }
      });

    return () => {
      cancelled = true;
    };
  }, []);

  if (error) {
    return null;
  }

  if (!geojson) {
    return null;
  }

  const polygons = geojson.features.filter(
    (feature) =>
      feature.geometry?.type === "Polygon" ||
      feature.geometry?.type === "MultiPolygon"
  );

  console.log("Cairo Gate polygon count:", polygons.length);

  if (polygons.length === 0) {
    console.error("No polygon found in the GeoJSON file.");
    return null;
  }

  return (
    <Source
      id="cairo-gate-source"
      type="geojson"
      data={{
        type: "FeatureCollection",
        features: polygons,
      }}
    >
      <Layer {...(extrude ? extrusionLayer : fillLayer)} />
      <Layer {...glowLayer} />
      <Layer {...outlineLayer} />
    </Source>
  );
}
