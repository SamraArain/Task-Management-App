import React from "react";
import { Navigate, Outlet } from "react-router-dom";

const PrivateRoute = () => {
  const token = localStorage.getItem("token");

  // If no token, redirect to login
  if (!token) {
    return <Navigate to="/login" replace />;
  }

  // If logged in, allow access to the nested route (dashboard or anything else)
  return <Outlet />;
};

export default PrivateRoute;
