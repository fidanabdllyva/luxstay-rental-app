import {
  Building2,
  Calendar,
  Images,
  LayoutDashboard,
  LogOut,
  MessageSquare,
  Users,
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/src/components/ui/avatar";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/src/components/ui/sidebar";
import { NavLink } from "react-router-dom";
import { useSelector } from "react-redux";
import type { RootState } from "@/redux/store";
import { useDispatch } from "react-redux";
import { logout } from "@/redux/features/auth/authSlice";

const menuItems = {
  ADMIN: [
    { title: "Dashboard", url: "/admin", icon: LayoutDashboard },
    { title: "Users", url: "/admin/users", icon: Users },
    { title: "Apartments", url: "/admin/apartments", icon: Building2 },
    { title: "Bookings", url: "/admin/bookings", icon: Calendar },
    { title: "Messages", url: "/admin/contacts", icon: MessageSquare },
    { title: "Sliders", url: "/admin/sliders", icon: Images },
  ],
  HOST: [
    { title: "Dashboard", url: "/host", icon: LayoutDashboard },
    { title: "My Apartments", url: "/host/apartments", icon: Building2 },
    { title: "Bookings", url: "/host/bookings", icon: Calendar },
  ],
};

export function AppSidebar() {
   const dispatch = useDispatch()
  const { user } = useSelector((state: RootState) => state.auth);

  if (!user) return null;

  const items = menuItems[user.role as keyof typeof menuItems] || [];

  return (
    <Sidebar>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className="py-6">
            <div className="flex items-center gap-2">
              <Building2 />
              <h3 className="text-xl font-bold">
                {user.role === "HOST" ? "Host Dashboard" : "LuxStay Admin"}
              </h3>
            </div>
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <NavLink to={item.url}>
                      <item.icon />
                      <span>{item.title}</span>
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Footer */}
        <div className="absolute bottom-0 border-t w-full">
          <div className="flex items-center justify-between gap-3 p-4">
            <Avatar className="w-12 h-12">
              <AvatarImage src={user.profileImage || ""} />
              <AvatarFallback>{user.username[0]?.toUpperCase() ?? "U"}</AvatarFallback>
            </Avatar>
            <div className="flex flex-col">
              <h4 className="text-md font-semibold">{user.username}</h4>
              <span>{user.email}</span>
            </div>

            <button onClick={()=>dispatch(logout())} className="hover:bg-accent cursor-pointer p-2 rounded-lg">
              <LogOut size={20} />
            </button>
          </div>
        </div>
      </SidebarContent>
    </Sidebar>
  );
}
