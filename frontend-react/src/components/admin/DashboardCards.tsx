import type { ReactNode } from "react";
import { Avatar, AvatarFallback } from "@/src/components/ui/avatar";

interface DashboardCardProps {
  icon: ReactNode;
  title: string;
  amount: number | string;
}

const DashboardCard = ({ icon, title, amount }: DashboardCardProps) => {
  return (
    <div className="border rounded-2xl shadow-sm p-6 flex flex-col gap-4 bg-white">
      <Avatar className="bg-gray-100 w-10 h-10">
        <AvatarFallback>{icon}</AvatarFallback>
      </Avatar>
      <div>
        <p className="text-sm text-gray-500">{title}</p>
        <span className="text-xl font-bold">{amount}</span>
      </div>
    </div>
  );
};

export default DashboardCard;
