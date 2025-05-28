import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import type { Apartment } from "@/types/apartments";
import { getApartmentById } from "@/api/requests/apartments";
import SkeletonDetailPage from "@/components/client/SkeletonDetailPage";
import SliderDetailPage from "@/components/client/SliderDetailPage";
import { MapPin, Star } from "lucide-react";
import DetailsTabs from "@/components/client/DetailsTabs";
import DateRangeCalendar from "@/components/client/DateRangePicker";
import { useSelector } from "react-redux";

import { differenceInCalendarDays } from "date-fns";
import type { RootState } from "@/redux/store";
import { createBooking } from "@/api/requests/bookings";
import { useDispatch } from "react-redux";
import { updateUserBalance } from "@/redux/features/auth/authSlice";
import { updateUser } from "@/api/requests/users";

const ApartmentDetails = () => {
  const { id } = useParams<{ id: string }>();
  const [apartment, setApartment] = useState<Apartment | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [checkIn, setCheckIn] = useState<Date | undefined>(undefined);
  const [checkOut, setCheckOut] = useState<Date | undefined>(undefined);

  const user = useSelector((state: RootState) => state.auth.user);
  const dispatch = useDispatch();

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

  const handleDateChange = (checkIn: Date | undefined, checkOut: Date | undefined) => {
    setCheckIn(checkIn);
    setCheckOut(checkOut);
  };
const handleBooking = async () => {
  if (!user || !checkIn || !checkOut || !apartment) {
    alert("Missing data");
    return;
  }

  const nights = differenceInCalendarDays(checkOut, checkIn);
  const pricePerNight = apartment.pricePerNight;
  const cleaningFee = 50;
  const serviceFee = pricePerNight * 0.1;
  const totalPrice = nights * pricePerNight + cleaningFee + serviceFee;

  try {
    await createBooking({
      userId: user.id,
      apartmentId: apartment.id,
      startDate: checkIn,
      endDate: checkOut,
      totalPrice,
      status: "PENDING", // Booking starts as pending
    });

    alert("Booking request sent! Please wait for confirmation.");
  } catch (err: any) {
    alert("Error: " + err.message);
  }
};




  if (loading) return <SkeletonDetailPage />;
  if (error) return <div className="text-center py-5 text-lg text-red-500">{error}</div>;
  if (!apartment) return <div>No apartment found.</div>;

  return (
    <>
      <SliderDetailPage apartment={apartment} />
      <div className="p-4">
        <div className="flex justify-between px-3">
          <div className="w-2xl">
            <h1 className="text-3xl font-bold mb-2">{apartment.title}</h1>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1">
                <MapPin size={15} />
                <p className="text-md">{apartment.location}</p>
              </div>

              <div className="flex gap-1 items-center">
                <Star className="text-yellow-500" size={20} />
                <span className="font-semibold">{apartment.avgRating}</span>
                <span>
                  ({apartment.reviews?.length || 0}{" "}
                  {apartment.reviews?.length === 1 ? "review" : "reviews"})
                </span>
              </div>
            </div>

            <DetailsTabs apartment={apartment} />
          </div>

          {/* calendar */}
          <div className="bg-accent p-6 rounded-lg mx-auto">
            <div className="mb-5 flex justify-between">
              <p>
                <span className="font-bold text-2xl">${apartment.pricePerNight}</span>
                <span> / night</span>
              </p>
              <div className="flex gap-1 items-center">
                <Star className="text-yellow-500" size={20} />
                <span className="font-semibold">{apartment.avgRating}</span>
                <span>
                  ({apartment.reviews?.length || 0}{" "}
                  {apartment.reviews?.length === 1 ? "review" : "reviews"})
                </span>
              </div>
            </div>

            <DateRangeCalendar apartment={apartment} onChange={handleDateChange} />

         
              <button
                onClick={handleBooking}
                className="mt-4 w-full bg-black text-white py-2 rounded-lg hover:bg-gray-800"
              >
                Reserve
              </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default ApartmentDetails;
