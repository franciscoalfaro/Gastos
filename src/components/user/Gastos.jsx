import React, { useEffect, useState } from 'react'
import { NavLink } from 'react-router-dom';
import { GastosList } from './GastosList';
import useAuth from '../../hooks/useAuth';
import { useForm } from '../../hooks/useForm';
import { Global } from '../../helpers/Global';
import html2pdf from 'html2pdf.js';
import { Detalle } from './Detalle';
import avatar from '../../assets/img/default.png'
import { EliminarCategoriasModal } from './EliminarCategoriasModal';




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

  const [forceUpdate, setForceUpdate] = useState(false);

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

    if (!newGasto.categoria) {
      Swal.fire({
        title: "Falta la categoria",
        text: "Debes de seleccionar una categoria",
        icon: "question"
      });
    } else {
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

              <div className="card">
                <div className="row g-0">
                  <div className="col-md-4 perfil" >
                    {auth.image !== 'default.png' && <img src={Global.url + "user/avatar/" + auth.image} className="img-thumbnail" alt="perfil"></img>}
                    {auth.image == 'default.png' && <img src={avatar} className="img-thumbnail" alt="perfil"></img>}
                  </div>
                  <div className="col-md-4 card-body pt-5 p-0 text-left">
                    <div className="card-body">
                      <h5 className="card-title text-capitalize">{auth.name}</h5>
                      <p className="card-text">Acerca de mi {auth.bio}</p>
                      <p className="card-text">Cuenta creada : {auth.create_at.split("T")[0]}</p>
                      <p className="card-text"></p>
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
                        ${saldos.saldoActual}
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
                          <input type="datetime-local" name="fechagasto" className="form-control" placeholder="fecha de gasto" aria-label="fechagasto" aria-describedby="gasto-addon" required onChange={changed} />
                          <input type="text" name="categoria" className="form-control" placeholder="Categoria" aria-label="categoria" aria-describedby="categoria-addon" hidden required disabled value={selectedOption} onChange={changed} />
                          <select name="categoria" value={selectedOption} onChange={eventosDistintos} className='select'>
                            <option value=""   >Categorias</option>
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
                        <button className="btn bg-gradient-dark" type="submit"><i className="fas fa-plus"></i><span>&nbsp;&nbsp;Agregar Categoria</span></button>
                        <button className="btn bg-gradient-dark" type="submit" data-bs-toggle="modal" data-bs-target="#miModalCategoria"><i className="fas fa-minus"></i><span>&nbsp;&nbsp;CATEGORIAS</span></button>
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

        <div className="modal" id="miModalCategoria" tabIndex="-1" >
          <div className="modal-dialog" >
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Historico de Categorias</h5>
                <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
              </div>
              <div className="modal-body">
                <EliminarCategoriasModal forceUpdate={() => setForceUpdate(!forceUpdate)}></EliminarCategoriasModal>
              </div>
            </div>
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
