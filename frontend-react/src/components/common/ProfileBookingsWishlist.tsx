import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/src/components/ui/tabs";
import { Card, CardContent } from "@/src/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/src/components/ui/table"
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import type { User } from "@/types/users";
import SkeletonDetailPage from "../client/SkeletonDetailPage";
import { formatEnumLabel } from "@/utils/helper";
import { Link } from "react-router";


type Props = {
  user: User;
};

export default function ProfileBookingsWishlist({ user }: Props) {

  const [loading, setLoading] = useState(true);
  useEffect(() =>
    setLoading(false), [])

  return (
    <Tabs defaultValue="bookings" className="w-full">
      <TabsList>
        <TabsTrigger value="bookings">My Bookings</TabsTrigger>
        <TabsTrigger value="wishlist">Wishlist</TabsTrigger>
      </TabsList>

      <TabsContent value="bookings">
        <Card className="mt-4">
          <CardContent className="p-6">
            {loading ? (
              <SkeletonDetailPage />) : user.bookings?.length === 0 ? (
                <p className="text-muted-foreground">No bookings found.</p>
              ) : (
              <>
                < div >
                  <h3 className="text-2xl font-semibold mb-2">My Bookings</h3>
                  <p className="text-sm text-muted-foreground mb-7">View and manage your apartment bookings</p>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Apartment</TableHead>
                        <TableHead>Dates</TableHead>
                        <TableHead>Total</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {user.bookings?.map((booking) => (
                        <TableRow key={booking.id}>
                          <TableCell className="font-medium">
                            {booking.apartment?.title} <br />
                            <span className="text-sm text-muted-foreground">
                              {booking.apartment?.location}
                            </span>
                          </TableCell>
                          <TableCell>
                            {new Date(booking.startDate).toLocaleDateString()} to{" "}
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
                          <TableCell>
                            <Link to={`/apartments/${booking.apartmentId}`}>
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
              </>
            )}
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="wishlist">
        <Card className="mt-4">
          <CardContent className="p-6 text-muted-foreground">
            Your wishlist is empty.
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  );
}
