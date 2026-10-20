// useBoundaries: returns { projectId: polygonGeometry } and fills it in as borders load.
import { useEffect, useState } from "react";
import { loadBoundaries } from "../utils/boundaries";

export default function useBoundaries(projects) {
  const [boundaries, setBoundaries] = useState({});

  useEffect(() => {
    let cancelled = false;
    loadBoundaries(
      projects,
      (id, geometry) => setBoundaries((prev) => ({ ...prev, [id]: geometry })),
      () => cancelled
    );
    return () => {
      cancelled = true;
    };
  }, [projects]);

  return boundaries;
}
