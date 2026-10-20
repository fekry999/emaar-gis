// RTLTextSetup: loads the Arabic (right-to-left) text plugin once for the map.
import { useEffect, useState } from "react";
import { useMap } from "react-map-gl/maplibre";
import maplibregl from "maplibre-gl";

const RTL_PLUGIN_URL =
  "https://unpkg.com/@mapbox/mapbox-gl-rtl-text@0.2.3/mapbox-gl-rtl-text.min.js";

let rtlPluginSetupStarted = false;

export default function RTLTextSetup() {
  const { current: map } = useMap();
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (!map) return;

    const status = maplibregl.getRTLTextPluginStatus();

    if (status === "loaded") {
      setReady(true);
      return;
    }

    if (rtlPluginSetupStarted) return;

    rtlPluginSetupStarted = true;

    try {
      maplibregl.setRTLTextPlugin(
        RTL_PLUGIN_URL,
        (error) => {
          if (error) {
            console.error("RTL text plugin failed to load:", error);
            rtlPluginSetupStarted = false;
            return;
          }

          setReady(true);
        },
        true
      );
    } catch (error) {
      console.error("RTL text plugin setup failed:", error);
      rtlPluginSetupStarted = false;
    }
  }, [map]);

  useEffect(() => {
    if (!ready || !map) return;

    // Refresh style placement after RTL support is ready.
    if (map.isStyleLoaded()) {
      map.triggerRepaint();
    }
  }, [ready, map]);

  return null;
}
