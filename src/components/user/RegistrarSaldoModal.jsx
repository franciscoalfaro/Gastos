import React, { useEffect, useState } from 'react'

import { Global } from '../../helpers/Global';
import { useForm } from '../../hooks/useForm';
import useAuth from '../../hooks/useAuth';

export const RegistrarSaldoModal = () => {
    const { auth } = useAuth()
    const { form, changed } = useForm()
    const [crearSaldoAnterior, setCrearSaldoAnterior] = useState([])


    useEffect(() => {

    }, [crearSaldoAnterior])

    const registrarSaldoAnterior = async (e) => {
        e.preventDefault();
        let saldoAnterior = form
  
        const request = await fetch(Global.url + 'saldo/register/', {
            method: "POST",
            body: JSON.stringify(saldoAnterior),
            headers: {
                'Content-Type': 'application/json',
                'Authorization': localStorage.getItem('token')

            }
        })
        const data = await request.json()

        if (data.status === "success") {
            setCrearSaldoAnterior(data)
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


        const myForm = document.querySelector("#registrosaldoanterior-form")
        myForm.reset()

    }


    return (
        <>
            <div className="modal-body">
                {/* Campos de input en el cuerpo del modal */}
                <form id='registrosaldoanterior-form' onSubmit={registrarSaldoAnterior}>
                    <div className="text-sm">
                        <input type="text" name="montoMensual" htmlFor='montoMensual' className="form-control" placeholder="Saldo" aria-label="saldo" aria-describedby="saldo-addon" required onChange={changed}></input> <br></br>
                        <input type="number" min="1" max="12" name="mes" htmlFor='mes' className="form-control" placeholder="Mes" aria-label="tope" aria-describedby="mes-addon" onChange={changed}></input><br></br>
                        <input type="text" name="ano" htmlFor='ano' className="form-control" placeholder="Año" aria-label="ano" aria-describedby="ano-addon" onChange={changed}></input><br></br>
                    </div>
                    <div className="modal-footer">
                        <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Cerrar</button>
                        <button type="submit" className="btn btn-primary" onChange={changed} >Guardar Saldo</button>
                    </div>
                </form>
            </div>
        </>
    )
}
