export default function Result({
  calculatedNumber,
  average,
}: {
  calculatedNumber: number;
  average: Boolean;
}) {
  return (
    <div className="relative mt-5 w-full p-5 h-[120px] bg-indigo-100 rounded-2xl">
      <h2 className="text-xl font-bold text-left">
        calculated {average ? "average" : null} area:
      </h2>
      <span className="text-2xl font-extrabold text-indigo-900 mt-1">
        {calculatedNumber.toFixed(3)} km²
      </span>
      <br />
      <span className="text-base font-bold w-full block text-left">
        {(calculatedNumber * 10 ** 6).toFixed(2)} m²
      </span>
    </div>
  );
}
