
export function projectAreas(projects, boundaries = {}) {
  return {
    type: "FeatureCollection",
    features: projects
      .filter((project) => {
        const boundary = boundaries[project.id];

        return (
          boundary &&
          (boundary.type === "Polygon" ||
            boundary.type === "MultiPolygon")
        );
      })
      .map((project) => ({
        type: "Feature",
        properties: {
          id: project.id,
          name: project.name,
          real: true,
        },
        geometry: boundaries[project.id],
      })),
  };
}
