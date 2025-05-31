import { getHostBookings, updateBookingStatus } from "@/api/requests/bookings"
import SkeletonTable from "@/components/admin/TableSkeleton"
import type { RootState } from "@/redux/store"
import { Input } from "@/src/components/ui/input"
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
import { useSelector } from "react-redux"
import { Link } from "react-router"

const HostBookings = () => {
  const [bookings, setBookings] = useState<Booking[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const entrepreneurId = useSelector(
    (state: RootState) => state.auth.user?.id
  );

  const fetchBookings = async () => {
    if (!entrepreneurId) return;
    setLoading(true);
    setError(null);
    try {
      const data = await getHostBookings(entrepreneurId);
      setBookings(data);
    } catch (err: any) {
      setError(err.message || "Failed to load apartments");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, [entrepreneurId]);
  const filteredBookings = bookings.filter(
    (booking) =>
      booking.user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
      booking.apartment.title.toLowerCase().includes(searchTerm.toLowerCase())
  );
  if (error) return <p>Error: {error}</p>;
  return (
    <>
      <h2 className="text-2xl font-bold mb-4">Bookings Management</h2>
      <Input
        placeholder="Search by username or apartment title..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="mb-4"
      />      <div className="overflow-x-auto">
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
                <TableHead className="w-32 px-7">Status</TableHead>
                <TableHead className="w-32">Total Price</TableHead>
                <TableHead className="w-32">Created At</TableHead>
                <TableHead className="w-28">Actions</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {filteredBookings.map((booking) => (
                <TableRow key={booking.id}>
                  <TableCell>{booking.user.username}</TableCell>
                  <TableCell className="font-medium truncate max-w-[160px] whitespace-nowrap overflow-hidden">
                    {booking.apartment.title}
                  </TableCell>

                  <TableCell>{new Date(booking.startDate).toLocaleDateString()}</TableCell>
                  <TableCell>{new Date(booking.endDate).toLocaleDateString()}</TableCell>
                  <TableCell>
                    <select

                      className={`px-2 py-1 rounded-full text-xs font-semibold border
                      ${booking.status === "CONFIRMED" ? "bg-green-500 text-white" : ""}
                      ${booking.status === "PENDING" ? "bg-yellow-500 text-white" : ""}
                      ${booking.status === "CANCELLED" ? "bg-red-500 text-white" : ""}
                                                                                          `}
                      value={booking.status}
                      onChange={async (e) => {
                        const newStatus = e.target.value as "PENDING" | "CONFIRMED" | "CANCELLED";
                        try {
                          await updateBookingStatus(booking.id, { status: newStatus });
                          setBookings((prev) =>
                            prev.map((b) =>
                              b.id === booking.id ? { ...b, status: newStatus } : b
                            )
                          );
                        } catch (err) {
                          console.error("Failed to update status", err);
                          alert("Status update failed");
                        }
                      }}

                    >
                      <option value="PENDING" disabled={booking.status !== "PENDING"} className={`bg-white text-black ${booking.status !== "PENDING" ? "text-gray-400 " : ""}`}>Pending</option>
                      <option value="CONFIRMED" className="bg-white text-black">Confirmed</option>
                      <option value="CANCELLED" className="bg-white text-black">Cancelled</option>
                    </select>
                  </TableCell>
                  <TableCell className="px-5">{booking.totalPrice}</TableCell>
                  <TableCell>{new Date(booking.createdAt).toLocaleDateString()}</TableCell>
                  <TableCell>
                    <div className="mx-5">
                      <Link target="blank" to={`/apartments/${booking.apartmentId}`}>
                        <Eye size={20} />
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

export default HostBookings
