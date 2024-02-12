import React, { useEffect, useState } from 'react'
import { Global } from '../../helpers/Global'
import { Modal } from './Modal';
import { GastoEntreFechas } from './GastoEntreFechas';



export const GastosList = ({ actualizarLista, updateTrigger }) => {
  const [dataGasto, setDataGasto] = useState([])
  const [actualizacion, setActualizacion] = useState(false);
  const [updateGastoList, setUpdateGastoList] = useState([])


  const openModal = (gasto) => {
    setUpdateGastoList(gasto);
    const miModal = new window.bootstrap.Modal(document.getElementById('miModal'));
    miModal.show();
  };


  useEffect(() => {
    listarGastosCreados()
  }, [updateTrigger, actualizarLista])

  //listar ultimos 10 gastos creados
  const listarGastosCreados = async () => {
    try {
      const request = await fetch(Global.url + 'bills/ultimos10', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': localStorage.getItem('token')
        }
      })

      const data = await request.json()

      if (data.status === "success") {
        setDataGasto(data.gastos)

      }




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
        listarGastosCreados()
        actualizarLista()
      }

    } catch (error) {
      console.error('Error al obtener los datos:', error);

    }


  }







  return (
    <>
      <div className="row">
        <div className="col-md-7 mt-4">
          <div className="card">
            <div className="card-header pb-0 px-3">
              <h6 className="mb-0">Gastos Creados</h6>
            </div>
            <div className="card-body pt-4 p-3">

              {dataGasto.length > 0 ? (
                dataGasto.map((gasto) => (

                  <ul className="list-group" key={gasto._id}>
                    <li className="list-group-item border-0 d-flex p-4 mb-2 bg-gray-100 border-radius-lg">
                      <div className="d-flex flex-column">
                        <span className="mb-2 text-xs">Nombre <span className="text-dark font-weight-bold ms-sm-2">{gasto.name}</span></span>
                        <span className="mb-2 text-xs">description <span className="text-dark font-weight-bold ms-sm-2">{gasto.description}</span></span>
                        <span className="mb-2 text-xs">cantidad <span className="text-dark ms-sm-2 font-weight-bold">{gasto.cantidad}</span></span>
                        <span className="mb-2 text-xs">categoria <span className="text-dark ms-sm-2 font-weight-bold">{gasto?.categoria?.name ?? ''}</span></span>


                        {gasto.fechagasto ? (
                          <span className="mb-2 text-xs">Fecha Gasto <span className="text-dark ms-sm-2 font-weight-bold"> {gasto.fechagasto.split("T")[0]}</span></span>

                        ) : (
                          <span className="mb-2 text-xs">Fecha Gasto <span className="text-dark ms-sm-2 font-weight-bold"> {gasto.create_at.split("T")[0]}</span></span>

                        )}

                        <span className="text-xs">Valor <span className="text-dark ms-sm-2 font-weight-bold">$ {gasto.valor}</span></span>

                      </div>
                      <div className="ms-auto text-end">
                        <a className="btn btn-link text-danger text-gradient px-3 mb-0" onClick={() => deleteGasto(gasto._id)}><i className="far fa-trash-alt me-2"></i>Eliminar</a>

                        <a className="btn btn-link text-dark px-3 mb-0" onClick={() => openModal(gasto)}><i className="fas fa-pencil-alt text-dark me-2" type="submit" aria-hidden="true"></i>Editar</a>

                      </div>
                    </li>
                  </ul>

                ))
              ) : (
                <p colSpan="4" className="text-center">No hay gastos creados.</p>
              )}
            </div>

          </div>
        </div>

        {/*modal */}

        <div className="modal" id="miModal" tabIndex="-1" >
          <div className="modal-dialog" >
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Editar Gasto</h5>
                <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
              </div>
              <div className="modal-body">
                <Modal updateGastoList={updateGastoList} setDataGasto={setDataGasto} ></Modal>
              </div>
            </div>
          </div>
        </div>

        {/*fin moodal */}


        < div className="col-md-5 mt-4" >
            <GastoEntreFechas></GastoEntreFechas>
        </div>

      </div >

    </>

  )
}
