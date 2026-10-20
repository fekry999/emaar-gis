// CityBar: horizontal bar with one card per project plus a reset card.
import "../styles/citybar.css";

export default function CityBar({ projects, selectedId, onSelect, onReset }) {
  return (
    <div className="bar">
      {projects.map((p) => (
        <button
          key={p.id}
          className={`card ${selectedId === p.id ? "active" : ""}`}
          onClick={() => onSelect(p)}
        >
          <span className="card-name">{p.name}</span>
          <span className="card-area">{p.area}</span>
        </button>
      ))}
      <button className="card all" onClick={onReset}>
        <span className="card-name">All</span>
        <span className="card-area">Reset view</span>
      </button>
    </div>
  );
}
