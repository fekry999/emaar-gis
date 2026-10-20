// ViewSwitch: picks which map to show (top-right).
// 2D Map = flat top-down map, 3D Map = tilted map with buildings in 3D.
import "../styles/viewswitch.css";

export default function ViewSwitch({ mode, onChange }) {
  return (
    <div className="viewswitch" role="group" aria-label="Map view">
      <button
        type="button"
        className={mode === "2d" ? "active" : ""}
        aria-pressed={mode === "2d"}
        onClick={() => onChange("2d")}
      >
        2D Map
      </button>
      <button
        type="button"
        className={mode === "3d" ? "active" : ""}
        aria-pressed={mode === "3d"}
        onClick={() => onChange("3d")}
      >
        3D Map
      </button>
    </div>
  );
}
