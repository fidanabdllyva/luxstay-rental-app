import { useSelector } from "react-redux";
import { Navigate, useLocation } from "react-router-dom";
import { type ReactNode } from "react";
import type { RootState } from "@/redux/store";

type Props = {
  children: ReactNode;
  allowedRoles: string[]; 
};

const ProtectedRoute = ({ children, allowedRoles }: Props) => {
  const { user } = useSelector((state: RootState) => state.auth);
  const location = useLocation();
console.log("user:", user); 
  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (!allowedRoles.includes(user.role)) {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default ProtectedRoute;
