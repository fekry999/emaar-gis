// Buildings3D: adds 3D buildings (from OpenStreetMap heights) to the map, in blue tones.
// It brings its own data source, so it works on any OpenFreeMap style.
// Buildings appear from zoom 14, and only where OpenStreetMap has them mapped.
import { useEffect, useState } from "react";
import { Source, Layer, useMap } from "react-map-gl/maplibre";

const HEIGHT = ["coalesce", ["get", "render_height"], 8];
const BASE = ["coalesce", ["get", "render_min_height"], 0];

export default function Buildings3D() {
  const { current: map } = useMap();
  const [beforeId, setBeforeId] = useState();

  // Put the buildings under the text labels so street names stay readable.
  useEffect(() => {
    const m = map.getMap();
    const findLabelLayer = () => {
      const label = m.getStyle().layers.find((l) => l.type === "symbol");
      if (label) setBeforeId(label.id);
    };
    if (m.isStyleLoaded()) findLabelLayer();
    else m.once("load", findLabelLayer);
    return () => m.off("load", findLabelLayer);
  }, [map]);

  return (
    <Source id="ofm-buildings" type="vector" url="https://tiles.openfreemap.org/planet">
      <Layer
        id="buildings-3d"
        type="fill-extrusion"
        source-layer="building"
        minzoom={14}
        beforeId={beforeId}
        paint={{
          "fill-extrusion-color": [
            "interpolate", ["linear"], HEIGHT,
            0, "#1d3a8a",
            40, "#2f80ed",
            120, "#7fd0ff",
          ],
          "fill-extrusion-height": HEIGHT,
          "fill-extrusion-base": BASE,
          "fill-extrusion-opacity": 0.85,
        }}
      />
    </Source>
  );
}
