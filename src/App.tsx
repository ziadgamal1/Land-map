import { useState, useEffect } from "react";
import "./App.css";
import "leaflet/dist/leaflet.css";

import { LatLngExpression } from "leaflet";
import Map from "./components/map";
import MapOOP from "./components/mapOOP";
import plus from "../public/plus-large-svgrepo-com.svg";
function App() {
  const tiles: string[] = [
    "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
    "https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png",
    "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
  ];
  const [tileNumber, setTileNumber] = useState<number>(0);
  const [position, setPosition] = useState<LatLngExpression>();
  useEffect(function getCurrentPosition() {
    let position: LatLngExpression;
    navigator.geolocation.getCurrentPosition((x) => {
      const { latitude, longitude } = x.coords;
      position = [latitude, longitude];
      setPosition(position);
    });
  }, []);

  return (
    <div className="App">
      {position && (
        <>
          <Map position={position} mapURL={tiles[tileNumber]} />
          {/* <MapOOP /> */}

          <button className="absolute right-[10vw] top-[10vh] p-5 bg-white z-10 rounded-full hover:cursor-pointer active:animate-ping timer">
            <img src={plus} alt="plus" className="w-[50px]" />
          </button>
          <nav className="absolute z-10 top-0 w-[100vw] bg-gray-100 opacity-95">
            <ul className="nav-buttons">
              <li>
                <button className="buttons" onClick={() => setTileNumber(0)}>
                  openstreetmap
                </button>
              </li>
              <li>
                <button className="buttons" onClick={() => setTileNumber(1)}>
                  CartoDB
                </button>
              </li>
              <li>
                <button className="buttons" onClick={() => setTileNumber(2)}>
                  arcGIS
                </button>
              </li>
            </ul>
          </nav>
        </>
      )}
    </div>
  );
}

export default App;
