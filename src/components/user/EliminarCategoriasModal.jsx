import React, { useEffect, useState } from 'react'
import { Global } from '../../helpers/Global';

export const EliminarCategoriasModal = () => {
    const [historicoCategorias, setHistoricoCategorias] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    const obtenerCategorias = async (page = 1) => {
        try {
            const response = await fetch(Global.url + 'category/list/' + page, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": localStorage.getItem("token")
                }
            });

            const data = await response.json();

            if (data.status === "success") {
                
                setHistoricoCategorias(data.categorias);
                setCurrentPage(data.page);
                setTotalPages(Math.ceil(data.totalDocs / data.itempage));

            }
        } catch (error) {
            console.error("Error al obtener las categorias:", error);
        }
    };

    useEffect(() => {
        obtenerCategorias();
    }, []); // Llamar a obtenerCategorias al montar el componente

    const paginaAnterior = () => {
        if (currentPage > 1) {
            obtenerCategorias(currentPage - 1);
        }
    };

    const paginaSiguiente = () => {
        if (currentPage < totalPages) {
            obtenerCategorias(currentPage + 1);
        }
    };


    const EliminarCategoria = async (categoriaId) => {
        try {
            const request = await fetch(Global.url + "category/delete/" + categoriaId, {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": localStorage.getItem("token")
                }
            })

            const data = await request.json()
            if (data.status === "success") {
                setHistoricoCategorias(data.total);
                obtenerCategorias();


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
                            <th>nombre</th>
                            <th>descripcion</th>
                            <th>Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {historicoCategorias && historicoCategorias.map((categoria) => (
                            <tr key={categoria._id}>
                                <td>{categoria.name}</td>
                                <td>{categoria.description}</td>
                                <td>
                                    {categoria.name !== "Sin Categoría" && ( 
                                        <div className="text-center">
                                            <button className="btn bg-gradient-dark mb-0" onClick={() => EliminarCategoria(categoria._id)}>
                                                <i className="fas fa-minus"></i><span>&nbsp;&nbsp;</span>
                                            </button>
                                        </div>
                                    )}
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


    )
}
