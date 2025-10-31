import React, { useEffect } from 'react'
import Navigation from './Navigation'
import { Outlet, useNavigate } from 'react-router-dom'
import Footer from './Footer'
import SideBar from './SideBar'

const MainLayout = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Check if user is a guest
    const isGuest = localStorage.getItem("isGuest") === "true";
    
    // If not a guest, check for token
    if (!isGuest) {
      const token = localStorage.getItem("token");
      if (!token) {
        // If no token and not a guest, redirect to login
        navigate("/login");
      }
    }
  }, [navigate]);

  // Check if user is a guest
  const isGuest = localStorage.getItem("isGuest") === "true";

  return (
    <>
    <Navigation />  
    {!isGuest && <SideBar />}
    <Outlet />
    <Footer />
    </>
  )
}

export default MainLayout