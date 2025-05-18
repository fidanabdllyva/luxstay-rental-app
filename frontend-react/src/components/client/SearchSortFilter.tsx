import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/src/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useState, useEffect, useMemo } from "react";
import type { Apartment } from "@/types/apartments";

interface SearchSortFilterProps {
  apartments: Apartment[];
  onFilterChange: (filtered: Apartment[]) => void;
  isLoading:boolean;
  apartmentFound:Apartment[]
}

const SearchSortFilter = ({
  apartments = [],
  onFilterChange,isLoading,apartmentFound
}: SearchSortFilterProps) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedType, setSelectedType] = useState("all");
  const [sortOrder, setSortOrder] = useState("recommended");

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
      filtered = filtered.filter((apt) =>
        apt.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
        apt.title.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (sortOrder === "newest") {
      filtered.sort((a, b) => Number(new Date(b.createdAt)) - Number(new Date(a.createdAt)));
    } else if (sortOrder === "lowest-price") {
      filtered.sort((a, b) => a.pricePerNight - b.pricePerNight);
    } else if (sortOrder === "highest-rated") {
      filtered.sort((a, b) => b.avgRating - a.avgRating);
    }

    onFilterChange(filtered);
  }, [searchTerm, selectedType, sortOrder, apartments, onFilterChange]);

  return (
    <>
    <div className="flex flex-wrap gap-4 items-center bg-muted p-4 rounded-md mt-6">
      <Input
        type="text"
        placeholder="Search by location or apartment name"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="w-full md:max-w-[400px] text-sm"
      />

      <Select value={selectedType} onValueChange={setSelectedType}>
        <SelectTrigger className="w-[160px]">
          <SelectValue placeholder="All Types" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Types</SelectItem>
          {apartmentTypes.map((type) => (
            <SelectItem key={type} value={type}>
              {type.charAt(0).toUpperCase() + type.slice(1).toLowerCase()}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select value={sortOrder} onValueChange={setSortOrder}>
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Recommended" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="recommended">Recommended</SelectItem>
          <SelectItem value="newest">Newest</SelectItem>
          <SelectItem value="lowest-price">Lowest Price</SelectItem>
          <SelectItem value="highest-rated">Highest Rated</SelectItem>
        </SelectContent>
      </Select>

      <Button variant="outline" className="text-sm">
        More Filters
      </Button>
    </div>
     <p className="mt-6 text-gray-700 text-md">
        {isLoading ? "Loading..." : `${apartmentFound.length} apartment${apartmentFound.length !== 1 ? "s" : ""} found`}
      </p>
      </>
  );
};

export default SearchSortFilter;
