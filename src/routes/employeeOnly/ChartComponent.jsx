import React, { useEffect, useRef } from 'react';
import Chart from 'chart.js/auto'; 
const ChartComponent = ({ data }) => {
    const chartRef = useRef(null);

    useEffect(() => {
        if (data.length > 0) {
            const ctx = chartRef.current.getContext('2d');
            const labels = data.map(artist => artist.label);
            const values = data.map(artist => artist.value);

            // Create the chart
            new Chart(ctx, {
                type: 'bar', // Change chart type as needed
                data: {
                    labels: labels,
                    datasets: [{
                        label: 'Artist Data',
                        data: values,
                        backgroundColor: 'rgba(75, 192, 192, 0.2)', // Customize colors as needed
                        borderColor: 'rgba(75, 192, 192, 1)', // Customize colors as needed
                        borderWidth: 1
                    }]
                },
                options: {
                    scales: {
                        y: {
                            beginAtZero: true
                        }
                    }
                }
            });
        }
    }, [data]);

    return <canvas ref={chartRef}></canvas>;
};

export default ChartComponent;