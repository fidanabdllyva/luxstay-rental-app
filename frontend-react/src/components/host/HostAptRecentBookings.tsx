import type { Apartment } from "@/types/apartments"
import type { Booking } from "@/types/bookings"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/src/components/ui/tabs";
import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/src/components/ui/table"
import { formatEnumLabel } from "@/utils/helper";
import { Star } from "lucide-react";
import { Link } from "react-router";
import { Button } from "../ui/button";

type HostApartmentsBookingsProps = {
    apartments: Apartment[],
    bookings: Booking[]
}
const HostAptRecentBookings = ({ apartments, bookings }: HostApartmentsBookingsProps) => {


    const recentBookings = [...bookings]
        .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
        .slice(0, 5);

    return (
        <Tabs defaultValue="apartments" className="w-full">
            <TabsList className="bg-neutral-200">
                <TabsTrigger value="apartments">My Apartments</TabsTrigger>
                <TabsTrigger value="bookings">Recent Bookings</TabsTrigger>
            </TabsList>

            <TabsContent value="apartments">
                <div className="bg-white p-5 border rounded-lg">
                    <h3 className="text-2xl font-semibold mb-2">Recent Users</h3>
                    <p className="text-sm text-muted-foreground mb-7">New users who have joined recently</p>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Apartment</TableHead>
                                <TableHead>Location</TableHead>
                                <TableHead>Price</TableHead>
                                <TableHead>Rating</TableHead>
                                <TableHead>Type</TableHead>
                                <TableHead>Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {apartments.map((apartment) => (
                                <TableRow key={apartment.id}>
                                    <TableCell className="font-medium">
                                        <div className="flex items-center gap-2">
                                            <img className="w-25 h-13 object-cover border rounded" src={apartment.coverImage} alt={apartment.title} />
                                            <p className="font-semibold">{apartment.title}</p>
                                        </div>
                                    </TableCell>
                                    <TableCell>{apartment.location}</TableCell>
                                    <TableCell>{apartment.pricePerNight} / night</TableCell>
                                    <TableCell>
                                        <div className="flex items-center gap-1">
                                            <Star size={15} className="text-yellow-500 " />
                                            {apartment.avgRating}
                                            <span className="text-muted-foreground">({apartment.reviews?.length || "0"})</span>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <span className="border rounded-3xl px-2 text-sm font-semibold py-0.5">
                                            {formatEnumLabel(apartment.type)}
                                        </span>
                                    </TableCell>
                                    <TableCell>
                                        <Link target="blank" to={`/apartments/${apartment.id}`}>
                                            <Button className="cursor-pointer" variant={"outline"}>
                                                View
                                            </Button>
                                        </Link>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>
            </TabsContent>

            <TabsContent value="bookings">
                <div className="bg-white p-5 border rounded-lg">
                    <h3 className="text-2xl font-semibold mb-2">Recent Bookings</h3>
                    <p className="text-sm text-muted-foreground mb-7">Latest bookings across the platform</p>
                    <Table>
                        <TableCaption>A list of your recent bookings.</TableCaption>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Guest</TableHead>
                                <TableHead>Apartment</TableHead>
                                <TableHead>Dates</TableHead>
                                <TableHead>Total</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead>Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {recentBookings.map((booking) => (
                                <TableRow key={booking.id}>
                                    <TableCell className="font-medium">{booking.user.username}</TableCell>
                                    <TableCell>{booking.apartment.title}</TableCell>
                                    <TableCell>
                                        {new Date(booking.startDate).toLocaleDateString()} <br /> 
                                        to{" "}
                                        <br />                                       
                                        {new Date(booking.endDate).toLocaleDateString()}
                                    </TableCell>
                                    <TableCell>{booking.totalPrice}</TableCell>
                                    <TableCell>
                                        <span
                                            className={`
                                           px-2 py-1 text-sm font-semibold rounded-full
                                           ${booking.status === "CONFIRMED" ? "bg-green-500 text-white" : ""}
                                           ${booking.status === "PENDING" ? "bg-yellow-500 text-white" : ""}
                                           ${booking.status === "CANCELLED" ? "bg-red-500 text-white" : ""}
                                                                                                                 `}
                                        >
                                            {formatEnumLabel(booking.status)}
                                        </span>
                                    </TableCell>
                                    <TableCell className="mx-auto">
                                        <Link to={"/admin/bookings"}>
                                            <Button className="cursor-pointer" variant={"outline"}>
                                                View
                                            </Button>
                                        </Link>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>
            </TabsContent>
        </Tabs>
    )
}

export default HostAptRecentBookings