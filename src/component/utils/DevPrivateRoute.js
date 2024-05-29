import React from "react";

//redux
import { useSelector } from "react-redux";
import { Navigate, Outlet } from "react-router-dom";

const DevPrivateRoute = () => {
  // const isAuth = useSelector((state) => state.admin.isAuth);
  // const isAuth = true;
  const isAuth = sessionStorage.getItem("isAuthDev");

  return isAuth ? <Outlet /> : <Navigate to="/devLogin" />;
};

export default DevPrivateRoute;
