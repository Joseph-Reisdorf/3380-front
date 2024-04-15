import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import '../styles/AdminDashboard.css'
import { Chart } from 'chart.js/auto'; 

const AdminDashboard = () => {
    const [artists, setArtists] = useState([]);
    const [listeners, setListeners] = useState([]);
    const [startMonth, setStartMonth] = useState('');
    const [endMonth, setEndMonth] = useState('');
    const [artistData, setArtistData] = useState([]);
    const chartRef = useRef(null);


    useEffect(() => {
        const fetchArtistData = async () => {
            try {
                const response = await axios.get(`${process.env.REACT_APP_BACK_URL}/admin/generateArtistTable`);
                setArtistData(response.data.data);
            } catch (error) {
                console.error('Error artist joined month data:', error);
            }
        };
    
        fetchArtistData();
    }, []);

    useEffect(() => { 
        if (artistData.length > 0) {
            drawLineGraph();
        } // eslint-disable-next-line
    }, [artistData]);

    const drawLineGraph = () => {
        
        const artistRegistrationMonth = artistData.map(artist => artist.registration_month);
        const artistCount = artistData.map(artist => artist.new_artists_count);
    
        const canvas = document.getElementById('artistJoinedMonth');
        const ctx = canvas.getContext('2d');
    
    
        if (chartRef.current !== null) {
         
            chartRef.current.destroy();
        }
    
        chartRef.current = new Chart(ctx, {
            type: 'line',
            data: {
                labels: artistRegistrationMonth,
                datasets: [{
                    label: 'Number of Artists',
                    data: artistCount,
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

    const deleteArtist = async (artistId, artistDisplayName, artistRegistrationDate, artistBiography, followCount) => {
        try {
            await axios.delete(`${process.env.REACT_APP_BACK_URL}/admin/deleteArtist/${artistId}`, {
                data: {
                    artist_display_name: artistDisplayName,
                    artist_registration_date: artistRegistrationDate,
                    artist_biography: artistBiography,
                    follow_count: followCount
                }
            });
            
            alert("Artist Deleted!"); // Show a success message
            // Optionally, you can update the state or perform any other actions after deleting the artist
        } catch (error) {
            console.error('Error deleting artist:', error);
            // Handle error
        }
    };

    const deleteListener = async (listenerId) => {
        try {
            // Send a DELETE request to the server to delete the listener with the given ID
            await axios.delete(`${process.env.REACT_APP_BACK_URL}/admin/deleteListener/${listenerId}`);
            
            alert("Listener Deleted!"); // Show a success message
            // Optionally, you can update the state or perform any other actions after deleting the listener
        } catch (error) {
            console.error('Error deleting listener:', error);
            // Handle error
        }
    };

    const fetchArtistReport = async () => {
        try {
            const response = await axios.get(`${process.env.REACT_APP_BACK_URL}/admin/showArtistReport/${startMonth}/${endMonth}`);
            setArtists(response.data.data);
        } catch (error) {
            console.error('Error fetching artist report:', error);
        }
    };
    
    const handleSubmit = (event) => {
        event.preventDefault();
        fetchArtistReport();
    };

    const fetchListenerReport = async () => {
        try {
            const response = await axios.get(`${process.env.REACT_APP_BACK_URL}/admin/showListenerReport/${startMonth}/${endMonth}`);
            setListeners(response.data.data);
        } catch (error) {
            console.error('Error fetching listener report:', error);
        }
    };
    
    const handleSubmits = (event) => {
        event.preventDefault();
        fetchListenerReport();
    };
    
    
    return (
        <div className="admin-dashboard-container">
            <div className="report-container">
                <h2>Artist Report</h2>
                <form onSubmit={handleSubmit}>
                    <label htmlFor="reportStartDate">
                        Start Month:
                        <input
                            type="date"
                            id="reportStartDate"
                            onChange={(e) => setStartMonth(e.target.value)}
                            value={startMonth}
                            required
                        />
                    </label>
                    <label htmlFor="reportEndDate">
                        End Month:
                        <input
                            type="date"
                            id="reportEndDate"
                            onChange={(e) => setEndMonth(e.target.value)}
                            value={endMonth}
                            required
                        />
                    </label>
                    <button type="submit">Generate Artist Report</button>
                </form>
                {/* Render artist report here */}
            </div>
    <h1>All Artists Registered</h1>
    <div className="table-container">
        <table className="table">
            <thead>
                <tr className="table-header">
                    <th>Artist ID</th>
                    <th>Username</th>
                    <th>Registration Date</th>
                    <th>Actions</th> {/* Assuming this is for delete button */}
                </tr>
            </thead>
            <tbody>
                {artists.map((artist) => (
                    <tr className="table-row" key={artist.artist_id}>
                        <td className="table-cell">{artist.artist_id}</td>
                        <td className="table-cell">{artist.artist_display_name}</td>
                        <td className="table-cell">{artist.artist_registration_date.substring(0, 10)}</td>
                        <td className="table-cell">
                            <button onClick={() => deleteArtist(artist.artist_id)}>Delete</button>
                        </td>
                    </tr>
                ))}
            </tbody>
        </table>
    </div>
            <div className="report-container">
                <h2>Listener Report</h2>
                <form onSubmit={handleSubmits}>
                    <label htmlFor="listenerReportStartDate">
                        Start Month:
                        <input
                            type="date"
                            id="listenerReportStartDate"
                            onChange={(e) => setStartMonth(e.target.value)}
                            value={startMonth}
                            required
                        />
                    </label>
                    <label htmlFor="listenerReportEndDate">
                        End Month:
                        <input
                            type="date"
                            id="listenerReportEndDate"
                            onChange={(e) => setEndMonth(e.target.value)}
                            value={endMonth}
                            required
                        />
                    </label>
                    <button type="submit">Generate Listener Report</button>
                </form>
                {/* Render listener report here */}
            </div>
            <h1>All Listeners Registered</h1>
            <div className="table-container">
            <table className="table">
    <thead>
        <tr className="table-header">
            <th className="table-cell">Listener ID</th>
            <th className="table-cell">Username</th>
            <th className="table-cell">Registration Date</th>
            <th className="table-cell">Actions</th> {/* Assuming this is for delete button */}
        </tr>
    </thead>
    <tbody>
        {listeners.map((listener) => (
            <tr className="table-row" key={listener.listener_id}>
                <td className="table-cell">{listener.listener_id}</td>
                <td className="table-cell">{listener.listener_username}</td>
                <td className="table-cell">{listener.person_registration_date.substring(0, 10)}</td>
                <td className="table-cell">
                    <button onClick={() => deleteListener(listener.listener_id)}>Delete</button>
                </td>
            </tr>
        ))}
    </tbody>
</table>

</div>

           
<div className="graph-container">
    <h1>Artists Joined</h1>
    <div>
        <canvas id="artistJoinedMonth" width="1000" height="400"></canvas>
    </div>
</div>

           
        </div>
    );
    

};


export default AdminDashboard;
