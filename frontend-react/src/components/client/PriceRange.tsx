import { Range } from "react-range";

type PriceRangeSliderProps = {
  value: [number, number];
  onChange: ((values: number[]) => void);
};

const MIN = 0;
const MAX = 1000;

const PriceRangeSlider = ({ value, onChange }: PriceRangeSliderProps) => {
  return (
    <div className="w-full">
      <label className="block font-semibold mb-2">Price Range</label>
      <Range
        step={1}
        min={MIN}
        max={MAX}
        values={value}
        onChange={onChange}
        renderTrack={({ props, children }) => (
          <div
            {...props}
            className="h-1 w-full bg-gray-300 rounded cursor-pointer relative"
            style={{ ...props.style }}
          >
            <div
              style={{
                position: "absolute",
                height: "100%",
                backgroundColor: "black",
                borderRadius: 4,
                left: `${((value[0] - MIN) / (MAX - MIN)) * 100}%`,
                width: `${((value[1] - value[0]) / (MAX - MIN)) * 100}%`,
              }}
            />
            {children}
          </div>
        )}
        renderThumb={({ props }) => (
          <div
            {...props}
            className="h-5 w-5 bg-black rounded-full"
            style={{ ...props.style }}
          />
        )}
      />
      <div className="mt-2 text-gray-700">
        Selected price: ${value[0]} – ${value[1]}
      </div>
    </div>
  );
};

export default PriceRangeSlider;