
import { useEffect, useState } from "react";
import { NavigationControl, useMap } from "react-map-gl/maplibre";

import { randomCameras } from "./utils/randomCameras";
import useMissingImages from "./hooks/useMissingImages";

import AreaLayer from "./components/AreaLayer";
import CairoGateLayer from "./components/CairoGateLayer";
import ProjectPins from "./components/ProjectPins";
import CameraMarkers from "./components/CameraMarkers";
import Buildings3D from "./components/Buildings3D";
import Navigator from "./components/Navigator";

const CITY_PINS_MAX_ZOOM = 11;

export default function MapContent({
  projects,
  homeView,
  cityView,
  layers = {},
  boundaries = {},
  selectedId,
  onSelect,
  variant = "2d", // "2d" = flat map, "3d" = 3D map
}) {
  const { current: map } = useMap();
  const is3d = variant === "3d";
  const [zoom, setZoom] = useState(() => map?.getZoom() ?? 0);

  useMissingImages();

  // If a project is already selected (you switched maps), show its cameras right away.
  const selectedBoundary = selectedId ? boundaries[selectedId] : null;
  const [cameras, setCameras] = useState(() => {
    const selected = projects.find((p) => p.id === selectedId);
    return selected ? randomCameras(selected, boundaries[selectedId]) : [];
  });

  // Boundaries load asynchronously; refresh cameras once the selected
  // project's actual polygon becomes available.
  useEffect(() => {
    const selected = projects.find((p) => p.id === selectedId);
    setCameras(selected ? randomCameras(selected, selectedBoundary) : []);
  }, [selectedId, selectedBoundary, projects]);

  useEffect(() => {
    if (!map) return undefined;
    const updateZoom = () => setZoom(map.getZoom());
    updateZoom();
    map.on("zoom", updateZoom);
    return () => map.off("zoom", updateZoom);
  }, [map]);

  const showCityPins = zoom <= CITY_PINS_MAX_ZOOM;
  const showCameras = zoom > CITY_PINS_MAX_ZOOM;

  const zoomTo = (project) => {
    onSelect(project.id);
    map.flyTo({
      center: [project.pos[1], project.pos[0]],
      zoom: cityView.zoom,
      pitch: cityView.pitch,
      bearing: cityView.bearing ?? 0,
      duration: 2000,
    });
  };

  const reset = () => {
    onSelect(null);
    setCameras([]);

    map.flyTo({
      center: homeView.center,
      zoom: homeView.zoom,
      pitch: homeView.pitch,
      bearing: homeView.bearing,
      duration: 2000,
    });
  };

  return (
    <>
      <NavigationControl position="top-left" />

      {is3d && <Buildings3D />}

      {layers.areas !== false && (
        <AreaLayer
          projects={projects}
          boundaries={boundaries}
          selectedId={selectedId}
          extrude={is3d}
        />
      )}

      {layers.cairoGate !== false && <CairoGateLayer extrude={is3d} />}

      {showCityPins && (
        <ProjectPins
          projects={projects}
          onSelect={zoomTo}
        />
      )}

      {showCameras && layers.cameras !== false && (
        <CameraMarkers cameras={cameras} />
      )}

      <Navigator
        projects={projects}
        selectedId={selectedId}
        onSelect={zoomTo}
        onReset={reset}
      />
    </>
  );
}
