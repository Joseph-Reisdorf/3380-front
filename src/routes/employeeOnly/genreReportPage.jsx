import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../../context/authContext';
import GenreGraph from './GenreGraph';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import '../../styles/GenreReportPage.css';

const GenreReportPage = () => {
    const { userId, userRole, loading } = useAuth();

    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [selectedGenre, setSelectedGenre] = useState('');
    const [genres, setGenres] = useState([]);
    const [genreData, setGenreData] = useState([]);
    const [tracks, setTracks] = useState([]);
    const [errorMessage, setErrorMessage] = useState('');

    useEffect(() => {
        const fetchGenres = async () => {
            try {
                const response = await axios.get(`${process.env.REACT_APP_BACK_URL}/genres/get_genres`);
                setGenres(response.data);
            } catch (error) {
                console.error('Error fetching genres:', error);
            }
        };
        fetchGenres();
    }, [userId, userRole, loading]);

    const handleSubmit = async (event) => {
        event.preventDefault();
        if (new Date(endDate) < new Date(startDate)) {
            setErrorMessage('End date cannot be before start date.');
            return;
        }
        try {
            const response = await axios.get(`${process.env.REACT_APP_BACK_URL}/genres/get_most_listened_genres`, {
                params: { startDate, endDate }
            });
            setGenreData(response.data);
            setErrorMessage('');
        } catch (error) {
            console.error('Error fetching most listened genres:', error);
            setErrorMessage('An error occurred while fetching data.');
        }
    };

    const handleGenreChange = async (event) => {
        const selectedGenre = event.target.value;
        setSelectedGenre(selectedGenre);
    
        try {
            const response = await axios.get(`${process.env.REACT_APP_BACK_URL}/genres/get_most_listened_songs_by_genre`, {
                params: { selectedGenre, startDate, endDate }
            });
            setTracks(response.data);
            setErrorMessage('');
        } catch (error) {
            console.error('Error fetching top tracks by genre:', error);
            setErrorMessage('An error occurred while fetching data.');
        }
    };
    

    return (
        <div className="employee-dashboard-container">
            <div className="form-container">
                <form onSubmit={handleSubmit}>
                    <label htmlFor="startDate">
                        Start Date:
                        <DatePicker
                            selected={startDate}
                            onChange={date => setStartDate(date)}
                            selectsStart
                            startDate={startDate}
                            endDate={endDate}
                            dateFormat="MM/dd/yyyy"
                            required
                        />
                    </label>
                    <label htmlFor="endDate">
                        End Date:
                        <DatePicker
                            selected={endDate}
                            onChange={date => setEndDate(date)}
                            selectsEnd
                            startDate={startDate}
                            endDate={endDate}
                            minDate={startDate}
                            dateFormat="MM/dd/yyyy"
                            required
                        />
                    </label>
                    <button type="submit">Generate Genre Graph</button>
                </form>
                {errorMessage && <p className="error-message">{errorMessage}</p>}
            </div>
            {genreData.length > 0 && (
                <div className="genre-graph-container">
                    <GenreGraph data={genreData} />
                </div>
            )}
            <div className="genre-select-container">
                <label>Select Genre:</label>
                <select
                    value={selectedGenre}
                    onChange={handleGenreChange}
                    required
                >
                    <option value="">Select Genre</option>
                    {genres.map((genre) => (
                        <option key={genre.genre_id} value={genre.genre_id}>{genre.genre_name}</option>
                    ))}
                </select>
            </div>
            <div className="track-list-container">
                <h2>Top Tracks for Selected Genre</h2>
                <ul>
                    {tracks.map((track, index) => (
                        <li key={index}>
                            {track.track_name} - {track.track_primary_artist_id}
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
};

export default GenreReportPage;
