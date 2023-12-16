import React, { useEffect, useState } from 'react';
import Chart from 'chart.js/auto';
import { Global } from '../../helpers/Global';

const Grafico = () => {
    const [consumos, setConsumos] = useState([]);
    

    useEffect(() => {
        const obtenerDatos = async () => {
            try {
                const request = await fetch(Global.url + "total/ultimosmeses", {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": localStorage.getItem("token")
                    }
                })
                const data = await request.json();
                const { consumosUltimos12Meses } = data;

                setConsumos(consumosUltimos12Meses);
            } catch (error) {
                console.error('Error al obtener los datos:', error);
            }
        };

        obtenerDatos();
    }, []);

    useEffect(() => {

        if (consumos.length > 0) {
            const ctx = document.getElementById("chart-bars").getContext("2d");
            const nombreMeses = [
                'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
                'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
              ];

            const barChart = new Chart(ctx, {
                type: "bar",
                data: {
                    labels: consumos.map(consumo => nombreMeses[consumo.month - 1]),
                    datasets: [{
                        label: 'consumo',
                        tension: 0.4,
                        borderWidth: 0,
                        borderRadius: 4,
                        borderSkipped: false,
                        backgroundColor: "#fff",
                        data: consumos.map(consumo => `${consumo.total}`),
                        maxBarThickness: 6
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                        legend: {
                            display: false,
                        }
                    },
                    interaction: {
                        intersect: false,
                        mode: 'index',
                    },
                    scales: {
                        y: {
                            grid: {
                                drawBorder: false,
                                display: false,
                                drawOnChartArea: false,
                                drawTicks: false,
                            },
                            ticks: {
                                suggestedMin: 0,
                                suggestedMax: 500,
                                beginAtZero: true,
                                padding: 15,
                                font: {
                                    size: 14,
                                    family: "Open Sans",
                                    style: 'normal',
                                    lineHeight: 2
                                },
                                color: "#fff"
                            },
                        },
                        x: {
                            grid: {
                                drawBorder: false,
                                display: false,
                                drawOnChartArea: false,
                                drawTicks: false
                            },
                            ticks: {
                                display: true
                            },
                        },
                    },
                },
            });

            return () => {
                barChart.destroy();
            };
        }
    }, [consumos]);

    return (
        <canvas id="chart-bars" className="chart-canvas" height="170"></canvas>
    );
};

export default Grafico;
