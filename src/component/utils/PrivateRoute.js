import React from "react";

//redux
import { useSelector } from "react-redux";
import { Navigate, Outlet } from "react-router-dom";

const PrivateRoute = () => {
  // const isAuth = useSelector((state) => state.admin.isAuth);
  // const isAuth = true;
  const isAuth = JSON.parse(sessionStorage.getItem("isAuth"));
  const isAuthDev = JSON.parse(sessionStorage.getItem("isAuthDev"));
  return (isAuth || isAuthDev) ? <Outlet /> : <Navigate to="/login" /> || <Navigate to="/devLogin" />;
};

export default PrivateRoute;
