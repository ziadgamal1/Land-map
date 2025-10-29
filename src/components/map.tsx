import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  FeatureGroup,
  ZoomControl,
} from "react-leaflet";
import ScaleControl from "./scale";
import { LatLngExpression } from "leaflet";
import logo from "../logo.svg";
import L from "leaflet";
import * as turf from "@turf/turf";
import { EditControl } from "react-leaflet-draw";
import "leaflet/dist/leaflet.css";
import "leaflet-draw/dist/leaflet.draw.css";
import MapForm from "./Form";
import { useRef, useState } from "react";
import CustomButton from "./customButton";
import { FormControl } from "./formControl";
export default function Map({
  position,
  mapURL,
}: {
  position: LatLngExpression;
  mapURL: string;
}) {
  const colors = ["blue", "red", "green", "yellow", "orange", "purple"];
  const [showForm, setShowForm] = useState<boolean>(false);
  const styles =
    "absolute top-[10vh] right-[4vw] z-1 w-[350px] h-[65vh] p-6 bg-white border border-gray-200 rounded-4xl shadow-sm dark:bg-gray-800 dark:border-gray-700 transition-all ease-in-out  duration-500";
  const stylesPosition = showForm
    ? "transform translate-y-25 opacity-100"
    : "opacity-0 pointer-events-none";
  const totalStyles = `${styles} ${stylesPosition}`;
  function handler() {
    setShowForm(!showForm);
  }
  const _onCreated = (e: any) => {
    const { layerType, layer } = e;
    if (layerType === "polygon") {
      const latLngs = layer.getLatLngs()[0]; // outer ring
      const coords = latLngs.map((pt: L.LatLng) => [pt.lng, pt.lat]);
      // Turf expects a closed ring (first === last)
      if (
        coords.length > 0 &&
        (coords[0][0] !== coords[coords.length - 1][0] ||
          coords[0][1] !== coords[coords.length - 1][1])
      ) {
        coords.push(coords[0]);
      }
      const polygon = turf.polygon([coords]);
      const areaMeters = turf.area(polygon); // in square meters
      const areaKm2 = areaMeters / 1_000_000;
      // bind popup to show area nicely
      layer.bindPopup(
        `Area: ${areaMeters.toFixed(2)} m² (${areaKm2.toFixed(4)} km²)`
      );
      // if you want popup open immediately:
      layer.openPopup();
      // set style for polygon
      layer.setStyle({
        fillColor: colors[layer._leaflet_id % colors.length],
        color: "black",
        weight: 2,
        opacity: 0.5,
        fillOpacity: 0.5,
      });
    }
    console.log(layer);
  };

  return (
    <MapContainer
      center={position}
      zoom={18}
      zoomControl={false}
      scrollWheelZoom={true}
      style={{
        height: "100vh",
        width: "100%",
        zIndex: 0,
      }}
      inertia={true}
    >
      <FormControl>
        <MapForm props={{ className: `${styles} ${stylesPosition}` }} />

        {!showForm && <CustomButton clickHandler={() => handler()} />}
      </FormControl>
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url={mapURL}
        className="z-0"
      />
      <Marker
        position={position}
        icon={L.icon({
          iconUrl: logo,
          iconSize: [50, 50],
          iconAnchor: [25, 25],
        })}
        interactive={true}
      >
        <Popup>
          <b>Hello from Cairo!</b>
          <br />
          This popup is clickable.
        </Popup>
      </Marker>
      <FeatureGroup>
        <EditControl
          position="bottomright"
          onCreated={_onCreated}
          draw={{
            rectangle: false,
            polygon: true,
            polyline: true,
            circle: true,
            circlemarker: false,
            marker: true,
          }}
        />
      </FeatureGroup>
      <ScaleControl />
      <ZoomControl position="bottomleft" />
    </MapContainer>
  );
}
