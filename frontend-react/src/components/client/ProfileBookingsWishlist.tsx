'use client';

import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/src/components/ui/tabs";
import { Card, CardContent } from "@/src/components/ui/card";
import { Badge } from "@/src/components/ui/badge";
import { Button } from "@/components/ui/button";

const bookings = [
  {
    apartment: "Luxury Penthouse with Ocean View",
    location: "Miami, FL",
    dates: "6/15/2023 to 6/20/2023",
    total: "$1750",
    status: "Confirmed",
  },
  {
    apartment: "Cozy Mountain Cabin",
    location: "Aspen, CO",
    dates: "7/10/2023 to 7/15/2023",
    total: "$975",
    status: "Pending",
  },
  {
    apartment: "Historic Brownstone",
    location: "Boston, MA",
    dates: "8/5/2023 to 8/10/2023",
    total: "$1550",
    status: "Cancelled",
  },
];

const getStatusColor = (status: string) => {
  switch (status) {
    case "Confirmed":
      return "bg-green-100 text-green-700";
    case "Pending":
      return "bg-yellow-100 text-yellow-700";
    case "Cancelled":
      return "bg-red-100 text-red-700";
    default:
      return "bg-gray-100 text-gray-700";
  }
};

export default function ProfileBookingsWishlist() {
  return (
    <Tabs defaultValue="bookings" className="w-full">
      <TabsList>
        <TabsTrigger value="bookings">My Bookings</TabsTrigger>
        <TabsTrigger value="wishlist">Wishlist</TabsTrigger>
      </TabsList>

      <TabsContent value="bookings">
        <Card className="mt-4">
          <CardContent className="p-6">
            <h2 className="text-2xl font-semibold mb-4">My Bookings</h2>
            <div className="grid grid-cols-6 font-medium text-muted-foreground border-b py-2">
              <div className="col-span-2">Apartment</div>
              <div>Dates</div>
              <div>Total</div>
              <div>Status</div>
              <div>Actions</div>
            </div>
            {bookings.map((booking, index) => (
              <div
                key={index}
                className="grid grid-cols-6 items-center border-b py-3"
              >
                <div className="col-span-2">
                  <div className="font-medium">{booking.apartment}</div>
                  <div className="text-sm text-muted-foreground">
                    {booking.location}
                  </div>
                </div>
                <div>{booking.dates}</div>
                <div>{booking.total}</div>
                <div>
                  <Badge
                    className={`${getStatusColor(booking.status)} px-3 py-1`}
                  >
                    {booking.status}
                  </Badge>
                </div>
                <div>
                  <Button variant="outline" size="sm">
                    View
                  </Button>
                </div>
              </div>
            ))}
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
