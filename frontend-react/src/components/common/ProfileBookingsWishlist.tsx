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
import { useEffect, useState } from "react";
import type { User } from "@/types/users";


type Props = {
  user: User;
};

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

export default function ProfileBookingsWishlist({ user }: Props) {

  const [loading, setLoading] = useState(true);
// console.log(user)
useEffect(()=>
setLoading(false),[])

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

            {loading ? (
              <p className="text-muted-foreground">Loading bookings...</p>
            ) : user.bookings?.length === 0 ? (
              <p className="text-muted-foreground">No bookings found.</p>
            ) : (
              <>
                <div className="grid grid-cols-6 font-medium text-muted-foreground border-b py-2">
                  <div className="col-span-2">Apartment</div>
                  <div>Dates</div>
                  <div>Total</div>
                  <div>Status</div>
                  <div>Actions</div>
                </div>
                {user.bookings?.map((booking) => (
                  <div
                    key={booking.id}
                    className="grid grid-cols-6 items-center border-b py-3"
                  >
                    <div className="col-span-2">
                      <div className="font-medium">
                        {booking.apartment?.title || "N/A"}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {booking.apartment?.location || "N/A"}
                      </div>
                    </div>
                    <div>
                      {booking.startDate.toLocaleString()} to {booking.endDate.toLocaleString()}
                    </div>
                    <div>${booking.totalPrice}</div>
                    <div>
                      <Badge className={`${getStatusColor(booking.status)} px-3 py-1`}>
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
