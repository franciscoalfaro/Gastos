import React from 'react'
import { Navigate, Outlet } from 'react-router-dom'
import useAuth from '../../../hooks/useAuth'
import {useNavigate} from 'react-router-dom'

import { Header } from './Header'

export const PublicLayout = () => {
  const { auth } = useAuth()
  const navigate = useNavigate()


  if (typeof auth === 'undefined') {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login')
  }


  return (
    <>
      <Header></Header>
      <div className='container'>
        {!auth._id ? <Outlet></Outlet> : <Navigate to="/auth"></Navigate>}
      </div>

    </>
  )
}
