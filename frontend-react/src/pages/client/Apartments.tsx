import { useEffect, useState } from "react";
import ApartmentCard from "@/components/client/ApartmentCard";
import type { Apartment } from "@/types/apartments";
import { getApartments } from "@/api/requests/apartments";
import SearchSortFilter from "@/components/client/SearchSortFilter";


const Apartments = () => {
  const [apartments, setApartments] = useState<Apartment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filteredApartments, setFilteredApartments] = useState<Apartment[]>([])

  useEffect(() => {
    const fetchApartments = async () => {
      try {
        const data = await getApartments();
        setApartments(data);
        setFilteredApartments(data);
      } catch (error) {
        console.error("Error fetching apartments:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchApartments();
  }, []);

  return (
    <div className="px-10">
      <h2 className="mt-6 text-3xl font-bold">Find Your Perfect Apartment</h2>

      <SearchSortFilter onFilterChange={setFilteredApartments}
        apartments={apartments} apartmentFound={filteredApartments} isLoading={isLoading} />

     

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-6">
        <ApartmentCard apartments={filteredApartments} isLoading={isLoading} />
      </div>
    </div>
  );
};

export default Apartments;
