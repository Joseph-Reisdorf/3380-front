import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import '../../styles/ArtistListenerReportPage.css'
import { Chart } from 'chart.js/auto';
import { useAuth } from '../../context/authContext';
import { useNavigate } from 'react-router-dom';


const ArtistListenerReportPage = () => {
    const [artists, setArtists] = useState([]);
    const [listeners, setListeners] = useState([]);
    const [startMonth, setStartMonth] = useState('');
    const [endMonth, setEndMonth] = useState('');
    const [artistData, setArtistData] = useState([]);
    const [gotGraph, setGotGraph] = useState(false);

    const chartRef = useRef(null);

    const navigate = useNavigate();
    const { loggedIn, userId, userRole, loading } = useAuth();

    useEffect(() => {
        if (!loading && loggedIn) {
            const verified = userRole === 'a' || userRole === 'x';
            if (!verified) {
                navigate('/');
            } else {
                fetchArtistData();  // Fetch data when component mounts and user is verified
            }
        }
    }, [loggedIn, loading, userRole, navigate]); // Depend on user's login status and their role

    useEffect(() => {
        if (!gotGraph && artistData.length > 0) {
            handleGenerateGraph(); // Trigger graph generation when artist data is set
        }
    }, [artistData, gotGraph]); // Depend on artistData and gotGraph status


    const fetchArtistData = async () => {
        try {
            const response = await axios.get(`${process.env.REACT_APP_BACK_URL}/admin/generateArtistGraph`);
            setArtistData(response.data.data);
        } catch (error) {
            console.error('Error fetching artist data:', error);
        }
    };

    const handleGenerateGraph = () => {
        if (artistData.length === 0 || gotGraph) {
            fetchArtistData();
            return;
        }

        const canvas = document.getElementById('artistJoinedMonth');
        const ctx = canvas.getContext('2d');

        if (chartRef.current) {
            chartRef.current.destroy();
        }

        chartRef.current = new Chart(ctx, {
            type: 'doughnut',
            data: {
                labels: artistData.map(artist => artist.registration_month),
                datasets: [{
                    label: 'Number of Artists',
                    data: artistData.map(artist => artist.new_artists_count),
                    backgroundColor: ["#bd6f77", "#6f9bc9", "#78d6ac", "#9ddb76", "#d7e378", "#e3bf78", "#e39c78", "#cc78e3", "#f781c6", "#8187f7", "#81bef7", "#81f78b", "#5f5fc7", "#111111", "#AAAAAA"],
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
                    
                        suggestedMax: 10,
                        ticks: {
                            stepSize: 1,
                            max: 50
                        }
                    }
                }
            }
        });
        setGotGraph(true);
    };

    const handleDeleteArtist = async (artistId, artistDisplayName, artistRegistrationDate, artistBiography, followCount) => {
        try {
            await axios.delete(`${process.env.REACT_APP_BACK_URL}/admin/deleteArtist/${artistId}`, {
                data: {
                    artist_display_name: artistDisplayName,
                    artist_registration_date: artistRegistrationDate,
                    artist_biography: artistBiography,
                    follow_count: followCount
                }
            });
            alert("Artist Deleted!");
        } catch (error) {
            console.error('Error deleting artist:', error);
        }
    };

    const handleDeleteListener = async (listenerId) => {
        try {
            await axios.delete(`${process.env.REACT_APP_BACK_URL}/admin/deleteListener/${listenerId}`);
            alert("Listener Deleted!");
        } catch (error) {
            console.error('Error deleting listener:', error);
        }
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        await fetchArtistData();
        await fetchArtistReport();
        await fetchListenerReport();
    };

    const fetchArtistReport = async () => {
        try {
            const response = await axios.get(`${process.env.REACT_APP_BACK_URL}/admin/showArtistReport/${startMonth}/${endMonth}`);
            setArtists(response.data.data);
        } catch (error) {
            console.error('Error fetching artist report:', error);
        }
    };

    const fetchListenerReport = async () => {
        try {
            const response = await axios.get(`${process.env.REACT_APP_BACK_URL}/admin/showListenerReport/${startMonth}/${endMonth}`);
            setListeners(response.data.data);
        } catch (error) {
            console.error('Error fetching listener report:', error);
        }
    };


    return (
        <div className="admin-dashboard-container">
            <div className="report-container">
                <h2>Artist/Listener Report</h2>
                <form onSubmit={handleSubmit}>
                    <label htmlFor="reportStartDate">Start Date:</label>
                    <input
                        type="date"
                        id="reportStartDate"
                        onChange={(e) => setStartMonth(e.target.value)}
                        value={startMonth}
                        required
                    />
                    <label htmlFor="reportEndDate">End Date:</label>
                    <input
                        type="date"
                        id="reportEndDate"
                        onChange={(e) => setEndMonth(e.target.value)}
                        value={endMonth}
                        required
                    />
                    <button type="submit">Generate Artist Report</button>
                </form>
            </div>
            <div className="table-container">
                <h2>All Artists Registered</h2>
                <table className="table">
                    <thead>
                        <tr className="table-header">
                            <th>Artist ID</th>
                            <th>Username</th>
                            <th>Registration Date</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {artists.map((artist) => (
                            <tr className="table-row" key={artist.artist_id}>
                                <td className="table-cell">{artist.artist_id}</td>
                                <td className="table-cell">{artist.artist_display_name}</td>
                                <td className="table-cell">{artist.artist_registration_date.substring(0, 10)}</td>
                                <td className="table-cell">
                                    <button onClick={() => handleDeleteArtist(artist.artist_id)}>
                                        Delete
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            <div className="table-container">
                <h2>All Listeners Registered</h2>
                <table className="table">
                    <thead>
                        <tr className="table-header">
                            <th>Listener ID</th>
                            <th>Username</th>
                            <th>Registration Date</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {listeners.map((listener) => (
                            <tr className="table-row" key={listener.listener_id}>
                                <td className="table-cell">{listener.listener_id}</td>
                                <td className="table-cell">{listener.listener_username}</td>
                                <td className="table-cell">{listener.person_registration_date.substring(0, 10)}</td>
                                <td className="table-cell">
                                    <button onClick={() => handleDeleteListener(listener.listener_id)}>
                                        Delete
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            <div className="graph-container">
                <h1>Artists Joined</h1>
                <div style={{ height: '500px' }}>
                    <canvas id="artistJoinedMonth" width="1500" height="400"></canvas>
                </div>
            </div>
        </div>
    );



};


export default ArtistListenerReportPage;