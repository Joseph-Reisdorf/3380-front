import React, { useState, useEffect } from 'react';
import axios from 'axios';

const AdminDashboard = () => {
    const [artists, setArtists] = useState([]);
    const [listeners, setListeners] = useState([]);

    useEffect(() => {
        const fetchAllArtists = async () => {
            try {
                const res = await axios.get(`${process.env.REACT_APP_BACK_URL}/admin/artists`);
                setArtists(res.data);
            } catch (error) {
                console.error(error);
            }
        };
        fetchAllArtists();
    }, []);

    useEffect(() => {
        const fetchAllListeners = async () => {
            try {
                const res = await axios.get(`${process.env.REACT_APP_BACK_URL}/admin/listeners`);
                setListeners(res.data);
            } catch (error) {
                console.error(error);
            }
        };
        fetchAllListeners();
    }, []);

    const deleteArtist = async (artistId) => {
        try {
            await axios.post(`${process.env.REACT_APP_BACK_URL}/admin/deleteArtist/${artistId}`);
            
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
        </div>
    );
};

export default AdminDashboard;
