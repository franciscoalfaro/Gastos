import React from 'react'
import { NavLink, Navigate, Outlet } from 'react-router-dom'
import useAuth from '../../../hooks/useAuth'
import { Spiner } from '../../../hooks/Spiner'
import { Header } from './Header'
import { Sidebar } from './Sidebar'
import { Footer } from './Footer'


export const PrivateLayout = () => {
  const { auth, loading } = useAuth()


  function sidebarType(a) {
    var parent = a.parentElement.children;
    var color = a.getAttribute("data-class");

    var colors = [];

    for (var i = 0; i < parent.length; i++) {
      parent[i].classList.remove('active');
      colors.push(parent[i].getAttribute('data-class'));
    }

    if (!a.classList.contains('active')) {
      a.classList.add('active');
    } else {
      a.classList.remove('active');
    }

    var sidebar = document.querySelector('.sidenav');

    for (var i = 0; i < colors.length; i++) {
      sidebar.classList.remove(colors[i]);
    }

    sidebar.classList.add(color);
  }

  function navbarFixed(el) {
    let classes = ['position-sticky', 'blur', 'shadow-blur', 'mt-4', 'left-auto', 'top-1', 'z-index-sticky'];
    const navbar = document.getElementById('navbarBlur');

    if (!el.getAttribute("checked")) {
      navbar.classList.add(...classes);
      navbar.setAttribute('navbar-scroll', 'true');
      navbarBlurOnScroll('navbarBlur');
      el.setAttribute("checked", "true");
    } else {
      navbar.classList.remove(...classes);
      navbar.setAttribute('navbar-scroll', 'false');
      navbarBlurOnScroll('navbarBlur');
      el.removeAttribute("checked");
    }
  };

  function openOptions() {
    var fixedPlugin = document.querySelector('.fixed-plugin');
    if (!fixedPlugin.classList.contains('show')) {
      fixedPlugin.classList.add('show');
    } else {
      fixedPlugin.classList.remove('show');
    }
  }

  if (document.querySelector('.fixed-plugin-button')) {
    var fixedPluginButton = document.querySelector('.fixed-plugin-button');
    var fixedPluginButtonNav = document.querySelector('.fixed-plugin-button-nav');

    fixedPluginButton.onclick = openOptions;
    if (fixedPluginButtonNav) {
      fixedPluginButtonNav.onclick = openOptions;
    }
  }


  function closeOption() {
    var fixedPlugin = document.querySelector('.fixed-plugin');
    fixedPlugin.classList.remove('show');

  }


  function sidebarColor(a) {
    var parent = a.parentElement.children;
    var color = a.getAttribute("data-color");

    for (var i = 0; i < parent.length; i++) {
      parent[i].classList.remove('active');
    }

    if (!a.classList.contains('active')) {
      a.classList.add('active');
    } else {
      a.classList.remove('active');
    }

    var sidebar = document.querySelector('.sidenav');
    sidebar.setAttribute("data-color", color);

    if (document.querySelector('#sidenavCard')) {
      var sidenavCard = document.querySelector('#sidenavCard');
      let sidenavCardClasses = ['card', 'card-background', 'shadow-none', 'card-background-mask-' + color];
      sidenavCard.className = '';
      sidenavCard.classList.add(...sidenavCardClasses);

      var sidenavCardIcon = document.querySelector('#sidenavCardIcon');
      let sidenavCardIconClasses = ['ni', 'ni-diamond', 'text-gradient', 'text-lg', 'top-0', 'text-' + color];
      sidenavCardIcon.className = '';
      sidenavCardIcon.classList.add(...sidenavCardIconClasses);
    }

  }

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

        <div className="fixed-plugin">
          <a className="fixed-plugin-button text-dark position-fixed px-3 py-2">
            <i className="fa fa-cog py-2"> </i>
          </a>
          <div className="card shadow-lg ">
          <div className="card-header pb-0 pt-3 ">
            <div className="float-start">
              <h5 className="mt-3 mb-0">Configuracion Adicional</h5>
              <p>Ve nuestras opciones del panel</p>
            </div>
            <div className="float-end mt-4">
              <button className="btn btn-link text-dark p-0 fixed-plugin-close-button">
                <i className="fa fa-close" onClick={closeOption}></i>
              </button>
            </div>
          </div>

          <hr className="horizontal dark my-1"></hr>
          <div className="card-body pt-sm-3 pt-0">
            <div>
              <h6 className="mb-0">Colores</h6>
            </div>

            <a className="switch-trigger background-color">
              <div className="badge-colors my-2 text-start">
                <span className="badge filter bg-gradient-primary active" data-color="primary" onClick={(e) => sidebarColor(e.target)}></span>
                <span className="badge filter bg-gradient-dark" data-color="dark" onClick={(e) => sidebarColor(e.target)}></span>
                <span className="badge filter bg-gradient-info" data-color="info" onClick={(e) => sidebarColor(e.target)}></span>
                <span className="badge filter bg-gradient-success" data-color="success" onClick={(e) => sidebarColor(e.target)}></span>
                <span className="badge filter bg-gradient-warning" data-color="warning" onClick={(e) => sidebarColor(e.target)}></span>
                <span className="badge filter bg-gradient-danger" data-color="danger" onClick={(e) => sidebarColor(e.target)}></span>
              </div>
            </a>

            <div className="mt-3">
              <h6 className="mb-0">Tipos De Navegacion Lateral</h6>
              <p className="text-sm">Elige entre 2 diferentes tipos de navegacion lateral</p>
            </div>
            <div className="d-flex">
              <button className="btn bg-gradient-primary w-100 px-3 mb-2 active" data-class="bg-transparent" onClick={(e) => sidebarType(e.target)}>Transparente</button>
              <button className="btn bg-gradient-primary w-100 px-3 mb-2 ms-2" data-class="bg-white" onClick={(e) => sidebarType(e.target)}>Blanco</button>
            </div>
            <p className="text-sm d-xl-none d-block mt-2">You can change the sidenav type just on desktop view.</p>

            <div className="mt-3">
              <h6 className="mb-0">Navbar Fixed</h6>
            </div>
            <div className="form-check form-switch ps-0">
              <input className="form-check-input mt-1 ms-auto" type="checkbox" id="navbarFixed" onClick={(e) => navbarFixed(e.target)}></input>
            </div>
          </div>

        </div>
        </div>

      </>


    )

  }


}
