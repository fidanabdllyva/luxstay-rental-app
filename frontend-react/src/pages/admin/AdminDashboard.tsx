import { useEffect, useState } from "react";
import { Building, Calendar, DollarSign, Users } from "lucide-react";
import { getApartments } from "@/api/requests/apartments";
import { getUsers, updateUser } from "@/api/requests/users";
import { getBookings } from "@/api/requests/bookings";
import RevenueChart from "@/components/admin/RevenueChart";
import BookingsLineChart from "@/components/admin/BookingsLineChart";
import AptTypesChart from "@/components/admin/AptTypesChart";
import type { User } from "@/types/users";
import { Button } from "@/components/ui/button";
import DashboardCard from "@/components/admin/DashboardCards";
import { Avatar, AvatarFallback, AvatarImage } from "@/src/components/ui/avatar";
import RecentUsersBookings from "@/components/admin/RecentUsersBookings";
import type { Booking } from "@/types/bookings";

const AdminDashboard = () => {
  const [totalApartments, setTotalApartments] = useState(0);
  const [totalUsers, setTotalUsers] = useState(0);
  const [totalBookings, setTotalBookings] = useState(0);
  const [monthlyRevenue, setMonthlyRevenue] = useState(0);
  const [users, setUsers] = useState<User[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loadingIds, setLoadingIds] = useState<string[]>([]);
  const [monthlyRevenueData, setMonthlyRevenueData] = useState<number[]>([]);
  const [monthlyBookings, setMonthlyBookings] = useState<number[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [apartments, _users, bookings] = await Promise.all([
          getApartments(),
          getUsers(),
          getBookings(),
        ]);

        setTotalApartments(apartments.length);
        setTotalUsers(_users.length);
        setTotalBookings(bookings.length);
        setUsers(_users);
        setBookings(bookings)

        const currentYear = new Date().getFullYear();
        const revenueByMonth = Array(12).fill(0);
        const bookingsPerMonth = Array(12).fill(0);

        bookings.forEach((booking) => {
          const date = new Date(booking.createdAt);
          if (date.getFullYear() === currentYear) {
            const month = date.getMonth();
            revenueByMonth[month] += booking.totalPrice;
            bookingsPerMonth[month] += 1;
          }
        });

        setMonthlyRevenueData(revenueByMonth);
        setMonthlyBookings(bookingsPerMonth);
        setMonthlyRevenue(revenueByMonth[new Date().getMonth()]);
      } catch (error) {
        console.error("Failed to fetch dashboard data", error);
      }
    };

    fetchData();
  }, []);

  const handleHostRequest = async (userId: string, approve: boolean) => {
    try {
      setLoadingIds((prev) => [...prev, userId]);

      const updateData = approve
        ? { role: "HOST" as const, hostRequest: false }
        : { hostRequest: false };

      await updateUser(userId, updateData);
      const updatedUsers = await getUsers();
      setUsers(updatedUsers);
    } catch (error) {
      console.error("Host request update failed", error);
      alert("Action failed, try again.");
    } finally {
      setLoadingIds((prev) => prev.filter((id) => id !== userId));
    }
  };

  const hostRequests = users.filter((user) => user.hostRequest);

  const cards = [
    {
      icon: <Users size={20} />,
      title: "Total Users",
      amount: totalUsers,
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
      <h2 className="text-3xl font-bold">Admin Dashboard</h2>

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

      {/* Apartment Types & Host Requests */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white border rounded-2xl p-5">
          <h3 className="font-bold text-3xl text-center">Apartment Types</h3>
          <p className="text-muted-foreground text-center my-2">
            Distribution of apartment types
          </p>
          <AptTypesChart />
        </div>

        <div className="bg-white border rounded-2xl p-5 space-y-4">
          <h3 className="font-bold text-2xl">Host Requests</h3>
          <p className="text-muted-foreground mb-4">
            Users requesting to become hosts
          </p>
          {hostRequests.length === 0 ? (
            <p className="text-sm text-muted-foreground">No pending requests</p>
          ) : (
            hostRequests.map((user) => (
              <div
                key={user.id}
                className="flex justify-between items-center border p-3 rounded-lg"
              >
                <div className="flex items-center gap-2">
                  <Avatar className="w-10 h-10">
                    <AvatarImage src={user.profileImage || ""} />
                    <AvatarFallback>{user.username[0]?.toUpperCase() ?? "U"}</AvatarFallback>
                  </Avatar>
                  <div>
                  <p className="font-semibold">{user.username}</p>
                  <p className="text-sm text-gray-500">{user.email}</p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button
                    className="cursor-pointer"
                    variant="outline"
                    disabled={loadingIds.includes(user.id)}
                    onClick={() => handleHostRequest(user.id, false)}
                  >
                    {loadingIds.includes(user.id) ? "Processing..." : "Reject"}
                  </Button>
                  <Button
                    className="bg-black text-white hover:bg-neutral-800 cursor-pointer"
                    disabled={loadingIds.includes(user.id)}
                    onClick={() => handleHostRequest(user.id, true)}
                  >
                    {loadingIds.includes(user.id) ? "Processing..." : "Approve"}
                  </Button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      <div>
        <RecentUsersBookings users={users} bookings={bookings}/>
      </div>
    </div>
  );
};

export default AdminDashboard;
