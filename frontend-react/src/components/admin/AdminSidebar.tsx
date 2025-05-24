import { Building2, Calendar, Images, LayoutDashboard, LogOut, MessageSquare, Users } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/src/components/ui/avatar"

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/src/components/ui/sidebar"
import { NavLink } from "react-router"

// Menu items.
const items = [
  {
    title: "Dashboard",
    url: "/admin/dashboard",
    icon: LayoutDashboard,
  },
  {
    title: "Users",
    url: "/admin/users",
    icon: Users,
  },
  {
    title: "Apartments",
    url: "/admin/apartments",
    icon: Building2,
  },
  {
    title: "Bookings",
    url: "/admin/bookings",
    icon: Calendar,
  },
  {
    title: "Messages",
    url: "/admin/contacts",
    icon: MessageSquare,
  },
  {
    title: "Sliders",
    url: "/admin/sliders",
    icon: Images,
  },
]

export function AppSidebar() {
  return (
    <Sidebar>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className="py-6">
            <div className="flex items-center gap-2 ">
              <Building2 />
              <h3 className="text-xl font-bold "> LuxStay Admin</h3>
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
        <div className="absolute bottom-0 border-t-1 w-full">
          <div className="flex items-center justify-between gap-3 p-4 ">
            <Avatar className="w-12 h-12">
              <AvatarImage />
              <AvatarFallback>CN</AvatarFallback>
            </Avatar>
            <div className="flex flex-col">
              <h4 className="text-md font-semibold">Admin fidan</h4>
              <span>fidan@gmail.com</span>
            </div>
            
            <div className="hover:bg-accent cursor-pointer p-2 rounded-lg">
              <LogOut  size={20} />
            </div>


          </div>
        </div>
      </SidebarContent>
    </Sidebar>
  )
}
