// The map style references icons that are not in its sprite (gate, atm, office...).
// MapLibre warns about each one. This adds a blank 1x1 image for any missing icon.
// Must be used inside <Map> (it needs useMap).
import { useEffect } from "react";
import { useMap } from "react-map-gl/maplibre";

export default function useMissingImages() {
  const { current: mapRef } = useMap();

  useEffect(() => {
    const map = mapRef.getMap();
    const onMissing = (e) => {
      if (!map.hasImage(e.id)) {
        map.addImage(e.id, { width: 1, height: 1, data: new Uint8Array(4) });
      }
    };
    map.on("styleimagemissing", onMissing);
    return () => map.off("styleimagemissing", onMissing);
  }, [mapRef]);
}
