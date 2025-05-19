import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import type { Apartment } from "@/types/apartments";
import { getApartmentById } from "@/api/requests/apartments";
import SkeletonDetailPage from "@/components/client/SkeletonDetailPage";

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

  if (loading) return <SkeletonDetailPage/>
  


  if (error) return <div className="text-red-500">{error}</div>;
  if (!apartment) return <div>No apartment found.</div>;


  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-2">{apartment.title}</h1>
      <img
        src={apartment.coverImage}
        alt={apartment.title}
        className="w-full max-w-lg rounded mb-4"
      />
      <p><strong>Location:</strong> {apartment.location}</p>
      <p><strong>Type:</strong> {apartment.type}</p>
      <p><strong>Price:</strong> ${apartment.pricePerNight}</p>
      <p className="mt-2"><strong>Description:</strong> {apartment.description}</p>
    </div>
  );
};

export default ApartmentDetails;
