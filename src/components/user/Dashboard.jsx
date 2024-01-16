import React, { useEffect, useState } from 'react'
import Grafico from './Graficos'
import useAuth from '../../hooks/useAuth';
import { Global } from '../../helpers/Global';
import { useForm } from '../../hooks/useForm';
import { SerializeForm } from '../../helpers/SerializeForm';
import imgCard from '../../assets/img/small-logos/contabilidad.png'
import { RegistrarSaldoModal } from './RegistrarSaldoModal';
import { HistoricoSaldos } from './HistoricoSaldos';

export const Dashboard = () => {

  const currentDate = new Date();
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth() + 1;
  const day = currentDate.getDate();
  const formattedDate = `${day}/${month}/${year}`;


  const { auth } = useAuth()

  const [dataUser, setDataUser] = useState([])
  const [dataGasto, setDataGasto] = useState([])
  const [crearSaldo, setCrearSaldo] = useState([])
  const { form, changed } = useForm()
  const [actualizacion, setActualizacion] = useState(false);
  const [selectedMonth, setSelectedMonth] = useState('');
  const [indicador, setIndicador] = useState([])



  useEffect(() => {
    gastoData()
    indicadoresEconomicos()
  }, [actualizacion])


  useEffect(() => {
    userData()
  }, [actualizacion])



  const userData = async () => {
    try {
      const request = await fetch(Global.url + "saldo/montoactual", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "Authorization": localStorage.getItem("token")
        }
      })
      const data = await request.json()
      setDataUser(data.saldoUser)

    } catch (error) {
      console.error('Error al obtener los datos:', error);

    }
  }

  //la consulta obtiene los ultimos 30 desde la api
  const gastoData = async () => {
    try {
      const request = await fetch(Global.url + "bills/ultimos5", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "Authorization": localStorage.getItem("token")
        }
      })
      const data = await request.json()
      setDataGasto(data.gastos)



    } catch (error) {
      console.error('Error al obtener los datos:', error);

    }
  }

  const registrarSaldo = async (e) => {

    e.preventDefault();
    let newSaldo = form


    const request = await fetch(Global.url + 'saldo/register/', {
      method: "POST",
      body: JSON.stringify(newSaldo),
      headers: {
        'Content-Type': 'application/json',
        'Authorization': localStorage.getItem('token')

      }
    })
    const data = await request.json()

    if (data.status === "success") {
      setActualizacion(prevState => !prevState);
      setCrearSaldo(data)


    } else {
      console.error('Error al obtener los datos:', data.message);
    }


    const myForm = document.querySelector("#saldo-form")
    myForm.reset()

  }

  const updateSaldo = async (e) => {
    e.preventDefault();
    let newSaldoUser = SerializeForm(e.target)

    const request = await fetch(Global.url + "saldo/update", {
      method: "PUT",
      body: JSON.stringify(newSaldoUser),
      headers: {
        "Content-Type": "application/json",
        'Authorization': localStorage.getItem('token')
      }
    })
    const data = await request.json()

    if (data.status == "success") {
      setActualizacion(prevState => !prevState);
      Swal.fire({
        position: 'center',
        icon: 'success',
        title: 'saldo actualizado Correctamente',
        showConfirmButton: true,
      });
      setTimeout(() => { window.location.reload() }, 100);

      

    } else {
      console.error('Error al obtener los datos:', data.message);
    }


  }


  const capitalizeFirstLetter = (name) => {
    return name.replace(/^\w/, (c) => c.toUpperCase());
  };

  //llamado para obtener indicadores economicos

  const indicadoresEconomicos = async () => {
    try {
      const request = await fetch(Global.url + "indicador/economico", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "Authorization": localStorage.getItem("token")
        }

      })
      const data = await request.json()
      console.log(data.map((dolarhoy, index)))
      if (data.status === "success") {
        setIndicador(data)

      }


    } catch (error) {

    }
  }

  return (
    <>
      <div className="container-fluid py-4">
        <div className="row">
          <div className="col-xl-3 col-sm-6 mb-lg-0 mb-4">
            <div className="card">
              <div className="card-body p-3">

                <div className="row">
                  <div className="col-8">
                    <div className="numbers">
                      <p className="text-sm mb-0 text-capitalize font-weight-bold">Mi Saldo Mensual</p>
                      <h5 className="font-weight-bolder mb-0">$
                        {dataUser?.montoMensual !== undefined ? dataUser.montoMensual : 0}
                      </h5>
                    </div>
                  </div>
                  <div className="col-4 text-end">
                    <div className="icon icon-shape bg-gradient-primary shadow text-center border-radius-md">
                      <i className="ni ni-money-coins text-lg opacity-10" aria-hidden="true"></i>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="col-xl-3 col-sm-6 mb-lg-0 mb-4">
            <div className="card">
              <div className="card-body p-3">
                <div className="row">
                  <div className="col-8">
                    {dataGasto && dataGasto.length > 0 ? (
                      <div className="numbers">
                        <p className="text-sm mb-0 text-capitalize font-weight-bold">Último gasto</p>
                        <h5 className="font-weight-bolder mb-0">
                          {dataGasto
                            .sort((a, b) => new Date(b.create_at) - new Date(a.create_at))
                            .slice(0, 1)
                            .map((gasto) => (
                              <span key={gasto._id}>
                                <span className="font-weight-bolder mb-0" >{gasto.name}</span>
                                <span className="font-weight-bolder mb-0"> ${gasto.valor}</span>
                              </span>
                            ))}
                        </h5>
                      </div>
                    ) : (
                      <span>No hay gastos registrados</span>
                    )}


                  </div>
                  <div className="col-4 text-end">
                    <div className="icon icon-shape bg-gradient-primary shadow text-center border-radius-md">
                      <i className="ni ni-world text-lg opacity-10" aria-hidden="true"></i>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="col-lg-2 col-sm-6 mb-lg-0 mb-4">
            <div className="card">
              <div className="card-body p-3">
                <div className="row">
                  <div className="col-8">
                    <div className="numbers">
                      <p className="text-sm mb-0 text-capitalize font-weight-bold">Fecha actual</p>
                      <h5 className="font-weight-bolder mb-0">
                        <div id="current_date">
                          <h5 className="font-weight-bolder mb-0">{formattedDate}</h5>
                        </div>
                      </h5>
                    </div>
                  </div>
                  <div className="col-4 text-end">
                    <div className="icon icon-shape bg-gradient-primary shadow text-center border-radius-md">
                      <i className="ni ni-paper-diploma text-lg opacity-10" aria-hidden="true"></i>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="col-lg-2 col-sm-6 mb-lg-0 mb-4">
            <div className="card">
              <div className="card-body p-3">
                <div className="row">
                  <div className="col-8">
                    <div className="numbers">
                      <p className="text-sm mb-0 text-capitalize font-weight-bold">Tope 1</p>
                      <h5 className="font-weight-bolder mb-0">
                        ${dataUser?.tope1 !== undefined ? dataUser.tope1 : 0}
                      </h5>
                    </div>
                  </div>
                  <div className="col-4 text-end">
                    <div className="icon icon-shape bg-gradient-primary shadow text-center border-radius-md">
                      <i className="ni ni-cart text-lg opacity-10" aria-hidden="true"></i>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="col-lg-2 col-sm-6 mb-lg-0 mb-4">
            <div className="card">
              <div className="card-body p-3">
                <div className="row">
                  <div className="col-8">
                    <div className="numbers">
                      <p className="text-sm mb-0 text-capitalize font-weight-bold">Tope 2</p>
                      <h5 className="font-weight-bolder mb-0">
                        ${dataUser?.tope2 !== undefined ? dataUser.tope2 : 0}
                      </h5>
                    </div>
                  </div>
                  <div className="col-4 text-end">
                    <div className="icon icon-shape bg-gradient-primary shadow text-center border-radius-md">
                      <i className="ni ni-cart text-lg opacity-10" aria-hidden="true"></i>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="row mt-4">
          <div className="col-lg-8 mb-lg-0 mb-4">
            <div className="card">
              <div className="card-header">
                <div className="row">
                  <div className="col-sm-6 mb-3 mb-sm-0">
                    <div className="card">
                      <div className="card-body">
                        <h5>Hola {capitalizeFirstLetter(auth.name)}</h5>
                        <p className="card-text">Tu gasto en los 12 meses a sido</p>
                      </div>
                    </div>
                  </div>

                  <div className="col-sm-3 mb-3 mb-sm-0">
                    <div className="card">
                      <div className="card-body">
                        <h5 className="card-title"></h5>
                        <p className="card-text">Dolar observador ayer  </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>


              <div className="card-body p-3">
                <div className="bg-gradient-dark border-radius-lg py-3 pe-1 mb-3">
                  <div className="chart">
                    <Grafico></Grafico>
                  </div>
                </div>
              </div>
            </div>
          </div>


          <div className="col-lg-4">
            <div className="card z-index-2">
              <div className="card-header pb-0">
                <h6>Registrar Saldo mes actual</h6>
                {/**si existen datos en el form mostrar update saldo si no mostrar registrar saldo */}

                {!dataUser ? (
                  <form id='saldo-form' onSubmit={registrarSaldo}>
                    <div className="text-sm">
                      <input type="text" name="montoMensual" htmlFor='montoMensual' className="form-control" placeholder="Saldo" aria-label="saldo" aria-describedby="saldo-addon" required defaultValue={dataUser?.montoMensual !== undefined ? dataUser.montoMensual : ''} onChange={changed}></input> <br></br>
                      <input type="number" min="1" max="12" name="mes" htmlFor='mes' className="form-control" placeholder="Mes" aria-label="tope" aria-describedby="mes-addon" defaultValue={dataUser?.mes !== undefined ? dataUser.mes : ''} onChange={changed}></input><br></br>
                      <input type="text" name="tope1" htmlFor='tope1' className="form-control" placeholder="Primer Tope" aria-label="tope" aria-describedby="tope1-addon" defaultValue={dataUser?.tope1 !== undefined ? dataUser.tope1 : ''} onChange={changed}></input><br></br>
                      <input type="text" name="tope2" htmlFor='tope2' className="form-control" placeholder="Segundo Tope" aria-label="tope" aria-describedby="tope2-addon" defaultValue={dataUser?.tope2 !== undefined ? dataUser.tope2 : ''} onChange={changed}></input><br></br>
                      <input type="text" name="ano" htmlFor='ano' className="form-control" placeholder="Año" aria-label="ano" aria-describedby="ano-addon" defaultValue={dataUser?.ano !== undefined ? dataUser.ano : ''} onChange={changed}></input><br></br>
                      <div className="">
                        <button className="btn bg-gradient-dark " type="submit">
                          <i className="fas fa-plus"></i><span>&nbsp;&nbsp;Agregar Saldo</span>
                        </button>
                        <button className="btn bg-gradient-dark " type="button" data-bs-toggle="modal" data-bs-target="#miModalregistrosaldo">
                          <i className="fas fa-money-bills"></i><span>&nbsp;&nbsp;Otros Saldos</span>
                        </button>
                        <button className="btn bg-gradient-dark " type="button" data-bs-toggle="modal" data-bs-target="#miModalHistorico">
                          <i className="fas fa-eye"></i><span>&nbsp;&nbsp;Historico</span>
                        </button>
                      </div>
                    </div>
                  </form>
                ) : (

                  <form id='update-form' onSubmit={updateSaldo}>
                    <div className="text-sm">
                      <input type="text" name="montoMensual" htmlFor='montoMensual' className="form-control" placeholder="Saldo" aria-label="saldo" aria-describedby="saldo-addon" required defaultValue={dataUser?.montoMensual !== undefined ? dataUser.montoMensual : ''} onChange={changed}></input> <br></br>
                      <input type="number" min="1" max="12" name="mes" htmlFor='mes' className="form-control" placeholder="Mes" aria-label="tope" aria-describedby="mes-addon" defaultValue={dataUser?.mes !== undefined ? dataUser.mes : ''} onChange={changed}></input><br></br>
                      <input type="text" name="tope1" htmlFor='tope1' className="form-control" placeholder="Primer Tope" aria-label="tope" aria-describedby="tope1-addon" defaultValue={dataUser?.tope1 !== undefined ? dataUser.tope1 : ''} onChange={changed}></input><br></br>
                      <input type="text" name="tope2" htmlFor='tope2' className="form-control" placeholder="Segundo Tope" aria-label="tope" aria-describedby="tope2-addon" defaultValue={dataUser?.tope2 !== undefined ? dataUser.tope2 : ''} onChange={changed}></input><br></br>
                      <input type="text" name="ano" htmlFor='ano' className="form-control" placeholder="Año" aria-label="ano" aria-describedby="ano-addon" defaultValue={dataUser?.ano !== undefined ? dataUser.ano : ''} onChange={changed}></input><br></br>
                      <div className="">
                        <button className="btn bg-gradient-dark " type="submit">
                          <i className="fas fa-sync"></i><span>&nbsp;&nbsp;Actualizar Saldo</span>
                        </button>
                        <button className="btn bg-gradient-dark " type="button" data-bs-toggle="modal" data-bs-target="#miModalregistrosaldo">
                          <i className="fas fa-money-bills"></i><span>&nbsp;&nbsp;Otros Saldos</span>
                        </button>
                        <button className="btn bg-gradient-dark " type="button" data-bs-toggle="modal" data-bs-target="#miModalHistorico">
                          <i className="fas fa-eye"></i><span>&nbsp;&nbsp;Historico</span>
                        </button>
                      </div>
                    </div>

                  </form>

                )}
              </div>




              <div className="card-body p-3">

              </div>
            </div>
          </div>
        </div>

        {/**modals */}
        <div className="modal" id="miModalregistrosaldo" tabIndex="-1" >
          <div className="modal-dialog" >
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Crear Saldo Mes Anterior</h5>
                <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
              </div>
              <div className="modal-body">
                <RegistrarSaldoModal></RegistrarSaldoModal>
              </div>
            </div>
          </div>
        </div>


        <div className="modal" id="miModalHistorico" tabIndex="-1" >
          <div className="modal-dialog" >
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Historico de saldos</h5>
                <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
              </div>
              <div className="modal-body">
                <HistoricoSaldos></HistoricoSaldos>
              </div>
            </div>
          </div>
        </div>

        {/**fin modals */}

        <div className="row my-4">
          <div className="col-lg-12 col-md-10 mb-md-0 mb-4">
            <div className="card">
              <div className="card-header pb-0">
                <div className="row">
                  <div className="col-lg-6 col-7">
                    <h6>Mis gastos</h6>
                    <p className="text-sm mb-0">
                      <i className="fa fa-check text-info" aria-hidden="true"></i>
                      <span className="font-weight-bold ms-1">mis ultimos gastos</span> de este mes
                    </p>
                  </div>
                  <div className="col-lg-6 col-5 my-auto text-end">
                    <p className="align-middle">
                      <a href="/auth/consumo" className="text-secondary font-weight-bold text-xs" data-toggle="tooltip" data-original-title="Edit user">
                        Ver mas</a>
                    </p >
                  </div>
                </div>
              </div>

              <div className="card-body px-0 pb-2">
                <div className="table-responsive">
                  <table className="table align-items-center mb-0">
                    <thead>
                      <tr>
                        <th className="text-uppercase text-secondary text-xxs font-weight-bolder opacity-7">Nombre Gasto</th>
                        <th className="text-uppercase text-secondary text-xxs font-weight-bolder opacity-7 ps-2">Descripción</th>
                        <th className="text-center text-uppercase text-secondary text-xxs font-weight-bolder opacity-7">Cantidad</th>
                        <th className="text-center text-uppercase text-secondary text-xxs font-weight-bolder opacity-7">Valor Total</th>
                      </tr>
                    </thead>
                    <tbody>
                      {dataGasto && dataGasto.length > 0 ? (
                        dataGasto.map((gasto) => (
                          <tr key={gasto._id}>
                            <td>
                              <div className="d-flex px-2 py-1">
                                <div>
                                  <img src={imgCard} className="avatar avatar-sm me-3" alt="xd" />
                                </div>
                                <div className="d-flex flex-column justify-content-center">
                                  <h6 className="mb-0 text-sm">{gasto.name}</h6>
                                </div>
                              </div>
                            </td>
                            <td>
                              <div className="avatar-group mt-2">
                                <span className="text-xs font-weight-bold">{gasto.description}</span>
                              </div>
                            </td>
                            <td className="align-middle text-center text-sm">
                              <span className="text-xs font-weight-bold">{gasto.cantidad}</span>
                            </td>
                            <td className="align-middle text-center text-sm">
                              <span className="text-xs font-weight-bold">$ {gasto.valor}</span>
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan="4" className="text-center">No hay gastos.</td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>


            </div>
          </div>
        </div>
      </div>

    </>
  )
}
