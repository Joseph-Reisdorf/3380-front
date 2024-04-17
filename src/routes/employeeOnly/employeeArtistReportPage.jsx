import React, { useState } from 'react';
import axios from 'axios';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

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

    return (
        <div>
            <h1>Artist Ranking Report</h1>
            <form onSubmit={handleSubmit}>
                <div>
                    <label htmlFor="startDate">Start Date:</label>
                    <DatePicker
                        selected={startDate}
                        onChange={(date) => setStartDate(date)}
                        dateFormat="MM/dd/yyyy"
                    />
                </div>
                <div>
                    <label htmlFor="endDate">End Date:</label>
                    <DatePicker
                        selected={endDate}
                        onChange={(date) => setEndDate(date)}
                        dateFormat="MM/dd/yyyy"
                    />
                </div>
                <div>
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
            <div>
                <h2>Report Data</h2>
                <ul>
                    {reportData.map((artist, index) => (
                        <li key={index}>
                            {artist.artist_id} - {artist.artist_display_name} - {artist.artist_email} - {artist.artist_birthdate} - {includeTracks ? artist.number_of_tracks : includeAlbums ? artist.number_of_albums : includeListens ? artist.total_listens : ''}
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
};

export default ArtistReport;
