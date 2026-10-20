// LayerPanel: checkbox list to switch map layers on/off (top-right).
import { LAYERS } from "../data/layers";
import "../styles/layers.css";

export default function LayerPanel({ layers, onToggle }) {
  return (
    <div className="layers">
      <div className="layers-title">Layers</div>
      {LAYERS.map((l) => (
        <label key={l.id} className="layers-row">
          <input type="checkbox" checked={!!layers[l.id]} onChange={() => onToggle(l.id)} />
          <span>{l.label}</span>
        </label>
      ))}
    </div>
  );
}
