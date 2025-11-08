import React from "react";
import Navigation from "./Navigation";
import { Outlet } from "react-router-dom";
import Footer from "./Footer";
import AdminSideBar from "./AdminSideBar";
import useAdminSideBar from "../Hook/useAdminSideBar";

const AdminLayout = () => {
  const {collapsed} = useAdminSideBar();
  return (
    <>
      <Navigation />
      <div className="flex">
        <AdminSideBar />
        <main className={`flex-1 xs:p-1 md:p-4 xs:ml-20 ${collapsed ? "md:ml-20" : "md:ml-64"} transition-all duration-300`}>
          <Outlet />
          <Footer />
        </main>
      </div>
    </>
  );
};

export default AdminLayout;
