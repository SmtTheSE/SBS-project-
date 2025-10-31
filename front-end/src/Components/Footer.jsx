import React from 'react'

const Footer = () => {
  // Check if user is a guest
  const isGuest = localStorage.getItem("isGuest") === "true";
  
  // Don't render anything for guest users
  if (isGuest) {
    return null;
  }

  return (
    <div className="py-5 text-center text-gray-600 text-sm">
      &copy; {new Date().getFullYear()} SBS Student Portal. All rights reserved.
    </div>
  )
}

export default Footer