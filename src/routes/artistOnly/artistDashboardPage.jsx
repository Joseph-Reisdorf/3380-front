import { React, useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useIsArtist } from '../../context/authInfo';
import { useAuth } from '../../context/authContext';
import axios from 'axios';
import { Chart } from 'chart.js/auto'; 
import AddAlbum from './addAlbumPage';
import { Routes, Route, Link } from "react-router-dom";

const ArtistDashboardPage = () => {
    const isArtist = useIsArtist();
    const { loggedIn, listenerId } = useAuth();
    const navigate = useNavigate();
    const [albumData, setAlbumData] = useState([]);
    const chartRef = useRef(null);

    useEffect(() => {
        const fetchAlbumLikes = async () => {
            try {
                const response = await axios.get(`${process.env.REACT_APP_BACK_URL}/albums/likes/${listenerId}`);
                setAlbumData(response.data);
            } catch (error) {
                console.error('Error fetching album likes:', error);
            }
        };

        if (loggedIn && isArtist) {
            fetchAlbumLikes();
        } else {
            navigate('/login');
        }
    }, [isArtist, loggedIn, listenerId, navigate]);

    useEffect(() => {
      
        if (albumData.length > 0) {
            drawBarGraph();
        } // eslint-disable-next-line
    }, [albumData]);

    const drawBarGraph = () => {
        const albumTitles = albumData.map(album => album.album_title);
        const albumLikeCounts = albumData.map(album => album.album_like_count);
    
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
                    label: 'Album Likes',
                    data: albumLikeCounts,
                    backgroundColor: 'rgba(54, 162, 235, 0.2)',
                    borderColor: 'rgba(54, 162, 235, 1)',
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
          <Link className="link" to={"add_album"}>Add Album</Link>
          <Routes>
            <Route path="add_album" element={<AddAlbum />} />
          </Routes>          
        </div>
        </div>
    );
};

export default ArtistDashboardPage;
