import { useEffect, useState } from "react"
import { Avatar, AvatarFallback } from "@/src/components/ui/avatar"
import { Building, Calendar, DollarSign, Users } from "lucide-react"
import { getApartments } from "@/api/requests/apartments"

const AdminDashboard = () => {
  const [totalApartments, setTotalApartments] = useState(0)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const apartments = await getApartments()
        setTotalApartments(apartments.length)
      } catch (error) {
        console.error("Failed to fetch apartments", error)
      }
    }

    fetchData()
  }, [])

  const cards = [
    {
      icon: <Users size={20} />,
      title: "Total Users",
      amount: 0, 
    },
    {
      icon: <Building size={20} />,
      title: "Total Apartments",
      amount: totalApartments,
    },
    {
      icon: <Calendar size={20} />,
      title: "Active Bookings",
      amount: 0, 
    },
    {
      icon: <DollarSign size={20} />,
      title: "Monthly Revenue",
      amount: "$0", 
    },
  ]

  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-bold">Admin Dashboard</h2>

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
    </div>
  )
}

export default AdminDashboard
