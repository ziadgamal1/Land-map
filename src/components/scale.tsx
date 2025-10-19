import { useMap } from "react-leaflet";
import { useEffect } from "react";
import L, { ControlPosition } from "leaflet";

export default function ScaleControl() {
  const map = useMap();

  useEffect(() => {
    const scale = L.control.scale({
      position: "bottomleft", // where to show the scale
      imperial: false, // false = metric only, true = both metric & imperial
      maxWidth: 100, // width of scale bar in pixels
    });
    scale.addTo(map);

    return () => {
      scale.remove();
    };
  }, [map]);

  return null;
}
