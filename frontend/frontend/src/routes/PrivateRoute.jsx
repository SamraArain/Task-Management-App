import React, { useContext } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { UserContext } from "../context/UserContext";

const PrivateRoute = ({ allowedRoles }) => {
  const token = localStorage.getItem("token");
  
  const { user, loading } = useContext(UserContext);

  if (loading) return null; // or a loader

  // If no token, redirect to login
  if (!token) {
    return <Navigate to="/login" replace />;
  }

  // If roles are specified, check if user's role matches
  if (allowedRoles && !allowedRoles.includes(user?.role)) {
    // Redirect to default dashboard based on role
    return user?.role === "admin" 
      ? <Navigate to="/admin/dashboard" replace />
      : <Navigate to="/user/dashboard" replace />;
  }

  // If everything checks out, render the nested route
  return <Outlet />;
};

export default PrivateRoute;
