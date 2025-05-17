import { useEffect, useState } from "react";
import { getApartments } from "@/api/requests/apartments";
import { Heart, Star } from "lucide-react";
import type { Apartment } from "@/types/apartments";
import { Link } from "react-router";
import { SkeletonCard } from "./SkeletonCard";

export default function ApartmentCard() {
  const [apartments, setApartments] = useState<Apartment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getApartments().then((_apartments) => {
      if (_apartments) {
        setApartments(_apartments);
      }
      setLoading(false);
    });
  }, []);


   if (loading) {
    return (
      <>
        {Array(4).fill(null).map((_, i) => (
          <SkeletonCard key={i} />
        ))}
      </>
    );
  }

  return (
    <>
      {apartments.map((apartment, index) => (
        <div
          key={index}
          className="max-w-xs  bg-white rounded-lg shadow-md overflow-hidden mb-6"
        >
          <div className="relative bg-gray-200 h-48 flex items-center justify-center">
            {apartment.coverImage ? (
              <img
                src={apartment.coverImage}
                alt={apartment.title || "Apartment Image"}
                className="w-full h-full object-cover"
              />
            ) : (
              <span className="text-gray-400 text-3xl">🖼</span>
            )}

            <div className="absolute top-2 left-2 bg-black text-white text-xs px-2 py-1 rounded-full font-semibold">
              {apartment.type || "Loft"}
            </div>

            <button
              aria-label="Favorite"
              className="absolute top-2 right-2 bg-white rounded-full p-2 shadow hover:bg-gray-100"
            >
              <Heart className="w-4 h-4" />
            </button>
          </div>

          <div className="p-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-1">
              {apartment.title || "Modern Downtown Loft"}
            </h3>
            <p className="text-sm text-gray-500 mb-2">
              {apartment.location || "New York, NY"}
            </p>

            <div className="flex items-center gap-2 mb-3">
              <Star className="w-4 h-4 text-yellow-400" />
              <span className="text-sm font-medium text-gray-900 mr-1">
                {apartment.avgRating}
              </span>
              <span className="text-sm text-gray-500">
                ({apartment.reviews?.length} reviews)
              </span>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-lg font-bold text-gray-900">
                ${apartment.pricePerNight}{" "}
                <span className="text-base font-normal text-gray-600">
                  / night
                </span>
              </span>
              <Link to={`/apartments/${apartment.id}`} className="text-sm text-gray-700 border border-gray-300 px-4 py-1 rounded hover:bg-gray-100">
                View Details
              </Link>
            </div>
          </div>
        </div>
      ))}
    </>
  );
}
