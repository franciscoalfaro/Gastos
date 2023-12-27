import React, { useEffect, useState } from 'react';
import { SerializeForm } from '../../helpers/SerializeForm';
import { Global } from '../../helpers/Global';
import { useForm } from '../../hooks/useForm';


export const Modal = ({ updateGastoList }) => {
  const { form, changed } = useForm()

  const updateGasto = async (e) => {
    e.preventDefault();
    const updateGastoUser = SerializeForm(e.target);
    const gastoId = updateGastoList._id;

    console.log(updateGastoList)


    try {
      const request = await fetch(Global.url + "bills/update/" + gastoId, {
        method: "PUT",
        body: JSON.stringify(updateGastoUser),
        headers: {
          "Content-Type": "application/json",
          'Authorization': localStorage.getItem('token')
        }
      });

      const data = await request.json();

      if (data.status === "success") {
        Swal.fire({
          position: 'center',
          icon: 'success',
          title: data.message,
          showConfirmButton: false,
          timer: 1150

        });
        setTimeout(() => { window.location.reload() }, 1200);



      } else {
        console.error('Error al obtener los datos:', data.message);
      }
    } catch (error) {
      console.error('Error al realizar la solicitud:', error);
    }
  };

  return (
    <>


      <div className="modal-body">
        {/* Campos de input en el cuerpo del modal */}
        <form id='update-gastos' onSubmit={updateGasto} >
          <div className="mb-3">
            <label htmlFor="name">Nombre:</label>
            <input type="text" name='' className="form-control" defaultValue={updateGastoList.name} onChange={changed}></input>
          </div>
          <div className="mb-3">
            <label htmlFor="description">Descripción:</label>
            <input type="text" name='description' className="form-control" defaultValue={updateGastoList.description} onChange={changed}></input>
          </div>
          <div className="mb-3">
            <label htmlFor="cantidad">Cantidad:</label>
            <input type="number" name='cantidad' className="form-control" defaultValue={updateGastoList.cantidad} onChange={changed}></input>
          </div>
          <div className="mb-3">
            <label htmlFor="categoria">Categoría:</label>
            <input type="text" name='categoria' className="form-control" defaultValue={updateGastoList.categoria?.name} onChange={changed}></input>
          </div>
          <div className="mb-3">
            <label htmlFor="valor">Valor:</label>
            <input type="number" name='valor' className="form-control" defaultValue={updateGastoList.valor} onChange={changed}></input>
          </div>
          <div className="mb-3">
            <label htmlFor="valor">Fecha del gasto:</label>
            {updateGastoList.fechagasto?(
              <input type="datetime-local" name="fechagasto" className="form-control" placeholder="fecha de gasto" aria-label="fechagasto" aria-describedby="gasto-addon" defaultValue={updateGastoList.fechagasto ? updateGastoList.fechagasto.split("T")[0] : ''} required onChange={changed}></input>
            ):(
              <input type="datetime-local" name="fechagasto" className="form-control" placeholder="fecha de gasto" aria-label="fechagasto" aria-describedby="gasto-addon" defaultValue={updateGastoList.fechagasto ? updateGastoList.create_at.split("T")[0] : ''} required onChange={changed}></input>
            )}
            
          </div>
          <div className="modal-footer">
            <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Cerrar</button>
            <button type="submit" className="btn btn-primary" onChange={changed} >Guardar Cambios</button>
          </div>
        </form>
      </div>



    </>
  );
};
