import Footer from "@/components/client/Footer";
import Header from "@/components/common/Header";
import { Outlet } from "react-router-dom"; 

function ClientLayout() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />

      <main className="flex-1">
        <Outlet />
      </main>

      <Footer />
    </div>
  );
}

export default ClientLayout;
