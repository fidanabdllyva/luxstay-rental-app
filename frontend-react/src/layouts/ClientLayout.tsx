import Header from "@/components/client/Header"
import { Outlet } from "react-router"

function ClientLayout() {
  return (
    <>
    <Header/>
    <Outlet/>
    </>
  )
}

export default ClientLayout