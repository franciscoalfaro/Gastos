import React, { useState } from 'react'
import { NavLink } from 'react-router-dom'
import { Sidebar } from './Sidebar'

import '../../../assets/css/barranav.css'

export const Nav = () => {

  const [isOpen, setIsOpen] = useState(true);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };



  return (
    <>
      <nav className="navbar">
        <div className="menu-toggle" onClick={toggleMenu}>
          <span className="bar">Inicio</span>
          <span className="bar">Servicios</span>
          <span className="bar">Acerca de</span>
        </div>
        <ul className={`nav-list ${isOpen ? 'menu-open' : ''}`}>
          <li><a href="#">Inicio</a></li>
          <li><a href="#">Servicios</a></li>
          <li><a href="#">Acerca de</a></li>
          <li><a href="#">Contacto</a></li>
        </ul>
      </nav>

    </>
  )
}
