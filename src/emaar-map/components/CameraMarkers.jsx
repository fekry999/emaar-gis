// CameraMarkers: cameras that pop in around the selected project.
import { Marker } from "react-map-gl/maplibre";
import CameraIcon from "./CameraIcon";
import "../styles/cameras.css";

export default function CameraMarkers({ cameras }) {
  return cameras.map((c) => (
    <Marker key={c.id} longitude={c.lng} latitude={c.lat} anchor="center">
      <div className="cam" style={{ animationDelay: `${c.delay}ms` }}>
        <CameraIcon rot={c.rot} />
      </div>
    </Marker>
  ));
}
