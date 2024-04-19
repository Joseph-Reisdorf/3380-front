import React, { useState } from 'react';
import axios from 'axios';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import '../../styles/artistRankingReportPage.css';

const ArtistReport = () => {
    const [startDate, setStartDate] = useState(new Date());
    const [endDate, setEndDate] = useState(new Date());
    const [reportData, setReportData] = useState([]);

    // Function to fetch artist ranking by tracks
    const fetchArtistRankingByTracks = async (startDate, endDate) => {
        try {
            const response = await axios.get(`${process.env.REACT_APP_BACK_URL}/artists/get_artist_ranking_by_tracks/${startDate}/${endDate}`, {
                params: {
                    start_date: startDate,
                    end_date: endDate,
                }
            });
            return response.data;
        } catch (error) {
            console.error('Error fetching artist ranking by tracks:', error);
            return [];
        }
    };

    // Function to fetch artist ranking by albums
    const fetchArtistRankingByAlbums = async (startDate, endDate) => {
        try {
            const response = await axios.get(`${process.env.REACT_APP_BACK_URL}/artists/get_artist_ranking_by_albums/${startDate}/${endDate}`, {
                params: {
                    start_date: startDate,
                    end_date: endDate,
                }
            });
            return response.data;
        } catch (error) {
            console.error('Error fetching artist ranking by albums:', error);
            return [];
        }
    };

    const fetchArtistRankingByListens = async (startDate, endDate) => {
        try {
            const response = await axios.get(`${process.env.REACT_APP_BACK_URL}/artists/get_artist_ranking_by_listens/${startDate}/${endDate}`, {
                params: {
                    start_date: startDate,
                    end_date: endDate,
                }
            });
            return response.data;
        } catch (error) {
            console.error('Error fetching artist ranking by listens:', error);
            return [];
        }
    };

    // Main handleSubmit function
    const handleSubmit = async (e) => {
        e.preventDefault();
        const formattedStartDate = startDate.toISOString().split('T')[0];
        const formattedEndDate = endDate.toISOString().split('T')[0];

        try {
            const tracksData = await fetchArtistRankingByTracks(formattedStartDate, formattedEndDate);
            const albumsData = await fetchArtistRankingByAlbums(formattedStartDate, formattedEndDate);

            // Set the report data
            setReportData({ tracks: tracksData, albums: albumsData });
        } catch (error) {
            console.error('Error fetching artist ranking report:', error);
        }
    };

    return (
        <div className="admin-dashboard-container">
            <div className="report-container">
                <h2>Artist Ranking Report</h2>
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label htmlFor="startDate">Start Date:</label>
                        <DatePicker
                            id="startDate"
                            selected={startDate}
                            onChange={(date) => setStartDate(date)}
                            dateFormat="MM/dd/yyyy"
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="endDate">End Date:</label>
                        <DatePicker
                            id="endDate"
                            selected={endDate}
                            onChange={(date) => setEndDate(date)}
                            dateFormat="MM/dd/yyyy"
                        />
                    </div>
                    <button type="submit">Generate Report</button>
                </form>
            </div>
            {reportData.tracks && (
                <div className="table-container">
                    <h3>Aritst Ranking By Tracks</h3>
                    <table className="table">
                        <thead>
                            <tr className="table-header">
                                <th>Name</th>
                                <th>Email</th>
                                <th>Birthdate</th>
                                <th>Number of Tracks</th>
                            </tr>
                        </thead>
                        <tbody>
                            {reportData.tracks.map((artist) => (
                                <tr className="table-row" key={artist.person_id}>
                                    <td className="table-cell">{artist.full_name}</td>
                                    <td className="table-cell">{artist.person_email}</td>
                                    <td className="table-cell">{artist.person_birthdate.substring(0, 10)}</td>
                                    <td className="table-cell">{artist.number_of_tracks}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
            {reportData.albums && (
                <div className="table-container">
                    <h3>Aritst Ranking By Albums</h3>
                    <table className="table">
                        <thead>
                            <tr className="table-header">
                                <th>Name</th>
                                <th>Email</th>
                                <th>Birthdate</th>
                                <th>Number of Albums</th>
                            </tr>
                        </thead>
                        <tbody>
                            {reportData.albums.map((artist) => (
                                <tr className="table-row" key={artist.person_id}>
                                    <td className="table-cell">{artist.full_name}</td>
                                    <td className="table-cell">{artist.person_email}</td>
                                    <td className="table-cell">{artist.person_birthdate.substring(0, 10)}</td>
                                    <td className="table-cell">{artist.number_of_albums}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
            {/* {reportData.albums && (
                <div className="table-container">
                    <h3>Aritst Ranking By Songs Played</h3>
                    <table className="table">
                        <thead>
                            <tr className="table-header">
                                <th>Name</th>
                                <th>Email</th>
                                <th>Birthdate</th>
                                <th>Number of Plays</th>
                            </tr>
                        </thead>
                        <tbody>
                            {reportData.listens.map((artist) => (
                                <tr className="table-row" key={artist.person_id}>
                                    <td className="table-cell">{artist.full_name}</td>
                                    <td className="table-cell">{artist.person_email}</td>
                                    <td className="table-cell">{artist.person_birthdate.substring(0, 10)}</td>
                                    <td className="table-cell">{artist.number_of_albums}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )} */}
        </div>
    );
};

export default ArtistReport;
