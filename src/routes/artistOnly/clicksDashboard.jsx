import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../../styles/clicksDashboard.css';
import { useAuth } from '../../context/authContext.mjs';

const ClicksDashboard = () => {
    const [startMonth, setStartMonth] = useState('');
    const [endMonth, setEndMonth] = useState('');
    const [albumClicks, setAlbumClicks] = useState([]);
    const { userId } = useAuth();

    const fetchAlbumReport = async () => {
        console.log(userId, startMonth, endMonth)
        try {
            const response = await axios.get(`${process.env.REACT_APP_BACK_URL}/clicks/show_album_report/${userId}/${startMonth}/${endMonth}`);
            setAlbumClicks(response.data.data);
            console.log(albumClicks)
        } catch (error) {
            console.error('Error fetching album report:', error);
        }
    };

    useEffect(() => {
        fetchAlbumReport();
    }, []); // not sure about this

    const handleSubmit = (event) => {
        event.preventDefault();
        fetchAlbumReport();
    };


    const getUniqueAlbumTitles = () => {
        const uniqueAlbumTitles = [...new Set(albumClicks.map(album => album.track_name))];
        return uniqueAlbumTitles;
    };

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
            <h1>Track Plays</h1>
            <div className="table-container">
                <table className="table">
                    <thead>
                        <tr className="table-header">
                            <th>Listener ID</th>
                            <th>Track Name</th>
                            <th>Play Date</th>
                        </tr>
                    </thead>
                    <tbody>
                        {albumClicks.map((album) => (
                            <tr className="table-row" key={album.listen_to_id}>
                                <td className="table-cell">{album.listen_to_listener_id}</td>
                                <td className="table-cell">{album.track_name}</td>
                                <td className="table-cell">{album.listen_to_datetime.substring(0, 10)}</td>
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
                        </tr>
                    </thead>
                    <tbody>
                        {getUniqueAlbumTitles().map((title) => (
                            <tr className="table-row" key={title}>
                                <td className="table-cell">{title}</td>
                                <td className="table-cell">{albumClicks.filter(album => album.track_name === title).length}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default ClicksDashboard;