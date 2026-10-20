// Map3D: dark-blue night map (Fiord style), tilted, with 3D buildings and 3D project blocks.
import Map from "react-map-gl/maplibre";
import "maplibre-gl/dist/maplibre-gl.css";
import MapContent from "../MapContent";
import RTLTextSetup from "../components/RTLTextSetup";
import { HOME_VIEW, CITY_VIEW } from "../data/projects";
import { startView } from "../utils/startView";

// If Fiord looks unfinished to you, try "dark" (black) or "liberty" (light) instead.
const STYLE_3D = "https://tiles.openfreemap.org/styles/fiord";
const HOME_3D = { ...HOME_VIEW, pitch: 45, bearing: -17 };
const CITY_3D = { ...CITY_VIEW, pitch: 60, bearing: -17 };

export default function Map3D({ projects, layers, boundaries, selectedId, onSelect }) {
  const selected = projects.find((p) => p.id === selectedId);

  return (
    <Map
      initialViewState={startView(selected, HOME_3D, CITY_3D)}
      mapStyle={STYLE_3D}
      maxPitch={85}
      canvasContextAttributes={{ antialias: true }}
      style={{ width: "100%", height: "100%" }}
    >
      <RTLTextSetup />
      <MapContent
        projects={projects}
        homeView={HOME_3D}
        cityView={CITY_3D}
        layers={layers}
        boundaries={boundaries}
        selectedId={selectedId}
        onSelect={onSelect}
        variant="3d"
      />
    </Map>
  );
}
