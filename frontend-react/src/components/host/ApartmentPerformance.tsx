import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/src/components/ui/table"
import type { Apartment } from "@/types/apartments"
import type { Booking } from "@/types/bookings";
import { Star } from "lucide-react";

type ApartmentsProps={
    apartments:Apartment[]
}

const calculateRevenue = (bookings?: Booking[]) =>
  bookings
    ?.filter((b) => b.status === "CONFIRMED")
    .reduce((sum, b) => sum + b.totalPrice, 0) ?? 0;


const ApartmentPerformance = ({apartments}:ApartmentsProps) => {
  return (
    <div className="border rounded-2xl bg-white p-7">
        <h3 className="text-2xl font-semibold mb-2">Apartment Performance</h3>
        <p className="text-sm text-muted-foreground mb-6">Performance metrics for your apartments</p>
    <Table>
  <TableHeader>
    <TableRow>
      <TableHead >Apartment</TableHead>
      <TableHead>Bookings</TableHead>
      <TableHead>Revenue</TableHead>
      <TableHead >Rating</TableHead>
    </TableRow>
  </TableHeader>
  <TableBody>
    {apartments.map((apartment)=>(

    <TableRow key={apartment.id}> 
      <TableCell className="text-md">{apartment.title}</TableCell>
      <TableCell className="px-7">{apartment.bookings?.length}</TableCell>
      <TableCell>${calculateRevenue(apartment.bookings).toFixed(2)}</TableCell>
      <TableCell className="flex items-center gap-1"><Star className="text-yellow-500" size={15}/>{apartment.avgRating}</TableCell>
    </TableRow>
    ))}
  </TableBody>
</Table>

    </div>
  )
}

export default ApartmentPerformance