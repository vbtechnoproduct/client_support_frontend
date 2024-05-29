import React from "react";

//redux
import { useSelector } from "react-redux";
import { Navigate, Outlet } from "react-router-dom";

const PrivateRoute = () => {
  // const isAuth = useSelector((state) => state.admin.isAuth);
  // const isAuth = true;
  const isAuth = sessionStorage.getItem("isAuth");

  return isAuth ? <Outlet /> : <Navigate to="/login" />;
};

export default PrivateRoute;
