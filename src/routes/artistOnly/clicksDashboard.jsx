import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../../styles/clicksDashboard.css';
import { useAuth } from '../../context/authContext.mjs';

const ClicksDashboard = () => {
    const [startMonth, setStartMonth] = useState('');
    const [endMonth, setEndMonth] = useState('');
    const [selectedAlbum, setSelectedAlbum] = useState('');
    const [trackClicks, setTrackClicks] = useState([]);
    const [albumTitles, setAlbumTitles] = useState([]);
    const { userId } = useAuth();

    const fetchTrackReport = async () => {
        try {
            let url = `${process.env.REACT_APP_BACK_URL}/clicks/show_album_report/${userId}/${startMonth}/${endMonth}`;
            if (selectedAlbum !== '') {
                url += `/${selectedAlbum}`;
            }
            console.log("Fetching track report with URL:", url); 
            const response = await axios.get(url);
            console.log("Track report response:", response.data);
            setTrackClicks(response.data);
            console.log('trackClicks:', response.data);
        } catch (error) {
            console.error('Error fetching track report:', error);
        }
    };
    

   

    useEffect(() => {
        const fetchAlbumTitles = async () => {
            try {
                const response = await axios.get(`${process.env.REACT_APP_BACK_URL}/albums/find_albums_by_artist/${userId}`);
                setAlbumTitles(response.data);
                console.log('Album titles response:', response.data);
            } catch (error) {
                console.error('Error fetching album titles:', error);
            }
        };
        fetchAlbumTitles();
    }, [userId]);



    const handleSubmit = async (event) => {
        event.preventDefault();
        console.log("Submitting form to fetch track report...");
        await fetchTrackReport();
    };

    const countTrackPlays = () => {
        const playCountMap = {};
        const topListenerMap = {};
    
        if (trackClicks.data) {
            trackClicks.data.forEach((listen_to) => {
                const trackName = listen_to.track_name;
                const listenerUsername = listen_to.listener_username;
                const listenerEmail = listen_to.person_email;
    
                if (!playCountMap[trackName]) {
                    playCountMap[trackName] = 1;
                    topListenerMap[trackName] = { username: listenerUsername, email: listenerEmail, count: 1 };
                } else {
                    playCountMap[trackName]++;
                    if (playCountMap[trackName] > topListenerMap[trackName].count) {
                        topListenerMap[trackName] = { username: listenerUsername, email: listenerEmail, count: playCountMap[trackName] };
                    }
                }
            });
        }
        return { playCountMap, topListenerMap };
    };
    
    
    const { playCountMap, topListenerMap } = countTrackPlays();


    return (
        <div className="clicks-dashboard-container">
            <div className="report-container">
                <h2>Plays Report</h2>
                <form onSubmit={handleSubmit}>
                    <label htmlFor="reportStartDate">
                        Start Month:
                        <input
                            type="date"
                            id="reportStartDate"
                            onChange={(e) => {
                            console.log('Start Month updated:', e.target.value);
                            setStartMonth(e.target.value);
                            }}
                            value={startMonth}
                            required
                        />
                    </label>
                    <label htmlFor="reportEndDate">
                        End Month:
                        <input
                            type="date"
                            id="reportEndDate"
                            onChange={(e) => {
                            console.log('End Month updated:', e.target.value);
                            setEndMonth(e.target.value);
                            }}
                            value={endMonth}
                            required
                        />
                    </label>

                    <label htmlFor="selectedAlbum">
                        Select Album:
                        <select
                            id="selectedAlbum"
                            onChange={(e) => {
                            console.log('Selected Album updated:', e.target.value);
                            setSelectedAlbum(e.target.value);
                            }}
                            value={selectedAlbum}
    >
                            <option key="all" value="">All Albums</option>
                            {albumTitles.map(album => (
                            <option key={album.album_id} value={album.album_title}>{album.album_title}</option>
                            ))}
                        </select>
                    </label>
        
                    <button type="submit">Generate Clicks Report</button>
                </form>
            </div>
            <h1>Track Plays</h1>
            <div className="table-container">
                <table className="table">
                    <thead>
                        <tr className="table-header">
                            <th>Play Date</th>
                            <th>Track Name</th>
                            <th>Listener ID</th>
                            <th>Listener Username</th>
                        </tr>
                    </thead>
                    <tbody>
                        {Array.isArray(trackClicks.data) && trackClicks.data.map((listen_to) => (
                            <tr className="table-row" key={listen_to.listen_to_id}>
                                <td className="table-cell">{listen_to.listen_to_datetime.substring(0, 10)}</td>
                                <td className="table-cell">{listen_to.track_name}</td>
                                <td className="table-cell">{listen_to.listen_to_listener_id}</td>
                                <td className="table-cell">{listen_to.listener_username}</td>
                            </tr>
                            ))}
                    </tbody>
                </table>
            </div>
            <div className="table-container">
                <h1>Track Play Count</h1>
                <table className="table">
                    <thead>
                    <tr className="table-header">
                        <th>Track Name</th>
                        <th>Play Count</th>
                        <th>Top Listener</th> 
                        <th>Top Listener Email</th> 
                    </tr>
                </thead>
                <tbody>
                    {Object.keys(playCountMap).map((trackName) => (
                        <tr className="table-row" key={trackName}>
                            <td className="table-cell">{trackName}</td>
                            <td className="table-cell">{playCountMap[trackName]}</td>
                            <td className="table-cell">{topListenerMap[trackName] ? topListenerMap[trackName].username : '-'}</td>
                            <td className="table-cell">{topListenerMap[trackName] ? topListenerMap[trackName].email : '-'}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
            </div>
        </div>
    );
};

export default ClicksDashboard;