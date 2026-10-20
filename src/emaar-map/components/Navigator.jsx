// Navigator: puts the brand chip, info card and city bar together.
// Pure UI: it only calls onSelect(project) / onReset().
import BrandChip from "./BrandChip";
import InfoCard from "./InfoCard";
import CityBar from "./CityBar";

export default function Navigator({ projects, selectedId, onSelect, onReset }) {
  const selected = projects.find((p) => p.id === selectedId);
  return (
    <>
      <BrandChip />
      <InfoCard project={selected} />
      <CityBar projects={projects} selectedId={selectedId} onSelect={onSelect} onReset={onReset} />
    </>
  );
}
