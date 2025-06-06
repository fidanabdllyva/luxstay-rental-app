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
} from "@/src/components/ui/table";
import { Button } from "@/components/ui/button";
import { useWishlist } from "@/hooks/useWishlist";
import type { User } from "@/types/users";
import SkeletonDetailPage from "../client/SkeletonDetailPage";
import { formatEnumLabel } from "@/utils/helper";
import { Link } from "react-router";
import { SkeletonCard } from "../client/SkeletonCard";

type Props = {
  user: User;
};

export default function ProfileBookingsWishlist({ user }: Props) {
  const { wishlist, loading, toggleApartment } = useWishlist(user.id);

  return (
    <Tabs defaultValue="bookings" className="w-full">
      <TabsList>
        <TabsTrigger value="bookings">My Bookings</TabsTrigger>
        <TabsTrigger value="wishlist">Wishlist</TabsTrigger>
      </TabsList>

      <TabsContent value="bookings">
        <Card className="mt-4">
          <CardContent className="p-6">
            {!user.bookings ? (
              <SkeletonDetailPage />
            ) : user.bookings.length === 0 ? (
              <p className="text-muted-foreground">No bookings found.</p>
            ) : (
              <>
                <div className="overflow-y-scroll h-100">
                  <h3 className="text-2xl font-semibold mb-2">My Bookings</h3>
                  <p className="text-sm text-muted-foreground mb-7">
                    View and manage your apartment bookings
                  </p>
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
                      {user.bookings.map((booking) => (
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
                          <TableCell>${booking.totalPrice}</TableCell>
                          <TableCell>
                            <span
                              className={`px-2 py-1 text-sm font-semibold rounded-full
                              ${booking.status === "CONFIRMED"
                                  ? "bg-green-500 text-white"
                                  : booking.status === "PENDING"
                                    ? "bg-yellow-500 text-white"
                                    : "bg-red-500 text-white"
                                }`}
                            >
                              {formatEnumLabel(booking.status)}
                            </span>
                          </TableCell>
                          <TableCell>
                            <Link to={`/apartments/${booking.apartmentId}`}>
                              <Button variant="outline">View</Button>
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
        <Card className="mt-4 h-120 overflow-y-scroll">
          <CardContent className="p-6">
            {loading ? (
              <div className="flex gap-2 ">
                {Array(4)
                  .fill(null)
                  .map((_, i) => (
                    <SkeletonCard  key={i} />
                  ))}
              </div>
            ) : !wishlist || wishlist.length === 0 ? (
              <p className="text-muted-foreground">Your wishlist is empty.</p>
            ) : (
              <div className="grid  grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                {wishlist.map((apt) => (
                  <div
                    key={apt.id}
                    className="border rounded-lg shadow-sm hover:shadow-md transition-shadow flex overflow-hidden"
                  >
                    <img
                      src={apt.coverImage}
                      alt={apt.title}
                      className="w-30 object-cover"
                      style={{ height: '100%' }}
                    />

                    <div className="flex flex-col justify-between p-4 flex-1">
                      <div>
                        <h4 className="text-lg font-semibold  h-[60px] mb-6">{apt.title}</h4>
                        <p className="text-sm text-muted-foreground">{apt.location}</p>
                        <p className="mt-1 text-yellow-500 font-semibold">
                          ★ {apt.avgRating.toFixed(1)}
                        </p>
                        <p className="mt-1 font-bold">${apt.pricePerNight} <span className="text-muted-foreground font-normal">/ night</span></p>
                      </div>

                      <div className="mt-4 flex space-x-2">
                        <Link to={`/apartments/${apt.id}`}>
                          <Button size="sm" variant="outline">
                            View
                          </Button>
                        </Link>
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => toggleApartment(apt.id)}
                        >
                          Remove
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

            )}
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  );
}
