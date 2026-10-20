// InfoCard: photo, name, area and description of the selected project.
import "../styles/info.css";

export default function InfoCard({ project }) {
  if (!project) return null;
  return (
    <div className="info">
      <img className="info-image" src={project.image} alt="" />
      <div className="info-name">{project.name}</div>
      <div className="info-area">{project.area}</div>
      <p className="info-desc">{project.desc}</p>
    </div>
  );
}
