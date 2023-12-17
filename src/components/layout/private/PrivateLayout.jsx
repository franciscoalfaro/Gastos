import React from 'react'
import { NavLink, Navigate, Outlet } from 'react-router-dom'
import useAuth from '../../../hooks/useAuth'
import { Spiner } from '../../../hooks/Spiner'
import { Header } from './Header'
import { Sidebar } from './Sidebar'
import { Footer } from './Footer'


export const PrivateLayout = () => {
  const { auth, loading } = useAuth()


  if (loading) {
    return <Spiner></Spiner>
  } else {
    return (
      <>

        {/*Layout*/}
        <Sidebar></Sidebar>
        <main className="main-content position-relative max-height-vh-100 h-100 border-radius-lg ">
          <Header></Header>



          {/*cabecera y navegacion*/}

          {/*contenido principal*/}


          {auth._id ? <Outlet></Outlet> : <Navigate to="/login"></Navigate>}


          {/*barra lateral*/}

        <Footer></Footer>
        </main>

      </>


    )

  }


}
