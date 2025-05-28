import { useEffect, useState } from "react";
import { Avatar, AvatarFallback } from "@/src/components/ui/avatar";
import { Building, Calendar, DollarSign, Users } from "lucide-react";
import { getApartments } from "@/api/requests/apartments";
import { getUsers, updateUser } from "@/api/requests/users";
import { getBookings } from "@/api/requests/bookings";
import RevenueChart from "@/components/admin/RevenueChart";
import BookingsLineChart from "@/components/admin/BookingsLineChart";
import AptTypesChart from "@/components/admin/AptTypesChart";
import type { User } from "@/types/users";
import { Button } from "@/components/ui/button";

const AdminDashboard = () => {
  const [totalApartments, setTotalApartments] = useState(0);
  const [totalUsers, setTotalUsers] = useState(0);
  const [totalBookings, setTotalBookings] = useState(0);
  const [monthlyRevenue, setMonthlyRevenue] = useState(0);
  const [users, setUsers] = useState<User[]>([]);
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
          <div
            key={index}
            className="border rounded-2xl shadow-sm p-6 flex flex-col gap-4 bg-white"
          >
            <Avatar className="bg-gray-100 w-10 h-10">
              <AvatarFallback>{card.icon}</AvatarFallback>
            </Avatar>
            <div>
              <p className="text-sm text-gray-500">{card.title}</p>
              <span className="text-xl font-bold">{card.amount}</span>
            </div>
          </div>
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
                <div>
                  <p className="font-semibold">{user.username}</p>
                  <p className="text-sm text-gray-500">{user.email}</p>
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    disabled={loadingIds.includes(user.id)}
                    onClick={() => handleHostRequest(user.id, false)}
                  >
                    {loadingIds.includes(user.id) ? "Processing..." : "Reject"}
                  </Button>
                  <Button
                    className="bg-green-600 text-white hover:bg-green-700"
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
    </div>
  );
};

export default AdminDashboard;
