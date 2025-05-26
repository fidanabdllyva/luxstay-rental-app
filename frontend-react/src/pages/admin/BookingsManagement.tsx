import { getBookings } from "@/api/requests/bookings"
import SkeletonTable from "@/components/admin/TableSkeleton"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/src/components/ui/table"
import type { Booking } from "@/types/bookings"
import { Eye } from "lucide-react"
import { useEffect, useState } from "react"
import { Link } from "react-router"

const BookingsManagement = () => {
  const [bookings, setBookings] = useState<Booking[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const bookingsData = await getBookings()
        setBookings(bookingsData)
        console.log(bookingsData)
      } catch (error) {
        console.error("Failed to fetch bookings", error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  return (
    <>
      <h2 className="text-2xl font-bold mb-4">Bookings Management</h2>

      <div className="overflow-x-auto">
        {loading ? (

          <SkeletonTable
            rowsCount={10}
            columns={[
              { label: "Username", width: "w-40" },
              { label: "Apartment Title", width: "w-64" },
              { label: "Start Date", width: "w-32" },
              { label: "End Date", width: "w-32" },
              { label: "Status", width: "w-32" },
              { label: "Total Price", width: "w-32" },
              { label: "Created At", width: "w-32" },
              { label: "Actions", width: "w-28" },
            ]}
          />
        ) : (
          <Table className="min-w-[1100px] table-fixed">
            <TableHeader>
              <TableRow>
                <TableHead className="w-32">Username</TableHead>
                <TableHead className="w-64">Apartment Title</TableHead>
                <TableHead className="w-32">Start Date</TableHead>
                <TableHead className="w-32">End Date</TableHead>
                <TableHead className="w-32">Status</TableHead>
                <TableHead className="w-32">Total Price</TableHead>
                <TableHead className="w-32">Created At</TableHead>
                <TableHead className="w-28">Actions</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {bookings.map((booking) => (
                <TableRow key={booking.id}>
                  <TableCell>{booking.user.username}</TableCell>
                  <TableCell className="font-medium truncate max-w-[160px] whitespace-nowrap overflow-hidden">
                    {booking.apartment.title}
                  </TableCell>

                  <TableCell>{new Date(booking.startDate).toLocaleDateString()}</TableCell>
                  <TableCell>{new Date(booking.endDate).toLocaleDateString()}</TableCell>
                  <TableCell><span
                    className={`px-2 py-1 rounded-full text-xs font-semibold
      ${booking.status === "PENDING" ? "bg-yellow-100 text-yellow-800" : ""}
      ${booking.status === "CONFIRMED" ? "bg-green-100 text-green-800" : ""}
      ${booking.status === "CANCELLED" ? "bg-red-100 text-red-800" : ""}
    `}
                  >
                    {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                  </span></TableCell>
                  <TableCell>{booking.totalPrice}</TableCell>
                  <TableCell>{new Date(booking.createdAt).toLocaleDateString()}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">



                      <Link target="blank" to={`/apartments/${booking.apartmentId}`}>
                        <Eye />
                      </Link>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </div>
    </>
  )
}

export default BookingsManagement
