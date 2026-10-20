// Map layers the user can switch on/off from the Layers panel.
// To add a layer: add one line here, then render it in MapContent.jsx
// when layers.<id> is true.
export const LAYERS = [
  { id: "areas", label: "Project areas", on: true },
  { id: "cameras", label: "Cameras", on: true },
  { id: "cairoGate", label: "Cairo Gate Boundary" },
];

export const initialLayers = Object.fromEntries(LAYERS.map((l) => [l.id, l.on]));
