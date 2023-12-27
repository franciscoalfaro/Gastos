import React, { useEffect, useState } from 'react'
import useAuth from '../../hooks/useAuth'
import ReactTimeAgo from 'react-time-ago'
import { NavLink } from 'react-router-dom';
import { Global } from '../../helpers/Global';
import avatar from '../../assets/img/default.png'

import imgCard from '../../assets/img/small-logos/contabilidad.png'


export const Consumo = ({ actualizarLista, updateTrigger }) => {


  const { auth } = useAuth()
  const [dataGasto, setDataGasto] = useState([])
  const [gastoDelete, setGastoDelete] = useState([])
  const [actualizacion, setActualizacion] = useState(false);

  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPage] = useState(1)

  useEffect(() => {
    gastoData()
  }, [gastoDelete])

  useEffect(() => {
  }, [updateTrigger, actualizarLista])


  const paginaAnterior = () => {
    if (currentPage > 1) {
      gastoData(currentPage - 1)
    }

  }

  const paginaSiguiente = () => {
    if (currentPage < totalPages) {
      gastoData(currentPage + 1)

    }
  }


  const gastoData = async (page = 1) => {

    try {
      const request = await fetch(Global.url + "bills/ultimosgastos/" + page, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "Authorization": localStorage.getItem("token")
        }
      })
      const data = await request.json()
      setDataGasto(data.gastos)
      setTotalPage(data.totalPages)
      setCurrentPage(page)



    } catch (error) {
      console.error('Error al obtener los datos:', error);

    }
  }


  //eliminar gastos
  const deleteGasto = async (gastoId) => {

    try {
      const request = await fetch(Global.url + 'bills/delete/' + gastoId, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': localStorage.getItem('token')
        }

      })
      const data = await request.json()



      if (data.status === 'success') {
        setGastoDelete(data)

      }

    } catch (error) {
      console.error('Error al obtener los datos:', error);

    }


  }


  return (
    <>
      <div className="container-fluid py-4">
        <div className="row">
          <div className="col-12">
            <div className="card mb-4">
              <div className="card-header pb-0">
                <h6>Tabla de gastos</h6>
              </div>
              <div className="card-body px-0 pt-0 pb-2">
                <div className="table-responsive p-0">
                  <table className="table align-items-center mb-0">
                    <thead>
                      <tr>
                        <th className="text-uppercase text-secondary text-xxs font-weight-bolder opacity-7">Nombre/email</th>
                        <th className="text-uppercase text-secondary text-xxs font-weight-bolder opacity-7 ps-2">nick</th>
                        <th className="text-center text-uppercase text-secondary text-xxs font-weight-bolder opacity-7">Status</th>
                        <th className="text-center text-uppercase text-secondary text-xxs font-weight-bolder opacity-7">Cuenta creada</th>
                        <th className="text-secondary opacity-7"></th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td>
                          <div className="d-flex px-2 py-1">
                            <div className='imgTabla'>
                              {auth.image == 'default.png' && <img src={avatar} className="img-fluid img-thumbnail " alt="Foto de perfil"></img>}
                              {auth.image != 'default.png' && <img src={Global.url + "user/avatar/" + auth.image} className="img-fluid img-thumbnail" alt="Foto de perfil"></img>}
                            </div>
                            <div className="d-flex flex-column justify-content-center">
                              <h6 className="mb-0 text-sm">{auth.name}</h6>
                              <p className="text-xs text-secondary mb-0">{auth.email}</p>
                            </div>
                          </div>
                        </td>
                        <td>
                          <p className="text-xs font-weight-bold mb-0">{auth.nick}</p>
                        </td>
                        <td className="align-middle text-center text-sm">
                          <span className="badge badge-sm bg-gradient-success">Online</span>
                        </td>
                        <td className="align-middle text-center">
                          <span className="text-secondary text-xs font-weight-bold"><ReactTimeAgo date={new Date(auth.create_at).getTime()} /></span>
                        </td>
                        <td className="align-middle">
                          <NavLink to="/auth/perfil" className="text-secondary font-weight-bold text-xs" data-toggle="tooltip" data-original-title="Edit user">
                            Editar Perfil
                          </NavLink>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="row">
          <div className="col-12">
            <div className="card mb-4">
              <div className="card-header pb-0">
                <h6>Tabla de gastos</h6>
              </div>
              <div className="card-body px-0 pt-0 pb-2">
                <div className="table-responsive p-0">
                  <table className="table align-items-center justify-content-center mb-0">
                    <thead>
                      <tr>
                        <th className="text-uppercase text-secondary text-xxs font-weight-bolder opacity-7">Nombre Gasto</th>
                        <th className="text-uppercase text-secondary text-xxs font-weight-bolder opacity-7 ps-2">Descripción</th>
                        <th className="text-uppercase text-secondary text-xxs font-weight-bolder opacity-7 align-middle text-center">Cantidad</th>
                        <th className="text-uppercase text-secondary text-xxs font-weight-bolder text-center opacity-7">Valor Total</th>
                        <th className="text-uppercase text-secondary text-xxs font-weight-bolder text-center opacity-7">Fecha del Gasto</th>
                        <th></th>
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
                              <span className="text-xs font-weight-bold">{gasto.description}</span>
                            </td>
                            <td className="align-middle text-center text-sm">
                              <span className="text-xs font-weight-bold">{gasto.cantidad}</span>
                            </td>
                            <td className="align-middle text-center text-sm">
                              <span className="text-xs font-weight-bold">$ {gasto.valor}</span>
                            </td>
                            <td className="align-middle text-center text-sm">
                           
                              <div>
                                {gasto.fechagasto ? (
                                  <span className="text-xs font-weight-bold">{gasto.fechagasto.split("T")[0]}</span>
                                ) : (
                                  <span className="text-xs font-weight-bold">{gasto.create_at.split("T")[0]}</span>
                                )}
                              </div>
                            </td>
                            <td className="ms-auto text-end">
                              <a className="btn btn-link text-danger text-gradient px-3 mb-0" onClick={() => deleteGasto(gasto._id)}><i className="far fa-trash-alt me-2"></i>Eliminar</a>
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
                  <div className="text-center"> {/* Contenedor centrado */}
                    <a onClick={paginaAnterior} disabled={currentPage === 1} style={{ cursor: currentPage === totalPages ? 'pointer' : '' }}>{"<<  "}</a>
                    <span>Página {currentPage} de {totalPages}</span>
                    <a onClick={paginaSiguiente} disabled={currentPage === totalPages} style={{ cursor: currentPage === totalPages ? '' : 'pointer' }}>{" >>"} </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

    </>

  )
}
