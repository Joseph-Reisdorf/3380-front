import { React, useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useIsArtist } from '../../context/authInfo';
import { useAuth } from '../../context/authContext';
import axios from 'axios';
import { Chart } from 'chart.js/auto'; 
import { Routes, Route, Link } from "react-router-dom";

const ArtistDashboardPage = () => {
    const isArtist = useIsArtist();
    const { loggedIn, listenerId } = useAuth();
    const navigate = useNavigate();
    const [ageData, setAgeData] = useState([]);
    const chartRef = useRef(null);

    useEffect(() => {
        const fetchAgeData = async () => {
            try {
                const response = await axios.get(`${process.env.REACT_APP_BACK_URL}/dashboard/get_age_data/${listenerId}`);
                setAgeData(response.data);
            } catch (error) {
                console.error('Error fetching listeners ages:', error);
            }
        };

        if (loggedIn && isArtist) {
            fetchAgeData();
        } else {
            navigate('/login');
        }
    }, [isArtist, loggedIn, listenerId, navigate]);

    useEffect(() => {
      
        if (ageData.length > 0) {
            drawBarGraph();
        } // eslint-disable-next-line
    }, [ageData]);

    const drawBarGraph = () => {
        ageData.sort((a, b) => a.age - b.age) 
        const albumTitles = ageData.map(age => age.listener_age);
        const albumLikeCounts = ageData.map(age => age.count);
    
        const canvas = document.getElementById('albumLikesChart');
        const ctx = canvas.getContext('2d');
    
    
        if (chartRef.current !== null) {
         
            chartRef.current.destroy();
        }
    
        chartRef.current = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: albumTitles,
                datasets: [{
                    label: 'Followers Age Count',
                    data: albumLikeCounts,
                    backgroundColor: 'rgba(225, 97, 163, 0.8)',
                    borderColor: 'rgba(0, 0, 0, 1)',
                    borderWidth: 1
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    y: {
                        beginAtZero: true,
                        suggestedMax: 10, // album like num cap
                        ticks: {
                            stepSize: 1,
                            max: 50
                        }
                    }
                }
            }
        });
    };
    
    

    return (
        <div>
            <h1>Artist Dashboard</h1>
            <div>
                <canvas id="albumLikesChart" width="400" height="400"></canvas>
            </div>

            <div className='add-album'>
        </div>
        </div>
    );
};

export default ArtistDashboardPage;
