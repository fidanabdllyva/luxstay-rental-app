//client-admin-host layouts 
import ClientLayout from "@/layouts/ClientLayout";
import AdminLayout from "@/layouts/AdminLayout";
import HostLayout from "@/layouts/HostLayout";

//client pages
import Home from "@/pages/client/Home";
import About from "@/pages/client/About";
import ApartmentDetails from "@/pages/client/ApartmentDetails";
import Apartments from "@/pages/client/Apartments";
import Contact from "@/pages/client/Contact";
import ClientProfile from "@/pages/client/ClientProfile";

//admin pages 
import AdminDashboard from "@/pages/admin/AdminDashboard";
import UsersManagement from "@/pages/admin/UsersManagement";
import SlidersManagement from "@/pages/admin/SlidersManagement";
import ContactsManagement from "@/pages/admin/ContactsManagement";
import ApartmentsManagement from "@/pages/admin/ApartmentsManagement";
import BookingsManagement from "@/pages/admin/BookingsManagement";
import AdminHostRequest from "@/pages/admin/AdminHostRequest";
import AdminProfile from "@/pages/admin/AdminProfile";

//host pages
import HostProfile from "@/pages/host/HostProfile";
import HostBookings from "@/pages/host/HostBookings";
import HostDashboard from "@/pages/host/HostDashboard";
import HostApartments from "@/pages/host/HostApartments";

//auth pages
import Login from "@/pages/auth/Login";
import Register from "@/pages/auth/Register";

//not found page
import NotFound from "@/pages/common/NotFound";


const ROUTER = [
    //client routes
    {
        path: "/",
        element: <ClientLayout />,
        children: [
            {
                index: true,
                element: <Home />
            },
            {
                path: "apartments",
                grandchildren: [
                    {
                        index: true,
                        element: <Apartments />
                    },
                    {
                        path: "/:id",
                        element: <ApartmentDetails />
                    }
                ]
            },
            {
                path: "contact",
                element: <Contact />
            },
            {
                path: "about",
                element: <About />
            },
            {
                path: "profile",
                //protected sey
                element: <ClientProfile />
            },
            {
                path: "*",
                element: <NotFound />,
            },
            {
                path: "login",
                element: <Login />
            },
            {
                path: "register",
                element: <Register />
            }
        ]
    },

    //admin routes
    {
        path: "/admin",
        element: <AdminLayout />,
        children: [
            {
                index: true,
                //protected sey for admin
                element: <AdminDashboard />
            },
            {
                path: "users",
                element: <UsersManagement />
            },
            {
                path: "sliders",
                element: <SlidersManagement />
            },
            {
                path: "contacts",
                element: <ContactsManagement />
            },
            {
                path: "apartments",
                element: <ApartmentsManagement />
            },
            {
                path: "bookings",
                element: <BookingsManagement />
            },
            {
                path: "requests",
                element: <AdminHostRequest />
            },
            {
                path: "profile",
                element: <AdminProfile />
            },
            {
                path: "*",
                element: <NotFound />,
            }

        ]
    },

    //host routes
    {
        path: "host",
        element: <HostLayout />,
        children: [
            {
                //protected sey for host
                index: true,
                element: <HostDashboard />
            },
            {
                path: "apartments",
                element: <HostApartments />
            },
            {
                path: "bookings",
                element: <HostBookings />
            },
            {
                path: "profile",
                element: <HostProfile />
            },
            {
                path: "*",
                element: <NotFound />,
            }
        ]
    }
]

export default ROUTER