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
        console.log('detalle mes',detalleMes)

        const content = document.getElementById(`pdfContent-${mes}`);

        // Crear HTML para el PDF con el detalle del mes seleccionado
        const detalleHTML = `
            <h6 className="mb-1 text-dark font-weight-bold text-sm"> Mes ${detalleMes.mes} - Total Utilizado $${detalleMes.totalGastos}</h6>
            <ul>
                ${detalleMes.gastos.map((gasto) => `
                    <li key=${gasto._id}>
                    ${gasto.name}: $${gasto.valor}<br/>
                    Descripción: ${gasto.description}<br/>
                    Cantidad: ${gasto.cantidad}
                    </li>
                `).join('')}
            </ul>
        `;

        const pdfContent = document.createElement('div');
        pdfContent.innerHTML = detalleHTML;

        html2pdf().from(pdfContent).save(`Detalle_${mes}.pdf`);
    };


    return (
        <>
            <div className="card-body p-3 pb-0">
                {detalle.map((details) => (
                    <div key={`pdfContent-${details.mes}`}className="pdf-container">
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
