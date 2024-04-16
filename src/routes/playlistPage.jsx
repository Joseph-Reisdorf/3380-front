// distinct from artistPage -> is artistsPage
import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useAuth } from '../context/authContext';

const PlaylistPage = () => {
    const { loggedIn, userId, userRole, loading, navListener } = useAuth();

    const [playlists, setPlaylists] = useState([]);
    const [newPlaylist, setNewPlaylist] = useState('');

    const [addingPlaylist, setAddingPlaylist] = React.useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const navigate = useNavigate();
    

    useEffect(() => {
        if (!loading) {
            if (!loggedIn) {
                navigate('/login');
            }
            else if (userRole !== 'a') {
                if (userRole !== 'l') {  
                    navigate('/');
                }
            }
        }

    }, [loggedIn, userRole, loading, navigate]); // Depend on isArtist to reactively navigate

    useEffect(() => {
        if (!loading) {
            fetchPlaylistsAndTracks();
        }
    }, [loading]);


    
    const fetchPlaylistsAndTracks = async () => {
        try {
            const playlistRes = await axios.get(`${process.env.REACT_APP_BACK_URL}/playlists/get_playlists_by_listener_id/${userId}`);
            const playlists = playlistRes.data;

            const tracksPromises = playlists.map(playlist =>
                axios.get(`${process.env.REACT_APP_BACK_URL}/playlists/get_tracks_by_playlist_id/${playlist.playlist_id}`)
            );

            const tracksResponses = await Promise.all(tracksPromises);
            const playlistsWithTracks = playlists.map((playlist, index) => ({
                ...playlist,
                tracks: tracksResponses[index].data
            }));

            setPlaylists(playlistsWithTracks);
            console.log(playlistsWithTracks);
        } catch (error) {
            console.error('Error loading playlists and tracks:', error);
        }
    };

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
                    <p>Created: {playlist.playlist_release_date.slice(0, 10)}</p>
                  
                    <ul>
                        {playlist.tracks && playlist.tracks.map(track => (
                            <li key={track.track_id}>{track.track_name}</li>
                        ))}
                    </ul>
              
                </li>
            ))}
            </ul>
            
        </div>
    );
}

export default PlaylistPage;
