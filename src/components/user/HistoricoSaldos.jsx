import React, { useEffect, useState } from 'react';
import { Global } from '../../helpers/Global';

export const HistoricoSaldos = () => {
    const [historico, setHistorico] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);


    const obtenerSaldos = async (page = 1) => {
        try {
            const response = await fetch(Global.url + 'saldo/list/' + page, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": localStorage.getItem("token")
                }
            });

            const data = await response.json();


            if (data.status === "success") {
                setHistorico(data.total);
                setCurrentPage(data.page);
                setTotalPages(Math.ceil(data.totalDocs / data.itempage));

            }
        } catch (error) {
            console.error("Error al obtener los saldos:", error);
        }
    };

    useEffect(() => {
        obtenerSaldos();
    }, []); // Llamar a obtenerSaldos al montar el componente

    const paginaAnterior = () => {
        if (currentPage > 1) {
            obtenerSaldos(currentPage - 1);
        }
    };

    const paginaSiguiente = () => {
        if (currentPage < totalPages) {
            obtenerSaldos(currentPage + 1);
        }
    };


    const EliminarSaldo = async (saldoId) => {
        try {
            const request = await fetch(Global.url + "saldo/delete/" + saldoId, {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": localStorage.getItem("token")
                }
            })

            const data = await request.json()
            if (data.status === "success") {
                setHistorico(data.total);
                obtenerSaldos();

            } else {
                console.log(data.message)
            }

        } catch (error) {

        }


    }
    return (
        <>
            <div className="modal-body">
                <table className="historico-table">
                    <thead className="bg-gradient-dark">
                        <tr>
                            <th>Monto</th>
                            <th>Mes</th>
                            <th>Año</th>
                            <th>Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {historico && historico.map((saldo) => (
                            <tr key={saldo._id}>
                                <td>{saldo.montoMensual}</td>
                                <td>{saldo.mes}</td>
                                <td>{saldo.ano}</td>
                                <td>
                                <div className="text-center">
                                    <button className="btn bg-gradient-dark mb-0" onClick={() => EliminarSaldo(saldo._id)}>
                                        <i className="fas fa-minus"></i><span>&nbsp;&nbsp;</span>
                                    </button>
                                </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                <div className="modal-footer">
                    <div className="text-center">
                        <a onClick={paginaAnterior} disabled={currentPage === 1} style={{ cursor: currentPage === 1 ? 'not-allowed' : 'pointer' }}>{"<< Anterior"}</a>
                        <span> {currentPage} </span>
                        <a onClick={paginaSiguiente} disabled={currentPage === totalPages} style={{ cursor: currentPage === totalPages ? 'not-allowed' : 'pointer' }}>{" Siguiente >>"}</a>
                    </div>
                </div>
            </div>
        </>
    );
};
