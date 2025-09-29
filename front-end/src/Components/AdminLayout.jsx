import React from 'react'
import Navigation from './Navigation'
import { Outlet } from 'react-router-dom'
import Footer from './Footer'
import AdminSideBar from './AdminSideBar'

const AdminLayout = () => {
  return (
    <>
      <Navigation />  
      <div className="flex">
        <AdminSideBar />
        <main className="flex-1 ml-80 mt-20 p-6">
          <Outlet />
        </main>
      </div>
      <Footer />
    </>
  )
}

export default AdminLayout