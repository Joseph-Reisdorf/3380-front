import React, { useState, useEffect } from 'react';
import axios from 'axios';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import '../../styles/GenreReportPage.css';
import GenreGraph from './GenreGraph'; // Updated import statement
const GenreReportPage = () => {
    const [dates, setDates] = useState({ startDate: null, endDate: null });
    const [genres, setGenres] = useState([]);
    const [selectedGenre, setSelectedGenre] = useState('');
    const [errorMessage, setErrorMessage] = useState('');


    const handleDateChange = (field, value) => {
        setDates(prev => ({ ...prev, [field]: value }));
        if (field === 'endDate' && value < dates.startDate) {
            setErrorMessage('End date cannot be before start date.');
        } else {
            setErrorMessage('');
        }
    };

    const handleGenreChange = (event) => {
        setSelectedGenre(event.target.value);
    };
    useEffect(() => {
        const fetchAllData = async () => {
            if (!dates.startDate || !dates.endDate) {
                setErrorMessage('Please ensure both start and end dates are selected.');
                return;
            }

            try {
                const genreResponse = await axios.get(`${process.env.REACT_APP_BACK_URL}/genres/get_genres`);
                const tracksPromises = genreResponse.data.map(genre =>
                    axios.get(`${process.env.REACT_APP_BACK_URL}/genres/get_most_listened_songs_by_genre`, {
                        params: {
                            selectedGenre: genre.genre_id,
                            startDate: dates.startDate.toISOString().slice(0, 10),
                            endDate: dates.endDate.toISOString().slice(0, 10)
                        }
                    }).then(response => ({
                        ...genre,
                        tracks: response.data
                    }))
                );
                
                const genresWithTracks = await Promise.all(tracksPromises);
                setGenres(genresWithTracks);
                console.log("Fetched all genres with tracks:", genresWithTracks);
            } catch (error) {
                console.error('Error fetching genres and their tracks:', error);
                setErrorMessage('An error occurred while fetching data.');
            }
        };

        fetchAllData();
    }, [dates.startDate, dates.endDate]);

    const handleSubmit = (event) => {
        event.preventDefault();
        console.log("Submit"); // Simplified submit just logs to console
    };
    return (
        <div className="employee-dashboard-container">
            <div className="form-container">
                <form onSubmit={handleSubmit}>
                    <DatePicker
                        selected={dates.startDate}
                        onChange={date => handleDateChange('startDate', date)}
                        selectsStart
                        startDate={dates.startDate}
                        endDate={dates.endDate}
                        dateFormat="MM/dd/yyyy"
                        placeholderText="Start Date"
                        required
                    />
                    <DatePicker
                        selected={dates.endDate}
                        onChange={date => handleDateChange('endDate', date)}
                        selectsEnd
                        startDate={dates.startDate}
                        endDate={dates.endDate}
                        dateFormat="MM/dd/yyyy"
                        placeholderText="End Date"
                        required
                    />
                </form>
                {errorMessage && <p className="error-message">{errorMessage}</p>}
            </div>
            {/* print out the genre its tracks */}
            <div className="genre-tracks-container">
            <h1>Genres with songs</h1>
            {genres.map(genre => (
                <div key={genre.genre_id} className="genre-tracks">
                    <h2>{genre.genre_name}</h2>
                    <ul>
                        {genre.tracks.map(track => (
                            <li key={track.track_id}>{track.track_name} - Listens:  {track.listen_count}</li>
                        ))}
                    </ul>
                </div>
            ))}

            </div> 
        </div>
    );
};

export default GenreReportPage;
