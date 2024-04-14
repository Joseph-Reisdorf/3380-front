// distinct from artistPage -> is artistsPage
import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useAuth } from '../context/authContext';

const PlaylistPage = () => {
    const { loggedIn, userId, userRole, loading } = useAuth();

    const [playlists, setPlaylists] = useState([]);
    const [newPlaylist, setNewPlaylist] = useState('');

    const [addingPlaylist, setAddingPlaylist] = React.useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const navigate = useNavigate();

    
    useEffect(() => {
        const fetchUserPlaylists = async () => {
            try {
                const res = await axios.get(`${process.env.REACT_APP_BACK_URL}/playlists/get_playlists_by_listener_id/${userId}`);
                setPlaylists(res.data);
            } catch (error) {
                console.error(error);
            }
        };
        fetchUserPlaylists();
    }, []);
    /*
    const handleClick = async (e) => {
        e.preventDefault();
        try {
            const res = await axios.get(`${process.env.REACT_APP_BACK_URL}/artists/search?artist_display_name=${searchTerm}`);
            setArtists(res.data);
        } catch (error) {
            console.error(error);
        }
    }

    const handleInputChange = (e) => {
        setSearchTerm(e.target.value);
    }

    const goToArtistPage = (artistId) => {
        navigate(`/artist/${artistId}`);
        <form onSubmit={handleClick}>
                <label>Search by Name:</label>
                <input type="text" value={searchTerm} onChange={handleInputChange}></input>
                <button type="submit">Search</button>
            </form>
    } */

    const handleAddPlaylist = async (e) => {
        e.preventDefault();
        setAddingPlaylist(!addingPlaylist);
    };

    const handleChange = (e) => {
        setNewPlaylist(e.target.value);
    }

    const handlePost = async (e) => {
        e.preventDefault();

        const playlistData = {
            playlist_name: newPlaylist,
            listener_id: userId // Ensure your backend expects this field
        };

        try {
            const res = await axios.post(`${process.env.REACT_APP_BACK_URL}/playlists/add_playlist`, playlistData);
            
        } catch (error) {
            console.error(error);
        }
    }

    return (
        <div>
            <button onClick={handleAddPlaylist}>Add Playlist</button>
            {addingPlaylist && <form onSubmit={handlePost}>
                <label>Playlist Name:</label>
                <input type="text" onChange={handleChange} required></input>
                <button type="submit">Create</button>
            </form>}
            <h1>Your Playlists</h1>

            <ul>
            {playlists.map((playlist) => (
                
                <li className="playlist" key={playlist.playlist_id}>
                    <p>Name: <strong>{playlist.playlist_name}</strong></p>
                    <p>Created: {playlist.playlist_release_date.slice(0,10)}</p>
                </li>
                
            ))}
            </ul>
            
            
        </div>
    );
}

export default PlaylistPage;
