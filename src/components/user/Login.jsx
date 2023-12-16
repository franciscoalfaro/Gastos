import React from 'react'
import { useForm } from '../../hooks/useForm'
import { useState } from 'react'
import useAuth from '../../hooks/useAuth'
import { Global } from '../../helpers/Global'
import { NavLink } from 'react-router-dom'
import userImage from '../../assets/img/curved-images/curved6.jpg'

export const Login = () => {

  const { form, changed } = useForm({})
  const [saved, setSaved] = useState('not_sended')

  const { setAuth } = useAuth()

  const loginUser = async (e) => {
    e.preventDefault()

    //obtener datos del formulario
    let userLogin = form

    const request = await fetch(Global.url + "user/login", {
      method: "POST",
      body: JSON.stringify(userLogin),
      headers: {
        "Content-Type": "application/json"
      }
    })
    const data = await request.json()

    if (data.status == "success") {
      // Persistir datos en el navegador - guardar datos de inicio de sesión
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));
      setSaved("login");
      // Establecer datos en el auth
      setAuth(data.user);
      // Redirección

      Swal.fire({
        position: 'center',
        icon: 'success',
        title: 'Login correcto',
        showConfirmButton: false,
        timer: 1150

      });
      setTimeout(() => { window.location.reload() }, 1200);


    } else if (data.status == "error_404") {
      setSaved("error_404");
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'Falta usuario o clave!',

      })
    } else if (data.status == "Not Found") {
      setSaved("warning");
      Swal.fire({
        icon: 'warning',
        title: 'Oops...',
        text: 'Usuario no registrado!',

      })


    } else {
      setSaved("error");
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'usuario o clave incorrecto!',

      })
    }


  }

  const divStyle = {
    backgroundImage: `url(${userImage})`, // Establece la imagen como fondo
  };


  return (
    
      <main className="main-content  mt-0">
        <section>
          <div className="page-header min-vh-75">
            <div className="container">
              <div className="row">
                <div className="col-xl-4 col-lg-5 col-md-6 d-flex flex-column mx-auto">
                  <div className="card card-plain mt-8">
                    <div className="card-header pb-0 text-left bg-transparent">
                      <h3 className="font-weight-bolder text-info text-gradient">Bienvenido</h3>
                      <p className="mb-0">Escribe tu e-mail y password para ingresar</p>
                    </div>
                    <div className="card-body">
                      <form onSubmit={loginUser}>
                        <div className="mb-3">
                          <label htmlFor="email" className="">Dirección de correo</label>
                          <input type="email" name="email" className="form-control" placeholder="Email" aria-label="Email" aria-describedby="email-addon" onChange={changed} required></input>

                        </div>
                        <div className="mb-3">
                          <label htmlFor="password" className="">Contraseña</label>
                          <input type="password" name="password" className="form-control" placeholder="Password" aria-label="Password" aria-describedby="password-addon" onChange={changed} required></input>

                        </div>
                        <div className="text-center">
                          <button type="submit" className="btn bg-gradient-info w-100 mt-4 mb-0">Ingresar</button>
                        </div>
                      </form>
                    </div>
                    <div className="card-footer text-center pt-0 px-lg-2 px-1">
                      <p className="mb-4 text-sm mx-auto">
                        No tienes cuenta?
                        <NavLink className="nav-link" to="/registro">
                          <span>Regístrate</span>
                        </NavLink>
                      </p>
                      <NavLink className="nav-link" to="/recuperar">
                        <span>¿Olvidaste tu contraseña?</span>
                      </NavLink>
                    </div>
                  </div>
                </div>
                <div className="col-md-6">
                  <div className="oblique position-absolute top-0 h-100 d-md-block d-none me-n8">
                    <div className="oblique-image bg-cover position-absolute fixed-top ms-auto h-100 z-index-0 ms-n6" style={divStyle}></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

    

  )
}
