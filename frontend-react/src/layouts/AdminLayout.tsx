import AdminHeader from '@/components/admin/AdminHeader'
import { AppSidebar } from '@/components/admin/AdminSidebar'
import { SidebarProvider } from '@/src/components/ui/sidebar'
import { Outlet } from 'react-router'

const AdminLayout = () => {
    return (
        <SidebarProvider>
            <div className="flex w-full h-screen">
                <AppSidebar />
                <div className="flex-1 w-full flex flex-col ">
                    <AdminHeader />
                    <main className="flex-1 p-6 overflow-auto">
                        <Outlet />
                    </main>
                </div>
            </div>
        </SidebarProvider>
    )
}

export default AdminLayout