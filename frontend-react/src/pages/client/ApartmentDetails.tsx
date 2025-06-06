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
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [checkIn, setCheckIn] = useState<Date | undefined>();
  const [checkOut, setCheckOut] = useState<Date | undefined>();
  const [bookedDates, setBookedDates] = useState<Date[]>([]);

  const user = useSelector((state: RootState) => state.auth.user);

  useEffect(() => {
    if (!id) {
      setError("Invalid apartment ID");
      setLoading(false);
      return;
    }

    setApartment(null);
    setError(null);
    setLoading(true);
    setCheckIn(undefined);
    setCheckOut(undefined);
    setBookedDates([]);

    const fetchApartment = async () => {
      try {
        const data = await getApartmentById(id);
        setApartment(data);
      } catch {
        setError("Failed to fetch apartment details");
      } finally {
        setLoading(false);
      }
    };

    fetchApartment();
  }, [id]);

  useEffect(() => {
    if (!id) return;

    setBookedDates([]);

    const fetchBookedDates = async () => {
      try {
        const bookings = await getBookingsByApartmentId(id);
        const confirmed = bookings.filter((b) => b.status === "CONFIRMED");

        const allDates: Date[] = [];

        confirmed.forEach(({ startDate, endDate }) => {
          let current = new Date(startDate);
          const last = new Date(endDate);

          while (current <= last) {
            allDates.push(new Date(current));
            current.setDate(current.getDate() + 1);
          }
        });

        setBookedDates(allDates);
      } catch (err) {
        console.error("Error fetching booked dates", err);
      }
    };

    fetchBookedDates();
  }, [id]);

  const handleDateChange = (start?: Date, end?: Date) => {
    setCheckIn(start);
    setCheckOut(end);
  };

  const handleBooking = async () => {
    if (!user || !apartment || !checkIn || !checkOut) {
      toast.error("Please fill in all required details.");
      return;
    }

    const nights = differenceInCalendarDays(checkOut, checkIn);
    if (nights <= 0) {
      toast.error("Check-out must be after check-in.");
      return;
    }

    const pricePerNight = apartment.pricePerNight;
    const cleaningFee = 50;
    const serviceFee = pricePerNight * 0.1;
    const totalPrice = nights * pricePerNight + cleaningFee + serviceFee;

    if ((user.balance ?? 0) < totalPrice) {
      toast.error("Insufficient balance. Please add funds.");
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
      toast.error("Booking failed: " + (err.message ?? "Unknown error"));
    }
  };

  if (loading) return <SkeletonDetailPage />;
  if (error) return <div className="text-center py-5 text-lg text-red-500">{error}</div>;
  if (!apartment) return <div className="text-center py-5 text-lg">Apartment not found.</div>;

  return (
    <>
      <SliderDetailPage apartment={apartment} />
      <div className="p-4">
        <div className="flex flex-col lg:flex-row gap-6 px-3">
          {/* Left Content */}
          <div className="w-full lg:w-2/3">
            <h1 className="text-3xl font-bold mb-2">{apartment.title}</h1>

            <div className="flex flex-col sm:flex-row sm:justify-between gap-2 mb-4">
              <div className="flex items-center gap-1">
                <MapPin size={16} />
                <p className="text-base">{apartment.location}</p>
              </div>

              <div className="flex gap-1 items-center">
                <Star className="text-yellow-500" size={20} />
                <span className="font-semibold">{apartment.avgRating}</span>
                <span>
                  ({apartment.reviews?.length ?? 0}{" "}
                  {apartment.reviews?.length === 1 ? "review" : "reviews"})
                </span>
              </div>
            </div>

            <DetailsTabs apartment={apartment} user={user ?? undefined} />
          </div>

          {/* Right Content */}
          <div className="w-full lg:w-1/3 bg-accent p-6 rounded-lg shadow-md mx-auto">
            <div className="mb-5 flex justify-between items-center">
              <p className="text-2xl font-bold">
                ${apartment.pricePerNight}
                <span className="text-base font-normal"> / night</span>
              </p>

              <div className="flex gap-1 items-center">
                <Star className="text-yellow-500" size={20} />
                <span className="font-semibold">{apartment.avgRating}</span>
                <span>
                  ({apartment.reviews?.length ?? 0}{" "}
                  {apartment.reviews?.length === 1 ? "review" : "reviews"})
                </span>
              </div>
            </div>

            <div className="w-full max-w-md mx-auto">
              <DateRangeCalendar
               key={apartment.id}
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
