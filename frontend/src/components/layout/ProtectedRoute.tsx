import React, { useEffect, useState } from "react";
import { setUser } from "@/utils/auth";
import { useAuthStore } from "@/store/authStore";
import { useNavigate } from "react-router-dom";

interface ProtectedRouteProps {
  allowedRoles: string[];
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ allowedRoles, children }) => {
  const [loading, setLoading] = useState(true);
  // Adjust the type to include 'role' or cast as needed
  const user = useAuthStore((state) => state.user) as
   { user_id: string;
     email: string;
      role: string } | null;

  const navigate = useNavigate();

  useEffect(() => {
    const initializeUser = async () => {
      try {
        await setUser();
      } catch (error) {
        // ignore
      } finally {
        setLoading(false);
      }
    };
    initializeUser();
  }, []);

  useEffect(() => {
    if (loading) {
      console.log("ProtectedRoute: loading user data...");
      return;
    }

    if (!user) {
      console.log("ProtectedRoute: user not found, redirecting to login");
      navigate("/dashboard");
      return;
    }

    if (!user.role || !allowedRoles.includes(user.role)) {
      console.log(`ProtectedRoute: user role "${user.role}" not allowed, redirecting to login`);
      navigate("/dashboard");
    }
  }, [loading, user, allowedRoles, navigate]);

  if (loading) {
    return <div className="flex justify-center items-center h-screen">Loading...</div>;
  }
  if (!user || !user.role || !allowedRoles.includes(user.role)) {
    return null;
  }

  return <>{children}</>;
};

export default ProtectedRoute;