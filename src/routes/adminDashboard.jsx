import React, { useState, useEffect } from 'react';
import axios from 'axios';

const AdminDashboard = () => {
    const [artists, setArtists] = useState([]);
    const [listeners, setListeners] = useState([]);
    const [startMonth, setStartMonth] = useState('');
    const [endMonth, setEndMonth] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);


    useEffect(() => {
        const fetchAllListeners = async () => {
            try {
                const res = await axios.get(`${process.env.REACT_APP_BACK_URL}/admin/listeners`);
                setListeners(res.data);
            } catch (error) {
                console.error(error);
                setError(error.message);
            }
        };
        fetchAllListeners();
    }, []);

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
console.log(artists);
    return (
        <div>
            <div>
    <h1>All Artists Registered</h1>
    {artists.map((artist) => {
        const registrationDate = new Date(artist.artist_registration_date);
        const formattedDate = registrationDate.toISOString().split('T')[0];

        return (
            <div className="artist" key={artist.artist_id}>
                <h2>{artist.artist_display_name}</h2>
                <h2>Registered on: {formattedDate}</h2>
                <button onClick={() => deleteArtist(artist.artist_id)}>Delete</button>
            </div>
        );
    })}
    <div>
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
            <button type="submit">Generate Report</button>
        </form>
        {loading ? (
            <div>Loading...</div>
        ) : error ? (
            <div>Error: {error.response.data.error}</div>
        ) : artists.length > 0 ? (
            <ul>
                {artists.map((artist) => (
                    <li key={artist.artist_id}>
                        {artist.artist_display_name} - {artist.artist_registration_date}
                    </li>
                ))}
            </ul>
        ) : null}
    </div>
</div>

            <div>
                <h1>All Listeners Registered</h1>
                {listeners.map((listener) => (
                    <div className="listener" key={listener.listener_id}>
                        <h2>{listener.listener_username}</h2>
                        <button onClick={() => deleteListener(listener.listener_id)}>Delete</button>
                    </div>
                ))}
            </div>
            <div>
                <h1>All Employees Registered</h1>
            </div>
        </div>
    );
};

export default AdminDashboard;
