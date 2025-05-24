import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import type { Apartment } from "@/types/apartments";
import { getApartmentById } from "@/api/requests/apartments";
import SkeletonDetailPage from "@/components/client/SkeletonDetailPage";
import SliderDetailPage from "@/components/client/SliderDetailPage";
import { MapPin, Star } from "lucide-react";
import DetailsTabs from "@/components/client/DetailsTabs";
import DateRangeCalendar from "@/components/client/DateRangePicker";


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
        setApartment(data);
      })
      .catch(() => setError("Failed to fetch apartment details"))
      .finally(() => setLoading(false));

  }, [id]);

  if (loading) return <SkeletonDetailPage />



  if (error) return <div className="text-center py-5 text-lg text-red-500">{error}</div>;
  if (!apartment) return <div>No apartment found.</div>;
console.log(apartment)
  const handleDateChange = (checkIn: Date | null, checkOut: Date | null) => {
    console.log('Check-In:', checkIn);
    console.log('Check-Out:', checkOut);
  };
  return (
    <>

      <SliderDetailPage apartment={apartment} />
      <div className="p-4">
        <div className="flex">


          <div>

            <h1 className="text-3xl font-bold mb-2">{apartment.title}</h1>

            <div className="flex items-center justify-between">

              <div className="flex items-center gap-1">
                <MapPin size={15} />
                <p className="text-md">{apartment.location}</p>
              </div>

              <div className="flex gap-1 items-center">
                <Star className="text-yellow-500" size={20} />
                <span className="font-semibold">{apartment.avgRating}</span>
                <span>({apartment.reviews?.length || 0} {apartment.reviews?.length === 1 ? "review" : "reviews"})</span>
              </div>


            </div>

            <div>
              <DetailsTabs apartment={apartment} />

            </div>
          </div>



          {/* calendar */}
          <div>
             <DateRangeCalendar onChange={handleDateChange} />
            <p>salam</p>
          </div>


        </div>
      </div>
    </>
  );
};

export default ApartmentDetails;
