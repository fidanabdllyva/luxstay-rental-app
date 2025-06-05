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
import { createBooking, getBookingsByApartmentId } from "@/api/requests/bookings";
import { toast } from "sonner";

const ApartmentDetails = () => {
  const { id } = useParams<{ id: string }>();
  const [apartment, setApartment] = useState<Apartment | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [checkIn, setCheckIn] = useState<Date | undefined>(undefined);
  const [checkOut, setCheckOut] = useState<Date | undefined>(undefined);
  const [bookedDates, setBookedDates] = useState<Date[]>([]);

  const user = useSelector((state: RootState) => state.auth.user);

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

  useEffect(() => {
    if (!id) return;

    const fetchBookedDates = async () => {
      try {
        const bookings = await getBookingsByApartmentId(id);

        const confirmedBookings = bookings.filter(
          (b) => b.status === "CONFIRMED"
        );

        const dates: Date[] = [];

        confirmedBookings.forEach(({ startDate, endDate }) => {
          let current = new Date(startDate);
          const last = new Date(endDate);

          while (current <= last) {
            dates.push(new Date(current));
            current.setDate(current.getDate() + 1);
          }
        });

        setBookedDates(dates);
      } catch (error) {
        console.error("Failed to fetch booked dates", error);
      }
    };

    fetchBookedDates();
  }, [id]);

  const handleDateChange = (checkIn: Date | undefined, checkOut: Date | undefined) => {
    setCheckIn(checkIn);
    setCheckOut(checkOut);
  };

  const handleBooking = async () => {
    if (!user || !checkIn || !checkOut || !apartment) {
      toast.error("Missing data");
      return;
    }

    const nights = differenceInCalendarDays(checkOut, checkIn);
    if (nights <= 0) {
      toast.error("Invalid date range");
      return;
    }

    const pricePerNight = apartment.pricePerNight;
    const cleaningFee = 50;
    const serviceFee = pricePerNight * 0.1;
    const totalPrice = nights * pricePerNight + cleaningFee + serviceFee;

    if (user.balance < totalPrice) {
      toast.error("Insufficient balance to make this booking. Please add funds.");
      return;
    }

    try {
      await createBooking({
        userId: user.id,
        apartmentId: apartment.id,
        startDate: checkIn,
        endDate: checkOut,
        totalPrice,
        status: "PENDING",
      });

      toast.success("Booking request sent! Please wait for confirmation.");
    } catch (err: any) {
      toast.error("Error: " + err.message);
    }
  };

  if (loading) return <SkeletonDetailPage />;
  if (error) return <div className="text-center py-5 text-lg text-red-500">{error}</div>;
  if (!apartment) return <div>No apartment found.</div>;

  return (
    <>
      <SliderDetailPage apartment={apartment} />
      <div className="p-4 max-w-[1200px] mx-auto">
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Left Content */}
          <div className="w-full lg:w-2/3">
            <h1 className="text-2xl sm:text-3xl font-bold mb-3">{apartment.title}</h1>

            <div className="flex flex-col sm:flex-row sm:justify-between gap-2 mb-4">
              <div className="flex items-center gap-1">
                <MapPin size={16} />
                <p className="text-base">{apartment.location}</p>
              </div>

              <div className="flex gap-1 items-center">
                <Star className="text-yellow-500" size={18} />
                <span className="font-semibold">{apartment.avgRating}</span>
                <span>
                  ({apartment.reviews?.length || 0}{" "}
                  {apartment.reviews?.length === 1 ? "review" : "reviews"})
                </span>
              </div>
            </div>

            <DetailsTabs apartment={apartment} user={user ?? undefined} />
          </div>

          {/* Right Calendar Booking */}
          <div className="w-full lg:w-1/3 bg-accent p-5 rounded-lg shadow-md">
            <div className="mb-4 flex justify-between items-center">
              <p className="text-xl sm:text-2xl font-bold">
                ${apartment.pricePerNight}
                <span className="text-base font-normal"> / night</span>
              </p>

              <div className="flex gap-1 items-center">
                <Star className="text-yellow-500" size={18} />
                <span className="font-semibold">{apartment.avgRating}</span>
              </div>
            </div>

            <div className="w-full max-w-md mx-auto">
              <DateRangeCalendar
                apartment={apartment}
                onChange={handleDateChange}
                disabledDates={bookedDates}
              />
            </div>

            <button
              onClick={handleBooking}
              className="mt-4 w-full bg-black text-white py-2 rounded-lg hover:bg-gray-800 transition-all text-sm sm:text-base"
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
