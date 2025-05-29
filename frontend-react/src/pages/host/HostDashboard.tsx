import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { getHostApartments } from "@/api/requests/apartments";
import { getHostBookings } from "@/api/requests/bookings";
import type { RootState } from "@/redux/store";
import type { Apartment } from "@/types/apartments";
import type { Booking } from "@/types/bookings";
import DashboardCard from "@/components/admin/DashboardCards";
import { Building, Calendar, DollarSign, MessageCircle } from "lucide-react";
import RevenueChart from "@/components/admin/RevenueChart";
import BookingsLineChart from "@/components/admin/BookingsLineChart";
import ApartmentPerformance from "@/components/host/ApartmentPerformance";
import HostAptRecentBookings from "@/components/host/HostAptRecentBookings";

const HostDashboard = () => {
  const entrepreneurId = useSelector((state: RootState) => state.auth.user?.id);
  const [apartments, setApartments] = useState<Apartment[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);

  const [totalApartments, setTotalApartments] = useState(0);
  const [totalBookings, setTotalBookings] = useState(0);
  const [monthlyRevenue, setMonthlyRevenue] = useState(0);
  const [totalReviews, setTotalReviews] = useState(0)
  const [monthlyRevenueData, setMonthlyRevenueData] = useState<number[]>([]);
  const [monthlyBookings, setMonthlyBookings] = useState<number[]>([]);

  useEffect(() => {
    const fetchHostData = async () => {
      if (!entrepreneurId) return;

      try {
        const apartmentsData = await getHostApartments(entrepreneurId);
        setApartments(apartmentsData);
        setTotalApartments(apartmentsData.length);

        const allReviews = apartmentsData.flatMap((apt) => apt.reviews || []);
        setTotalReviews(allReviews.length);

        const bookingsData = await getHostBookings(entrepreneurId);
        const confirmedBookings = bookingsData.filter(b => b.status === "CONFIRMED");

        setBookings(confirmedBookings);
        setTotalBookings(confirmedBookings.length);

        const currentYear = new Date().getFullYear();
        const revenueByMonth = Array(12).fill(0);
        const bookingsByMonth = Array(12).fill(0);

        confirmedBookings.forEach((booking) => {
          const date = new Date(booking.createdAt);
          if (date.getFullYear() === currentYear) {
            const month = date.getMonth();
            revenueByMonth[month] += booking.totalPrice;
            bookingsByMonth[month] += 1;
          }
        });

        setMonthlyRevenueData(revenueByMonth);
        setMonthlyBookings(bookingsByMonth);
        setMonthlyRevenue(revenueByMonth[new Date().getMonth()]);
      } catch (err) {
        console.error("Error fetching host dashboard data", err);
      } finally {

      }
    };

    fetchHostData();
  }, [entrepreneurId]);



  const cards = [
    {
      icon: <MessageCircle size={20} />,
      title: "Total Reviews",
      amount: totalReviews,
    },
    {
      icon: <Building size={20} />,
      title: "Total Apartments",
      amount: totalApartments,
    },
    {
      icon: <Calendar size={20} />,
      title: "Active Bookings",
      amount: totalBookings,
    },
    {
      icon: <DollarSign size={20} />,
      title: "Monthly Revenue",
      amount: `$${monthlyRevenue.toLocaleString()}`,
    },
  ];


  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-bold">Host Dashboard</h2>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">

        {cards.map((card, index) => (
          <DashboardCard
            key={index}
            icon={card.icon}
            title={card.title}
            amount={card.amount}
          />
        ))}

      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white border rounded-2xl p-3">
          <h3 className="font-bold text-xl">Revenue Overview</h3>
          <p className="text-muted-foreground">Monthly revenue for the current year</p>
          <RevenueChart monthlyRevenueData={monthlyRevenueData} />
        </div>

        <div className="bg-white border rounded-2xl p-3">
          <h3 className="font-bold text-xl">Bookings Overview</h3>
          <p className="text-muted-foreground">Monthly bookings for the current year</p>
          <BookingsLineChart values={monthlyBookings} />
        </div>
      </div>

      {/* Apartment Performance */}
      <div>
        <ApartmentPerformance apartments={apartments}/>
      </div>

      {/* My apartments and Recent Bookings */}
      <div>
        <HostAptRecentBookings apartments={apartments} bookings={bookings}/>
      </div>
    </div>
  );
};

export default HostDashboard;
