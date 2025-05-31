import { useState, useEffect } from "react";
import { getApartments, toggleWishlist } from "@/api/requests/apartments";
import type { Apartment } from "@/types/apartments";

export function useWishlist(userId?: string) {
  const [wishlist, setWishlist] = useState<Apartment[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchWishlist = async () => {
    if (!userId) {
      setWishlist([]);
      return;
    }

    setLoading(true);
    try {
      const apartments = await getApartments();
      const filtered = apartments.filter((apt) =>
        apt.wishlistedBy?.some((user) => user.id === userId)
      );
      setWishlist(filtered);
    } catch (error) {
      console.error("Failed to load wishlist:", error);
      setWishlist([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWishlist();
  }, [userId]);

  const toggleApartment = async (apartmentId: string) => {
    if (!userId) return;
    setLoading(true);
    try {
      await toggleWishlist(apartmentId, userId);
      await fetchWishlist(); 
    } catch (error) {
      console.error("Failed to toggle wishlist:", error);
    } finally {
      setLoading(false);
    }
  };

  const isInWishlist = (apartmentId: string) =>
    wishlist.some((apt) => apt.id === apartmentId);

  return {
    wishlist,
    toggleApartment,
    isInWishlist,
    loading,
  };
}
