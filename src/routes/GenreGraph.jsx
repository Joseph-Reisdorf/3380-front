import React, { useState } from 'react';
import axios from 'axios';
import { Chart } from 'chart.js/auto';

const GenreGraph = () => {
  const [genreData, setGenreData] = useState([]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.get(`${process.env.REACT_APP_BACK_URL}/mostListenedGenres`);
      const data = response.data;
      setGenreData(data);
      renderChart(data);
    } catch (error) {
      console.error('Error fetching most listened genres:', error);
    }
  };

  const renderChart = (data) => {
    const ctx = document.getElementById('genreChart').getContext('2d');
    new Chart(ctx, {
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
        // Add other chart options as needed
      }
    });
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <button type="submit">Generate Graph</button>
      </form>
      <div>
        <canvas id="genreChart"></canvas>
      </div>
    </div>
  );
};

export default GenreGraph;
