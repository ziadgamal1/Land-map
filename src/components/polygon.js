import { polygon, area } from "@turf/turf";
import L from "leaflet";
export const colors = ["blue", "red", "green", "yellow", "orange", "purple"];
export default function Polygon(arr, map) {
  const areaKm2 = [];
  for (let i = 0; i < arr.length; i++) {
    const element = arr[i];
    const shape = polygon([element]);
    const areaMeters = area(shape);
    areaKm2.push(areaMeters / 1_000_000);
    const Km2 = areaMeters / 1_000_000;
    const color = colors[i];
    const layer = L.polygon(element)
      .bindPopup(`Area: ${Km2.toFixed(4)} Km2`)
      .setStyle({
        fillColor: color,
        color: color, // Set stroke color to match fill color
        weight: 1, // A thin weight is usually enough
        opacity: 1,
        fillOpacity: 0.5,
      })
      .addTo(map);
    map.flyToBounds(layer.getBounds());
  }
  if (areaKm2.length === 1) {
    return areaKm2[0];
  } else {
    const sum = areaKm2.reduce((a, b) => a + b, 0);
    return sum / areaKm2.length;
  }
}
