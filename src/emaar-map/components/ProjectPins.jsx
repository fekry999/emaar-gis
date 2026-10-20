// ProjectPins: the photo circles with the city name inside.
import { Marker } from "react-map-gl/maplibre";
import "../styles/pins.css";

export default function ProjectPins({ projects, onSelect }) {
  return projects.map((p) => (
    <Marker
      key={p.id}
      longitude={p.pos[1]}
      latitude={p.pos[0]}
      anchor="center"
      onClick={(e) => {
        e.originalEvent.stopPropagation();
        onSelect(p);
      }}
    >
      <div
        className="emaar-pin"
        style={{
          backgroundImage: `linear-gradient(rgba(27,16,54,.55), rgba(27,16,54,.55)), url('${p.image}')`,
        }}
      >
        <span>{p.name}</span>
      </div>
    </Marker>
  ));
}
