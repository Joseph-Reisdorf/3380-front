import React, { useEffect, useRef } from 'react';
import { Chart, ArcElement, Tooltip, Legend } from 'chart.js';

// Register the components needed by Chart.js
Chart.register(ArcElement, Tooltip, Legend);

const GenreGraph = ({ data }) => {
  const chartRef = useRef(null); // To hold the chart instance
  const canvasRef = useRef(null); // To hold the canvas DOM element

  useEffect(() => {
    if (!canvasRef.current) return; // Ensure the canvas ref is attached

    const ctx = canvasRef.current.getContext('2d');
    if (chartRef.current) {
      chartRef.current.destroy(); // Destroy the existing chart instance if it exists
    }

    // Create a new Chart instance
    chartRef.current = new Chart(ctx, {
      type: 'doughnut',
      data: {
        labels: data.map(genre => genre.genre_name),
        datasets: [{
          label: 'Most Listened Genres',
          data: data.map(genre => genre.listen_count),
          backgroundColor: [
            '#ff6384', 
            '#36a2eb', 
            '#cc65fe', 
            '#ffce56', 
            '#33ffcc',
            '#4bc0c0',
            '#ff9f40',
            '#ffcd56',
            '#c9cbcf',
            '#36a2eb'
          ],
          hoverOffset: 4
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: 'top',
          },
        }
      }
    });

    return () => {
      if (chartRef.current) {
        chartRef.current.destroy(); // Clean up the chart when the component unmounts
      }
    };
  }, [data]); // Rerender chart when data changes

  return <canvas ref={canvasRef} id="genreChart"></canvas>;
};

export default GenreGraph;
