// Zoomer: shows either the 2D map or the 3D map. They are two separate maps.
// The selected project and the borders are kept here, so both maps share them.
import { useState } from "react";

import "./styles/base.css";

import Map2D from "./maps/Map2D";
import Map3D from "./maps/Map3D";
import ViewSwitch from "./components/ViewSwitch";
import useBoundaries from "./hooks/useBoundaries";
import { projects } from "./data/projects";
import { initialLayers } from "./data/layers";

export default function Zoomer() {
  const [mode, setMode] = useState("2d"); // "2d" | "3d"
  const [selectedId, setSelectedId] = useState(null);
  const boundaries = useBoundaries(projects); // loaded once, used by both maps

  const MapView = mode === "2d" ? Map2D : Map3D;

  return (
    <div className="zoomer">
      <MapView
        key={mode}
        projects={projects}
        layers={initialLayers}
        boundaries={boundaries}
        selectedId={selectedId}
        onSelect={setSelectedId}
      />
      <ViewSwitch mode={mode} onChange={setMode} />
    </div>
  );
}
