// Where a map opens: on the selected project if there is one, otherwise the home view.
// Lets the 2D and 3D maps open at the same place when you switch between them.
export function startView(project, homeView, cityView) {
  if (project) {
    return {
      longitude: project.pos[1],
      latitude: project.pos[0],
      zoom: cityView.zoom,
      pitch: cityView.pitch,
      bearing: cityView.bearing ?? 0,
    };
  }
  return {
    longitude: homeView.center[0],
    latitude: homeView.center[1],
    zoom: homeView.zoom,
    pitch: homeView.pitch,
    bearing: homeView.bearing ?? 0,
  };
}
