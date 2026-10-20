// Map2D: light, flat, top-down map (Positron style). Tilt and rotation are locked.
import Map from "react-map-gl/maplibre";
import "maplibre-gl/dist/maplibre-gl.css";
import MapContent from "../MapContent";
import RTLTextSetup from "../components/RTLTextSetup";
import { HOME_VIEW, CITY_VIEW } from "../data/projects";
import { startView } from "../utils/startView";

const STYLE_2D = "https://tiles.openfreemap.org/styles/positron"; // clean light flat map, free, no key
const HOME_2D = { ...HOME_VIEW, pitch: 0, bearing: 0 };
const CITY_2D = { ...CITY_VIEW, pitch: 0, bearing: 0 };

export default function Map2D({ projects, layers, boundaries, selectedId, onSelect }) {
  const selected = projects.find((p) => p.id === selectedId);

  return (
    <Map
      initialViewState={startView(selected, HOME_2D, CITY_2D)}
      mapStyle={STYLE_2D}
      maxPitch={0}
      dragRotate={false}
      touchPitch={false}
      style={{ width: "100%", height: "100%" }}
    >
      <RTLTextSetup />
      <MapContent
        projects={projects}
        homeView={HOME_2D}
        cityView={CITY_2D}
        layers={layers}
        boundaries={boundaries}
        selectedId={selectedId}
        onSelect={onSelect}
        variant="2d"
      />
    </Map>
  );
}
