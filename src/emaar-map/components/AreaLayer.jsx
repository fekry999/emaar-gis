// AreaLayer: blue fill + outline covering each project's real border.
// 2D map: flat fill. 3D map (extrude): the border is raised into a 3D block.
import { useMemo } from "react";
import { Source, Layer } from "react-map-gl/maplibre";
import { projectAreas } from "../utils/projectAreas";

export default function AreaLayer({ projects, boundaries, selectedId, extrude = false }) {
  const data = useMemo(() => {
    const areas = projectAreas(projects, boundaries);

    return {
      type: "FeatureCollection",
      features: (areas.features ?? []).filter(
        (feature) =>
          feature.geometry?.type === "Polygon" ||
          feature.geometry?.type === "MultiPolygon"
      ),
    };
  }, [projects, boundaries]);

  return (
    <Source id="project-areas" type="geojson" data={data}>
      {extrude ? (
        <Layer
          id="project-areas-3d"
          type="fill-extrusion"
          paint={{
            "fill-extrusion-color": [
              "case",
              ["==", ["get", "id"], selectedId || ""],
              "#00e5ff",
              "#2f80ed",
            ],
            "fill-extrusion-height": 40,
            "fill-extrusion-base": 0,
            "fill-extrusion-opacity": 0.6,
          }}
        />
      ) : (
        <Layer
          id="project-areas-fill"
          type="fill"
          paint={{
            "fill-color": "#2f80ed",
            "fill-opacity": [
              "case",
              ["==", ["get", "id"], selectedId || ""],
              0.35,
              0.18,
            ],
          }}
        />
      )}
      <Layer
        id="project-areas-line"
        type="line"
        paint={{
          "line-color": "#1456a8",
          "line-width": 2.5,
        }}
      />
    </Source>
  );
}
