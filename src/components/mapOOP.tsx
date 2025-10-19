import L from "leaflet";
import "leaflet-draw";
import "leaflet-draw/dist/leaflet.draw.css";
export default function Mapty() {
  const map = L.map("map").setView([30.0444, 31.2357], 16);

  // Add tile layer
  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    maxZoom: 19,
  }).addTo(map);

  // Initialize a feature group to store drawn shapes
  const drawnItems = new L.FeatureGroup();
  map.addLayer(drawnItems);

  // Define drawing controls
  const drawControl = new L.Control.Draw({
    position: "topleft",
    draw: {
      polygon: true,
      polyline: true,
      rectangle: true,
      circle: false,
      circlemarker: false,
      marker: true,
    },
    edit: {
      featureGroup: drawnItems,
    },
  });
  map.addControl(drawControl);

  // Handle created shapes
  map.on(L.Draw.Event.CREATED, function (event) {
    const layer = event.layer;
    drawnItems.addLayer(layer);
  });
}
