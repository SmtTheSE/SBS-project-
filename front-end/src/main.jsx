import React from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'
import { RouterProvider } from 'react-router-dom'
import router from './Routes/router'
import { ProfileImageProvider } from './utils/profileImageContext'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ProfileImageProvider>
      <RouterProvider router={router} />
    </ProfileImageProvider>
  </React.StrictMode>
)