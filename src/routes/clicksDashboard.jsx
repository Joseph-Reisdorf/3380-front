import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../styles/ClicksDashboard.css';
import { useAuth } from '../context/authContext.mjs';

const ClicksDashboard = () => {
    const [startMonth, setStartMonth] = useState('');
    const [endMonth, setEndMonth] = useState('');
    const [albumClicks, setAlbumClicks] = useState([]);
    const { listenerId } = useAuth();

    const fetchAlbumReport = async () => {
        try {
            const response = await axios.get(`${process.env.REACT_APP_BACK_URL}/albumClicks/show_album_report/${listenerId}/${startMonth}/${endMonth}`);
            setAlbumClicks(response.data.data);
        } catch (error) {
            console.error('Error fetching album report:', error);
        }
    };

    useEffect(() => {
        fetchAlbumReport();
    }, []); // Fetch album report on component mount

    const handleSubmit = (event) => {
        event.preventDefault();
        fetchAlbumReport();
    };

    // Function to get unique album titles
    const getUniqueAlbumTitles = () => {
        const uniqueAlbumTitles = [...new Set(albumClicks.map(album => album.album_title))];
        return uniqueAlbumTitles;
    };

    return (
        <div className="clicks-dashboard-container">
            <div className="report-container">
                <h2>Clicks Report</h2>
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
                    <button type="submit">Generate Clicks Report</button>
                </form>
            </div>
            <h1>Album Clicks</h1>
            <div className="table-container">
                <table className="table">
                    <thead>
                        <tr className="table-header">
                            <th>Listener ID</th>
                            <th>Album Title</th>
                            <th>Click Date</th>
                        </tr>
                    </thead>
                    <tbody>
                        {albumClicks.map((album) => (
                            <tr className="table-row" key={album.listen_to_id}>
                                <td className="table-cell">{album.listen_to_listener_id}</td>
                                <td className="table-cell">{album.album_title}</td>
                                <td className="table-cell">{album.listen_to_datetime.substring(0, 10)}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            <div className="table-container">
                <h1>Album Click Counts</h1>
                <table className="table">
                    <thead>
                        <tr className="table-header">
                            <th>Album Title</th>
                            <th>Click Count</th>
                        </tr>
                    </thead>
                    <tbody>
                        {getUniqueAlbumTitles().map((title) => (
                            <tr className="table-row" key={title}>
                                <td className="table-cell">{title}</td>
                                <td className="table-cell">{albumClicks.filter(album => album.album_title === title).length}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default ClicksDashboard;
