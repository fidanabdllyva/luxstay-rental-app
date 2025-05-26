import { useEffect, useState } from "react";
import type { Apartment } from "@/types/apartments";
import { getHostApartments } from "@/api/requests/apartments";

interface Props {
  entrepreneurId: string;
}
const HostApartments = ({ entrepreneurId }: Props) => {
  const [apartments, setApartments] = useState<Apartment[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  useEffect(() => {
    if (!entrepreneurId) return;

    setLoading(true);
    getHostApartments(entrepreneurId)
      .then((data) => setApartments(data))
      .catch((err) => setError(err.message || "Failed to load apartments"))
      .finally(() => setLoading(false));
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
}

export default HostApartments




