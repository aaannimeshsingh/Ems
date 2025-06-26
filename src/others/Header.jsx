import React from 'react'

function Header(props) {
  const logOutUser = () => {
    localStorage.setItem('loggedInUser', "")
    // Set user to null instead of empty string to properly trigger login page
    props.changeUser(null)
  }
  
  return (
    <div className='flex items-end justify-between'>
        <h1 className='text-2xl font-medium'>Hello <br /> <span className='text-3xl font-semibold'>{props?.data?.firstName || props?.firstName || "User"}</span>👋🏿</h1>
        <button onClick={logOutUser} className='bg-red-600 text-lg font-medium text-white px-5 py-2 rounded-sm'>Logout</button>
    </div>
  )
}

export default Header