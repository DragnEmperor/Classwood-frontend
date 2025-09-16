import React from 'react'
import { useNavigate } from 'react-router-dom';

export default function NotAuthorized() {
  const navigate = useNavigate();
  const Logout = ()=>{
    localStorage.removeItem("UserType");
    localStorage.removeItem("token");
    localStorage.removeItem("Payed");
    localStorage.removeItem("session");
    navigate(`/`);
  }

  return (
    <div className='flex flex-col items-center justify-center w-full h-screen gap-4'>
    <p className='text-center'>You are Not authorized to assess this page<br/> Please login with valid credential</p>
    <button
      onClick={Logout}
      className="flex items-center px-4 py-1 mx-4 text-sm font-medium text-white duration-300 ease-in-out bg-green-600 rounded-md hover:bg-green-800"
    >
      Go to Login
    </button>
    </div>
  )
}
