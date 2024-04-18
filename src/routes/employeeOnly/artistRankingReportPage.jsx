import React, { useState } from 'react';
import axios from 'axios';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import '../../styles/artistRankingReportPage.css';
import Chart from './ChartComponent'; // Import the Chart component

const ArtistReport = () => {
    const [startDate, setStartDate] = useState(new Date());
    const [endDate, setEndDate] = useState(new Date());
    const [includeTracks, setIncludeTracks] = useState(false);
    const [includeAlbums, setIncludeAlbums] = useState(false);
    const [includeListens, setIncludeListens] = useState(false);
    const [reportData, setReportData] = useState([]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            let requests = [];
            if (includeTracks) {
                requests.push(axios.get(`${process.env.REACT_APP_BACK_URL}/get_artist_ranking_by_tracks`, {
                    params: {
                        start_date: startDate,
                        end_date: endDate,
                    }
                }));
            }
            if (includeAlbums) {
                requests.push(axios.get(`${process.env.REACT_APP_BACK_URL}/get_artist_ranking_by_albums`, {
                    params: {
                        start_date: startDate,
                        end_date: endDate,
                    }
                }));
            }
            if (includeListens) {
                requests.push(axios.get(`${process.env.REACT_APP_BACK_URL}/get_artist_ranking_by_listens`, {
                    params: {
                        start_date: startDate,
                        end_date: endDate,
                    }
                }));
            }
            const responses = await Promise.all(requests);
            const mergedData = responses.reduce((acc, response) => [...acc, ...response.data], []);
            setReportData(mergedData);
        } catch (error) {
            console.error('Error fetching artist ranking report:', error);
        }
    };

    const renderCharts = () => {
        const chartsToRender = [];

        if (includeTracks) {
            chartsToRender.push(<Chart key="tracks" data={reportData.filter(artist => artist.type === 'tracks')} />);
        }
        if (includeAlbums) {
            chartsToRender.push(<Chart key="albums" data={reportData.filter(artist => artist.type === 'albums')} />);
        }
        if (includeListens) {
            chartsToRender.push(<Chart key="listens" data={reportData.filter(artist => artist.type === 'listens')} />);
        }

        return chartsToRender;
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
                    <div className="form-group">
                        <label>
                            Include Tracks:
                            <input
                                type="checkbox"
                                checked={includeTracks}
                                onChange={(e) => setIncludeTracks(e.target.checked)}
                            />
                        </label>
                        <label>
                            Include Albums:
                            <input
                                type="checkbox"
                                checked={includeAlbums}
                                onChange={(e) => setIncludeAlbums(e.target.checked)}
                            />
                        </label>
                        <label>
                            Include Listens:
                            <input
                                type="checkbox"
                                checked={includeListens}
                                onChange={(e) => setIncludeListens(e.target.checked)}
                            />
                        </label>
                    </div>
                    <button type="submit">Generate Report</button>
                </form>
                <div className="chart-container">
                    {renderCharts()}
                </div>
            </div>
        </div>
    );
};

export default ArtistReport;
