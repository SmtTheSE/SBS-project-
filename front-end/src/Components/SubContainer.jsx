import React from 'react'

const SubContainer = ({children, className}) => {
  return (
    <div className={`${className} w-[80%] mx-auto`}>
        {children}
    </div>
  )
}

export default SubContainer