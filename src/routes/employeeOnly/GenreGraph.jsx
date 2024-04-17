import React, { useEffect, useRef } from 'react';
import { Chart } from 'chart.js/auto';

const GenreGraph = ({ data }) => {
  const chartRef = useRef(null); // To hold the chart instance

  const renderChart = () => {
    if (chartRef.current) {
      chartRef.current.destroy(); // Destroy the existing chart instance if it exists
    }

    const ctx = document.getElementById('genreChart').getContext('2d');
    chartRef.current = new Chart(ctx, {
      type: 'doughnut',
      data: {
        labels: data.map(genre => genre.genre_name),
        datasets: [{
          label: 'Most Listened Genres',
          data: data.map(genre => genre.listen_count),
          backgroundColor: ['#ff6384', '#36a2eb', '#cc65fe', '#ffce56', '#33ffcc'],
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
      }
    });
  };

  useEffect(() => {
    renderChart();
    return () => {
      if (chartRef.current) {
        chartRef.current.destroy(); // Clean up the chart when the component unmounts
      }
    };
  }, [data]); // Rerender chart when data changes

  return <canvas id="genreChart"></canvas>;
};

export default GenreGraph;
