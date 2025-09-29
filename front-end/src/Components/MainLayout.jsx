import React from 'react'
import Navigation from './Navigation'
import { Outlet } from 'react-router-dom'
import Footer from './Footer'
import SideBar from './SideBar'

const MainLayout = () => {
  return (
    <>
    <Navigation />  
    <SideBar />
    <Outlet />
    <Footer />
    </>
  )
}

export default MainLayout