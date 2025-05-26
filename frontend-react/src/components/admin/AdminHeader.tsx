import { SidebarTrigger } from "@/src/components/ui/sidebar";
import { ModeToggle } from "../common/mode-toggle";
import { House } from "lucide-react";
import { Link } from "react-router-dom";

const HeaderDashboard = () => {
    return (

       <header className="flex justify-between w-full items-center z-100 p-4 border border-bottom-1 ">
            <SidebarTrigger />

            <div className="flex-1 flex bg-wh justify-end items-center gap-4">
                <ModeToggle />
                <Link to="/" className="flex border rounded dark:bg-black dark:text-white bg-white p-1 px-1.5 items-center gap-2 hover:underline">
                    <House size={17} />
                    View Site
                </Link>
            </div>
        </header>
    );
};

export default HeaderDashboard;


