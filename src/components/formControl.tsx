import { useEffect, useRef } from "react";
import L from "leaflet";
import { useMap } from "react-leaflet";
export const FormControl: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const map = useMap();
  const formRef = useRef(null);

  useEffect(() => {
    if (!formRef.current) return;

    // Create a custom Leaflet Control
    const control = L.control({ position: "topright" });

    // Define the required methods for the control
    control.onAdd = function (map) {
      // The container element is the div that holds the form
      // We explicitly stop click propagation to allow interaction with the form
      L.DomEvent.disableClickPropagation(formRef.current);
      return formRef.current;
    };

    control.onRemove = function (map) {
      // Clean up if needed
    };

    // Add the control to the map
    control.addTo(map);

    // Clean up function
    return () => {
      control.remove();
    };
  }, [map]);

  // Render the form into a container div
  // The 'ref' is crucial for Leaflet to grab the element
  return <div ref={formRef}>{children}</div>;
};
