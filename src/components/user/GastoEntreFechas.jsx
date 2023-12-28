import React, { useEffect, useState } from 'react'
import { useForm, } from '../../hooks/useForm'
import useAuth from '../../hooks/useAuth'
import { Global } from '../../helpers/Global'



export const GastoEntreFechas = () => {
    const { auth } = useAuth();
    const { form, changed } = useForm();
    const [fechas, setFechas] = useState({ fechaInicial: '', fechaFinal: '' });
    const [resultadoFechas, setResultadoFechas] = useState([])

    useEffect(() => {
        if (!fechas.fechaInicial || !fechas.fechaFinal) {
            const fechaHoy = new Date().toISOString().split('T')[0]; // Fecha actual
            const fechaUnaSemanaAtras = new Date(new Date().getTime() - (7 * 24 * 60 * 60 * 1000)).toISOString().split('T')[0]; // se setea desde una semana atras
            setFechas({ fechaInicial: fechaUnaSemanaAtras, fechaFinal: fechaHoy });
        }else{
             busquedaFechas({ value: fechas.fechaInicial }, { value: fechas.fechaFinal });
        }
       
    }, [fechas]);

    //se setean las fecha inicial y final (campo:fechaInicial o fin, y el valor de la fecha)
    const actualizarFechas = (campo, valor) => {
        setFechas({ ...fechas, [campo]: valor });
        changed({ target: { name: campo, value: valor } });
    };


    const busquedaFechas = async (fechaInicio, fechaFin) => {
        const fechaIni = fechaInicio.value;
        const fechaFinal = fechaFin.value;

        const request = await fetch(Global.url + 'total/fechas', {
            method: "POST",
            body: JSON.stringify({ fechaInicio: fechaIni, fechaFin: fechaFinal }),
            headers: {
                "Content-Type": "application/json",
                "Authorization": localStorage.getItem("token")
            }
        });
        const data = await request.json();
        if (data.status === "success") {
            setResultadoFechas(data.gastos)

        }
    };



    return (
        <>
            <div className="card h-100 mb-4">
                <div className="card-header pb-0 px-3">
                    <div className="row">
                        <div className="col-md-6">
                            <h6 className="mb-0">Ultimos Gastos</h6>
                        </div>

                    </div>
                </div>
                <div className="col-md-10 d-flex align-items-center inputFechas">
                    <i className="far fa-calendar-alt me-2"></i>
                    <input type="date" id='fechaInicial' name="fechaInicial" className="form-control" placeholder="fechaInicial" aria-label="fechaInicial" aria-describedby="fechaInicial-addon" required value={fechas.fechaInicial} onChange={(e) => actualizarFechas('fechaInicial', e.target.value)} />
                    <input type="date" id='fechaFinal' name="fechaFinal" className="form-control" placeholder="fechaFinal" aria-label="fechaFinal" aria-describedby="fechaFinal-addon" required value={fechas.fechaFinal} onChange={(e) => actualizarFechas('fechaFinal', e.target.value)} />
                    <button className='btn bg-gradient-dark mb-0' onClick={() => busquedaFechas({ value: fechas.fechaInicial }, { value: fechas.fechaFinal })}>Traer</button>
                </div>
                <div className="card-body pt-4 p-3">
                    <ul className="list-group">
                        {resultadoFechas.length > 0 ? (
                            <li className="list-group-item border-0 d-flex justify-content-between ps-0 mb-2 border-radius-lg">
                                <div className="fw-bold">Nombre</div>
                                <div className="fw-bold">Valor</div>
                                <div className="fw-bold">Fecha de Gasto</div>
                            </li>
                        ) : (
                            <p>No hay gastos entre estas fechas</p>
                        )}
                        {resultadoFechas.map((gasto) => (
                            <li key={gasto._id} className="list-group-item border-0 d-flex justify-content-between ps-0 mb-2 border-radius-lg">
                                <div>{gasto.name}</div>
                                <div>${gasto.valor}</div>
                                <div>{gasto.fechagasto.split('T')[0]}</div>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>

        </>
    )
}
