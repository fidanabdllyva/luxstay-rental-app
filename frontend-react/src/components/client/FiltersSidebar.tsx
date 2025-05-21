import type { Apartment } from "@/types/apartments";
import PriceRangeSlider from "./PriceRange";
import { useMemo } from "react";

type FilterSidebarProps = {
    visible: boolean;
    onClose: () => void;
    priceRange: [number, number];
    onPriceChange: (values: number[]) => void;
    onReset: () => void;
    selectedAmenities: string[];
    onAmenityChange: (amenity: string, checked: boolean) => void;
    apartments: Apartment[]
};


const FilterSidebar = ({
    visible,
    onClose,
    priceRange,
    onPriceChange,
    onReset,
    selectedAmenities,
    onAmenityChange,
    apartments
}: FilterSidebarProps) => {

    const apartmentFeatures = useMemo(() => {
        const allFeatures = apartments.flatMap((apt) => apt.features || []);
        return Array.from(new Set(allFeatures));
    }, [apartments]);

    return (
        <>
            {visible && (
                <div
                    onClick={onClose}
                    className="fixed inset-0 z-40 bg-black"
                    style={{ opacity: 0.7 }}
                />
            )}

            <div
                className={`fixed top-0 right-0 w-80 h-full bg-white shadow-lg p-6 z-50
          transform transition-transform duration-300 ease-in-out
          ${visible ? "translate-x-0" : "translate-x-full"}`}
            >
                <button
                    onClick={onClose}
                    className="text-xl font-bold mb-6 float-right"
                    aria-label="Close sidebar"
                >
                    &times;
                </button>

                <h2 className="text-2xl font-semibold mb-1">Filters</h2>
                <p className="text-gray-500 mb-6">Refine your search with filters</p>

                <PriceRangeSlider
                    value={priceRange}
                    onChange={onPriceChange}
                />

                <label className="block font-semibold mt-6 mb-3">Amenities</label>
                <div className="grid grid-cols-2 gap-3 max-h-64 overflow-y-auto">
                    {apartmentFeatures.map((amenity) => (
                        <label
                            key={amenity}
                            className="flex items-center gap-2 text-gray-700 cursor-pointer"
                        >
                            <input
                                type="checkbox"
                                className="w-4 h-4 border-gray-300 rounded"
                                checked={selectedAmenities.includes(amenity)}
                                onChange={(e) => onAmenityChange(amenity, e.target.checked)}
                            />
                            {amenity}
                        </label>
                    ))}
                </div>

                <div className="flex justify-between mt-6">
                    <button
                        onClick={onReset}
                        className="border border-gray-300 rounded px-4 py-2 hover:bg-gray-100"
                    >
                        Reset
                    </button>
                    <button
                        onClick={onClose}
                        className="bg-black text-white rounded px-4 py-2 hover:bg-gray-800"
                    >
                        Apply
                    </button>
                </div>
            </div>
        </>
    );
};

export default FilterSidebar;