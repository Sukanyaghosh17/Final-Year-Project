import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const ProtectedRoute = ({ allowedRoles }) => {
  const { token, role } = useAuth();

  if (!token) {
    return <Navigate to="/" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(role)) {
    // Redirect to their appropriate dashboard if they try to access wrong route
    if (role === "citizen")
      return (
        <Navigate
          to={`/dashboard/citizen/${useAuth().user?.username}`}
          replace
        />
      );
    if (role === "police")
      return (
        <Navigate
          to={`/dashboard/police/${useAuth().user?.username}`}
          replace
        />
      );
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
