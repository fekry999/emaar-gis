// Pillars3D: optional 3D gold pillar on each project (react-three-map).
// To remove the 3D layer, delete <Pillars3D /> from MapContent.jsx.
import { Canvas, Coordinates } from "react-three-map/maplibre";

export default function Pillars3D({ projects, selectedId, origin }) {
  return (
    <Canvas latitude={origin[1]} longitude={origin[0]}>
      <hemisphereLight args={["#ffffff", "#60666C"]} position={[1, 4.5, 3]} />
      <directionalLight position={[1, 2, 3]} intensity={1.2} />
      {projects.map((p) => (
        <Coordinates key={p.id} latitude={p.pos[0]} longitude={p.pos[1]}>
          <mesh position={[0, 110, 0]}>
            <cylinderGeometry args={[8, 8, 220, 24]} />
            <meshStandardMaterial
              color={selectedId === p.id ? "#f2b705" : "#7a5ac0"}
              emissive={selectedId === p.id ? "#7a5a00" : "#1b1036"}
            />
          </mesh>
        </Coordinates>
      ))}
    </Canvas>
  );
}
