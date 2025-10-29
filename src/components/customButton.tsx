import "leaflet-draw/dist/leaflet.draw.css";
export default function CustomButton({ clickHandler }) {
  return (
    <button
      onClick={clickHandler}
      className="absolute right-[10vw] top-[10vh] pr-5 pl-5 pt-3 pb-3 bg-white z-10 rounded-full hover:cursor-pointer active:animate-ping timer"
    >
      <span className="text-black font-bold text-5xl ">+</span>
    </button>
  );
}
