import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import '../styles/Library.css';

function Library() {
  const [playlists, setPlaylists] = useState([]);
  const [showPopup, setShowPopup] = useState(false);
  const [playlistName, setPlaylistName] = useState('');

  useEffect(() => {
    // Fetch playlists when the component mounts
    fetchPlaylists();
  }, []);

  function fetchPlaylists() {
    axios.get(`${process.env.REACT_APP_BACK_URL}/WHAT HERE/playlists`)
      .then(response => {
        setPlaylists(response.data);
      })
      .catch(error => {
        console.error('Error fetching playlists:', error);
      });
  }

  const handleAddPlaylist = () => {
    setShowPopup(true);
  };

  const handleClosePopup = () => {
    setShowPopup(false);
  };

  const handlePlaylistNameChange = (e) => {
    setPlaylistName(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Make a POST request to add a new playlist
    try {
      await axios.post(`${process.env.REACT_APP_BACK_URL}/WHAT HERE/playlists`, { name: playlistName });
      // After successfully adding playlist, fetch playlists again
      fetchPlaylists();
      // Close the pop-up window
      setShowPopup(false);
    } catch (error) {
      console.error('Error adding playlist:', error);
    }
  };

  return (
    <div>
      <h1>Library</h1>
      <ul>
        {playlists.map((playlist) => (
          <li key={playlist.id}>
            <Link to={`/playlists/${playlist.id}`}>{playlist.name}</Link>
          </li>
        ))}
      </ul>
      <button onClick={handleAddPlaylist}>Add Playlist</button>
      {/* Pop-up window content */}
      {showPopup && (
        <div className="popup">
          <h2>Add Playlist</h2>
          <form onSubmit={handleSubmit}>
            <label htmlFor="playlistName">Playlist Name:</label>
            <input type="text" id="playlistName" value={playlistName} onChange={handlePlaylistNameChange} required />
            <button type="submit">Create Playlist</button>
          </form>
          <button onClick={handleClosePopup}>Close</button>
        </div>
      )}
    </div>
  );
}

export default Library;
