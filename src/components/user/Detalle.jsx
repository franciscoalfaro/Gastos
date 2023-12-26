import React, { useEffect, useState } from 'react'
import { Global } from '../../helpers/Global';
import html2pdf from 'html2pdf.js';

export const Detalle = () => {
    const [detalle, setDetalle] = useState([]);
    useEffect(() => {
        obtenerDetalle()

    }, [])


    const obtenerDetalle = async () => {
        try {
            const request = await fetch(Global.url + 'total/detalle', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': localStorage.getItem('token')
                }
            })
            const data = await request.json()
            if (data.status === "success") {
                setDetalle(data.detalleGastos)


            }

        } catch (error) {
            console.error('Error fetching data:', error);

        }
    }

    const generatePDF = async (mes) => {
        const detalleMes = detalle.find((details) => details.mes === mes); // Obtener el detalle del mes seleccionado
        if (!detalleMes) {
            console.error('No se encontró detalle para el mes seleccionado');
            return;
        }
   

        const content = document.getElementById(`pdfContent-${mes}`);

        // Crear HTML para el PDF con el detalle del mes seleccionado
        const detalleHTML = `
                <h6 style="text-align: center; margin-bottom: 10px;" className="mb-1 text-dark font-weight-bold text-sm"> Año ${detalleMes.ano} Mes ${detalleMes.mes}</h6>
                <table style="width: 100%; border-collapse: collapse; text-align: center;">
                    <thead style="background-color: lightgray;">
                        <tr>
                            <th style="border: 1px solid black; padding: 8px;">Nombre</th>
                            <th style="border: 1px solid black; padding: 8px;">Valor</th>
                            <th style="border: 1px solid black; padding: 8px;">Descripción</th>
                            <th style="border: 1px solid black; padding: 8px;">Cantidad</th>
                            <th style="border: 1px solid black; padding: 8px;">Fecha</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${detalleMes.gastos.map((gasto) => `
                            <tr key=${gasto._id}>
                                <td style="border: 1px solid black; padding: 8px;">${gasto.name}</td>
                                <td style="border: 1px solid black; padding: 8px;">$${gasto.valor}</td>
                                <td style="border: 1px solid black; padding: 8px;">${gasto.description}</td>
                                <td style="border: 1px solid black; padding: 8px;">${gasto.cantidad}</td>
                                <td style="border: 1px solid black; padding: 8px;">${gasto.create_at.split("T")[0]}</td>
                            </tr>
                        `).join('')}
                        <tr>
                        <td colspan="4"></td>
                        <td style="text-align: right; border: 1px solid black; padding: 8px;">
                            <p style="margin-bottom: 0; font-weight: bold;">Gasto Total $ ${detalleMes.totalGastos}</p>
                        </td>
                    </tr>
                    </tbody>
                </table>        
                `;


        const pdfContent = document.createElement('div');
        pdfContent.innerHTML = detalleHTML;

        html2pdf().from(pdfContent).save(`Detalle_${mes}.pdf`);
    };


    return (
        <>
            <div className="card-body p-3 pb-0">
                {detalle.map((details) => (
                    <div key={`pdfContent-${details.mes}`} className="pdf-container">
                        <div className="pdf-content">
                            <ul className="list-group">
                                <li key={`${details.ano}-${details.mes}`} className="list-group-item border-0 d-flex justify-content-between ps-0 mb-2 border-radius-lg">
                                    <div className="d-flex flex-column">
                                        <h6 className="mb-1 text-dark font-weight-bold text-sm">{details.mes}</h6>
                                        <span className="text-xs">${details.totalGastos}</span>
                                    </div>
                                    <div className="d-flex align-items-center text-sm">
                                        <button className="btn btn-link text-dark text-sm mb-0 px-0 ms-4" onClick={() => generatePDF(details.mes)}>
                                            <i className="fas fa-file-pdf text-lg me-1"></i> PDF
                                        </button>
                                    </div>
                                </li>
                            </ul>
                        </div>
                    </div>
                ))}
            </div>
        </>
    )
}
