import React, { useEffect, useState } from 'react'
import imgLogo from '../../assets/img/curved-images/curved14.jpg'
import imgCard from '../../assets/img/logos/mastercard.png'
import { NavLink } from 'react-router-dom';
import { GastosList } from './GastosList';
import useAuth from '../../hooks/useAuth';
import { useForm } from '../../hooks/useForm';
import { Global } from '../../helpers/Global';
import html2pdf from 'html2pdf.js';
import { Detalle } from './Detalle';



const divStyle = {
  backgroundImage: `url(${imgLogo})`, // Establece la imagen como fondo
};




export const Gastos = () => {

  const { auth } = useAuth()
  const { form, changed } = useForm()
  const [categorias, setCategorias] = useState([])
  const [actualizarGastosList, setActualizarGastosList] = useState(false);
  const [newCategorias, setNewCategorias] = useState([])
  const [updateTrigger, setUpdateTrigger] = useState(false);
  const [selectedOption, setSelectedOption] = useState('')

  const [totalGeneral, setTotalGeneral] = useState([])
  const [saldos, setSaldos] = useState([])

  const actualizarListaDeGastos = () => {
    setActualizarGastosList(prevState => !prevState);
    setUpdateTrigger(prevState => !prevState);
  };


  useEffect(() => {
    listCategorias()

  }, [newCategorias])



  const listCategorias = async () => {
    try {
      const request = await fetch(Global.url + 'category/list', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': localStorage.getItem('token')
        }
      })

      const data = await request.json()

      if (data.status === "success") {
        setCategorias(data.categorias)

      }
    } catch (error) {
      console.error('Error al obtener los datos:', error);

    }

  }


  const crearGasto = async (e) => {

    e.preventDefault();
    let newGasto = form
   

    const request = await fetch(Global.url + 'bills/creargasto', {
      method: "POST",
      body: JSON.stringify(newGasto),
      headers: {
        'Content-Type': 'application/json',
        'Authorization': localStorage.getItem('token')

      }
    })
    const data = await request.json()

    if (data.status === "success") {
      setActualizarGastosList()
     
    }

    const myForm = document.querySelector("#gasto-form")
    myForm.reset()

  }


  const crearCategoria = async (e) => {

    e.preventDefault();
    let newCategoria = form
   

    const request = await fetch(Global.url + 'category/crearcategoria', {
      method: "POST",
      body: JSON.stringify(newCategoria),
      headers: {
        'Content-Type': 'application/json',
        'Authorization': localStorage.getItem('token')

      }
    })
    const data = await request.json()

    if (data.status === "success") {
      setNewCategorias(data)
     
    }

    const myForm = document.querySelector("#categoria-form")
    myForm.reset()

  }

  const opcioneDelselect = (event) => {
    setSelectedOption(event.target.value); // Actualiza la opción seleccionada
    
  };


  //llamar eventos distintos con onchange
  const eventosDistintos = (event) => {
    opcioneDelselect(event);
    changed(event);
  };

  useEffect(() => {
    generalTotal()
  }, [actualizarGastosList])

  const generalTotal = async () => {
    try {
      const request = await fetch(Global.url + 'total/generartotal/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': localStorage.getItem('token')
        }
      })
      const data = await request.json()
      if (data.status === "success") {
        setSaldos(data.total)
        setTotalGeneral(data)
       
      }
    } catch (error) {

    }
  }


  const generatePDF = () => {
    const content = document.getElementById('pdfContent');
    html2pdf().from(content).save();
  };


  return (
    <div className="container-fluid py-4">
      <div className="row">
        <div className="col-lg-8">
          <div className="row">
            <div className="col-xl-6 mb-xl-0 mb-4">
              <div className="card bg-transparent shadow-xl">
                <div className="overflow-hidden position-relative border-radius-xl " style={divStyle}>
                  <span className="mask bg-gradient-dark"></span>
                  <div className="card-body position-relative z-index-1 p-3">
                    <i className="fas fa-wifi text-white p-2"></i>
                    <h5 className="text-white mt-4 mb-5 pb-2">4562&nbsp;&nbsp;&nbsp;1122&nbsp;&nbsp;&nbsp;4594&nbsp;&nbsp;&nbsp;7852</h5>
                    <div className="d-flex">
                      <div className="d-flex">
                        <div className="me-4">
                          <p className="text-white text-sm opacity-8 mb-0" >Usuario</p>
                          <h6 className="text-white mb-0">{auth.name}</h6>
                        </div>
                        <div>
                          <p className="text-white text-sm opacity-8 mb-0">Cuenta Creada</p>
                          <h6 className="text-white mb-0">{auth.create_at.split("T")[0]}</h6>
                        </div>
                      </div>
                      <div className="ms-auto w-20 d-flex align-items-end justify-content-end">
                        <img className="w-60 mt-2" src={imgCard} alt="logo"></img>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-xl-6">
              <div className="row">
                <div className="col-md-6">
                  <div className="card">
                    <div className="card-header mx-4 p-3 text-center">
                      <div className="icon icon-shape icon-lg bg-gradient-primary shadow text-center border-radius-lg">
                        <i className="fas fa-landmark opacity-10"></i>
                      </div>
                    </div>
                    <div className="card-body pt-0 p-3 text-center">
                      <h6 className="text-center mb-0">Saldo Inicial</h6>
                      <span className="text-xs"></span>
                      <hr className="horizontal dark my-3"></hr>
                      <h5 className="mb-0">
                        {saldos.saldoInicial ? `$${saldos.saldoInicial}` : "$0"}
                      </h5>
                    </div>
                  </div>
                </div>
                <div className="col-md-6 mt-md-0 mt-4">
                  <div className="card">
                    <div className="card-header mx-4 p-3 text-center">
                      <div className="icon icon-shape icon-lg bg-gradient-primary shadow text-center border-radius-lg">
                        <i className="fas fa-landmark opacity-10"></i>
                      </div>
                    </div>
                    <div className="card-body pt-0 p-3 text-center">
                      <h6 className="text-center mb-0">Saldo Actual</h6>
                      <span className="text-xs"></span>
                      <hr className="horizontal dark my-3"></hr>
                      <h5 className="mb-0">
                        ${saldos.saldoInicial !== undefined && saldos.gastoUtilizado !== undefined ? saldos.saldoInicial - saldos.gastoUtilizado : 0}
                      </h5>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* seccion para agregar gastos*/}
            <form id='gasto-form' onSubmit={crearGasto}>
              <div className="col-md-12 mb-lg-0 mb-4">
                <div className="card mt-4">
                  <div className="card-header pb-0 p-3">
                    <div className="row">
                      <div className="col-6 d-flex align-items-center">
                        <h6 className="mb-0">Crear nuevo Gasto</h6>
                      </div>
                      <div className="col-6 text-end">
                        <button className="btn bg-gradient-dark mb-0" type="submit"><i className="fas fa-plus"></i><span>&nbsp;&nbsp;Agregar Gasto</span></button>
                      </div>
                    </div>
                  </div>
                  <div className="card-body p-3">
                    <div className="row">
                      <div className="col-md-12 mb-md-0 mb-4">
                        <div className="card card-body border card-plain border-radius-lg d-flex align-items-center flex-row">
                          <input type="text" name="name" className="form-control" placeholder="Nombre" aria-label="name" aria-describedby="email-addon" required onChange={changed} />
                          <input type="text" name="description" className="form-control" placeholder="Descripcion" aria-label="description" aria-describedby="description-addon" required onChange={changed} />
                          <input type="number" name="cantidad" className="form-control" placeholder="cantidad" aria-label="cantidad" aria-describedby="cantidad-addon" required onChange={changed} />
                          <input type="number" name="valor" className="form-control" placeholder="valor" aria-label="valor" aria-describedby="valor-addon" required onChange={changed} />
                          <input type="text" name="categoria" className="form-control" placeholder="Categoria" aria-label="categoria" aria-describedby="categoria-addon" required disabled value={selectedOption} onChange={changed} />
                          <select name="categoria" value={selectedOption} onChange={eventosDistintos} className='select'>
                            <option value=""   >Seleccionar Categoria</option>
                            {categorias.map((item) => (
                              <option key={item._id} value={item.name} >
                                {item.name}
                              </option>
                             
                            ))}
                          </select>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </form>
            {/* Fin seccion para agregar gastos*/}



            {/* seccion para agregar categorias*/}
            <form id='categoria-form' onSubmit={crearCategoria}>
              <div className="col-md-12 mb-lg-0 mb-4">
                <div className="card mt-4">
                  <div className="card-header pb-0 p-3">
                    <div className="row">
                      <div className="col-6 d-flex align-items-center">
                        <h6 className="mb-0">Crear Nueva Categoria</h6>
                      </div>
                      <div className="col-6 text-end">
                        <button className="btn bg-gradient-dark mb-0" type="submit"><i className="fas fa-plus"></i><span>&nbsp;&nbsp;Agregar Categoria</span></button>
                      </div>
                    </div>
                  </div>
                  <div className="card-body p-3">
                    <div className="row">
                      <div className="col-md-12 mb-md-0 mb-4">
                        <div className="card card-body border card-plain border-radius-lg d-flex align-items-center flex-row">
                          <input type="text" name="name" className="form-control" placeholder="Nombre" aria-label="name" aria-describedby="email-addon" required onChange={changed} />
                          <input type="text" name="description" className="form-control" placeholder="Descripcion" aria-label="description" aria-describedby="email-addon" onChange={changed} />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </form>
            {/* Fin seccion para agregar categorias*/}


          </div>
        </div>

        <div className="col-lg-4">
          <div className="card h-100">
            <div className="card-header pb-0 p-3">
              <div className="row">
                <div className="col-6 d-flex align-items-center">
                  <h6 className="mb-0">Totales Mensuales</h6>
                </div>
                <div className="col-6 text-end">
                  <button className="btn btn-outline-primary btn-sm mb-0"><NavLink to="/auth/consumo">Ver Mas</NavLink></button>
                </div>
              </div>
            </div>
          {/* generar pdf */}
            <Detalle></Detalle>
            {/* fin generar pdf */}
          </div>        
        </div>
      </div>

      <GastosList updateTrigger={updateTrigger} actualizarLista={actualizarListaDeGastos} />

    </div >

  )
}
