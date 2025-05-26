import { useEffect, useState } from "react"
import { Avatar, AvatarFallback } from "@/src/components/ui/avatar"
import { Building, Calendar, DollarSign, Users } from "lucide-react"
import { getApartments } from "@/api/requests/apartments"
import { getUsers } from "@/api/requests/users"
import { getBookings } from "@/api/requests/bookings"
import RevenueChart from "@/components/admin/RevenueChart"
import BookingsLineChart from "@/components/admin/BookingsLineChart"

const AdminDashboard = () => {
  const [totalApartments, setTotalApartments] = useState(0)
  const [totalUsers, setTotalUsers] = useState(0)
  const [totalBookings, setTotalBookings] = useState(0)
  const [monthlyRevenue, setMonthlyRevenue] = useState(0)

  const [monthlyRevenueData, setMonthlyRevenueData] = useState<number[]>([])
  const [monthlyBookings, setMonthlyBookings] = useState<number[]>([])

  useEffect(() => {
    const fetchData = async () => {
      try {
        const apartments = await getApartments()
        const users = await getUsers()
        const bookings = await getBookings()

        setTotalApartments(apartments.length)
        setTotalUsers(users.length)
        setTotalBookings(bookings.length)

        const currentYear = new Date().getFullYear()
        const revenueByMonth = Array(12).fill(0)
        const bookingsPerMonth = Array(12).fill(0)

        bookings.forEach((booking) => {
          const date = new Date(booking.createdAt)
          if (date.getFullYear() === currentYear) {
            const month = date.getMonth()
            revenueByMonth[month] += booking.totalPrice
            bookingsPerMonth[month] += 1
          }
        })

        setMonthlyRevenueData(revenueByMonth)
        setMonthlyBookings(bookingsPerMonth)

        const currentMonth = new Date().getMonth()
        setMonthlyRevenue(revenueByMonth[currentMonth])
      } catch (error) {
        console.error("Failed to fetch data", error)
      }
    }

    fetchData()
  }, [])

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
  ]

  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-bold">Admin Dashboard</h2>

      {/* cards */}
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

      <div className="grid grid-cols-1 sm:grid-cols-1 lg:grid-cols-2 gap-6">
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
    </div>
  )
}

export default AdminDashboard
