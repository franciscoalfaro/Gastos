import React, { useState } from 'react'
import { NavLink } from 'react-router-dom'

export const Nav = () => {
  
  return (
  

    <div className="container position-sticky z-index-sticky top-0">
      <div className="row">
        <div className="col-12">
          <nav className="navbar navbar-expand-lg blur blur-rounded top-0 z-index-3 shadow position-absolute my-3 py-2 start-0 end-0 mx-4">
            <div className="container-fluid pe-0">
              <a className="navbar-brand font-weight-bolder ms-lg-0 ms-3 ">Como Gasto</a>
              <button className="navbar-toggler shadow-none ms-2" type="button" data-bs-toggle="collapse" data-bs-target="#navigation" aria-controls="navigation" aria-expanded="false" aria-label="Toggle navigation">
                <span className="navbar-toggler-icon mt-2">
                  <span className="navbar-toggler-bar bar1"></span>
                  <span className="navbar-toggler-bar bar2"></span>
                  <span className="navbar-toggler-bar bar3"></span>
                </span>
              </button>
              <div className="collapse navbar-collapse" id="navigation">
                <ul className="navbar-nav mx-auto ms-xl-auto me-xl-7">
                  <li className="nav-link me-2">
                    <i className="fas fa-user-circle opacity-6 text-dark me-1"></i>
                    <NavLink to="login">Ingresar</NavLink>
                  </li>
                  <li className="nav-link me-2"><i className="fas fa-key opacity-6 text-dark me-1"></i>
                    <NavLink to="registro">Registrarse</NavLink>
                  </li>
                </ul>
              </div>
            </div>
          </nav>
        </div>
      </div>
    </div>



  )
}
