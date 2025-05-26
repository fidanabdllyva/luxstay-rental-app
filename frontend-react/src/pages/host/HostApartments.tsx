import { useEffect, useState } from "react";
import type { Apartment } from "@/types/apartments";
import { getHostApartments } from "@/api/requests/apartments";
import { useSelector } from "react-redux";
import type { RootState } from "@/redux/store";



const HostApartments = () => {
  const [apartments, setApartments] = useState<Apartment[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const entrepreneurId = useSelector(
    (state: RootState) => state.auth.user?.id 
  );

  ;
  useEffect(() => {

    const fetchApartments = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await getHostApartments(entrepreneurId);
        setApartments(data);
      } catch (err: any) {
        setError(err.message || "Failed to load apartments");
      } finally {
        setLoading(false);
      }
    };

    fetchApartments();
  }, [entrepreneurId]);

  if (loading) return <p>Loading apartments...</p>;
  if (error) return <p>Error: {error}</p>;
  if (apartments.length === 0)
    return <p>No apartments found for this host.</p>;

  return (
    <ul>
      {apartments.map((apt) => (
        <li key={apt.id}>{apt.title}</li>
      ))}
    </ul>
  );
};

export default HostApartments;
