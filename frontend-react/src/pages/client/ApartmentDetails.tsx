import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import type { Apartment } from "@/types/apartments";
import { getApartmentById } from "@/api/requests/apartments";
import SkeletonDetailPage from "@/components/client/SkeletonDetailPage";
import SliderDetailPage from "@/components/client/SliderDetailPage";
import { MapPin } from "lucide-react";

const ApartmentDetails = () => {
  const { id } = useParams<{ id: string }>();
  const [apartment, setApartment] = useState<Apartment | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) {
      setError("Invalid apartment ID");
      setLoading(false);
      return;
    }

    getApartmentById(id)
      .then((data) => {
        console.log("API response:", data);
        setApartment(data);
      })
      .catch(() => setError("Failed to fetch apartment details"))
      .finally(() => setLoading(false));

  }, [id]);

  if (loading) return <SkeletonDetailPage />



  if (error) return <div className="text-center py-5 text-lg text-red-500">{error}</div>;
  if (!apartment) return <div>No apartment found.</div>;


  return (
    <>

      <SliderDetailPage apartment={apartment} />
      <div className="p-4">
        <h1 className="text-3xl font-bold mb-2">{apartment.title}</h1>

        <div className="flex items-center gap-1">
        <MapPin size={15}/>
        <p className="text-md">{apartment.location }</p>
        </div>

        <div>
        </div>
        <p><strong>Price:</strong> ${apartment.pricePerNight}</p>
        <p className="mt-2"><strong>Description:</strong> {apartment.description}</p>
      </div>
    </>
  );
};

export default ApartmentDetails;
