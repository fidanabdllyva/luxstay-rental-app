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
import type { User } from "@/types/users";
import { Avatar, AvatarFallback, AvatarImage } from "@/src/components/ui/avatar";
import { formatEnumLabel } from "@/utils/helper";
import { Button } from "@/src/components/ui/button";
import { Link } from "react-router";
import type { Booking } from "@/types/bookings";

type UsersBookingsProps = {
    users: User[]
    bookings: Booking[]
}

const RecentUsersBookings = ({ users, bookings }: UsersBookingsProps) => {
    const recentUsers = [...users]
        .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
        .slice(0, 5);

    const recentBookings = [...bookings]
        .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
        .slice(0, 5);

    return (
        <Tabs defaultValue="users" className="w-full">
            <TabsList className="bg-neutral-200">
                <TabsTrigger value="users">Recent Users</TabsTrigger>
                <TabsTrigger value="bookings">Recent Bookings</TabsTrigger>
            </TabsList>

            <TabsContent value="users">
                <div className="bg-white p-5 border rounded-lg">
                    <h3 className="text-2xl font-semibold mb-2">Recent Users</h3>
                    <p className="text-sm text-muted-foreground mb-7">New users who have joined recently</p>
                    <Table>
                        <TableCaption>A list of your recent users.</TableCaption>
                        <TableHeader>
                            <TableRow>
                                <TableHead>User</TableHead>
                                <TableHead>Email</TableHead>
                                <TableHead>Role</TableHead>
                                <TableHead>Join Date</TableHead>
                                <TableHead>Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {recentUsers.map((user) => (
                                <TableRow key={user.id}>
                                    <TableCell className="font-medium">
                                        <div className="flex items-center gap-2">
                                            <Avatar className="w-10 h-10">
                                                <AvatarImage src={user.profileImage || ""} />
                                                <AvatarFallback>{user.username[0]?.toUpperCase() ?? "U"}</AvatarFallback>
                                            </Avatar>
                                            <p className="font-semibold">{user.username}</p>
                                        </div>
                                    </TableCell>
                                    <TableCell>{user.email}</TableCell>
                                    <TableCell>
                                        <span className="border rounded-3xl px-2 text-sm font-semibold py-0.5">
                                            {formatEnumLabel(user.role)}
                                        </span>
                                    </TableCell>
                                    <TableCell>{new Date(user.createdAt).toLocaleString()}</TableCell>
                                    <TableCell>
                                        <Link to={"/admin/users"}>
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
                                <TableHead>User</TableHead>
                                <TableHead>Apartment</TableHead>
                                <TableHead>Dates</TableHead>
                                <TableHead>Total Value</TableHead>
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
    );
};


export default RecentUsersBookings
