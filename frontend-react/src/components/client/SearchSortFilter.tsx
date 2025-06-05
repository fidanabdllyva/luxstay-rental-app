import { useState, useEffect, useMemo } from "react";
import type { Apartment } from "@/types/apartments";
import FilterSidebar from "./FiltersSidebar";
import { SlidersHorizontal } from "lucide-react";

interface SearchSortFilterProps {
  apartments: Apartment[];
  onFilterChange: (filtered: Apartment[]) => void;
  isLoading: boolean;
  apartmentFound: Apartment[];
  onMoreFiltersClick?: () => void;
}

const SearchSortFilter = ({
  apartments = [],
  onFilterChange,
  isLoading,
  apartmentFound,
  onMoreFiltersClick,
}: SearchSortFilterProps) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedType, setSelectedType] = useState("all");
  const [sortOrder, setSortOrder] = useState("recommended");
  const [sidebarVisible, setSidebarVisible] = useState(false);

  const [priceRange, setPriceRange] = useState<[number, number]>([0, 1000]);
  const [selectedAmenities, setSelectedAmenities] = useState<string[]>([]);

  const apartmentTypes = useMemo(() => {
    const types = Array.from(new Set(apartments.map((apt) => apt.type)));
    return types;
  }, [apartments]);

  useEffect(() => {
    let filtered = [...apartments];

    if (selectedType !== "all") {
      filtered = filtered.filter((apt) => apt.type === selectedType);
    }

    if (searchTerm.trim()) {
      filtered = filtered.filter(
        (apt) =>
          apt.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
          apt.title.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    filtered = filtered.filter(
      (apt) =>
        apt.pricePerNight >= priceRange[0] && apt.pricePerNight <= priceRange[1]
    );

    if (selectedAmenities.length > 0) {
      filtered = filtered.filter((apt) =>
        selectedAmenities.every((amenity) => apt.features?.includes(amenity))
      );
    }

    if (sortOrder === "highest-price") {
      filtered.sort((a, b) => b.pricePerNight - a.pricePerNight);
    } else if (sortOrder === "lowest-price") {
      filtered.sort((a, b) => a.pricePerNight - b.pricePerNight);
    } else if (sortOrder === "highest-rated") {
      filtered.sort((a, b) => b.avgRating - a.avgRating);
    }

    onFilterChange(filtered);
  }, [
    searchTerm,
    selectedType,
    sortOrder,
    apartments,
    priceRange,
    selectedAmenities,
    onFilterChange,
  ]);

  const handleResetFilters = () => {
    setPriceRange([0, 1000]);
    setSelectedAmenities([]);
  };

  const handleAmenityChange = (amenity: string, checked: boolean) => {
    setSelectedAmenities((prev) =>
      checked ? [...prev, amenity] : prev.filter((a) => a !== amenity)
    );
  };

  const openSidebar = () => {
    setSidebarVisible(true);
    if (onMoreFiltersClick) onMoreFiltersClick();
  };

  return (
    <>
      <div className="flex flex-wrap gap-3 justify-between items-center mt-5 bg-gray-100 dark:bg-neutral-800 p-4 rounded-md">
        <input
          type="text"
          placeholder="Search by location or apartment name"
          className="flex-grow dark:bg-black dark:text-white dark:border-neutral-900 bg-white rounded-md px-3 py-2 border border-gray-300 text-sm text-gray-700 focus:outline-none"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />

        <select
          className=" bg-white dark:bg-black dark:text-white dark:border-neutral-900 border border-gray-300 rounded-md pr-8 pl-2 py-2 text-sm text-gray-800"
          value={selectedType}
          onChange={(e) => setSelectedType(e.target.value)}
        >
          <option value="all">All Types</option>
          {apartmentTypes.map((type) => (
            <option key={type} value={type}>
              {type.charAt(0).toUpperCase() + type.slice(1)}
            </option>
          ))}
        </select>

        <select
          className="min-w-[140px] max-w-[220px] bg-white border dark:bg-black dark:text-white dark:border-neutral-900 border-gray-300 rounded-md pr-8 pl-2 py-2 text-sm text-gray-800"
          value={sortOrder}
          onChange={(e) => setSortOrder(e.target.value)}
        >
          <option value="recommended">Recommended</option>
          <option value="newest">Newest</option>
          <option value="lowest-price">Lowest Price</option>
          <option value="highest-rated">Highest Rated</option>
        </select>

        <button
          onClick={openSidebar}
          className="flex items-center dark:bg-black dark:text-white dark:border-neutral-900 bg-white border border-gray-300 rounded-md pl-2 pr-8 py-2 text-sm text-gray-800 whitespace-nowrap"
        >
          <SlidersHorizontal size={15} className="mr-2" />
          More Filters
        </button>
      </div>

      <p className="w-full mt-6 text-center text-gray-700 dark:text-gray-200 text-md">
        {isLoading
          ? "Loading..."
          : `${apartmentFound.length} apartment${
              apartmentFound.length !== 1 ? "s" : ""
            } found`}
      </p>

      <FilterSidebar
        visible={sidebarVisible}
        onClose={() => setSidebarVisible(false)}
        priceRange={priceRange}
        onPriceChange={(values: number[]) =>
          setPriceRange([values[0], values[1]])
        }
        onReset={handleResetFilters}
        selectedAmenities={selectedAmenities}
        onAmenityChange={handleAmenityChange}
        apartments={apartments}
      />
    </>
  );
};

export default SearchSortFilter;
