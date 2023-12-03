import React from 'react'
import { NavLink } from 'react-router-dom'

export const Nav = () => {
  return (
    <nav className="navbar navbar-expand-lg navbar-dark navbar-custom">
      <div className="container">
        <a className="navbar-brand" to="/">Como Gasto</a>
        <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
          <span className="navbar-toggler-icon"></span>
        </button>

        {/*
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav ml-auto">
            <li className="nav-item">
              <NavLink className="nav-link" to="login">
                <span>Login</span>
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink className="nav-link" to="registro">
                <span>Registro</span>
              </NavLink>
            </li>
          </ul>
        </div>
        */}
      </div>
    </nav>
  )
}
