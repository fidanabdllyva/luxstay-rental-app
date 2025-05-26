import HeaderDashboard from '@/components/admin/AdminHeader'
import { AppSidebar } from '@/components/admin/AdminSidebar'
import { SidebarProvider } from '@/src/components/ui/sidebar'
import { Outlet } from 'react-router'

const AdminLayout = () => {
  return (
    <SidebarProvider>
      <div className="flex w-full h-screen overflow-hidden">
        <AppSidebar />
        <div className="flex-1 flex flex-col overflow-hidden">
          <div className="sticky top-0 z-50">
            <HeaderDashboard />
          </div>
          <main className="flex-1 p-6 overflow-auto bg-muted">
            <Outlet />
          </main>
        </div>
      </div>
    </SidebarProvider>
  )
}


export default AdminLayout