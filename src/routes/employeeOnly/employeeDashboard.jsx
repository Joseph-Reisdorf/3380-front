import React, { useState, useEffect } from 'react';
import axios from 'axios';
import GenreGraph from './GenreGraph'; // Import GenreGraph component
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import '../styles/EmployeeDashboard.css';

const EmployeeDashboard = () => {
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
                const response = await axios.get(`${process.env.REACT_APP_BACK_URL}/getAllGenreNames`);
                setGenres(response.data);
            } catch (error) {
                console.error('Error fetching genres:', error);
            }
        };
        fetchGenres();
    }, []);

    const handleSubmit = async (event) => {
        event.preventDefault();
        if (new Date(endDate) < new Date(startDate)) {
            setErrorMessage('End date cannot be before start date.');
            return;
        }
        try {
            const response = await axios.get(`${process.env.REACT_APP_BACK_URL}/getMostListenedGenres`, {
                params: {
                    startDate,
                    endDate
                }
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
            const response = await axios.get(`${process.env.REACT_APP_BACK_URL}/getMostListenedSongsByGenre`, {
                params: {
                    genre: selectedGenre,
                    startDate,
                    endDate
                }
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
            <h1>Employee Dashboard</h1>
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
                <label htmlFor="genreSelect">Select Genre:</label>
                <select
                    id="genreSelect"
                    value={selectedGenre}
                    onChange={handleGenreChange}
                    required
                >
                    <option value="">Select Genre</option>
                    {genreData.map((genre, index) => (
                        <option key={index} value={genre.genre_name}>{genre.genre_name}</option>
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

export default EmployeeDashboard;
