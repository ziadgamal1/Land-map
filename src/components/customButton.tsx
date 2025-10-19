import "leaflet-draw/dist/leaflet.draw.css";
import { useMap } from "react-leaflet";
import L from "leaflet";
export default function CustomButton() {
  const map = useMap();
  function clickHandler() {
    const polygonDrawer = new L.Draw.Polygon(map);
    polygonDrawer.enable();
  }
  return (
    <button
      className="absolute right-[50vw] top-[50vh] z-10"
      onClick={clickHandler}
    >
      Custom Button
    </button>
  );
}
