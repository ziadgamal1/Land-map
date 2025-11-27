import { Formik, Form, Field, FieldArray } from "formik";
import { useMap } from "react-leaflet";
import { useState, useEffect } from "react";
import Result from "./result";
import PolygonCalculation from "./polygon";
import { getToken } from "./token";
interface Props extends React.HTMLAttributes<HTMLFormElement> {
  props: {
    className: string;
  };
}
interface Coord {
  lat: number;
  lng: number;
}

interface FormValues {
  coords: Coord[];
}
export default function MapForm({ props }: Props) {
  const map = useMap();
  const [calculatedNumber, setCalculatedNumber] = useState<number | null>(null);
  const [DBdata, setDBdata] = useState<number[][] | null>(null);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [active, setActive] = useState(false);
  const [isAverage, setIsAverage] = useState(false);
  function handleSwitch() {
    setCalculatedNumber(null);
    setActive(!active);
  }
  const token = getToken();
  useEffect(() => {
    async function fetchData() {
      const response = await fetch(
        "https://land-map-umsa.onrender.com/dashboard",
        {
          method: "GET",
          headers: {
            authorization: `Bearer ${token}`,
          },
        }
      );
      if (response.ok) {
        const data = await response.json();
        setDBdata(data);
      } else {
        return;
      }
    }
    fetchData();
  }, [token]);
  function showHandler() {
    if (!DBdata || selectedOption === null) return;
    const selected = DBdata[selectedOption as unknown as number];
    console.log(selected);
    const areaKm2 = PolygonCalculation(selected, map);
    setCalculatedNumber(areaKm2);
  }
  return (
    <div {...props}>
      <button
        type="button"
        className={`hero-icons ${!active ? "active" : ""}`}
        onClick={() => handleSwitch()}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
          className="size-6"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M10.5 6h9.75M10.5 6a1.5 1.5 0 1 1-3 0m3 0a1.5 1.5 0 1 0-3 0M3.75 6H7.5m3 12h9.75m-9.75 0a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m-3.75 0H7.5m9-6h3.75m-3.75 0a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m-9.75 0h9.75"
          />
        </svg>
      </button>
      <button
        type="button"
        className={`hero-icons ${active ? "active" : ""}`}
        onClick={() => handleSwitch()}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
          className="size-6"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5m-13.5-9L12 3m0 0 4.5 4.5M12 3v13.5"
          />
        </svg>
      </button>
      {!active && (
        <Formik<FormValues>
          initialValues={{
            coords: [
              {
                lat: 0,
                lng: 0,
              },
            ],
          }}
          onSubmit={(values) => {
            const arr = values.coords.map((coord) => [coord.lat, coord.lng]);
            const areaKm2 = PolygonCalculation([arr], map);
            setCalculatedNumber(areaKm2);
          }}
        >
          {({ values }) => (
            <>
              <Form>
                <>
                  <FieldArray
                    name="coords"
                    render={(arrayHelpers) => (
                      <div>
                        {values.coords.map((coord, index) => (
                          <div
                            key={index}
                            className="flex gap-5 justify-between ml-3"
                          >
                            <label htmlFor={`coords.${index}.lat`}>lat</label>
                            <Field
                              placeholder="latitude"
                              className="w-1/2"
                              name={`coords.${index}.lat`}
                            />
                            <label htmlFor={`coords.${index}.lng`}>lng</label>
                            <Field
                              placeholder="longitude"
                              className="w-1/2"
                              name={`coords.${index}.lng`}
                            />
                          </div>
                        ))}
                        <div className="flex gap-0 justify-center-safe items-center">
                          <button
                            type="button"
                            onClick={() =>
                              arrayHelpers.push({ lat: "", lng: "" })
                            }
                            className="button-form"
                          >
                            +
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              if (arrayHelpers.form.values.coords.length > 1) {
                                arrayHelpers.pop();
                              }
                              return;
                            }}
                            className="button-form bg-rose-400"
                          >
                            -
                          </button>
                        </div>
                      </div>
                    )}
                  />
                  <button type="submit" className="button-submit">
                    Submit
                  </button>
                </>
              </Form>
            </>
          )}
        </Formik>
      )}
      {active && (
        <Formik
          initialValues={{ file: null }}
          onSubmit={async (values) => {
            const token = localStorage.getItem("token");
            const response = await fetch(
              "https://land-map-umsa.onrender.com/form",
              {
                method: "POST",
                body: values.file,
                headers: {
                  "Content-Type": "application/geo+json",
                  authorization: `Bearer ${token}`,
                },
              }
            );
            const arr = await response.json();
            console.log(arr);
            if (arr.length > 1) {
              setIsAverage(true);
            } else {
              setIsAverage(false);
            }
            const areaKm2 = PolygonCalculation(arr, map);
            setCalculatedNumber(areaKm2);
          }}
        >
          {({ setFieldValue }) => (
            <Form>
              <h2 className="text-xl font-bold mb-5">
                please insert coordination file
              </h2>
              <input
                className="bg-slate-50 text-gray-900 border w-full border-gray-300 rounded-md py-2 hover:shadow-md hover:cursor-pointer"
                type="file"
                name="file"
                onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                  setFieldValue("file", event.currentTarget.files?.[0] ?? null);
                }}
              />
              {DBdata && (
                <>
                  <label
                    htmlFor="stored-data"
                    className="text-left mb-3 font-bold"
                  >
                    Saved data
                  </label>
                  <select
                    name="stored-data"
                    id="selection"
                    onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
                      setSelectedOption(e.target.value)
                    }
                    className="w-full p-2 text-lg font-semibold border  rounded-lg hover:cursor-pointer mb-2 "
                  >
                    <option value="">Choose an option</option>
                    {new Array(DBdata.length).fill("Land").map((land, i) => {
                      return (
                        <option key={i} value={i}>
                          {land} {i + 1}
                        </option>
                      );
                    })}
                  </select>
                </>
              )}
              {DBdata && selectedOption && (
                <button
                  type="button"
                  onClick={showHandler}
                  className="button-submit bg-amber-500 hover:bg-amber-800"
                >
                  Show
                </button>
              )}
              <button type="submit" className="button-submit">
                Submit
              </button>
            </Form>
          )}
        </Formik>
      )}
      {calculatedNumber && (
        <Result calculatedNumber={calculatedNumber} average={isAverage} />
      )}
    </div>
  );
}
